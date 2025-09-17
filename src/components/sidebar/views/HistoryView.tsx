import React from 'react';
import { useHistoryStore } from '@/store/historyStore';
import { useUser } from '@clerk/clerk-react';

const HistoryView: React.FC = () => {
  const { user } = useUser();
  const { state, getForUser, clearForUser } = useHistoryStore();
  const userId = user?.id ?? 'anonymous';
  const entries = user ? getForUser(userId) : state.entries.filter(e => e.userId === 'anonymous');

  // Group by directory path (folder view) using filePath
  const groups = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
    const parts = entry.filePath.split('/');
    parts.pop();
    const dir = parts.join('/') || '/';
    if (!acc[dir]) acc[dir] = [] as any;
    acc[dir].push(entry);
    return acc;
  }, {});

  return (
    <div className="vscode-sidebar-view p-2 h-full flex flex-col">
      <div className="flex items-center justify-between px-2 py-1">
        <h2 className="text-sm font-semibold">History</h2>
        <button
          className="text-xs text-red-400 hover:text-red-300"
          onClick={() => clearForUser(userId)}
        >
          Clear
        </button>
      </div>
      <div className="mt-2 flex-1 overflow-auto space-y-2">
        {entries.length === 0 && (
          <div className="text-xs text-muted-foreground px-2">No history yet.</div>
        )}
        {Object.keys(groups).sort().map(dir => (
          <div key={dir} className="border border-border rounded">
            <div className="px-2 py-1 text-[11px] text-muted-foreground bg-muted/40">
              {dir}
            </div>
            <div className="p-2 space-y-2">
              {groups[dir].map(entry => (
                <div key={entry.id} className="rounded border border-border p-2 bg-background">
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>{entry.fileName} • {entry.language}</span>
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                  <pre className="mt-1 text-xs whitespace-pre-wrap break-words max-h-40 overflow-auto">
                    {entry.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;


