import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage } from 'shared/new-components';
import { useBillTracking } from '../queries';

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('VB-2025-001');
  const [activeSearch, setActiveSearch] = useState('VB-2025-001');

  const { data, isFetching } = useBillTracking(activeSearch);

  const handleSearch = () => {
    setActiveSearch(searchTerm.trim());
  };

  const STEP_CONFIG = [
    {
      label: 'Received',
      completedStyles:
        'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200',
      currentRing: 'ring-blue-100',
      path: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
    },
    {
      label: 'Verified',
      completedStyles:
        'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200',
      currentRing: 'ring-amber-100',
      path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      label: 'Approved',
      completedStyles:
        'bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-200',
      currentRing: 'ring-purple-100',
      path: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    },
    {
      label: 'Paid',
      completedStyles:
        'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200',
      currentRing: 'ring-emerald-100',
      path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  const getLineColor = (stage: number) => {
    if (stage >= 3) return 'bg-emerald-500';
    if (stage === 2) return 'bg-purple-500';
    if (stage === 1) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <FormPage
      title="Track Your Bill"
      description="Enter your Bill Reference Number or Receipt Number to track its current status in the processing workflow."
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Bill Tracking Status
        </h3>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="e.g. VB-2025-001 or EC-2025-001"
              className="w-full h-[38px] border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="shrink-0">
            <style>{`.search-btn .p-button { height: 38px !important; }`}</style>
            <div className="search-btn">
              <Button
                label={isFetching ? 'Searching...' : 'Track Bill'}
                icon="search"
                variant="primary"
                onClick={handleSearch}
                disabled={isFetching || !searchTerm.trim()}
              />
            </div>
          </div>
        </div>

        {activeSearch && !isFetching && !data && (
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-medium">
            No bill found with reference number "{activeSearch}". Please check
            the number and try again.
          </div>
        )}

        {data && (
          <div className="mt-8">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h4 className="text-xl font-bold text-gray-800">
                Bill Ref: {data.billRef}
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Current Status Timeline
              </p>
            </div>

            {data.currentStage === -1 ? (
              <div className="p-5 rounded-xl bg-red-50 border border-red-200 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-red-700 text-lg">
                      Bill Cancelled / Rejected
                    </h5>
                    <p className="text-red-600 mt-2 font-medium">Reason:</p>
                    <p className="text-red-800 text-sm mt-1">
                      {data.events[data.events.length - 1]?.remarks}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative py-8">
                {/* Connecting Line - precisely positioned at top-6 which is exactly the center of the 48px (h-12) icons */}
                <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
                <div
                  className={`absolute top-6 left-[10%] h-1 ${getLineColor(data.currentStage)} -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out`}
                  style={{
                    width: `${(Math.max(0, data.currentStage) / (STEP_CONFIG.length - 1)) * 80}%`,
                  }}
                />

                <div className="relative flex justify-between">
                  {STEP_CONFIG.map((step, index) => {
                    const isCompleted = index <= data.currentStage;
                    const isCurrent = index === data.currentStage;
                    const event = data.events.find(
                      e => e.status === step.label
                    );

                    return (
                      <div
                        key={step.label}
                        className="flex flex-col items-center w-1/4 relative z-10 group"
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300
                            ${isCompleted ? step.completedStyles : 'bg-white border-gray-200 text-gray-300'}
                            ${isCurrent ? `ring-4 ${step.currentRing} scale-110` : ''}
                          `}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d={step.path}
                              ></path>
                            </svg>
                          ) : (
                            <span className="font-bold text-gray-400 text-sm">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <h4
                          className={`mt-4 font-bold tracking-wide transition-colors duration-300 ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}
                        >
                          {step.label}
                        </h4>
                        {event && (
                          <div className="text-center mt-2 px-4 max-w-[200px]">
                            <span className="text-xs font-bold text-gray-500 block mb-1.5">
                              {event.date}
                            </span>
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                              {event.remarks}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </FormPage>
  );
}
