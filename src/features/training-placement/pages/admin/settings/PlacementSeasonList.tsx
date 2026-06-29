import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { seasonStatusVariant } from '../../../constants';
import { useSeasonsQuery } from '../../../hooks/queries';
import { tpUrls } from '../../../urls';
import type { PlacementSeason } from '../../../types';

export default function PlacementSeasonList() {
  const navigate = useNavigate();
  const { data: seasons = [], isLoading } = useSeasonsQuery();

  const columns = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    {
      field: 'companyFeeLabel',
      header: 'Company Fee',
    },
    {
      field: 'studentFeeLabel',
      header: 'Student Fee',
    },
    {
      field: 'statusBadge',
      header: 'Status',
    },
  ];

  const tableData = seasons.map((season: PlacementSeason) => ({
    ...season,
    companyFeeLabel: season.feeApplicableCompany
      ? `₹${season.companyFeeAmount.toLocaleString('en-IN')}`
      : 'N/A',
    studentFeeLabel: season.feeApplicableStudent
      ? `₹${season.studentFeeAmount.toLocaleString('en-IN')}`
      : 'N/A',
    statusBadge: (
      <StatusBadge
        label={season.status}
        variant={seasonStatusVariant(season.status)}
      />
    ),
  }));

  return (
    <FormPage
      title="Placement Seasons"
      description="Configure and manage placement drive seasons."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Placement Seasons' },
      ]}
      headerAction={
        <Button
          label="Add Placement Season"
          icon="pi pi-plus"
          onClick={() => navigate(tpUrls.admin.settings.placementSeasonAdd)}
        />
      }
    >
      <FormCard>
        <div className="p-4">
          <GridPanel
            searchBox
            searchPlaceholder="Search by code or name..."
            data={isLoading ? [] : tableData}
            columns={columns as never[]}
            editCaption="Update"
            onEdit={(row: PlacementSeason) =>
              navigate(tpUrls.admin.settings.placementSeasonEdit(row.id))
            }
            emptyMessage={
              isLoading
                ? 'Loading seasons...'
                : 'No placement seasons configured.'
            }
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
