"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VideoPlayer } from "./video-player";
import { VideoReactionsOverlay } from "./video-reactions-overlay";
import { useVideoPiP } from "../_hooks/use-video-pip";

interface VideoSidebarProps {
  src: string;
  poster?: string;
}

export function VideoSidebar({ src, poster }: VideoSidebarProps) {
  const { videoSectionRef, isPiPActive } = useVideoPiP();

  return (
    <>
      {/* Sticky Sidebar Video (Desktop only) */}
      <aside
        ref={videoSectionRef}
        className="hidden lg:sticky lg:top-24 lg:block lg:self-start lg:max-h-[calc(100vh-6rem)]"
        aria-label="Vídeo explicativo"
      >
        <div className="relative w-full max-w-[360px]">
          <VideoPlayer src={src} poster={poster} />
          <VideoReactionsOverlay />
        </div>
      </aside>

      {/* Picture-in-Picture Mode (appears when scrolling) */}
      <AnimatePresence>
        {isPiPActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 z-50 w-[280px] rounded-2xl shadow-2xl"
            style={{
              right: "max(1.5rem, calc((100vw - 1152px) / 2 + 1.5rem))",
            }}
            aria-label="Vídeo em picture-in-picture"
          >
            <div className="relative">
              <VideoPlayer src={src} poster={poster} />
              {/* Reactions overlay scaled down for PiP */}
              <div className="scale-75 origin-bottom-right">
                <VideoReactionsOverlay />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Video (shows only on mobile) */}
      <div className="lg:hidden">
        <div className="relative w-full">
          <VideoPlayer src={src} poster={poster} />
          <VideoReactionsOverlay />
        </div>
      </div>
    </>
  );
}
