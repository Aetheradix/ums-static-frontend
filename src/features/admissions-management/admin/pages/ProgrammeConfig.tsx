import { useState, useEffect } from 'react';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import {
  ProgrammeConfigSeedService,
  type SeedProgrammeConfig,
} from '../../seed';
import { admissionsUrls } from '../../urls';

const CRITERIA_OPTIONS = [
  { label: 'Entrance', value: 'Entrance' },
  { label: 'Merit', value: 'Merit' },
  { label: 'Both', value: 'Both' },
];

export default function ProgrammeConfig() {
  const [programmes, setProgrammes] = useState<SeedProgrammeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const load = async () => {
    setLoading(true);
    const data = await ProgrammeConfigSeedService.getAll();
    setProgrammes(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p: SeedProgrammeConfig) => {
    setEditId(p.id);
    setEditValue(p.admissionCriteria);
  };

  const handleSave = async (id: string) => {
    await ProgrammeConfigSeedService.update(id, {
      admissionCriteria: editValue as SeedProgrammeConfig['admissionCriteria'],
    });
    ToastService.success('Admission criteria updated');
    setEditId(null);
    load();
  };

  return (
    <FormPage
      title="Programme Configuration"
      description="Configure admission criteria (Entrance / Merit / Both) for each programme."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Programme Config' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={programmes}
          loading={loading}
          columns={[
            {
              cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            { header: 'Programme', field: 'programmeName', sortable: true },
            {
              header: 'Admission Criteria',
              cell: (item: SeedProgrammeConfig) =>
                editId === item.id ? (
                  <DropDownList
                    value={editValue}
                    onChange={(v: any) => setEditValue(v)}
                    data={CRITERIA_OPTIONS}
                    textField="label"
                    valueField="value"
                  />
                ) : (
                  <span className="font-medium">{item.admissionCriteria}</span>
                ),
            },
            {
              header: 'Actions',
              cell: (item: SeedProgrammeConfig) =>
                editId === item.id ? (
                  <div className="flex gap-2">
                    <Button
                      label="Save"
                      variant="primary"
                      onClick={() => handleSave(item.id)}
                    />
                    <Button
                      label="Cancel"
                      variant="outlined"
                      onClick={() => setEditId(null)}
                    />
                  </div>
                ) : (
                  <Button
                    icon="pi pi-pencil"
                    variant="text"
                    onClick={() => startEdit(item)}
                  />
                ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
