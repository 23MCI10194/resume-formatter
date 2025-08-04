'use client';
import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ColResizerProps {
  tableRef: React.RefObject<HTMLTableElement>;
  onWidthsChange: (newWidths: number[]) => void;
  colIndex: number;
  enabled: boolean;
}

export default function ColResizer({ tableRef, onWidthsChange, colIndex, enabled }: ColResizerProps) {
  const resizerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startWidths = useRef<number[]>([]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!tableRef.current) return;
    
    const dx = e.clientX - startX.current;
    const tableWidth = tableRef.current.offsetWidth;
    const cols = Array.from(tableRef.current.getElementsByTagName('col'));

    if (colIndex >= cols.length -1) return;

    const currentTh = cols[colIndex];
    if (!currentTh) return;

    const currentWidthPx = (startWidths.current[colIndex] / 100) * tableWidth;
    const nextWidthPx = (startWidths.current[colIndex+1] / 100) * tableWidth;
    
    let newCurrentWidth = currentWidthPx + dx;
    let newNextWidth = nextWidthPx - dx;

    const minWidthPx = 30;

    if (newCurrentWidth < minWidthPx) {
        newCurrentWidth = minWidthPx;
        newNextWidth = currentWidthPx + nextWidthPx - newCurrentWidth;
    }
    
    if (newNextWidth < minWidthPx) {
        newNextWidth = minWidthPx;
        newCurrentWidth = currentWidthPx + nextWidthPx - newNextWidth;
    }

    const newWidths = [...startWidths.current];
    newWidths[colIndex] = (newCurrentWidth / tableWidth) * 100;
    newWidths[colIndex+1] = (newNextWidth / tableWidth) * 100;
    
    onWidthsChange(newWidths);

  }, [colIndex, onWidthsChange, tableRef]);


  const onMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    if(resizerRef.current) {
        resizerRef.current.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
  }, [onMouseMove]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!tableRef.current) return;

    startX.current = e.clientX;
    const cols = Array.from(tableRef.current.getElementsByTagName('col'));
    startWidths.current = cols.map(col => parseFloat(col.style.width));

    if(resizerRef.current) {
        resizerRef.current.classList.add('active');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [onMouseMove, onMouseUp, tableRef]);
  
  if (!enabled) return null;

  return (
    <div
      ref={resizerRef}
      onMouseDown={onMouseDown}
      className={cn(
        "absolute top-0 right-0 h-full w-2 cursor-col-resize z-10",
        "hover:bg-primary/20",
        "active:bg-primary/40"
      )}
    />
  );
}

    