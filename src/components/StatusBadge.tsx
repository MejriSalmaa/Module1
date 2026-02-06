import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Job statuses
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  submitted: { label: 'Submitted', className: 'bg-info/10 text-info' },
  validated: { label: 'Validated', className: 'bg-success/10 text-success' },
  open: { label: 'Open', className: 'bg-primary/10 text-primary' },
  closed: { label: 'Closed', className: 'bg-muted text-muted-foreground' },
  
  // Request statuses
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
  'in-review': { label: 'In Review', className: 'bg-info/10 text-info' },
  matched: { label: 'Matched', className: 'bg-success/10 text-success' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground' },
  
  // Availability
  available: { label: 'Available', className: 'bg-success/10 text-success' },
  'partially-available': { label: 'Partially Available', className: 'bg-warning/10 text-warning' },
  unavailable: { label: 'Unavailable', className: 'bg-destructive/10 text-destructive' },
  
  // Assessment statuses
  'in-progress': { label: 'In Progress', className: 'bg-info/10 text-info' },
  expired: { label: 'Expired', className: 'bg-destructive/10 text-destructive' },
  
  // Pipeline stages
  applied: { label: 'Applied', className: 'bg-muted text-muted-foreground' },
  screening: { label: 'Screening', className: 'bg-info/10 text-info' },
  assessed: { label: 'Assessed', className: 'bg-primary/10 text-primary' },
  'interview-scheduled': { label: 'Interview', className: 'bg-warning/10 text-warning' },
  results: { label: 'Results', className: 'bg-info/10 text-info' },
  accepted: { label: 'Accepted', className: 'bg-success/10 text-success' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive' },
  
  // Urgency
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning' },
  high: { label: 'High', className: 'bg-warning/10 text-warning' },
  urgent: { label: 'Urgent', className: 'bg-destructive/10 text-destructive' },
  
  // Priority
  'must-have': { label: 'Must Have', className: 'bg-primary/10 text-primary' },
  'nice-to-have': { label: 'Nice to Have', className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };

  return (
    <span
      className={cn(
        'status-badge',
        config.className,
        variant === 'outline' && 'bg-transparent border',
        className
      )}
    >
      {config.label}
    </span>
  );
}
