// Mock dataset for Knowledge Base, Ingestion Jobs, and KB Gaps (M2 Spec)

export const mockArticles = [
  {
    id: 'kb-001',
    title: 'How to handle Payment Gateway Failures',
    slug: 'payment-gateway-failures',
    category: 'Billing',
    subCategory: 'Payments',
    status: 'PUBLISHED',
    version: 2,
    updatedAt: '2026-08-10T14:30:00Z',
    lastIndexedAt: '2026-08-10T14:32:00Z',
    views: 1240,
    content: `# Payment Gateway Failure Resolution Guide
## Overview
This document covers handling timeout and authorization errors during checkout.

## Troubleshooting Steps
1. Verify if the gateway timeout threshold exceeds 30 seconds.
2. Check customer bank webhook response logs under Billing Dashboard.
3. If issue persists, issue a manual transaction query token.`,
  },
  {
    id: 'kb-002',
    title: 'Troubleshooting SSO and Login Authorization',
    slug: 'sso-login-authorization',
    category: 'Account',
    subCategory: 'Authentication',
    status: 'PUBLISHED',
    version: 1,
    updatedAt: '2026-08-12T09:15:00Z',
    lastIndexedAt: '2026-08-12T09:16:00Z',
    views: 840,
    content: `# SSO Configuration and Diagnostics
## Common Identity Provider Mismatches
1. Clear browser cache and local storage tokens.
2. Verify SAML response assertion endpoint matches the client domain.`,
  },
  {
    id: 'kb-003',
    title: 'Resolving Mobile App Crash Logs',
    slug: 'mobile-app-crash-logs',
    category: 'Technical',
    subCategory: 'Mobile',
    status: 'DRAFT',
    version: 1,
    updatedAt: '2026-08-18T11:00:00Z',
    lastIndexedAt: null, // Unindexed item triggers StaleBadge/UnindexedChip
    views: 2400,
    content: `# Mobile App Crash Diagnostics
## Gathering Logs
Obtain crash stack traces using the device logging tool.`,
  },
];

export const mockKbGaps = [
  {
    id: 'gap-001',
    category: 'Printer',
    subCategory: 'Hardware',
    occurrenceCount: 18,
    status: 'OPEN',
    sampleQueries: ['Printer queue stuck', 'Paper jam code 50.4'],
    firstSeen: '2026-08-01T08:00:00Z',
  },
  {
    id: 'gap-002',
    category: 'Network',
    subCategory: 'VPN',
    occurrenceCount: 7,
    status: 'WRITING',
    sampleQueries: ['VPN error code 0x80070422', 'Tunnel disconnects every 5 mins'],
    firstSeen: '2026-08-05T10:00:00Z',
  },
];

export const mockIngestionJobs = [
  {
    jobId: 'job-991',
    sourceType: 'PDF_BULK',
    status: 'COMPLETED_WITH_ERRORS',
    totalDocs: 5,
    processed: 4,
    failed: 1,
    startedAt: '2026-08-19T10:00:00Z',
    errorLog: [
      { file: 'Legacy_Vpn_2021.pdf', reason: 'Corrupt heading structure / Parsing failed' },
    ],
  },
];