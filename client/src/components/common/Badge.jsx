export const PriorityBadge = ({ priority }) => {
  const styles = {
    High: 'bg-red-100 text-red-600 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[priority] || styles.Low}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      {priority} {priority === 'High' && 'Priority'}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    'In Progress': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    'Open': 'bg-red-50 text-red-500 border-red-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Closed': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[status] || styles.Open}`}>
      {status}
    </span>
  );
};