"use client";

import { VideoPlayer } from "./video-player";
import { VideoReactionsOverlay } from "./video-reactions-overlay";

interface VideoSidebarProps {
  src: string;
  poster?: string;
}

export function VideoSidebar({ src, poster }: VideoSidebarProps) {
  return (
    <>
      {/* Sticky Sidebar Video (Desktop only) */}
      <aside
        className="hidden lg:sticky lg:top-24 lg:block lg:self-start lg:max-h-[calc(100vh-6rem)]"
        aria-label="Vídeo explicativo"
      >
        <div className="relative w-full max-w-[360px]">
          <VideoPlayer src={src} poster={poster} />
          <VideoReactionsOverlay />
        </div>
      </aside>

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
