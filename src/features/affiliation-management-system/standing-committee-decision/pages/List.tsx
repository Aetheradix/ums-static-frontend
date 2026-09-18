import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { formatDate } from 'shared/utils/dateUtils';
import { ToastService } from 'services';
import type {
  FinalDecisionStatus,
  StandingCommitteeDecisionItem,
} from '../types';
import { INITIAL_DECISIONS } from '../data';
import DecisionModal from '../components/DecisionModal';
import DecisionDetailsModal from '../components/DecisionDetailsModal';

export default function StandingCommitteeDecisionList() {
  const [data, setData] =
    useState<StandingCommitteeDecisionItem[]>(INITIAL_DECISIONS);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingItem, setEditingItem] =
    useState<StandingCommitteeDecisionItem | null>(null);
  const [viewingItem, setViewingItem] =
    useState<StandingCommitteeDecisionItem | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setShowDecisionModal(true);
  };

  const handleOpenEdit = (item: StandingCommitteeDecisionItem) => {
    setEditingItem(item);
    setShowDecisionModal(true);
  };

  const handleOpenView = (item: StandingCommitteeDecisionItem) => {
    setViewingItem(item);
    setShowDetailsModal(true);
  };

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
    ToastService.success('Standing committee decision record deleted.');
  };

  const handleSaveDecision = (savedItem: StandingCommitteeDecisionItem) => {
    if (editingItem) {
      setData(prev =>
        prev.map(item => (item.id === savedItem.id ? savedItem : item))
      );
      ToastService.success('Decision updated successfully.');
    } else {
      setData(prev => [savedItem, ...prev]);
      ToastService.success(
        'Final standing committee decision recorded successfully.'
      );
    }
  };

  const getStatusVariant = (
    status: FinalDecisionStatus
  ): 'approved' | 'rejected' | 'warning' | 'pending' => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Returned for Compliance':
        return 'warning';
      case 'Deferred':
        return 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <FormPage
      title="Standing Committee Decision"
      description="Manage and track final affiliation decisions taken by the University Standing Committee."
    >
      <FormCard
        title="Standing Committee Decisions"
        headerAction={
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            label="Record Final Decision"
            icon="pi pi-plus"
          />
        }
      >
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search colleges, application number..."
          searchFields={[
            'collegeName',
            'applicationNo',
            'committeeMembers',
            'finalDecision',
            'decisionRemarks',
          ]}
          emptyMessage="No standing committee decisions found."
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '60px',
              sortable: false,
            },
            {
              field: 'collegeName',
              header: 'College Name',
              sortable: true,
              cell: item => <span>{item.collegeName}</span>,
            },
            {
              field: 'applicationNo',
              header: 'Application Number',
              sortable: true,
              cell: item => <span>{item.applicationNo}</span>,
            },
            {
              field: 'meetingDate',
              header: 'Meeting Date',
              sortable: true,
              cell: item => <span>{formatDate(item.meetingDate)}</span>,
            },
            {
              field: 'decisionDate',
              header: 'Decision Date',
              sortable: true,
              cell: item => <span>{formatDate(item.decisionDate)}</span>,
            },
            {
              field: 'committeeMembers',
              header: 'Committee Members',
              sortable: true,
              cell: item => <span>{item.committeeMembers}</span>,
            },
            {
              field: 'finalDecision',
              header: 'Final Decision',
              sortable: true,
              cell: item => (
                <StatusBadge
                  label={item.finalDecision}
                  variant={getStatusVariant(item.finalDecision)}
                />
              ),
            },
            {
              field: 'supportingDocumentName',
              header: 'Supporting Document',
              sortable: true,
              cell: item =>
                item.supportingDocumentName ? (
                  <button
                    type="button"
                    onClick={() =>
                      ToastService.success(
                        `Downloading ${item.supportingDocumentName}...`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
                    title={`Click to download ${item.supportingDocumentName}`}
                  >
                    <i className="pi pi-file-pdf text-red-500 text-sm flex-shrink-0" />
                    <span className="truncate max-w-[150px]">
                      {item.supportingDocumentName}
                    </span>
                    <i className="pi pi-download text-slate-400 text-xs flex-shrink-0" />
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '120px',
              cell: item => (
                <GridActionButtons
                  onView={() => handleOpenView(item)}
                  viewTooltip="View Decision Details"
                  onEdit={() => handleOpenEdit(item)}
                  editTooltip="Edit Decision"
                  onDelete={() => handleDelete(item.id)}
                  deleteTooltip="Delete Record"
                />
              ),
            },
          ]}
        />
      </FormCard>

      {/* Decision Create / Edit Modal */}
      <DecisionModal
        visible={showDecisionModal}
        onHide={() => setShowDecisionModal(false)}
        onSave={handleSaveDecision}
        editingItem={editingItem}
      />

      {/* Decision View / Preview Modal */}
      <DecisionDetailsModal
        visible={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        item={viewingItem}
        onEdit={handleOpenEdit}
      />
    </FormPage>
  );
}
