import { FormPage, FormCard } from 'shared/new-components';

export default function BusLiveTracking() {
  return (
    <FormPage
      title="College Bus Live Tracking"
      description="Live GPS tracking and status of college buses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        {
          label: 'Student Login',
          to: '/transport-management/student-login/dashboard',
        },
        { label: 'Live Tracking' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormCard
            title="Live Map View"
            className="h-[500px] flex items-center justify-center bg-gray-100 border-2 border-dashed"
          >
            <div className="text-center text-gray-500">
              <i className="pi pi-map-marker text-4xl mb-2"></i>
              <p>Google Maps Integration Placeholder</p>
            </div>
          </FormCard>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <FormCard title="Vehicle Status (MP04AB1234)">
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Route:</span>
                <span>Route 1 (City Center)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Driver:</span>
                <span>Ramesh Kumar</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">
                  Current Location:
                </span>
                <span>Main Square Market, Bhopal</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">
                  Coordinates:
                </span>
                <span>23.2599° N, 77.4126° E</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Speed:</span>
                <span className="text-green-600 font-bold">45 km/h</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">
                  Last Updated:
                </span>
                <span>2 mins ago</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">
                  Current Stop:
                </span>
                <span>Approaching Stop B</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">
                  Estimated Arrival:
                </span>
                <span className="text-blue-600 font-bold">08:15 AM</span>
              </div>
            </div>
          </FormCard>

          <FormCard title="Active Buses">
            <ul className="flex flex-col gap-2">
              <li className="p-3 border rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center border-blue-500 bg-blue-50">
                <span className="font-semibold">MP04AB1234</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  On Move
                </span>
              </li>
              <li className="p-3 border rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                <span className="font-semibold">MP08XY9876</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  Stopped
                </span>
              </li>
            </ul>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
