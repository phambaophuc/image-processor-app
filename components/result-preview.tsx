'use client';

import { Download } from 'lucide-react';

import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ImageResponse } from '@/types';

import { Button } from './ui';

interface ResultPreviewProps {
  result?: ImageResponse;
}

export default function ResultPreview({ result }: ResultPreviewProps) {
  if (!result) {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm h-full flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Process an image to see results here
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(result.url, { mode: 'cors' });
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = result.url.split('/').pop() || 'image.jpg';
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please check CORS or file URL.');
    }
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Result</CardTitle>
        <CardDescription>Processed image preview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image preview */}
        <div className="relative w-full overflow-hidden rounded-lg border border-border/40 bg-background/50">
          <div className="relative aspect-4/3 w-full">
            <Image
              src={result.url || '/placeholder.svg'}
              alt="Processed"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* File info */}
        <div className="space-y-2 p-3 rounded-lg bg-background/50 border border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">File Size</span>
            <span className="font-medium text-foreground">
              {(result.file_size / 1024).toFixed(2)} KB
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Processed At</span>
            <span className="font-medium text-foreground text-sm">
              {new Date(result.processed_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Download button */}
        <Button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Image
        </Button>
      </CardContent>
    </Card>
  );
}
