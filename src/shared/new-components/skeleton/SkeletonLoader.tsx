import { useEffect, useState } from 'react';

interface SkeletonLoaderProps {
  type?: 'grid' | 'card' | 'form';
}

export default function SkeletonLoader({ type = 'grid' }: SkeletonLoaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const isDarkTheme =
        document.body.classList.contains('dark-theme') ||
        document.body.classList.contains('dark');
      setIsDark(isDarkTheme);
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const bgColor = isDark ? 'bg-transparent' : 'bg-zinc-100';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-200/60';
  const boneColor = isDark ? 'bg-zinc-800/80' : 'bg-zinc-200';
  const subBoneColor = isDark ? 'bg-zinc-800/40' : 'bg-zinc-200/50';

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse w-full">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className={`${bgColor} ${borderColor} rounded-xl p-6 h-40 border flex flex-col justify-between transition-colors`}
          >
            <div className="flex justify-between items-start">
              <div className={`rounded-xl w-12 h-12 ${boneColor}`}></div>
              <div className={`rounded-lg w-8 h-8 ${boneColor}/80`}></div>
            </div>
            <div>
              <div className={`rounded-md h-5 w-3/4 mb-2 ${boneColor}`}></div>
              <div className={`rounded-md h-4 w-1/2 ${subBoneColor}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="space-y-6 animate-pulse w-full mx-auto">
        <div
          className={`${bgColor} ${borderColor} rounded-xl p-6 h-[400px] border space-y-6 flex flex-col justify-between`}
        >
          <div className="space-y-4">
            <div className={`h-6 w-1/4 rounded-md mb-4 ${boneColor}`}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <div className={`h-4 w-24 rounded-md ${boneColor}/80`}></div>
                  <div className={`h-10 rounded-xl ${subBoneColor}`}></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <div className={`h-10 w-28 rounded-xl ${boneColor}/80`}></div>
            <div className={`h-10 w-28 rounded-xl ${boneColor}`}></div>
          </div>
        </div>
      </div>
    );
  }

  // Grid / Table Skeleton fallback
  return (
    <div className="animate-pulse w-full mx-auto">
      <div className={`${bgColor} ${borderColor} rounded-xl p-6 border`}>
        <div className="flex justify-between items-center mb-6">
          <div className={`h-8 w-48 rounded-lg ${boneColor}`}></div>
          <div className={`h-10 w-32 rounded-xl ${boneColor}`}></div>
        </div>
        <div className="space-y-4">
          <div className={`h-10 rounded-xl ${boneColor}/80`}></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-12 rounded-xl ${subBoneColor}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
