import type { TransportMode } from '../../types';
import { TRANSPORT_ICONS, TRANSPORT_COLORS } from '../../utils/helpers';

interface TransportBadgeProps {
  mode: TransportMode;
  label?: string;
  size?: 'sm' | 'md';
}

export function TransportBadge({ mode, label, size = 'md' }: TransportBadgeProps) {
  const icon = TRANSPORT_ICONS[mode];
  const color = TRANSPORT_COLORS[mode];

  return (
    <span
      className="badge"
      style={{
        backgroundColor: `${color}18`,
        color,
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        padding: size === 'sm' ? '0.15rem 0.4rem' : '0.25rem 0.6rem',
      }}
      aria-label={label ?? mode}
    >
      <span aria-hidden="true">{icon}</span>
      {label && <span>{label}</span>}
    </span>
  );
}

interface TransportChainProps {
  modes: TransportMode[];
}

export function TransportChain({ modes }: TransportChainProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap" role="list" aria-label="Transport modes">
      {modes.map((mode, i) => (
        <span key={i} className="flex items-center gap-1" role="listitem">
          <TransportBadge mode={mode} size="sm" />
          {i < modes.length - 1 && (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }} aria-hidden="true">→</span>
          )}
        </span>
      ))}
    </div>
  );
}
