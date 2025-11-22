"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="px-4 py-4 md:px-6 md:py-5">
        {/* Header */}
        <div className="mb-5">
          <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
            Visualizações
          </p>
          <h2 className="text-xl font-semibold">
            Infográficos e dados visuais
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg active:scale-[0.98]"
              aria-label={`Ver ${item.alt}`}
            >
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
            </button>
          ))}
        </div>
      </Card>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Visualização de imagem em tela cheia"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95"
              aria-label="Fechar visualização"
            >
              <X className="h-6 w-6" weight="bold" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="h-auto w-auto max-h-[85vh] max-w-full rounded-lg object-contain"
                  priority
                />
              </div>
              {selectedImage.caption && (
                <p className="mt-4 text-center text-sm text-white/90">
                  {selectedImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
