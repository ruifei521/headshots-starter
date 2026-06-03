'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTrainingStatus } from '@/hooks';
import type { TrainingStatus } from '@/hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FaSpinner, FaCheck, FaTimes, FaImage } from 'react-icons/fa';

// ============================================
// TrainingProgress Component
// ============================================

interface TrainingProgressProps {
  /** Database model ID from /astria/train-model response */
  modelId: number;
  /** Called when training completes successfully */
  onComplete?: () => void;
}

/** Maps status strings to badge variant and label */
const STATUS_CONFIG: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  processing: { variant: 'secondary', label: 'Processing' },
  training: { variant: 'default', label: 'Training' },
  completed: { variant: 'default', label: 'Completed' },
  failed: { variant: 'destructive', label: 'Failed' },
};

export default function TrainingProgress({ modelId, onComplete }: TrainingProgressProps) {
  const router = useRouter();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const {
    status,
    images_generated,
    total_images,
    name,
    isLoading,
    error,
  } = useTrainingStatus(modelId);

  // Auto-redirect on completion after 3s
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (status === 'completed' && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      onCompleteRef.current?.();

      const timer = setTimeout(() => {
        router.push('/overview/models');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Derive display values
  const statusConfig = STATUS_CONFIG[status] ?? { variant: 'secondary' as const, label: status || 'Unknown' };
  const progressPercent = total_images > 0 ? Math.min(100, Math.round((images_generated / total_images) * 100)) : 0;
  const isTerminal = status === 'completed' || status === 'failed';

  // Estimated time (rough heuristic)
  const estimatedTime = useMemo(() => {
    if (status === 'completed') return 'Done!';
    if (status === 'failed') return 'N/A';
    if (total_images > 0 && images_generated > 0) {
      const remaining = total_images - images_generated;
      // Rough: ~2 min per image
      const minutes = Math.max(1, remaining * 2);
      return `~${minutes} min remaining`;
    }
    return '~30 min remaining';
  }, [status, total_images, images_generated]);

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            {status === 'completed' && (
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <FaCheck className="h-7 w-7 text-green-600" />
              </div>
            )}
            {status === 'failed' && (
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <FaTimes className="h-7 w-7 text-red-600" />
              </div>
            )}
            {!isTerminal && (
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <FaSpinner className="h-7 w-7 text-blue-600 animate-spin" />
              </div>
            )}
          </div>

          <CardTitle>
            {status === 'completed' && 'Your headshots are ready!'}
            {status === 'failed' && 'Training failed'}
            {!isTerminal && `Training "${name || 'your model'}"`}
          </CardTitle>

          <CardDescription>
            {status === 'completed' && 'Redirecting to your models in 3 seconds...'}
            {status === 'failed' && 'Something went wrong during training. Please try again.'}
            {!isTerminal && 'We are generating your AI headshots. This may take a while.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Status badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={statusConfig.variant}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* Progress bar */}
          {!isTerminal && total_images > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {images_generated} / {total_images} images
                </span>
              </div>
              <Progress value={progressPercent} />
            </div>
          )}

          {/* Loading skeleton for unknown total */}
          {!isTerminal && total_images === 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">Initializing...</span>
              </div>
              <Progress value={0} className="animate-pulse" />
            </div>
          )}

          {/* Completed: image count */}
          {status === 'completed' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FaImage className="h-4 w-4" />
              <span>{images_generated} headshots generated</span>
            </div>
          )}

          {/* Estimated time */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isTerminal ? 'Status' : 'Estimated time'}
            </span>
            <span className="text-sm font-medium">{estimatedTime}</span>
          </div>

          {/* Model name */}
          {name && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Model</span>
              <span className="text-sm font-medium">{name}</span>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              Error: {error.message}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          {status === 'completed' && (
            <Button
              className="w-full"
              onClick={() => router.push('/overview/models')}
            >
              View My Headshots
            </Button>
          )}

          {status === 'failed' && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/overview')}
            >
              Back to Overview
            </Button>
          )}

          {!isTerminal && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/overview')}
            >
              Go to Dashboard
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            You can safely close this page — training continues in the background.
            We will notify you when your headshots are ready.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
