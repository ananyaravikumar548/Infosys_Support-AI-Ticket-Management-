import logging

from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from tickets.models import EmailLog

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def send_ticket_created(ticket_id, recipient_email, title):
        subject = f"[SupportPilot] Ticket Received: #{ticket_id}"
        message = f"Hello,\n\nWe have received your ticket: '{title}'.\nOur AI system is working on diagnosis and resolution.\n\nTicket ID: {ticket_id}"
        return EmailService._send_and_log(ticket_id, recipient_email, subject, message, "TICKET_CREATED")

    @staticmethod
    def send_resolution(
        ticket_id,
        recipient_email,
        suggested_steps,
        ai_confidence=None,
        confirm_url=None,
        escalate_url=None,
    ):
        subject = f"[SupportPilot] Proposed Resolution for Ticket #{ticket_id}"
        steps_text = "\n".join(suggested_steps) if isinstance(suggested_steps, list) else str(suggested_steps)
        message = (
            "Hello,\n\nOur AI Assistant has generated a resolution for your issue:\n\n"
            f"{steps_text}\n\nConfirm or request human support in the SupportPilot portal."
        )
        html_message = render_to_string(
            "emails/ai_resolution.html",
            {
                "ai_solution": steps_text,
                "ai_confidence": ai_confidence,
                "confirm_url": confirm_url or "http://localhost:3000/customer/tickets",
                "escalate_url": escalate_url or "http://localhost:3000/customer/tickets",
            },
        )
        return EmailService._send_and_log(
            ticket_id,
            recipient_email,
            subject,
            message,
            "RESOLUTION",
            html_message=html_message,
        )

    @staticmethod
    def send_manual_resolution(ticket_id, recipient_email, resolution):
        subject = f"[SupportPilot] Revised Resolution for Ticket #{ticket_id}"
        message = f"Hello,\n\nA support specialist has reviewed your ticket and provided this resolution:\n\n{resolution}\n\nIf you need more help, reply to this email."
        return EmailService._send_and_log(ticket_id, recipient_email, subject, message, "RESOLUTION")

    @staticmethod
    def send_escalation_notice(ticket_id, recipient_email):
        subject = f"[SupportPilot] Ticket #{ticket_id} Escalated to Support Team"
        message = f"Hello,\n\nYour ticket #{ticket_id} requires human assistance and has been escalated to our technical engineering team."
        return EmailService._send_and_log(ticket_id, recipient_email, subject, message, "ESCALATION")

    @staticmethod
    def send_assignment_notification(ticket_id, recipient_email, ticket_title, assigned_by_email):
        subject = f"[SupportPilot] Ticket #{ticket_id} Assigned to You"
        message = (
            f"Hello,\n\n"
            f"A new ticket has been assigned to you by {assigned_by_email}.\n\n"
            f"Ticket ID: {ticket_id}\n"
            f"Title: {ticket_title}\n\n"
            f"Please log in to the Agent Dashboard to review and begin working on this ticket."
        )
        return EmailService._send_and_log(ticket_id, recipient_email, subject, message, "TICKET_CREATED")

    @staticmethod
    def _send_and_log(
        ticket_id,
        recipient_email,
        subject,
        message,
        email_type,
        html_message=None,
    ):
        status = "SENT"
        try:
            email = EmailMultiAlternatives(
                subject,
                message,
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@supportpilot.ai'),
                [recipient_email],
            )
            if html_message:
                email.attach_alternative(html_message, "text/html")
            email.send(fail_silently=False)
        except Exception:
            logger.exception("Email delivery failed for ticket %s", ticket_id)
            status = "FAILED"

        log = EmailLog(
            ticket_id=str(ticket_id),
            recipient=recipient_email,
            subject=subject,
            body=message,
            email_type=email_type,
            status=status
        )
        log.save()
        return {"status": status, "email_type": email_type}
