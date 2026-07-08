import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { committees } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function GrievanceCellCommitteeManagement() {
  const [coms] = useState(committees);
  const [selectedCom, setSelectedCom] = useState(committees[0]);
  const [activeSubTab, setActiveSubTab] = useState<
    'members' | 'meetings' | 'reports'
  >('members');

  const handleCreateMeeting = () => {
    ToastService.success(
      `Simulated meeting notification sent to all ${selectedCom.acronym} committee members.`
    );
  };

  return (
    <FormPage
      title="Statutory Committee Management"
      description="Manage members, schedule compliance meetings, and document action taken reports for SGRC, ICC, and cells."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell Portal', to: grvUrls.cell.portal },
        { label: 'Committee Management' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Left Side: Committee List */}
        <FormCard title="Registered Statutory Committees" icon="groups">
          <div className="space-y-3">
            {coms.map(c => {
              const isActive = selectedCom.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCom(c)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-xs text-slate-800">
                      {c.name} ({c.acronym})
                    </span>
                    <span
                      className={`grv-status-pill ${c.status === 'Active' ? 'active' : 'inactive'}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {c.mandate}
                  </p>
                  <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-bold">
                    <span>Total Cases: {c.totalCases}</span>
                    <span className="text-amber-600">
                      Pending: {c.pendingCases}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        {/* Right Side: Tabbed Details */}
        <div className="space-y-4">
          <FormCard title={`Committee Details: ${selectedCom.name}`}>
            {/* Sub Tabs */}
            <div className="flex gap-4 border-b border-slate-200 mb-4">
              <button
                onClick={() => setActiveSubTab('members')}
                className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                  activeSubTab === 'members'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Committee Roster
              </button>
              <button
                onClick={() => setActiveSubTab('meetings')}
                className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                  activeSubTab === 'meetings'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Meeting Calendar
              </button>
              <button
                onClick={() => setActiveSubTab('reports')}
                className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                  activeSubTab === 'reports'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Action Taken Reports
              </button>
            </div>

            {/* Tab 1: Members */}
            {activeSubTab === 'members' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold">
                    Total Members: {selectedCom.members.length}
                  </span>
                  <Button
                    label="Add Member"
                    icon="plus"
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      ToastService.success(
                        'Member registration form popup simulated.'
                      )
                    }
                  />
                </div>
                <table className="grv-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Designation / Department</th>
                      <th>Committee Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCom.members.map(m => (
                      <tr key={m.id}>
                        <td className="font-bold text-slate-800">{m.name}</td>
                        <td>
                          <div className="text-xs text-slate-700">
                            {m.designation}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {m.department}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              m.role === 'Chair'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td>
                          <button className="text-red-500 hover:text-red-700 text-xs">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Meetings */}
            {activeSubTab === 'meetings' && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">
                    Scheduled Hearings / Meetings
                  </span>
                  <Button
                    label="Schedule Hearing"
                    icon="plus"
                    variant="primary"
                    size="small"
                    onClick={handleCreateMeeting}
                  />
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">
                        Regular Monthly Review Hearing
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono font-bold">
                        UPCOMING
                      </span>
                    </div>
                    <p className="text-slate-500">
                      Reviewing pending academic and financial petitions filed
                      in SCSIT department.
                    </p>
                    <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-bold">
                      <span>Date: 25 Dec 2026, 11:00 AM</span>
                      <span>Venue: SCSIT Seminar Hall / VC Boardroom</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Action Taken Reports */}
            {activeSubTab === 'reports' && (
              <div className="space-y-4">
                <table className="grv-table text-xs">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Document / Title</th>
                      <th>Upload Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold text-slate-700">AY 2025-26</td>
                      <td className="font-bold text-blue-600 underline cursor-pointer">
                        Anti-Ragging Compliance Report Q2.pdf
                      </td>
                      <td>12 Nov 2025</td>
                      <td>
                        <span className="grv-status-pill approved">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-slate-700">AY 2024-25</td>
                      <td className="font-bold text-blue-600 underline cursor-pointer">
                        Annual ICC Women Safety Audit.pdf
                      </td>
                      <td>10 May 2025</td>
                      <td>
                        <span className="grv-status-pill approved">
                          Approved
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
