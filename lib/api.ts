import type {
  APIResponse,
  BatchResponse,
  HealthCheck,
  ImageResponse
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Call API resize/process single image
 */
export async function processImage(formData: FormData): Promise<ImageResponse> {
  const response = await fetch(`${API_URL}/images/resize`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data: APIResponse<ImageResponse> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Image processing failed');
  }

  return data.data;
}

/**
 * Call API batch resize
 */
export async function processBatch(formData: FormData): Promise<BatchResponse> {
  const response = await fetch(`${API_URL}/images/batch/resize`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data: APIResponse<BatchResponse> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Batch processing failed');
  }

  return data.data;
}

/**
 * Health check
 */
export async function checkHealth(): Promise<HealthCheck> {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data: APIResponse<HealthCheck> = await response.json();

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Health check failed');
  }

  return data.data;
}
