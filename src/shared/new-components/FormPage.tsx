import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb';
import './FormPage.css';
import SkeletonLoader from './skeleton/SkeletonLoader';

interface FormPageProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export default function FormPage({
  title,
  description,
  breadcrumbs,
  children,
  headerAction,
  className = '',
}: FormPageProps) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`form-page-wrapper ${className}`.trim()}>
      <div className="form-page-container">
        <div className="form-page-header">
          <div className="form-page-header-content w-full flex flex-col md:flex-row justify-between gap-4">
            {/* Title & Description - Left on Desktop (order 1), Bottom on Mobile (order 2) */}
            <div className="form-page-header-left flex flex-col gap-1 md:order-1 order-2">
              <h1 className="form-page-title">{title}</h1>
              {description && (
                <p className="form-page-description">{description}</p>
              )}
            </div>

            {/* Breadcrumb & Action - Right on Desktop (order 2), Top on Mobile (order 1) */}
            <div className="form-page-header-right flex flex-col md:items-end items-start gap-2 md:order-2 order-1">
              <div className="form-page-breadcrumb-container flex flex-col md:items-end items-start gap-1">
                <Breadcrumb items={breadcrumbs} />
                <button
                  onClick={() => navigate(-1)}
                  className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#2264dc] hover:text-[#1849a9] transition-colors mt-0.5  bg-white hover:bg-slate-100/50 px-2.5 py-1 rounded-md border border-slate-200 shadow-xs cursor-pointer"
                  type="button"
                >
                  <i className="pi pi-arrow-left text-[9px]" />
                  <span>Back</span>
                </button>
              </div>
              {headerAction && (
                <div className="form-page-action">{headerAction}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-page-content">
          {loading ? <SkeletonLoader type="grid" /> : children}
        </div>
      </div>
    </div>
  );
}
