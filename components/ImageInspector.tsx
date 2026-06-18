import { useEffect, useRef, useState } from 'react';
import { ImageInspectionResult, inspectImage } from '@/lib/imageInspection';
import { getInspectionIssues, getInspectionUiIssues, DEFAULT_INSPECTION_RESULT } from '@/lib/image-inspection-labels';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ImageInspectorProps {
  file: File;
  fileId?: string;
  type: string;
  onInspectionComplete: (result: ImageInspectionResult, fileId?: string) => void;
}

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
        const { result, verified } = await inspectImage(file, type);
        if (!isMountedRef.current) return;

        const detectedIssues = verified
          ? getInspectionIssues(result)
          : getInspectionUiIssues(result, false);

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
          onInspectionCompleteRef.current(DEFAULT_INSPECTION_RESULT, fileId);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // ⭐ 只在 file 变化时重新检测。type（man/woman）不影响 Astria 检测结果。
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
