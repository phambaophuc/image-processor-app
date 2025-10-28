'use client';

import { useState } from 'react';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { checkHealth } from '@/lib/api';
import { HealthCheck } from '@/types';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui';

export function HealthTab() {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthCheck | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const data = await checkHealth();
      setHealth(data);
      toast.success('Health check completed');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to check health');
      } else {
        toast.error(`Unknown error: ${error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Server Health</CardTitle>
          <CardDescription>
            Check the status of the image processing service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleCheck}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Checking...' : 'Check Health'}
          </Button>

          {health && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border/40 bg-background/50">
                <div className="flex items-center gap-3">
                  {health.status === 'healthy' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">
                      Status:{' '}
                      <span className="capitalize">{health.status}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(health.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {health.services && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(health.services).map(
                      ([service, status]) => (
                        <div
                          key={service}
                          className="p-3 rounded-lg border border-border/40 bg-background/50 flex items-center gap-2"
                        >
                          {status === 'healthy' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground capitalize">
                              {service}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {status}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
