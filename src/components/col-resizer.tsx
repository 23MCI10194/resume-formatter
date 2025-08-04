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

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!tableRef.current) return;
    
    const tableWidth = tableRef.current.offsetWidth;
    const cols = Array.from(tableRef.current.getElementsByTagName('col'));

    if (colIndex >= cols.length -1) return;

    const currentTh = cols[colIndex];
    if (!currentTh) return;

    const pageX = e.pageX;
    const thRect = currentTh.getBoundingClientRect();
    const tableLeft = tableRef.current.getBoundingClientRect().left;

    const currentThWidth = thRect.width;
    const nextThWidth = cols[colIndex + 1].getBoundingClientRect().width;
    
    const combinedWidth = currentThWidth + nextThWidth;

    const newCurrentThWidth = pageX - (tableLeft + currentTh.offsetLeft);
    const newNextThWidth = combinedWidth - newCurrentThWidth;

    if (newCurrentThWidth < 20 || newNextThWidth < 20) return;

    // Convert to percentage
    const newCurrentWidthPercent = (newCurrentThWidth / tableWidth) * 100;
    const newNextWidthPercent = (newNextThWidth / tableWidth) * 100;

    const newWidths = cols.map((col, i) => {
        if (i === colIndex) return newCurrentWidthPercent;
        if (i === colIndex + 1) return newNextWidthPercent;
        const colWidth = col.style.width ? parseFloat(col.style.width) : (col.getBoundingClientRect().width / tableWidth) * 100;
        return colWidth;
    });
    
    // Distribute remaining width proportionally
    const updatedWidthsSum = newWidths.reduce((a, b) => a + b, 0);
    if(Math.abs(100 - updatedWidthsSum) > 0.1) {
        const otherCols = newWidths.filter((_, i) => i !== colIndex && i !== colIndex + 1);
        const otherColsSum = otherCols.reduce((a, b) => a + b, 0);
        const scale = (100 - newCurrentWidthPercent - newNextWidthPercent) / otherColsSum;
        for(let i=0; i<newWidths.length; i++) {
            if (i !== colIndex && i !== colIndex + 1) {
                newWidths[i] *= scale;
            }
        }
    }


    onWidthsChange(newWidths);

  }, [colIndex, onWidthsChange, tableRef]);


  const onMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    if(resizerRef.current) {
        resizerRef.current.classList.remove('active');
        document.body.style.cursor = '';
    }
  }, [onMouseMove]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if(resizerRef.current) {
        resizerRef.current.classList.add('active');
        document.body.style.cursor = 'col-resize';
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [onMouseMove, onMouseUp]);
  
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
