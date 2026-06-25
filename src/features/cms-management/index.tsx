import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { cmsUrls } from './urls';
import { ProtectedRoute } from 'auth';

const Departments = React.lazy(() => import('./departments/pages/List'));
const Courses = React.lazy(() => import('./courses/pages/List'));
const Faculty = React.lazy(() => import('./faculty/pages/List'));
const News = React.lazy(() => import('./news/pages/List'));
const Downloads = React.lazy(() => import('./downloads/pages/List'));
const Gallery = React.lazy(() => import('./gallery/pages/List'));
const Facilities = React.lazy(() => import('./facilities/pages/List'));
const Stats = React.lazy(() => import('./stats/pages/List'));
const Notices = React.lazy(() => import('./notices/pages/List'));

export default function CmsManagementRoutes() {
  return (
    <Routes>
      <Route
        path={`${cmsUrls.departments.root}/*`}
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.courses.root}/*`}
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.faculty.root}/*`}
        element={
          <ProtectedRoute>
            <Faculty />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.news.root}/*`}
        element={
          <ProtectedRoute>
            <News />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.downloads.root}/*`}
        element={
          <ProtectedRoute>
            <Downloads />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.gallery.root}/*`}
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.facilities.root}/*`}
        element={
          <ProtectedRoute>
            <Facilities />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.stats.root}/*`}
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${cmsUrls.notices.root}/*`}
        element={
          <ProtectedRoute>
            <Notices />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
