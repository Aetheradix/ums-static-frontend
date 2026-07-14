import { Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../../../shared/context/useLanguage';

const CAMPUS_VIDEO_URL = 'https://youtu.be/WCqw4fnpHBw?si=sz5Uvz29RE8KQcYA';
const VIDEO_START_TIME = 15; // Skip the first 15 seconds of the video

// Helper to parse YouTube URL and return an embeddable player link
function getYouTubeEmbedUrl(url: string, startTime: number): string | null {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&start=${startTime}&cc_load_policy=0&iv_load_policy=3`;
  }
  return null;
}

export default function CampusLifeBanner() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useLanguage();

  // Keyboard navigation and body scroll-lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPlaying(false);
    };

    if (isPlaying) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(
    CAMPUS_VIDEO_URL,
    VIDEO_START_TIME
  );

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 md:py-6 select-none relative z-10">
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] rounded-3xl overflow-hidden shadow-md group">
        {/* Dynamic Static Campus Background Graphic */}
        <div className="absolute inset-0 bg-slate-900 z-0">
          <img
            src="/davv-cms/crousel/Slide1.jpg"
            alt="Vibrant DAVV Campus Life"
            className="w-full h-full object-cover opacity-85 dark:opacity-40 dark:brightness-75 group-hover:scale-103 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Premium Semi-Transparent Left-to-Right Overlapping Gradient Layer */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-davv-darkest) 0%, color-mix(in srgb, var(--color-davv-dark) 80%, transparent) 50%, transparent 100%)',
          }}
        />

        {/* Content Wrapper */}
        <div className="absolute inset-0 flex items-center z-20 px-6 sm:px-12 md:px-16">
          <div className="max-w-md md:max-w-xl text-left flex flex-col items-start gap-4">
            <div className="space-y-1 md:space-y-2">
              <h3 className="font-display font-black text-white text-xl sm:text-2xl md:text-3xl leading-tight">
                {t('Campus Life @ DAVV')}
              </h3>
              <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                {t(
                  'A vibrant campus that inspires learning, creativity and holistic development.'
                )}
              </p>
            </div>

            {/* Play Button Action Trigger */}
            <button
              onClick={handlePlayVideo}
              className="flex items-center gap-3.5 group/btn cursor-pointer"
            >
              {/* Circular play icon */}
              <div className="w-10 h-10 rounded-full bg-white text-[#002147] flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                <Play className="w-4.5 h-4.5 fill-current stroke-0 ml-0.5" />
              </div>
              {/* Dark pill label */}
              <div className="px-5 py-2.5 rounded-full bg-black/40 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/10 group-hover/btn:bg-black/60 transition-colors">
                {t('Watch Campus Video')}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {isPlaying && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn"
          onClick={() => setIsPlaying(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-zoomIn"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/15"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player / Youtube Embed iframe */}
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={t('Campus Life @ DAVV')}
              />
            ) : (
              <video
                src={`${CAMPUS_VIDEO_URL}#t=${VIDEO_START_TIME}`}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
