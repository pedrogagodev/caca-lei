"use client";

import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerX,
  SpeakerLow,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export function VideoPlayer({ src, poster, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Time update handler
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };

    // Duration change handler
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          // Autoplay was prevented (browser policy)
          setIsPlaying(false);
          setIsLoading(false);
        });
    }

    // Hide controls after 3 seconds
    const timeout = setTimeout(() => setShowControls(false), 3000);

    return () => {
      clearTimeout(timeout);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      // Clear hide controls timeout on unmount
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    // Show controls briefly
    setShowControls(true);

    // Clear existing timeout
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    // Auto-hide if playing
    if (video.paused) {
      // Keep controls visible when paused
      hideControlsTimeoutRef.current = null;
    } else {
      hideControlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
    }
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      togglePlayPause();
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
    // Clear timeout when mouse leaves
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
      hideControlsTimeoutRef.current = null;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);

    // Clear existing timeout
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    // Auto-hide controls after 2 seconds of no mouse movement
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  const handleLoadStart = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = volume > 0 ? volume : 0.5;
      setVolume(volume > 0 ? volume : 0.5);
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }

    setShowControls(true);

    // Clear existing timeout
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    // Auto-hide controls after 2 seconds
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Number.parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    video.muted = newVolume === 0;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * video.duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return SpeakerX;
    if (volume < 0.5) return SpeakerLow;
    return SpeakerHigh;
  };

  const VolumeIcon = getVolumeIcon();

  if (hasError) {
    return (
      <div
        className={cn(
          "flex aspect-[9/16] w-full items-center justify-center rounded-2xl bg-muted",
          className
        )}
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Vídeo indisponível no momento
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black", className)}
      onClick={handleVideoClick}
      onKeyDown={handleKeyPress}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      tabIndex={0}
      role="region"
      aria-label="Vídeo explicativo da lei"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        playsInline
        muted={isMuted}
        preload="metadata"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        className="h-full w-full object-cover"
        aria-label="Vídeo explicativo"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      )}

      {/* Play/Pause Overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          showControls && !isLoading ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="rounded-full bg-black/60 p-4 backdrop-blur-sm transition-transform duration-200">
          {isPlaying ? (
            <Pause className="h-12 w-12 text-white" weight="fill" />
          ) : (
            <Play className="h-12 w-12 text-white" weight="fill" />
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-8 transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div
          className="pointer-events-auto mb-3 h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/20 transition-all duration-200 hover:h-1.5"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Barra de progresso do vídeo"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="pointer-events-auto flex items-center justify-between gap-3">
          {/* Time Display */}
          <div className="flex items-center gap-1 text-xs font-medium text-white tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/60">/</span>
            <span className="text-white/80">{formatTime(duration)}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95"
              aria-label={isMuted ? "Ativar som" : "Silenciar"}
            >
              <VolumeIcon className="h-5 w-5 text-white" weight="fill" />
            </button>

            {/* Volume Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              onClick={(e) => e.stopPropagation()}
              className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/20 transition-all duration-200 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 hover:[&::-webkit-slider-thumb]:scale-110"
              aria-label="Controle de volume"
            />
          </div>
        </div>
      </div>

      {/* Click Target Hint */}
      <div className="pointer-events-none absolute inset-0">
        <span className="sr-only">
          {isPlaying ? "Clique para pausar" : "Clique para reproduzir"}
        </span>
      </div>
    </div>
  );
}
