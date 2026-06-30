import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import { FileMovementTimeline, FileStatusBadge } from '../../components';
import { mockFileMovements, mockFiles } from '../../data';

export default function QuickAccessStatus() {
  const { code } = useParams();
  const [searchInput, setSearchInput] = useState(code || '');
  const [activeCode, setActiveCode] = useState(code || '');

  const file = activeCode
    ? mockFiles.find(
        f =>
          f.quickAccessCode.toLowerCase() === activeCode.toLowerCase() ||
          f.fileNumber.toLowerCase() === activeCode.toLowerCase()
      )
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveCode(searchInput.trim());
    }
  };

  const movements = file
    ? mockFileMovements
        .filter(m => m.fileId === file.id)
        .sort(
          (a, b) =>
            new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
        )
    : [];

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Public' },
        { label: 'Quick Access — File Status' },
      ]}
      title="Quick Access — File Status"
      description="Public file tracking and search"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="p-8 md:p-12 text-center bg-gradient-to-b from-indigo-50/50 to-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-6 shadow-inner">
            <Icon name="search" className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Track Your File
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Enter your Quick Access Code or File Number to instantly check the
            current status and movement history of your file.
          </p>
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto relative flex items-center"
          >
            <Icon
              name="tag"
              className="absolute left-4 text-gray-400 text-[20px]"
            />
            <input
              type="text"
              placeholder="e.g. QA-001 or UMS/CS/2026/001"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-32 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Search
              <Icon name="arrow_forward" className="text-[18px]" />
            </button>
          </form>
        </div>
      </div>

      {activeCode && !file && (
        <div className="bg-red-50 text-red-600 rounded-xl p-8 text-center border border-red-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Icon name="error_outline" className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">File Not Found</h3>
          <p className="text-red-500/80">
            We couldn't find any file matching the code{' '}
            <strong>"{activeCode}"</strong>. Please check and try again.
          </p>
        </div>
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Icon name="info" className="text-[18px]" /> File Details
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-500 mb-1">File Number</p>
                  <p className="font-mono text-sm font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded inline-block">
                    {file.fileNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Title</p>
                  <p className="font-medium text-gray-800">{file.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Current Status</p>
                  <FileStatusBadge status={file.currentStatus} />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="font-medium text-gray-800">
                    {file.departmentName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-gray-800">
                    {file.categoryName}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Current Holder</p>
                  <p className="font-medium text-indigo-600 flex items-center gap-1">
                    <Icon name="person" className="text-[16px]" />
                    {file.currentHolderUserName || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium text-gray-600 text-sm flex items-center gap-1">
                    <Icon name="update" className="text-[16px]" />
                    {file.updatedAt}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full relative overflow-hidden">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <Icon name="history" className="text-[18px]" />
                </div>
                Movement History
              </h3>
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <FileMovementTimeline movements={movements} />
              </div>
            </div>
          </div>
        </div>
      )}
    </FormPage>
  );
}
