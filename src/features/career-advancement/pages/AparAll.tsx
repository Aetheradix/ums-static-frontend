import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

import { DEPARTMENT_OPTIONS, INITIAL_SESSIONS } from '../data';

export default function AparAll() {
  const navigate = useNavigate();
  const { aparApplications, triggerNotification } = useCareerAdvancement();

  // Search & Filter state
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Dropdown data options formatted for DropDownList
  const deptDataOptions = useMemo(() => {
    return DEPARTMENT_OPTIONS.map(d => ({ id: d, text: d }));
  }, []);

  const sessionDataOptions = useMemo(() => {
    return INITIAL_SESSIONS.filter(s => s.type === 'APAR').map(s => ({
      id: s.name,
      text: s.name,
    }));
  }, []);

  const statusDataOptions = useMemo(() => {
    return [
      { id: 'Draft', text: 'Draft' },
      { id: 'Pending', text: 'Pending' },
      { id: 'Forwarded', text: 'Forwarded' },
      { id: 'Under Review', text: 'Under Review' },
      { id: 'Completed', text: 'Completed' },
      { id: 'Rejected', text: 'Rejected' },
    ];
  }, []);

  // Filter logic
  const filteredApplications = useMemo(() => {
    return aparApplications.filter(
      (a: CareerAdvancement.CASAPARApplication) => {
        const matchSearch =
          employeeSearch === '' ||
          a.employeeName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
          a.id.toLowerCase().includes(employeeSearch.toLowerCase());
        const matchDept = selectedDept === '' || a.department === selectedDept;
        const matchSession =
          selectedSession === '' || a.session === selectedSession;
        const matchStatus =
          selectedStatus === '' || a.status === selectedStatus;
        return matchSearch && matchDept && matchSession && matchStatus;
      }
    );
  }, [
    aparApplications,
    employeeSearch,
    selectedDept,
    selectedSession,
    selectedStatus,
  ]);

  const handleReset = () => {
    setEmployeeSearch('');
    setSelectedDept('');
    setSelectedSession('');
    setSelectedStatus('');
    triggerNotification('Filters cleared successfully.', 'info');
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') {
      return 'bg-emerald-100 text-emerald-700';
    }
    if (s === 'pending' || s === 'draft') {
      return 'bg-amber-100 text-amber-700';
    }
    if (s === 'rejected') {
      return 'bg-rose-100 text-rose-700';
    }
    return 'bg-cyan-100 text-cyan-700';
  };

  return (
    <FormPage
      title="APAR — All Applications"
      description="Initiate, process, and track APAR reviews for all employees"
      breadcrumbs={[
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'APAR Applications' },
      ]}
    >
      <FormCard title="Search Filters" icon="search" className="mb-6">
        <FormGrid columns={4}>
          <TextBox
            label="Search Employee"
            placeholder="Name or App ID"
            value={employeeSearch}
            onChange={v => setEmployeeSearch(v)}
          />
          <DropDownList
            label="Department"
            data={deptDataOptions}
            textField="text"
            valueField="id"
            value={selectedDept}
            onChange={v => setSelectedDept(v as string)}
          />
          <DropDownList
            label="Session"
            data={sessionDataOptions}
            textField="text"
            valueField="id"
            value={selectedSession}
            onChange={v => setSelectedSession(v as string)}
          />
          <DropDownList
            label="Status"
            data={statusDataOptions}
            textField="text"
            valueField="id"
            value={selectedStatus}
            onChange={v => setSelectedStatus(v as string)}
          />
        </FormGrid>
        <div className="flex gap-2 justify-end mt-4">
          <Button
            label="Reset Filters"
            variant="outlined"
            onClick={handleReset}
          />
        </div>
      </FormCard>

      <FormCard title="All Employees & APAR Records" icon="list">
        <GridPanel
          data={filteredApplications}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'employeeName', header: 'Employee Name' },
            { field: 'designation', header: 'Designation' },
            { field: 'department', header: 'Department' },
            { field: 'session', header: 'Session' },
            { field: 'stage', header: 'Stage' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: CareerAdvancement.CASAPARApplication) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusBadge(item.status)}`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              field: 'currentHandler',
              header: 'Current Handler',
              cell: (item: CareerAdvancement.CASAPARApplication) => (
                <span>{item.currentHandler || '—'}</span>
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              cell: (item: CareerAdvancement.CASAPARApplication) => (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Button
                    label="Process"
                    icon="cog"
                    variant="primary"
                    onClick={() =>
                      navigate(`/career-advancement/apar-process?id=${item.id}`)
                    }
                  />
                  <Button
                    label="Track"
                    icon="map-marker"
                    variant="outlined"
                    onClick={() =>
                      navigate(`/career-advancement/apar-track?id=${item.id}`)
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
