
"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Banner } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      setLoading(true);
      try {
        const res = await fetch('/api/banners?active=true&limit=3');
        if (res.ok) {
          const data = await res.json();
          setBanners(data);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  if (loading) {
      return <Skeleton className="w-full h-[200px] md:h-[300px] rounded-lg" />;
  }

  if (banners.length === 0) {
    return null; // Don't render anything if there are no active banners
  }

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <Card className="overflow-hidden">
                <div className="relative aspect-[3/1] w-full">
                    <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
