import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { sisUrls } from '../../urls';
import { useStudentAdditionalInformationsQuery } from '../queries';

export default function List() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading } = useStudentAdditionalInformationsQuery();

  if (
    !isLoading &&
    data.length === 0 &&
    location.pathname === sisUrls.studentAdditionalInformation.root &&
    !location.state?.fromSave
  ) {
    return <Navigate to="create" replace />;
  }

  return (
    <FormPage
      title="Student Additional Information"
      description="Manage additional details for students including emergency contacts and notifications."
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          pagination={false}
          onEdit={(item: SIS.StudentAdditionalInformationItem) =>
            navigate(sisUrls.studentAdditionalInformation.edit(item.id))
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Student ID',
              field: 'studentId',
              sortable: true,
            },
            {
              header: 'Emergency Contact Name',
              field: 'emergencyContactName',
              sortable: true,
            },
            {
              header: 'Contact',
              field: 'emergencyContact',
              sortable: true,
            },
            {
              header: 'Relation',
              field: 'emergencyRelation',
              sortable: true,
            },
          ]}
          // toolbar={
          //   <Button
          //     label="Create"
          //     icon="plus"
          //     variant="primary"
          //     className="ml-auto"
          //     onClick={() => navigate('create')}
          //   />
          // }
          searchBox={false}
        />
      </FormCard>
      <Outlet />
    </FormPage>
  );
}
