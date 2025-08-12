import React from 'react';

interface Cursor {
  userId: string;
  userName: string;
  line: number;
  column: number;
  color: string;
}

interface LiveCursorsProps {
  cursors: Cursor[];
  currentFile: string;
}

const LiveCursors: React.FC<LiveCursorsProps> = ({ cursors, currentFile }) => {
  const userColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {cursors.map((cursor, index) => (
        <div
          key={cursor.userId}
          className="absolute"
          style={{
            top: `${cursor.line * 24}px`, // Assuming 24px line height
            left: `${cursor.column * 8 + 64}px`, // Assuming 8px char width + 64px for line numbers
            transform: 'translateY(-2px)',
          }}
        >
          {/* Cursor line */}
          <div
            className="w-0.5 h-6 animate-pulse"
            style={{ backgroundColor: userColors[index % userColors.length] }}
          />
          
          {/* User label */}
          <div
            className="absolute top-0 left-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap transform -translate-y-full"
            style={{ backgroundColor: userColors[index % userColors.length] }}
          >
            {cursor.userName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveCursors;