export default function ProfileSidebar({
  data,
  employeeName,
  employeeInitials,
}: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="h-24 bg-blue-50/50 w-full relative border-b border-gray-100">
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-200 text-3xl font-medium shadow-sm relative">
            {employeeInitials}
            <button className="absolute bottom-0 right-0 bg-white border border-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-xs text-gray-500 hover:text-blue-600 cursor-pointer shadow-sm">
              <i className="pi pi-camera"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-14 pb-6 px-6">
        <div className="text-xs text-red-500 font-medium mb-4">
          JPG/PNG, max 250 KB
        </div>

        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          {employeeName}
        </h2>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex">
            <span className="w-32 text-gray-600 font-medium">
              Employee Code
            </span>
            <span className="flex-1 text-gray-800">
              : {data.employeeCode || '-'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 font-medium">Full Name</span>
            <span className="flex-1 text-gray-800">
              : {employeeName || '-'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 font-medium">Email</span>
            <span className="flex-1 text-gray-800 break-all">
              : {data.officialEmail || '-'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 font-medium">
              Official Phone
            </span>
            <span className="flex-1 text-gray-800">
              : {data.mobileNumber || '-'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 font-medium">Department</span>
            <span className="flex-1 text-gray-800">
              : {data.organizationUnit || '-'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 font-medium">Designation</span>
            <span className="flex-1 text-gray-800">: {data.post || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 font-medium">Bio</span>
            <span className="flex-1 text-gray-500 italic text-xs leading-tight">
              : {data.bioNote || 'Add a short bio to complete your profile.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
