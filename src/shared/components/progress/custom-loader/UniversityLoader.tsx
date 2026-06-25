// import React from 'react';
import './UniversityLoader.css';

interface UniversityLoaderProps {
  type?: 'full' | 'relative';
  text?: string;
  bgTransparent?: boolean;
}

export default function UniversityLoader({
  type = 'full',
  text = 'Loading UMS Portal...',
  bgTransparent = false,
}: UniversityLoaderProps) {
  return (
    <div
      className={`page-loader-container ${
        type === 'relative' ? 'relative-loader' : ''
      } ${bgTransparent ? 'bg-transparent' : ''}`}
    >
      <div className="page-loader-wrapper">
        <div className="page-loader-ring">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            style={{ width: '100%', height: '100%' }}
          >
            <g>
              <polygon fill="#E75D02" points="0,15 8,8 15,0 18,8 13,13 8,18 " />
              <polygon fill="#E13815" points="0,36 0,26 0,16 8,19 8,26 8,33 " />
              <polygon
                fill="#B61568"
                points="15,52 8,45 0,37 8,34 13,39 18,44 "
              />
              <polygon
                fill="#451A8A"
                points="36,52 26,52 16,52 19,45 26,45 33,45 "
              />
              <polygon
                fill="#15328B"
                points="52,37 45,45 37,52 34,44 39,39 44,34 "
              />
              <polygon
                fill="#014296"
                points="52,16 52,26 52,36 45,33 45,26 45,19 "
              />
              <polygon fill="#228433" points="33,8 26,8 19,8 16,0 26,0 36,0 " />
              <polygon
                fill="#0187AD"
                points="37,0 45,8 52,15 44,18 39,13 34,8 "
              />
              <polygon fill="#61B939" points="16,0 36,0 36,0 19,8 " />
              <polygon fill="#01C4E4" points="37,0 52,15 52,15 34,8 " />
              <polygon fill="#0395E7" points="52,16 52,36 52,36 45,19 " />
              <polygon fill="#2751C9" points="52,37 37,52 37,52 44,34 " />
              <polygon fill="#762EBB" points="36,52 16,52 16,52 33,45 " />
              <polygon fill="#E32181" points="15,52 0,37 0,37 18,44 " />
              <polygon fill="#FE6621" points="0,36 0,16 0,16 8,33 " />
              <polygon fill="#FFBB03" points="0,15 15,0 15,0 8,18 " />
            </g>
          </svg>
        </div>
        <div className="page-loader-cap">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e5cff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '100%', height: '100%' }}
          >
            <path
              d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
              fill="#1e5cff"
              fillOpacity="0.15"
            />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            <path d="M21.5 12v6" />
            <circle cx="21.5" cy="18" r="1" fill="#1e5cff" />
          </svg>
        </div>
      </div>
      {text && <div className="page-loader-text">{text}</div>}
    </div>
  );
}
