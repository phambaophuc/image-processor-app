'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Upload } from 'lucide-react';

import Image from 'next/image';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  preview?: string;
}

export default function ImageUpload({
  onFileSelect,
  preview
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!preview) return;
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = preview;
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onFileSelect(file);
      setImageSize(null);
      const img = new window.Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onFileSelect(file);
      const img = new window.Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/30 backdrop-blur-sm"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border/40 bg-muted/30">
            <div
              className="relative w-full"
              style={{
                aspectRatio: imageSize
                  ? `${imageSize.width} / ${imageSize.height}`
                  : 'auto'
              }}
            >
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Click to change image</p>
        </div>
      ) : (
        <div className="space-y-3">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
