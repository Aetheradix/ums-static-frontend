import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { complaints, grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const statusColors: Record<string, string> = {
  Submitted: 'grv-status-pill pending',
  'Department Review': 'grv-status-pill review',
  'HoD Review': 'grv-status-pill review',
  'Committee Review': 'grv-status-pill review',
  'Registrar Decision': 'grv-status-pill approved',
  Closed: 'grv-status-pill closed',
};

export default function DepartmentOfficerComplaintInbox() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;

    let matchesStatus = true;
    if (selectedStatus === 'New') {
      matchesStatus = c.status === 'Submitted';
    } else if (selectedStatus === 'Under Process') {
      matchesStatus =
        c.status === 'Department Review' ||
        c.status === 'HoD Review' ||
        c.status === 'Committee Review';
    } else if (selectedStatus === 'Completed') {
      matchesStatus =
        c.status === 'Closed' || c.status === 'Registrar Decision';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const catOptions = ['All', ...grievanceCategories.map(c => c.name)];

  return (
    <FormPage
      title="Complaint Inbox"
      description="Department Officer — Incoming grievances assigned to your section"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Dept Officer', to: grvUrls.departmentOfficer.portal },
        { label: 'Inbox' },
      ]}
    >
      <FormCard title={`Complaint Queue (${filteredComplaints.length})`}>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            className="grv-input flex-1"
            placeholder="Search by Ticket No, Name, Subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="grv-input w-52"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {catOptions.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="grv-input w-40"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Under Process">Under Process</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <table className="grv-table w-full text-xs">
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Complainant</th>
              <th>Type</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Submitted</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">
                  No complaints found.
                </td>
              </tr>
            )}
            {filteredComplaints.map(c => (
              <tr key={c.id}>
                <td className="font-mono font-bold text-blue-700">
                  {c.ticketNo}
                </td>
                <td>
                  <p className="font-semibold">{c.studentName}</p>
                  <p className="text-slate-400">{c.enrollmentNo}</p>
                </td>
                <td>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.complaintType === 'Student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}
                  >
                    {c.complaintType}
                  </span>
                </td>
                <td className="max-w-32 truncate">{c.category}</td>
                <td className="max-w-xs truncate">{c.subject}</td>
                <td>{c.submittedDate}</td>
                <td>
                  <span className={statusColors[c.status] || 'grv-status-pill'}>
                    {c.status}
                  </span>
                </td>
                <td className="text-center">
                  <Button
                    label="Open →"
                    variant="primary"
                    onClick={() =>
                      navigate(
                        `${grvUrls.departmentOfficer.details}?id=${c.id}`
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
