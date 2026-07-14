import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
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

export default function StudentComplaintHistory() {
  const navigate = useNavigate();
  const myComplaints = complaints.filter(c => c.complaintType === 'Student');

  return (
    <FormPage
      title="Complaint History"
      description="Complete history of all grievances filed by you"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'History' },
      ]}
    >
      {myComplaints.map(c => (
        <FormCard key={c.id} title={c.ticketNo}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-slate-800 text-sm">
                {c.subject}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {c.category} · {c.subCategory}
              </p>
            </div>
            <span className={statusColors[c.status]}>{c.status}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
            <div>
              <p className="text-slate-400">Submitted</p>
              <p className="font-medium">{c.submittedDate}</p>
            </div>
            <div>
              <p className="text-slate-400">Department</p>
              <p className="font-medium">{c.assignedDept}</p>
            </div>
            <div>
              <p className="text-slate-400">Incident Date</p>
              <p className="font-medium">{c.incidentDate}</p>
            </div>
            <div>
              <p className="text-slate-400">Location</p>
              <p className="font-medium">{c.location}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {c.timeline.map(t => (
              <div
                key={t.id}
                className={`text-[10px] px-2 py-1 rounded-full border font-medium ${t.done ? 'bg-green-50 border-green-300 text-green-700' : t.active ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                {t.action}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="text-blue-600 underline text-xs hover:text-blue-800"
              onClick={() => navigate(`${grvUrls.student.details}?id=${c.id}`)}
            >
              View Details →
            </button>
            <button
              className="text-blue-600 underline text-xs hover:text-blue-800"
              onClick={() => navigate(`${grvUrls.student.track}?id=${c.id}`)}
            >
              Track Status →
            </button>
          </div>
        </FormCard>
      ))}
    </FormPage>
  );
}
