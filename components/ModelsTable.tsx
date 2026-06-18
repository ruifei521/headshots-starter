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
import { modelRowWithSamples } from "@/types/utils";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getModelStatusLabel, isModelGenerating } from "@/lib/model-status-label";
import { ESTIMATED_DELIVERY_MINUTES } from "@/lib/tiers";

type ModelsTableProps = {
  models: modelRowWithSamples[];
};

const ESTIMATED_TRAINING_MIN = ESTIMATED_DELIVERY_MINUTES;

function StatusBadge({ model }: { model: modelRowWithSamples }) {
  const label = getModelStatusLabel(model);
  const spinning = isModelGenerating(model);

  return (
    <Badge
      className="flex w-fit items-center gap-2"
      variant={
        model.status === "failed"
          ? "destructive"
          : model.status === "finished" || model.status === "completed"
            ? "default"
            : "secondary"
      }
    >
      {label}
      {spinning && <Icons.spinner className="h-4 w-4 animate-spin" />}
    </Badge>
  );
}

function TrainingProgress({ model }: { model: modelRowWithSamples }) {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");

  const generated = model.images_generated ?? 0;
  const total = model.total_images ?? 0;
  const isGenerating = total > 0 && generated > 0;

  useEffect(() => {
    if (isGenerating) {
      const pct = Math.round((generated / total) * 100);
      setProgress(pct);
      setLabel(`${generated}/${total}`);
      return;
    }

    const update = () => {
      if (!model.created_at) return;
      const start = new Date(model.created_at).getTime();
      const elapsedMs = Date.now() - start;
      const mins = Math.floor(elapsedMs / 60000);
      const pct = Math.min(Math.round((mins / ESTIMATED_TRAINING_MIN) * 100), 80);
      setProgress(pct);
      if (mins > ESTIMATED_TRAINING_MIN) {
        setLabel(`>${ESTIMATED_TRAINING_MIN} min`);
      } else {
        setLabel(mins < 1 ? "<1 min" : `${mins} min`);
      }
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [model.created_at, isGenerating, generated, total]);

  return (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <Progress value={progress} className="h-2 min-w-[4rem] flex-1 max-w-32" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {isGenerating ? label : `~${ESTIMATED_TRAINING_MIN} min`}
      </span>
    </div>
  );
}

function SampleAvatars({ model }: { model: modelRowWithSamples }) {
  const samples = model.samples || [];
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {samples.slice(0, 3).map((sample) => (
        <Avatar key={sample.id} className="h-9 w-9 sm:h-10 sm:w-10">
          <AvatarImage src={sample.uri} className="object-cover" alt="" />
        </Avatar>
      ))}
      {samples.length > 3 && (
        <Badge className="h-9 rounded-full px-2 text-xs" variant="outline">
          +{samples.length - 3}
        </Badge>
      )}
    </div>
  );
}

export default function ModelsTable({ models }: ModelsTableProps) {
  const handleRedirect = (id: number) => {
    window.location.href = `/overview/models/${id}`;
  };

  return (
    <>
      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => handleRedirect(model.id)}
            className="flex w-full flex-col gap-3 rounded-lg border bg-card p-4 text-left active:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{model.name}</p>
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">{model.type}</p>
              </div>
              <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge model={model} />
              {(model.status === "processing" || model.status === "pending" || model.status === "finished") && (
                <TrainingProgress model={model} />
              )}
            </div>
            {(model.samples || []).length > 0 && (
              <div className="flex items-center justify-between gap-2 border-t pt-3">
                <span className="text-xs text-muted-foreground">Training photos</span>
                <SampleAvatars model={model} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden rounded-md border md:block">
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
            {models.map((model) => (
              <TableRow
                key={model.id}
                onClick={() => handleRedirect(model.id)}
                className="h-16 cursor-pointer"
              >
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <StatusBadge model={model} />
                    {(model.status === "processing" || model.status === "pending" || model.status === "finished") && (
                      <TrainingProgress model={model} />
                    )}
                  </div>
                </TableCell>
                <TableCell>{model.type}</TableCell>
                <TableCell>
                  <SampleAvatars model={model} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
