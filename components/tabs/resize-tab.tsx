'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { processImage } from '@/lib/api';
import type { ImageResponse } from '@/types';

import ImageUpload from '../image-upload';
import ResultPreview from '../result-preview';
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

export function ResizeTab() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');
  const [quality, setQuality] = useState<string>('80');
  const [format, setFormat] = useState<string>('webp');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ImageResponse | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('width', width);
      formData.append('height', height);
      formData.append('quality', quality);
      formData.append('format', format);

      const data = await processImage(formData);
      setResult(data);
      toast.success('Image resized successfully');
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image to resize</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload onFileSelect={handleFileSelect} preview={preview} />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="800"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="600"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Input
                  id="quality"
                  type="number"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  placeholder="80"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
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
          </div>

          <Button
            onClick={handleProcess}
            disabled={!file || loading}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Processing...' : 'Process Image'}
          </Button>
        </CardContent>
      </Card>

      <ResultPreview result={result || undefined} />
    </div>
  );
}
