import type { ReactNode } from 'react';

export default function Tooltip({ text, children }: { text: ReactNode; children: ReactNode }) {
  return (
    <div className="tooltip-wrapper">
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
}
