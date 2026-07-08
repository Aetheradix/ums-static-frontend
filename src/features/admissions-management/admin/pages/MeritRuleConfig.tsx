import { useState } from 'react';
import {
  FormPage,
  FormCard,
  StatusBadge,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { Modal } from 'shared/components/popups';
import { TextBox, DropDownList, NumberBox } from 'shared/components/forms';
import { ToastService } from 'services';

interface MeritRule {
  id: string;
  name: string;
  programCode: string;
  academicWeightage: number;
  entranceWeightage: number;
  interviewWeightage: number;
  status: 'Active' | 'Inactive';
}

const mockRules: MeritRule[] = [
  {
    id: 'MR-01',
    name: 'B.Tech Standard Admission',
    programCode: 'BTECH-CSE',
    academicWeightage: 60,
    entranceWeightage: 40,
    interviewWeightage: 0,
    status: 'Active',
  },
  {
    id: 'MR-02',
    name: 'MBA Holistic Selection',
    programCode: 'MBA-FIN',
    academicWeightage: 40,
    entranceWeightage: 30,
    interviewWeightage: 30,
    status: 'Active',
  },
];

export default function MeritRuleConfig() {
  const [rules, setRules] = useState<MeritRule[]>(mockRules);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Partial<MeritRule>>({});

  const statusTemplate = (rowData: MeritRule) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const handleSave = () => {
    if (selectedRule.id) {
      setRules(
        rules.map(r =>
          r.id === selectedRule.id
            ? ({ ...r, ...selectedRule } as MeritRule)
            : r
        )
      );
      ToastService.success('Rule updated successfully.');
    } else {
      const newRule: MeritRule = {
        ...(selectedRule as MeritRule),
        id: `MR-0${Math.floor(Math.random() * 10) + 3}`,
        status: selectedRule.status || 'Active',
      };
      setRules([newRule, ...rules]);
      ToastService.success('Rule created successfully.');
    }
    setShowDialog(false);
    setSelectedRule({});
  };

  const toolbar = (
    <Button
      label="New Rule"
      icon="pi pi-plus"
      onClick={() => {
        setSelectedRule({
          academicWeightage: 50,
          entranceWeightage: 50,
          interviewWeightage: 0,
        });
        setShowDialog(true);
      }}
    />
  );

  const totalWeightage =
    (selectedRule.academicWeightage || 0) +
    (selectedRule.entranceWeightage || 0) +
    (selectedRule.interviewWeightage || 0);

  // Footer is inline

  return (
    <FormPage
      title="Merit Rule Config"
      description="Define weightage rules for generating program-wise admission merit lists"
    >
      <FormCard>
        <GridPanel
          data={rules}
          searchBox={true}
          searchFields={['name', 'programCode', 'status']}
          toolbar={toolbar}
          onEdit={(rowData: MeritRule) => {
            setSelectedRule({ ...rowData });
            setShowDialog(true);
          }}
          onRemove={(rowData: MeritRule) => {
            setRules(rules.filter(r => r.id !== rowData.id));
            ToastService.success('Rule removed successfully.');
          }}
          columns={[
            { field: 'name', header: 'Rule Name', sortable: true },
            { field: 'programCode', header: 'Program', sortable: true },
            {
              field: 'academicWeightage',
              header: 'Academic %',
              sortable: true,
            },
            {
              field: 'entranceWeightage',
              header: 'Entrance %',
              sortable: true,
            },
            {
              field: 'interviewWeightage',
              header: 'Interview %',
              sortable: true,
            },
            {
              field: 'status',
              header: 'Status',
              cell: statusTemplate,
              sortable: true,
            },
          ]}
        />
      </FormCard>

      <Modal
        visible={showDialog}
        size="medium"
        header={selectedRule.id ? 'Edit Merit Rule' : 'New Merit Rule'}
        onHide={() => setShowDialog(false)}
      >
        <div className="p-4 flex flex-col gap-4">
          <TextBox
            label="Rule Name *"
            value={selectedRule.name || ''}
            onChange={v =>
              setSelectedRule({ ...selectedRule, name: v as string })
            }
            placeholder="e.g. B.Tech Standard Admission"
          />

          <DropDownList
            label="Applies To Program *"
            value={selectedRule.programCode}
            data={[
              { label: 'BTECH-CSE', value: 'BTECH-CSE' },
              { label: 'MBA-FIN', value: 'MBA-FIN' },
              { label: 'PHD-PHY', value: 'PHD-PHY' },
            ]}
            textField="label"
            valueField="value"
            onChange={(v: any) =>
              setSelectedRule({ ...selectedRule, programCode: v })
            }
            defaultOptionText="Select Program"
          />

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
              Weightage Distribution (Must equal 100%)
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <NumberBox
                  label="Past Academics (%)"
                  value={selectedRule.academicWeightage}
                  onChange={v =>
                    setSelectedRule({
                      ...selectedRule,
                      academicWeightage: Number(v),
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <NumberBox
                  label="Entrance Test (%)"
                  value={selectedRule.entranceWeightage}
                  onChange={v =>
                    setSelectedRule({
                      ...selectedRule,
                      entranceWeightage: Number(v),
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <NumberBox
                  label="Interview (%)"
                  value={selectedRule.interviewWeightage}
                  onChange={v =>
                    setSelectedRule({
                      ...selectedRule,
                      interviewWeightage: Number(v),
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-700">Total Weightage:</span>
                <span
                  className={`px-2 py-1 rounded ${totalWeightage === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {totalWeightage}%
                </span>
              </div>
            </div>
          </div>

          <DropDownList
            label="Status"
            value={selectedRule.status || 'Active'}
            data={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            textField="label"
            valueField="value"
            onChange={(v: any) =>
              setSelectedRule({
                ...selectedRule,
                status: v as 'Active' | 'Inactive',
              })
            }
            defaultOptionText="Select Status"
          />

          <div className="flex justify-end gap-2 mt-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              variant="outlined"
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Save Rule"
              icon="pi pi-check"
              variant="primary"
              onClick={handleSave}
              disabled={totalWeightage !== 100}
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
