"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";
import { modelRowWithSamples } from "@/types/utils";
import { useEffect, useState } from "react";

type ModelsTableProps = {
  models: modelRowWithSamples[];
};

const ESTIMATED_TRAINING_MS = 30 * 60 * 1000; // 30 minutes

function TrainingProgress({ model }: { model: modelRowWithSamples }) {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");

  // ⭐ 优先使用真实进度（images_generated / total_images）
  const generated = (model as any).images_generated ?? 0;
  const total = (model as any).total_images ?? 0;
  const hasRealProgress = total > 0;

  useEffect(() => {
    if (hasRealProgress) {
      const pct = Math.round((generated / total) * 100);
      setProgress(pct);
      setLabel(`${generated}/${total}`);
      return;
    }

    // Fallback: 基于时间的估算
    const update = () => {
      if (!model.created_at) return;
      const start = new Date(model.created_at).getTime();
      const now = Date.now();
      const elapsedMs = now - start;
      const pct = Math.min(Math.round((elapsedMs / ESTIMATED_TRAINING_MS) * 100), 95);
      setProgress(pct);
      const mins = Math.floor(elapsedMs / 60000);
      setLabel(mins < 1 ? "<1m" : `${mins}m`);
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [model.created_at, hasRealProgress, generated, total]);

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <Progress value={progress} className="h-2 w-20" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {hasRealProgress ? label : `${label} / ~30m`}
      </span>
    </div>
  );
}

export default function ModelsTable({ models }: ModelsTableProps) {
  const router = useRouter();
  const handleRedirect = (id: number) => {
    router.push(`/overview/models/${id}`);
  };

  return (
    <div className="rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Samples</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.map((model) => (
            <TableRow
              key={model.modelId}
              onClick={() => handleRedirect(model.id)}
              className="cursor-pointer h-16"
            >
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge
                    className="flex gap-2 items-center w-min"
                    variant={model.status === "finished" ? "default" : "secondary"}
                  >
                    {model.status === "processing" ? "training" : model.status === "pending" ? "queued" : model.status}
                    {(model.status === "processing" || model.status === "pending") && (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    )}
                  </Badge>
                  {(model.status === "processing" || model.status === "pending") && (
                    <TrainingProgress model={model} />
                  )}
                </div>
              </TableCell>
              <TableCell>{model.type}</TableCell>
              <TableCell>
                <div className="flex gap-2 flex-shrink-0 items-center">
                  {(model.samples || []).slice(0, 3).map((sample) => (
                    <Avatar key={sample.id}>
                      <AvatarImage src={sample.uri} className="object-cover" />
                    </Avatar>
                  ))}
                  {(model.samples || []).length > 3 && (
                    <Badge className="rounded-full h-10" variant={"outline"}>
                      +{(model.samples || []).length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
