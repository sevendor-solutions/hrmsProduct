export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="skeleton h-5 w-40 rounded" />
      </div>
      <table className="data-table w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} cols={cols} />)}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-8 w-32 rounded" />
      <div className="skeleton h-3 w-20 rounded" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="skeleton h-4 w-36 rounded" />
      <div className="skeleton h-48 w-full rounded-xl" />
    </div>
  );
}

export default SkeletonTable;
