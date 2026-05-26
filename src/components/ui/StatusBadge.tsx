import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'on-time' | 'delayed' | 'cancelled' | 'confirmed' | 'pending' | 'completed' | 'refunded';
  delayMinutes?: number;
}

export function StatusBadge({ status, delayMinutes }: StatusBadgeProps) {
  const configs = {
    'on-time': { label: 'On time', icon: CheckCircle, className: 'badge-green' },
    delayed: { label: delayMinutes ? `+${delayMinutes} min` : 'Delayed', icon: Clock, className: 'badge-amber' },
    cancelled: { label: 'Cancelled', icon: XCircle, className: 'badge-red' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, className: 'badge-green' },
    pending: { label: 'Pending', icon: Clock, className: 'badge-amber' },
    completed: { label: 'Completed', icon: CheckCircle, className: 'badge-gray' },
    refunded: { label: 'Refunded', icon: AlertCircle, className: 'badge-blue' },
  };

  const { label, icon: Icon, className } = configs[status];

  return (
    <span className={`badge ${className}`} role="status">
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}
