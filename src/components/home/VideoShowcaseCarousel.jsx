import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaTimes,
  FaClock,
  FaVolumeMute,
  FaVolumeUp,
  FaVideo,
} from 'react-icons/fa';

function getEmbedInfo(url) {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    };
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      thumbnailUrl: null,
    };
  }
  return null;
}

export default function VideoShowcaseCarousel({ videos = [], loading = false }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const videoPlayerRef = useRef(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Format video duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0:45';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else {
        if (!activeVideo && !prefersReducedMotion) {
          setIsPlaying(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeVideo, prefersReducedMotion]);

  // Toggle Play / Pause Carousel
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Open / Close Video Modal
  const openVideo = (video) => {
    setActiveVideo(video);
    setIsMuted(false); // Unmute for user-initiated playback
  };

  const closeVideo = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    setActiveVideo(null);
    if (!prefersReducedMotion) {
      setIsPlaying(true);
    }
  };

  // When video playback ends, close video and resume
  const handleVideoEnded = () => {
    closeVideo();
  };

  // Keyboard escape handler for video modal
  useEffect(() => {
    if (!activeVideo) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeVideo();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeVideo]);

  // Build seamless infinite marquee items
  const infiniteVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    let base = [...videos];
    while (base.length < 6 && videos.length > 0) {
      base = [...base, ...videos];
    }
    return [
      ...base.map((v, i) => ({ ...v, _origIdx: i % videos.length, _key: `v1-${v.id || i}-${i}` })),
      ...base.map((v, i) => ({ ...v, _origIdx: i % videos.length, _key: `v2-${v.id || i}-${i}` })),
      ...base.map((v, i) => ({ ...v, _origIdx: i % videos.length, _key: `v3-${v.id || i}-${i}` })),
      ...base.map((v, i) => ({ ...v, _origIdx: i % videos.length, _key: `v4-${v.id || i}-${i}` })),
    ];
  }, [videos]);

  if (loading && videos.length === 0) {
    return (
      <section className="py-20 bg-[#050A14] border-t border-white/5" aria-busy="true">
        <div className="container mx-auto px-6">
          <div className="h-8 w-48 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-80 bg-white/10 rounded-xl mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#050A14] via-[#081224] to-[#050A14] border-t border-white/10 text-white select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('home.videoCarouselLabel', 'Travel Stories & Videos')}
    >
      <style>{`
        @keyframes videoShowcaseContinuous {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .video-showcase-marquee-track {
          display: flex;
          width: max-content;
          animation: videoShowcaseContinuous 60s linear infinite;
          will-change: transform;
        }
        .video-showcase-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Section Header */}
      <div className="container mx-auto px-6 mb-10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#F5A623] border border-[#F5A623]/40 rounded-full bg-[#F5A623]/10 shadow-[0_0_15px_rgba(245,166,35,0.2)] mb-4">
            <FaVideo className="w-3 h-3 text-[#F5A623]" />
            <span>{t('home.videoBadge', 'TRAVEL STORIES')}</span>
          </div>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('home.videoHeading', 'Witness The Magic')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent mx-auto mt-2 rounded-full" />
        </motion.div>
      </div>

      {/* Marquee Container with Left & Right Gradient Masks */}
      <div className="relative w-full overflow-hidden">
        {/* Cinematic Edge Gradient Overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 md:w-44 bg-gradient-to-r from-[#050A14] via-[#050A14]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 md:w-44 bg-gradient-to-l from-[#050A14] via-[#050A14]/80 to-transparent z-20" />

        {/* Continuous Right-to-Left Infinite Marquee Track */}
        <div className="w-full overflow-hidden relative py-4" dir="ltr">
          <div
            className="video-showcase-marquee-track flex gap-6 px-4"
            style={{
              animationPlayState: !isPlaying || activeVideo || prefersReducedMotion ? 'paused' : undefined,
              animation: prefersReducedMotion ? 'none' : undefined,
            }}
          >
            {infiniteVideos.map((video, index) => {
              const embed = getEmbedInfo(video.url || video.videoUrl || video.secureUrl);
              const poster = video.posterUrl || video.thumbnailUrl || embed?.thumbnailUrl || video.url;
              const videoTitle = video.title || video.alt || 'Dunas Travel Video';

              return (
                <div
                  key={video._key || `video-${index}`}
                  onClick={() => openVideo(video)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openVideo(video);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${t('home.playVideo', 'Play video clip of')} ${videoTitle}`}
                  className="group relative w-[320px] sm:w-[380px] md:w-[420px] lg:w-[460px] h-[250px] sm:h-[280px] md:h-[320px] shrink-0 rounded-3xl overflow-hidden border border-white/10 hover:border-[#F5A623]/80 bg-[#0E1726] shadow-2xl transition-all duration-500 hover:scale-[1.03] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
                >
                  <img
                    src={poster}
                    alt={videoTitle}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />

                  {/* Dark Overlay with Central Play Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 group-hover:from-black/85 group-hover:via-black/30 transition-colors flex flex-col justify-between p-5">
                    {/* Top Duration Badge */}
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
                        <FaClock className="w-3 h-3 text-[#F5A623]" />
                        <span>{formatDuration(video.duration)}</span>
                      </span>
                    </div>

                    {/* Center Play Button with Glow */}
                    <div className="self-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F5A623] text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(245,166,35,0.5)] group-hover:scale-115 transition-transform duration-300">
                        <FaPlay className="w-5 h-5 ml-1" />
                      </div>
                    </div>

                    {/* Bottom Title */}
                    <div>
                      <h3 className="text-white text-sm md:text-base font-bold line-clamp-2 leading-snug drop-shadow-md group-hover:text-[#F5A623] transition-colors">
                        {videoTitle}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Autoplay Play/Pause Bar */}
      <div className="container mx-auto px-6 mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? t('home.pauseCarousel', 'Pause Autoplay') : t('home.playCarousel', 'Start Autoplay')}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs md:text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#F5A623]/50 text-white/80 hover:text-white transition-all shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]"
        >
          {isPlaying ? (
            <>
              <FaPause className="w-3 h-3 text-[#F5A623]" />
              <span>{t('home.pause', 'Pause')}</span>
            </>
          ) : (
            <>
              <FaPlay className="w-3 h-3 text-[#F5A623]" />
              <span>{t('home.play', 'Autoplay')}</span>
            </>
          )}
        </button>
      </div>

      {/* Fullscreen Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            onClick={closeVideo}
            role="dialog"
            aria-modal="true"
            aria-label={t('home.videoPlayer', 'Video Player')}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeVideo}
              aria-label={t('home.close', 'Close')}
              className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-110 cursor-pointer"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/15"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const activeEmbed = getEmbedInfo(activeVideo.url || activeVideo.videoUrl || activeVideo.secureUrl);
                if (activeEmbed) {
                  return (
                    <iframe
                      src={activeEmbed.embedUrl}
                      title={activeVideo.title || activeVideo.alt || 'Dunas Travel Video'}
                      className="w-full aspect-video object-contain bg-black border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video
                    ref={videoPlayerRef}
                    src={activeVideo.url || activeVideo.videoUrl || activeVideo.secureUrl}
                    poster={activeVideo.posterUrl || activeVideo.thumbnailUrl}
                    controls
                    autoPlay
                    playsInline
                    muted={isMuted}
                    onEnded={handleVideoEnded}
                    className="w-full aspect-video object-contain bg-black"
                  >
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                );
              })()}

              {/* Bottom Details Bar */}
              <div className="p-6 bg-gradient-to-t from-[#0E1726] to-[#0A101C] flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 text-[#F5A623] text-xs font-black uppercase tracking-wider">
                    <FaVideo className="w-3 h-3" />
                    <span>{t('home.videoBadge', 'TRAVEL STORIES')}</span>
                  </div>
                  <h4 className="text-white text-lg font-bold truncate">
                    {activeVideo.title || activeVideo.alt || 'Dunas Travel Video'}
                  </h4>
                  {activeVideo.description && (
                    <p className="text-white/70 text-xs line-clamp-2">
                      {activeVideo.description}
                    </p>
                  )}
                </div>

                {!getEmbedInfo(activeVideo.url || activeVideo.videoUrl || activeVideo.secureUrl) && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMuted((m) => !m);
                        if (videoPlayerRef.current) {
                          videoPlayerRef.current.muted = !isMuted;
                        }
                      }}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <FaVolumeMute className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
