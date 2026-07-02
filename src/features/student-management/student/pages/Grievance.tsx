import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToastService } from 'services';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

interface Ticket {
  id: string;
  category: string;
  subject: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-2023-001',
    category: 'Academics',
    subject: 'Discrepancy in Mid-Sem Marks',
    date: '2026-06-15',
    status: 'Resolved',
  },
  {
    id: 'TKT-2023-042',
    category: 'Hostel',
    subject: 'Wi-Fi issues in Block B',
    date: '2026-06-28',
    status: 'In Progress',
  },
  {
    id: 'TKT-2023-055',
    category: 'Finance',
    subject: 'Fee Receipt not generated',
    date: '2026-07-01',
    status: 'Open',
  },
];

export default function Grievance() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [showDialog, setShowDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');

  // New Ticket State
  const [category, setCategory] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const statusTemplate = (rowData: Ticket) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Resolved' || rowData.status === 'Closed'
            ? 'approved'
            : rowData.status === 'Open'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const actionTemplate = () => (
    <Button
      label="View Thread"
      icon="pi pi-comments"
      size="small"
      outlined
      className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
    />
  );

  const handleSubmit = () => {
    if (category && subject && description) {
      const newTicket: Ticket = {
        id: `TKT-2023-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0')}`,
        category,
        subject,
        date: new Date().toISOString().split('T')[0],
        status: 'Open',
      };
      setTickets([newTicket, ...tickets]);
      setShowDialog(false);

      // Reset form
      setCategory('');
      setSubject('');
      setDescription('');

      ToastService.success(
        `Your grievance has been logged with ID ${newTicket.id}`
      );
    }
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
      <div className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search tickets..."
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full md:w-64"
        />
      </div>
      <Button
        label="Raise New Ticket"
        icon="pi pi-plus"
        severity="info"
        onClick={() => setShowDialog(true)}
        className="w-full md:w-auto shadow-sm font-bold bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700"
      />
    </div>
  );

  return (
    <FormPage
      title="Helpdesk & Grievance"
      description="Raise concerns, track ticket status, and communicate with university administration"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Portal', to: studentManagementUrls.student.root },
        { label: 'Grievance' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner mb-3 relative z-10">
            <i className="pi pi-ticket text-xl"></i>
          </div>
          <span className="text-3xl font-black text-gray-900 relative z-10">
            {tickets.length}
          </span>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mt-1 relative z-10">
            Total Raised
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner mb-3 relative z-10">
            <i className="pi pi-exclamation-circle text-xl"></i>
          </div>
          <span className="text-3xl font-black text-red-600 relative z-10">
            {tickets.filter(t => t.status === 'Open').length}
          </span>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mt-1 relative z-10">
            Open Tickets
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner mb-3 relative z-10">
            <i className="pi pi-spin pi-spinner text-xl"></i>
          </div>
          <span className="text-3xl font-black text-orange-500 relative z-10">
            {tickets.filter(t => t.status === 'In Progress').length}
          </span>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mt-1 relative z-10">
            In Progress
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner mb-3 relative z-10">
            <i className="pi pi-check-circle text-xl"></i>
          </div>
          <span className="text-3xl font-black text-green-600 relative z-10">
            {
              tickets.filter(
                t => t.status === 'Resolved' || t.status === 'Closed'
              ).length
            }
          </span>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mt-1 relative z-10">
            Resolved
          </span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden shadow-sm border-t-4 border-indigo-500">
        <DataTable
          value={tickets}
          header={header}
          emptyMessage="No tickets found."
          responsiveLayout="scroll"
          globalFilter={globalFilter}
          paginator
          rows={10}
          stripedRows
          rowHover
          className="p-datatable-sm"
        >
          <Column
            field="id"
            header="Ticket ID"
            style={{ width: '15%' }}
            className="font-mono text-gray-700 font-medium"
          ></Column>
          <Column
            field="date"
            header="Date Raised"
            style={{ width: '15%' }}
            className="text-gray-600"
          ></Column>
          <Column
            field="category"
            header="Category"
            style={{ width: '15%' }}
            className="font-bold text-gray-800"
          ></Column>
          <Column
            field="subject"
            header="Subject"
            style={{ width: '25%' }}
            className="font-medium text-gray-800"
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            style={{ textAlign: 'center' }}
          ></Column>
          <Column
            body={actionTemplate}
            header="Action"
            style={{ width: '10rem', textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '600px' }}
        header="Raise New Grievance"
        modal
        onHide={() => setShowDialog(false)}
        className="p-fluid"
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800 rounded-lg flex items-start gap-3 shadow-sm">
            <i className="pi pi-info-circle text-blue-500 text-xl mt-0.5"></i>
            <p>
              Please select the appropriate category for your grievance to
              ensure it reaches the right department quickly.
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="font-bold text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={category}
              options={[
                'Academics',
                'Examination',
                'Finance / Fees',
                'Hostel',
                'Transport',
                'IT Support',
                'Other',
              ]}
              onChange={e => setCategory(e.value)}
              placeholder="Select Category"
              className="border-gray-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <InputText
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Brief summary of your issue"
              className="border-gray-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder="Elaborate on your concern..."
              className="border-gray-300 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors bg-gray-50">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-indigo-500">
                <i className="pi pi-cloud-upload text-3xl"></i>
              </div>
              <span className="font-bold text-gray-700">
                Drag & drop files here
              </span>
              <span className="text-sm text-gray-500 mt-1">
                or click to browse
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text text-gray-600"
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Submit Ticket"
              icon="pi pi-send"
              onClick={handleSubmit}
              disabled={!category || !subject || !description}
              className="shadow-sm font-bold bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700"
            />
          </div>
        </div>
      </Dialog>
    </FormPage>
  );
}
