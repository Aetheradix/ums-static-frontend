import { useState } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

import { Modal } from 'shared/components/popups';
import { DropDownList, TextBox } from 'shared/components/forms';

const courierCompanies = [
  { name: 'India Post (Speed Post)', value: 'India Post (Speed Post)' },
  { name: 'DTDC', value: 'DTDC' },
  { name: 'Blue Dart', value: 'Blue Dart' },
  { name: 'Delhivery', value: 'Delhivery' },
  { name: 'Other', value: 'Other' },
];

export default function DispatchManagement() {
  const [data, setData] = useState([
    {
      id: 1,
      applicationNo: 'RGPV/DEG/2026/0101',
      student: 'Priya Singh',
      certificate: 'Degree Certificate',
      date: '25-06-2026',
      status: 'Pending Dispatch',
      courier: '',
      trackingId: '',
    },
    {
      id: 2,
      applicationNo: 'RGPV/MIG/2026/0095',
      student: 'Rahul Verma',
      certificate: 'Migration Certificate',
      date: '20-06-2026',
      status: 'Dispatched',
      courier: 'India Post (Speed Post)',
      trackingId: 'IN987654321',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    courier: 'India Post (Speed Post)',
    trackingId: '',
    otherCourier: '',
  });

  const openDispatchModal = (id: number) => {
    setSelectedId(id);
    setForm({
      courier: 'India Post (Speed Post)',
      trackingId: '',
      otherCourier: '',
    });
    setModalVisible(true);
  };

  const handleDispatch = () => {
    if (!selectedId || !form.trackingId) return;
    const finalCourierName =
      form.courier === 'Other' ? form.otherCourier : form.courier;

    setData(
      data.map(item =>
        item.id === selectedId
          ? {
              ...item,
              status: 'Dispatched',
              courier: finalCourierName,
              trackingId: form.trackingId,
            }
          : item
      )
    );
    setModalVisible(false);
  };

  const actionTemplate = (rowData: any) => {
    if (rowData.status === 'Dispatched') {
      return (
        <div className="flex flex-col text-sm">
          <span className="text-gray-600 font-medium">{rowData.courier}</span>
          <span className="text-green-600 font-bold">{rowData.trackingId}</span>
        </div>
      );
    }
    return (
      <Button
        label="Dispatch"
        variant="outlined"
        onClick={() => openDispatchModal(rowData.id)}
      />
    );
  };

  const columns = [
    { field: 'applicationNo', header: 'Application No' },
    { field: 'student', header: 'Student' },
    { field: 'certificate', header: 'Certificate' },
    { field: 'date', header: 'Issue Date' },
    { field: 'status', header: 'Status' },
    { field: 'actions', header: 'Action/Tracking', cell: actionTemplate },
  ];

  return (
    <FormPage
      title="Dispatch Management"
      description="Update courier and tracking details for physically dispatched certificates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'University Portal', to: '/home/sub-menu/university-portal' },
        { label: 'Dispatch Management' },
      ]}
    >
      <FormCard>
        <div className="flex gap-4 mb-4">
          <Button label="Print Labels" variant="outlined" icon="print" />
          <Button
            label="Export Pending List"
            variant="outlined"
            icon="download"
          />
        </div>
      </FormCard>

      <GridPanel columns={columns as any} data={data} searchBox />

      <Modal
        header="Dispatch Certificate"
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        size="small"
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-600">
            Enter courier details for the selected certificate.
          </p>
          <DropDownList
            label="Select Courier Service"
            data={courierCompanies}
            textField="name"
            optionValue="value"
            value={form.courier}
            onChange={v => setForm({ ...form, courier: String(v) })}
          />

          {form.courier === 'Other' && (
            <TextBox
              label="Courier Company Name"
              value={form.otherCourier}
              onChange={v => setForm({ ...form, otherCourier: v })}
            />
          )}

          <TextBox
            label="Tracking Number"
            value={form.trackingId}
            onChange={v => setForm({ ...form, trackingId: v })}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setModalVisible(false)}
            />
            <Button
              label="Submit Tracking"
              variant="primary"
              onClick={handleDispatch}
              disabled={
                !form.trackingId ||
                (form.courier === 'Other' && !form.otherCourier)
              }
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
