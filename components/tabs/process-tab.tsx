'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { processAdvanced } from '@/lib/api';
import { ImageResponse } from '@/types';

import ImageUpload from '../image-upload';
import ResultPreview from '../result-preview';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label
} from '../ui';

export function ProcessTab() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageResponse | null>(null);

  // Resize
  const [resizeWidth, setResizeWidth] = useState('800');
  const [resizeHeight, setResizeHeight] = useState('600');
  const [resizeFormat, setResizeFormat] = useState('webp');
  const [enableResize, setEnableResize] = useState(false);

  // Crop
  const [cropX, setCropX] = useState('10');
  const [cropY, setCropY] = useState('10');
  const [cropWidth, setCropWidth] = useState('400');
  const [cropHeight, setCropHeight] = useState('400');
  const [enableCrop, setEnableCrop] = useState(false);

  // Watermark
  const [watermarkText, setWatermarkText] = useState('PhucDev');
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right');
  const [watermarkOpacity, setWatermarkOpacity] = useState('0.5');
  const [enableWatermark, setEnableWatermark] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const params: Record<string, unknown> = {};

      if (enableResize) {
        params.resize = {
          width: Number(resizeWidth),
          height: Number(resizeHeight),
          format: resizeFormat
        };
      }

      if (enableCrop) {
        params.crop = {
          x: Number(cropX),
          y: Number(cropY),
          width: Number(cropWidth),
          height: Number(cropHeight)
        };
      }

      if (enableWatermark) {
        params.watermark = {
          text: watermarkText,
          position: watermarkPosition,
          opacity: Number(watermarkOpacity)
        };
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('payload', JSON.stringify(params));

      const data = await processAdvanced(formData);
      setResult(data);
      toast.success('Image processed successfully');
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
          <CardTitle>Advanced Processing</CardTitle>
          <CardDescription>Combine multiple image operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-h-[800px] overflow-y-auto">
          <ImageUpload onFileSelect={handleFileSelect} preview={preview} />

          <div className="space-y-3 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Checkbox
                id="enable-resize"
                checked={enableResize}
                onCheckedChange={(checked) =>
                  setEnableResize(checked as boolean)
                }
              />
              <Label
                htmlFor="enable-resize"
                className="text-sm font-medium cursor-pointer"
              >
                Enable Resize
              </Label>
            </div>
          </div>

          {enableResize && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="resize-width" className="text-xs">
                    Width
                  </Label>
                  <Input
                    id="resize-width"
                    type="number"
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(e.target.value)}
                    className="bg-background/50 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="resize-height" className="text-xs">
                    Height
                  </Label>
                  <Input
                    id="resize-height"
                    type="number"
                    value={resizeHeight}
                    onChange={(e) => setResizeHeight(e.target.value)}
                    className="bg-background/50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="resize-format" className="text-xs">
                  Format
                </Label>
                <Select value={resizeFormat} onValueChange={setResizeFormat}>
                  <SelectTrigger className="bg-background/50 text-sm">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-3 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Checkbox
                id="enable-crop"
                checked={enableCrop}
                onCheckedChange={(checked) => setEnableCrop(checked as boolean)}
              />
              <Label
                htmlFor="enable-crop"
                className="text-sm font-medium cursor-pointer"
              >
                Enable Crop
              </Label>
            </div>

            {enableCrop && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="crop-x" className="text-xs">
                      X (start position)
                    </Label>
                    <Input
                      id="crop-x"
                      type="number"
                      value={cropX}
                      onChange={(e) => setCropX(e.target.value)}
                      className="bg-background/50 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="crop-y" className="text-xs">
                      Y (start position)
                    </Label>
                    <Input
                      id="crop-y"
                      type="number"
                      value={cropY}
                      onChange={(e) => setCropY(e.target.value)}
                      className="bg-background/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="crop-width" className="text-xs">
                      Width (px)
                    </Label>
                    <Input
                      id="crop-width"
                      type="number"
                      value={cropWidth}
                      onChange={(e) => setCropWidth(e.target.value)}
                      className="bg-background/50 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="crop-height" className="text-xs">
                      Height (px)
                    </Label>
                    <Input
                      id="crop-height"
                      type="number"
                      value={cropHeight}
                      onChange={(e) => setCropHeight(e.target.value)}
                      className="bg-background/50 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Checkbox
                id="enable-watermark"
                checked={enableWatermark}
                onCheckedChange={(checked) =>
                  setEnableWatermark(checked as boolean)
                }
              />
              <Label
                htmlFor="enable-watermark"
                className="text-sm font-medium cursor-pointer"
              >
                Enable Watermark
              </Label>
            </div>

            {enableWatermark && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="watermark-text" className="text-xs">
                    Watermark Text
                  </Label>
                  <Input
                    id="watermark-text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="bg-background/50 text-sm"
                    placeholder="Enter watermark text (e.g. © PhucDev)"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="watermark-position" className="text-xs">
                    Position
                  </Label>
                  <Select
                    value={watermarkPosition}
                    onValueChange={setWatermarkPosition}
                  >
                    <SelectTrigger className="bg-background/50 text-sm">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="watermark-opacity" className="text-xs">
                    Opacity ({watermarkOpacity})
                  </Label>
                  <input
                    id="watermark-opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(e.target.value)}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Adjust transparency level (0 = invisible, 1 = fully opaque)
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleProcess}
            disabled={!file || loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Processing...' : 'Process Image'}
          </Button>
        </CardContent>
      </Card>

      <ResultPreview result={result ?? undefined} />
    </div>
  );
}
