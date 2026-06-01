'use client'
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { Loader2, Users, ImageIcon } from "lucide-react";

interface PackCost {
  cost: number;
  num_images: number;
}

interface Pack {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  cover_url: string;
  costs: Record<string, PackCost>;
  tag: string;
}

export default function PacksGalleryZone() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPacks = async (signal?: AbortSignal): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Pack[]>('/astria/packs', { signal });
      setPacks(response.data);
    } catch (err: unknown) {
      if (axios.isCancel(err)) return;
      if (err instanceof Error) {
        toast({
          title: "Error fetching packs",
          description: err.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "Unknown error",
          description: "An unknown error occurred.",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchPacks(controller.signal);
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <Progress className="w-64" />
        <p className="mt-4 text-sm text-gray-500">Loading packs...</p>
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No packs available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {packs.map((pack) => {
        const hasWomen = !!pack.costs?.woman;
        const hasMen = !!pack.costs?.man;
        const totalImages = hasWomen && hasMen
          ? `${pack.costs.woman.num_images} (W) / ${pack.costs.man.num_images} (M)`
          : hasWomen
            ? `${pack.costs.woman.num_images} images`
            : `${pack.costs.man.num_images} images`;

        return (
          <Link
            href={`/overview/models/train/${pack.slug}`}
            key={pack.id}
            className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={pack.cover_url ?? "https://snapprohead.com/placeholder-logo.png"}
                alt={pack.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              {pack.tag && (
                <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full bg-primary/80 text-primary-foreground backdrop-blur-sm">
                  {pack.tag}
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-bold leading-tight">{pack.title}</h3>
              {pack.subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-2">{pack.subtitle}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {totalImages}
                </span>
                {hasWomen && hasMen && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Men & Women
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
