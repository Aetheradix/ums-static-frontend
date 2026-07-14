import { useState } from 'react';
import { EXPLORE_CARDS } from '../../constants/data';
import ImagePreviewModal from '../ImagePreviewModal';
import { useLanguage } from '../../../../shared/context/useLanguage';

export default function ExploreSlider() {
  const [preview, setPreview] = useState<{
    images: string[];
    title: string;
    index: number;
  } | null>(null);

  const { t } = useLanguage();

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-3 sm:pb-8 select-none">
      <div className="flex flex-col items-center mb-8">
        <h3 className="font-display font-black text-[#002147] text-xl md:text-2xl tracking-wide mb-2">
          {t('Explore DAVV')}
        </h3>
        <div className="w-12 h-1 bg-[#F2A900] rounded-full" />
      </div>

      {/* Grid container representing the cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {EXPLORE_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() =>
                setPreview({ images: card.images, title: card.title, index: 0 })
              }
              className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1 relative cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-32 md:h-36 overflow-hidden z-0">
                <img
                  src={card.images[0]}
                  alt={t(card.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Outlined Icon overlay hanging half outside bottom edge of image */}
              <div className="absolute top-[108px] md:top-[124px] left-4 z-20 w-10 h-10 rounded-xl bg-[#002147] group-hover:bg-blue text-white flex items-center justify-center shadow-md border border-white/20 transition-colors">
                <Icon className="w-5 h-5" />
              </div>

              {/* Title Content */}
              <div className="p-5 pt-8 bg-white flex-1 flex items-center z-10">
                <h4 className="font-display font-black text-navy text-[13px] md:text-sm tracking-tight leading-snug group-hover:text-blue transition-colors">
                  {t(card.title)}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <ImagePreviewModal
          images={preview.images}
          title={t(preview.title)}
          initialIndex={preview.index}
          isOpen={true}
          onClose={() => setPreview(null)}
        />
      )}
    </section>
  );
}
