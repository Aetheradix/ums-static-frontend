import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { Loader } from 'shared/components/progress';
import { FormPage, Tabs } from 'shared/new-components';
import { useGetEmployeeByIdQuery } from '../queries';
import EmployeeProfileSummaryCard from './EmployeeProfileSummaryCard';
import './ViewProfile.css';
import ContactTab from './tabs/ContactTab';
import DocumentsTab from './tabs/DocumentsTab';
import EmploymentTab from './tabs/EmploymentTab';
import HistoryTab from './tabs/HistoryTab';
import OrganizationTab from './tabs/OrganizationTab';
import OverviewTab from './tabs/OverviewTab';

export default function ViewProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetEmployeeByIdQuery(Number(id));
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const moreActionRef = useRef<HTMLDivElement | null>(null);

  const employeeName = useMemo(() => {
    if (!data) return '';

    return [data.salutation, data.firstName, data.middleName, data.lastName]
      .filter(Boolean)
      .join(' ');
  }, [data]);

  const employeeInitials = useMemo(() => {
    if (!data) return 'EM';

    const first = data.firstName?.charAt(0) ?? '';
    const last = data.lastName?.charAt(0) ?? '';

    return `${first}${last}`.toUpperCase() || 'EM';
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreActionRef.current &&
        !moreActionRef.current.contains(event.target as Node)
      ) {
        setShowMoreActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <FormPage
      title="Employee Profile"
      description="View detailed information about the employee."
    >
      {isLoading && <Loader />}

      {!isLoading && data ? (
        <div className="employee-profile-page">
          <div className="employee-profile-actions">
            <Button
              label="Edit Employee"
              icon="pencil"
              variant="outlined"
              size="small"
              className="employee-back-list-btn"
              onClick={() =>
                navigate(
                  `/employee-management/manage-employees/${data.employeeId}/edit`
                )
              }
            />

            <div className="employee-profile-icon-action-panel">
              <Button
                icon="arrow-left"
                variant="text"
                size="small"
                className="employee-profile-panel-icon-btn"
                onClick={() =>
                  navigate('/employee-management/manage-employees')
                }
              />

              <span className="employee-profile-action-divider" />

              <div className="employee-more-action-wrap" ref={moreActionRef}>
                <Button
                  icon="ellipsis-v"
                  variant="text"
                  size="small"
                  className="employee-profile-panel-icon-btn"
                  onClick={() => setShowMoreActions(prev => !prev)}
                />

                {showMoreActions && (
                  <div className="employee-more-menu">
                    <Button
                      label="Change Status"
                      icon="refresh"
                      variant="text"
                      size="small"
                      className="employee-more-menu-button"
                      onClick={() => {}}
                    />

                    <Button
                      label="Assign Role"
                      icon="user-plus"
                      variant="text"
                      size="small"
                      className="employee-more-menu-button"
                      onClick={() => {}}
                    />

                    <Button
                      label="Download Profile"
                      icon="download"
                      variant="text"
                      size="small"
                      className="employee-more-menu-button"
                      onClick={() => {}}
                    />

                    <Button
                      label="Deactivate Employee"
                      icon="ban"
                      variant="text"
                      size="small"
                      className="employee-more-menu-button employee-more-menu-button-danger"
                      onClick={() => {}}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <EmployeeProfileSummaryCard
            data={data}
            employeeName={employeeName}
            employeeInitials={employeeInitials}
          />

          <Tabs
            activeIndex={activeTabIndex}
            onTabChange={e => setActiveTabIndex(e.index)}
            className="employee-profile-tabs"
            tabs={[
              { title: 'Overview', content: null },
              { title: 'Employment', content: null },
              { title: 'Organization', content: null },
              { title: 'Contact', content: null },
              { title: 'Documents', content: null },
              { title: 'History', content: null },
            ]}
          />

          {activeTabIndex === 0 && <OverviewTab data={data} />}
          {activeTabIndex === 1 && <EmploymentTab data={data} />}
          {activeTabIndex === 2 && <OrganizationTab data={data} />}
          {activeTabIndex === 3 && <ContactTab data={data} />}
          {activeTabIndex === 4 && <DocumentsTab data={data} />}
          {activeTabIndex === 5 && <HistoryTab data={data} />}
        </div>
      ) : (
        !isLoading && <p>Employee not found.</p>
      )}
    </FormPage>
  );
}
