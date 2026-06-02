import { useEffect, useRef, useState } from 'react';
import { ImageInspectionResult, inspectImage } from '@/lib/imageInspection';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ImageInspectorProps {
  file: File;
  fileId?: string;  // optional ID to track which file the result belongs to
  type: string;
  onInspectionComplete: (result: ImageInspectionResult, fileId?: string) => void;
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

export function ImageInspector({ file, fileId, type, onInspectionComplete }: ImageInspectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);
  const isMountedRef = useRef(true);
  const hasCalledCompleteRef = useRef(false);
  // ⭐ 用 ref 存 callback，避免 onInspectionComplete 引用变化导致 effect 重跑
  const onInspectionCompleteRef = useRef(onInspectionComplete);
  onInspectionCompleteRef.current = onInspectionComplete;

  useEffect(() => {
    isMountedRef.current = true;

    const inspect = async () => {
      try {
        setIsLoading(true);
        const result = await inspectImage(file, type);
        if (!isMountedRef.current) return;

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
        if (!hasCalledCompleteRef.current) {
          hasCalledCompleteRef.current = true;
          onInspectionCompleteRef.current(result, fileId);
        }
      } catch (error) {
        if (!isMountedRef.current) return;
        // Silently pass — don't block upload
        setIssues([]);
        if (!hasCalledCompleteRef.current) {
          hasCalledCompleteRef.current = true;
          onInspectionCompleteRef.current({
            selfie: false,
            blurry: false,
            includes_multiple_people: false,
            full_body_image_or_longshot: false,
            funny_face: false,
            wearing_hat: false,
            wearing_sunglasses: false,
          }, fileId);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // ⭐ 只在 file 变化时重新检测。type（man/woman/person）不影响 Astria 检测结果。
    // onInspectionComplete 通过 ref 访问，不在依赖中，避免父组件渲染导致重检。
    inspect();

    return () => {
      isMountedRef.current = false;
    };
  }, [file, fileId]);

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
