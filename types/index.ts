export interface ImageResponse {
  processed_at: string;
  url: string;
  file_size: number;
}

export interface BatchResponse {
  images?: ImageResponse[];
  processed_at?: string;
  error?: string;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  services: Record<string, string>;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
