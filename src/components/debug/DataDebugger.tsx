// Создайте временный компонент для отладки в src/components/debug/DataDebugger.tsx
'use client';

import React from 'react';

interface DebuggerProps {
  data: any;
  title: string;
}

export function DataDebugger({ data, title }: DebuggerProps) {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      background: '#1f2937',
      color: '#f9fafb',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      border: '1px solid #374151'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#fbbf24' }}>{title}</h4>
      <pre style={{ 
        margin: 0, 
        whiteSpace: 'pre-wrap',
        fontSize: '10px',
        lineHeight: '1.3'
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
