import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImagePreviewModalProps {
  images: string[];
  title: string;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImagePreviewModal({
  images,
  title,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || images.length === 0) return null;

  const hasMultiple = images.length > 1;

  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image container */}
      <div
        className="relative max-w-4xl max-h-[90vh] mx-4 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
        />

        {/* Image counter */}
        {hasMultiple && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Left / Right controls */}
        {hasMultiple && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-lg transition-all hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-lg transition-all hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
