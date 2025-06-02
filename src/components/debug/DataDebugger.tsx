// src/components/debug/DataDebugger.tsx
'use client';

import React from 'react';

interface DebuggerProps {
  data: any;
  title: string;
}

export function DataDebugger({ data, title }: DebuggerProps) {
  return (
    <div className="fixed top-2.5 right-2.5 w-[300px] max-h-[400px] overflow-auto bg-gray-800 text-gray-50 p-3 rounded-lg text-xs z-[9999] border border-gray-600">
      <h4 className="m-0 mb-2.5 text-amber-400">{title}</h4>
      <pre className="m-0 whitespace-pre-wrap text-[10px] leading-tight">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}