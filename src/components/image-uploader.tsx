"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Image from 'next/image';

interface ImageUploaderProps {
  value: string; // data URI
  onChange: (dataUri: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file (PNG, JPG, etc.).',
      });
      return;
    }
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUri = reader.result as string;
      onChange(dataUri);
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File Error",
        description: "Could not read the selected file.",
      });
    }
  }, [onChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  }

  if (value) {
    return (
      <div className="relative w-full h-48 group border-2 border-dashed rounded-lg p-2">
        <Image
          src={value}
          alt="PAN Card Preview"
          layout="fill"
          objectFit="contain"
          className="rounded-md"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors duration-300 ease-in-out h-24 flex flex-col items-center justify-center',
        'hover:border-primary hover:bg-primary/5',
        isDragActive ? 'border-primary bg-primary/10' : 'border-border'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
        </p>
      </div>
    </div>
  );
}
