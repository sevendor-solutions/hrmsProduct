import { useState } from 'react';
import { useHrms } from '../context/HrmsContext';
import { orgChartData } from '../data/mockData';
import { Users, ChevronDown, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';

const DEPT_COLORS: Record<string, string> = {
  Operations: 'border-l-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400',
  Engineering: 'border-l-violet-500 bg-violet-50/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400',
  'Human Resources': 'border-l-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400',
  Marketing: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
  Finance: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400',
  Design: 'border-l-pink-500 bg-pink-50/50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400',
};

type OrgNode = {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar: string;
  children?: OrgNode[];
};

function TreeNode({ node }: { node: OrgNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className={`glass-card p-4 w-56 border-l-4 ${DEPT_COLORS[node.department] || 'border-l-slate-400'} flex items-center gap-3 relative hover:scale-[1.02] hover:shadow-lg transition-all`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
          {node.avatar}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-800 dark:text-white text-xs truncate">{node.name}</p>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">{node.designation}</p>
          <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">{node.department}</p>
        </div>

        {hasChildren && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          </button>
        )}
      </div>

      {/* Connector line below parent card */}
      {hasChildren && !isCollapsed && (
        <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-800" />
      )}

      {/* Children nodes container */}
      {hasChildren && !isCollapsed && (
        <div className="relative flex gap-6 pt-2">
          {/* Horizontal connecting line overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-slate-200 dark:bg-slate-800" style={{ width: 'calc(100% - 224px)' }} />

          {(node.children || []).map((child: OrgNode, index: number) => {
            const isFirst = index === 0;
            const isLast = index === (node.children?.length || 0) - 1;
            return (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical connector line above child card */}
                <div className="w-0.5 h-4 bg-slate-200 dark:bg-slate-800 absolute -top-4" />
                <TreeNode node={child} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrgChart() {
  return (
    <div className="space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1>Corporate Org Chart</h1>
          <p>Explore the organizational reporting hierarchy and manager structure tree.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('Exporting structural reporting chart image...')} className="btn-secondary flex items-center gap-1">
            <Users size={16} /> Export Chart
          </button>
        </div>
      </div>

      {/* Interactive Hierarchical Tree Container */}
      <div className="glass-card p-6 overflow-auto flex justify-center min-h-[500px]">
        <div className="pt-4 pb-12 w-fit h-fit">
          <TreeNode node={orgChartData} />
        </div>
      </div>
    </div>
  );
}
