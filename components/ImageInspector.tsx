import { useEffect, useState } from 'react';
import { ImageInspectionResult, inspectImage } from '@/lib/imageInspection';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ImageInspectorProps {
  file: File;
  type: string;
  onInspectionComplete: (result: ImageInspectionResult) => void;
}

// Only show issues that actually prevent good AI headshot results
// "Selfie" is NORMAL and expected - don't show it as a warning
const CRITICAL_ISSUES = {
  includes_multiple_people: 'Multiple people detected — use solo photos only',
  blurry: 'Image is blurry — use a clearer photo',
  wearing_sunglasses: 'Sunglasses may affect results',
  wearing_hat: 'Hat may affect results — face should be fully visible',
  funny_face: 'Unusual expression detected — neutral faces work best',
};

export function ImageInspector({ file, type, onInspectionComplete }: ImageInspectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const inspect = async () => {
      try {
        setIsLoading(true);
        const result = await inspectImage(file, type);
        if (!controller.signal.aborted) {
          // Only show critical issues that affect AI output quality
          // "Selfie" is expected/normal — NOT a problem
          // "Full body" is minor — don't alarm the user
          const detectedIssues: string[] = [];

          if (result.includes_multiple_people) {
            detectedIssues.push(CRITICAL_ISSUES.includes_multiple_people);
          }
          if (result.blurry) {
            detectedIssues.push(CRITICAL_ISSUES.blurry);
          }
          if (result.wearing_sunglasses) {
            detectedIssues.push(CRITICAL_ISSUES.wearing_sunglasses);
          }
          if (result.wearing_hat) {
            detectedIssues.push(CRITICAL_ISSUES.wearing_hat);
          }
          if (result.funny_face) {
            detectedIssues.push(CRITICAL_ISSUES.funny_face);
          }

          setIssues(detectedIssues);
          onInspectionComplete(result);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          // Silently pass — don't block upload
          setIssues([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    inspect();

    return () => {
      controller.abort();
    };
  }, [file, type]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking...
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600">
        <CheckCircle2 className="h-3 w-3" />
        Looks good
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {issues.map((issue, index) => (
        <div key={index} className="flex items-start gap-1 text-xs text-amber-600">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{issue}</span>
        </div>
      ))}
    </div>
  );
}
