import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function Reports() {
  const { data } = useHostelContext();
  const [reportType, setReportType] = useState('Room Occupancy Report');

  const reportTypes = [
    'Room Occupancy Report',
    'Vacant Rooms List',
    'Fee Defaulters Report',
    'Daily Attendance Summary',
    'Student Outpass/Leave Register',
    'Maintenance Request Status',
    'Visitor Log Summary',
    'Hostel Defaulters/Disciplinary Report',
    'Student Facility Enrollment Report',
    'Checkout and Refund Status',
  ];

  const renderReportGrid = () => {
    switch (reportType) {
      case 'Room Occupancy Report':
        return (
          <GridPanel
            data={data.allocations.filter(a => a.status === 'Active')}
            columns={[
              { field: 'studentId', header: 'Student ID' },
              { field: 'studentName', header: 'Student Name' },
              {
                field: 'hostelId',
                header: 'Hostel',
                cell: (item: any) => (
                  <>{data.hostels.find(h => h.id === item.hostelId)?.name}</>
                ),
              },
              {
                field: 'roomId',
                header: 'Room No',
                cell: (item: any) => (
                  <>{data.rooms.find(r => r.id === item.roomId)?.roomNumber}</>
                ),
              },
              { field: 'validFrom', header: 'Allocated On' },
            ]}
          />
        );
      case 'Vacant Rooms List':
        const allocatedRoomIds = data.allocations
          .filter(a => a.status === 'Active')
          .map(a => a.roomId);
        const vacantRooms = data.rooms.filter(
          r => !allocatedRoomIds.includes(r.id)
        );
        return (
          <GridPanel
            data={vacantRooms}
            columns={[
              { field: 'roomNumber', header: 'Room No' },
              {
                field: 'hostelId',
                header: 'Hostel',
                cell: (item: any) => (
                  <>{data.hostels.find(h => h.id === item.hostelId)?.name}</>
                ),
              },
              {
                field: 'buildingId',
                header: 'Building',
                cell: (item: any) => (
                  <>
                    {data.buildings.find(b => b.id === item.buildingId)?.name}
                  </>
                ),
              },
              { field: 'capacity', header: 'Capacity' },
            ]}
          />
        );
      case 'Fee Defaulters Report':
        return (
          <GridPanel
            data={data.feeCollections.filter(f => f.status === 'Pending')}
            columns={[
              { field: 'studentId', header: 'Student ID' },
              { field: 'studentName', header: 'Student Name' },
              { field: 'amountPaid', header: 'Amount Due (₹)' },
              { field: 'paymentDate', header: 'Due Date' },
            ]}
          />
        );
      case 'Daily Attendance Summary':
        return (
          <GridPanel
            data={data.attendance}
            columns={[
              { field: 'date', header: 'Date' },
              { field: 'studentId', header: 'Student ID' },
              { field: 'studentName', header: 'Student Name' },
              { field: 'status', header: 'Status' },
            ]}
          />
        );
      case 'Student Outpass/Leave Register':
        return (
          <GridPanel
            data={data.leaves}
            columns={[
              { field: 'studentName', header: 'Student Name' },
              { field: 'leaveType', header: 'Type' },
              { field: 'fromDate', header: 'From Date' },
              { field: 'toDate', header: 'To Date' },
              { field: 'approvalStatus', header: 'Status' },
            ]}
          />
        );
      case 'Maintenance Request Status':
        return (
          <GridPanel
            data={data.requests}
            columns={[
              { field: 'studentName', header: 'Student Name' },
              { field: 'type', header: 'Request Type' },
              { field: 'description', header: 'Description' },
              { field: 'status', header: 'Status' },
            ]}
          />
        );
      case 'Visitor Log Summary':
        return (
          <GridPanel
            data={data.visitorLogs}
            columns={[
              { field: 'visitorName', header: 'Visitor Name' },
              { field: 'studentVisited', header: 'Student Visited' },
              { field: 'timeIn', header: 'Time In' },
              { field: 'timeOut', header: 'Time Out' },
            ]}
          />
        );
      case 'Hostel Defaulters/Disciplinary Report':
        return (
          <GridPanel
            data={data.disciplinaryActions}
            columns={[
              { field: 'date', header: 'Date' },
              { field: 'studentName', header: 'Student Name' },
              { field: 'reason', header: 'Reason' },
              { field: 'actionTaken', header: 'Action Taken' },
            ]}
          />
        );
      case 'Student Facility Enrollment Report':
        return (
          <GridPanel
            data={data.studentFacilities}
            columns={[
              { field: 'studentName', header: 'Student Name' },
              {
                field: 'facilityId',
                header: 'Facility',
                cell: (item: any) => (
                  <>
                    {data.facilities.find(f => f.id === item.facilityId)?.name}
                  </>
                ),
              },
              { field: 'mappedDate', header: 'Enrolled On' },
            ]}
          />
        );
      case 'Checkout and Refund Status':
        return (
          <GridPanel
            data={data.checkouts}
            columns={[
              { field: 'studentName', header: 'Student Name' },
              { field: 'vacateDate', header: 'Vacate Date' },
              { field: 'refundAmount', header: 'Refund (₹)' },
              { field: 'refundStatus', header: 'Status' },
            ]}
          />
        );
      default:
        return <div>Select a valid report.</div>;
    }
  };

  return (
    <FormPage
      title="Hostel Reports"
      description="View and export various static reports."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Reports' },
      ]}
    >
      <FormCard title="Report Filters" icon="filter_alt">
        <div className="flex gap-4 items-end">
          <div className="w-1/3">
            <DropDownList
              label="Select Report Type *"
              data={reportTypes.map(r => ({ id: r, text: r }))}
              textField="text"
              valueField="id"
              value={reportType}
              onChange={v => setReportType(v as string)}
            />
          </div>
          <Button
            label="Generate Report"
            variant="primary"
            icon="analytics"
            onClick={() => {}}
          />
          <Button
            label="Export to Excel"
            variant="outlined"
            icon="download"
            onClick={() => {}}
          />
        </div>
      </FormCard>

      <FormCard title={reportType} icon="table_chart">
        {renderReportGrid()}
      </FormCard>
    </FormPage>
  );
}
