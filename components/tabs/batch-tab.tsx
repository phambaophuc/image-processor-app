'use client';

import { useState } from 'react';

import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import Image from 'next/image';

import { processBatch } from '@/lib/api';
import type { ImageResponse } from '@/types';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui';

export function BatchTab() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [format, setFormat] = useState('webp');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImageResponse[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviews((prev) => [...prev, event.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      formData.append('width', width);
      formData.append('height', height);
      formData.append('format', format);

      const data = await processBatch(formData);
      setResults(data.images ?? []);
      toast.success(
        `Processed ${data.images?.length || 0} images successfully`
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to process images');
      } else {
        toast.error(`Unknown error: ${error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url, { mode: 'cors' });
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = url.split('/').pop() || 'image.jpg';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Batch Upload</CardTitle>
          <CardDescription>Process multiple images at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-width">Width (px)</Label>
                <Input
                  id="batch-width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-height">Height (px)</Label>
                <Input
                  id="batch-height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-format">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-2 border-dashed border-border/40 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="batch-upload"
              />
              <label htmlFor="batch-upload" className="cursor-pointer block">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p>PNG, JPG, WEBP, GIF up to 10MB each</p>
                </div>
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Selected Files ({files.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={preview || '/placeholder.svg'}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover rounded-lg border border-border/40"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleProcess}
            disabled={files.length === 0 || loading}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Processing...' : 'Process All Images'}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Processed Images</CardTitle>
            <CardDescription>
              {results.length} images processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 rounded-lg border border-border/40 bg-background/50"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={result.url || '/placeholder.svg'}
                      alt={`Result ${index}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Size: {(result.file_size / 1024).toFixed(2)} KB</p>
                    <p>
                      Processed:{' '}
                      {new Date(result.processed_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDownload(result.url)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
