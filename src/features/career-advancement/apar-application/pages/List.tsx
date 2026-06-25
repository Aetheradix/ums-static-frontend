import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import SelectCaSession from 'features/components/SelectCaSession';
import SelectDepartment from 'features/components/SelectDepartment';
import SelectSessionAppStatus from 'features/components/SelectSessionAppStatus';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { careerAdvancementUrls } from '../../urls';
import AparStatusBadge from '../components/AparStatusBadge';
import { useAparApplicationsQuery } from '../queries';
import './List.css';

type SearchFilter = CareerAdvancement.AparApplication.AparSearchFilter;
type AparItem = CareerAdvancement.AparApplication.AparApplicationItem;

const DEFAULT_FILTER: SearchFilter = {
  employeeSearch: '',
  departmentId: null,
  sessionId: null,
  statusId: null,
};

export default function List() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<SearchFilter>(DEFAULT_FILTER);
  const [activeFilter, setActiveFilter] =
    useState<Partial<SearchFilter>>(DEFAULT_FILTER);

  const { data, isLoading } = useAparApplicationsQuery(activeFilter);

  const handleProcess = (item: AparItem) => {
    navigate(careerAdvancementUrls.aparApplication.initiate(item.id), {
      state: {
        employeeName: item.employeeName,
        designation: item.designation,
      },
    });
  };

  const handleSearch = useCallback(() => {
    setActiveFilter({ ...filter });
  }, [filter]);

  const handleReset = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setActiveFilter(DEFAULT_FILTER);
  }, []);

  return (
    <FormPage
      title="APAR — All Applications"
      description="Initiate and manage APAR for all employees"
      breadcrumbs={[
        {
          label: 'Career Advancement',
          to: '/home/sub-menu/career-advancement',
        },
        {
          label: 'APAR — All Applications',
          to: '/career-advancement/apar-application/all',
        },
      ]}
    >
      <FormCard>
        <FormGrid columns={4}>
          <TextBox
            label="Search Employee"
            placeholder="Name / Employee ID"
            value={filter.employeeSearch}
            onChange={val =>
              setFilter(prev => ({ ...prev, employeeSearch: val }))
            }
          />
          <SelectDepartment
            label="Department"
            defaultOptionText="— Select —"
            value={filter.departmentId}
            onChange={val =>
              setFilter(prev => ({
                ...prev,
                departmentId: val as string | null,
              }))
            }
          />
          <SelectCaSession
            label="Session"
            defaultOptionText="— Select —"
            value={filter.sessionId}
            onChange={val =>
              setFilter(prev => ({ ...prev, sessionId: val as string | null }))
            }
          />
          <SelectSessionAppStatus
            label="Status"
            defaultOptionText="— Select —"
            value={filter.statusId}
            onChange={val =>
              setFilter(prev => ({ ...prev, statusId: val as string | null }))
            }
          />
        </FormGrid>

        <div className="form-actions-row">
          <Button
            label="Search"
            icon="search"
            variant="primary"
            onClick={handleSearch}
            isLoading={isLoading}
          />
          <Button label="Reset" variant="outlined" onClick={handleReset} />
        </div>
      </FormCard>

      <FormCard title="Employee List" icon="users">
        <GridPanel
          data={data}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'employeeId', header: 'Employee ID' },
            { field: 'employeeName', header: 'Employee Name' },
            { field: 'designation', header: 'Designation' },
            { field: 'department', header: 'Department' },
            { field: 'session', header: 'Session' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: AparItem) => (
                <AparStatusBadge status={item.status} />
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: AparItem) => (
                <div className="apar-action-buttons">
                  <Button
                    label="Process"
                    icon="play"
                    variant="primary"
                    onClick={() => handleProcess(item)}
                  />
                  <Button label="Track" icon="map-marker" variant="outlined" />
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
