'use client';

import { useState, useCallback, type DragEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ResumeUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ResumeUploader({ onUpload, isLoading }: ResumeUploaderProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a .pdf or .docx file.',
      });
      return;
    }
    const file = acceptedFiles[0];
    onUpload(file);
  }, [onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 ease-in-out',
        'hover:border-primary hover:bg-primary/5',
        isDragActive ? 'border-primary bg-primary/10' : 'border-border'
      )}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Parsing your resume, please wait...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-semibold text-lg">
            {isDragActive ? 'Drop the resume here!' : 'Drag & drop a resume here, or click to select'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports .pdf and .docx formats
          </p>
        </div>
      )}
    </div>
  );
}
