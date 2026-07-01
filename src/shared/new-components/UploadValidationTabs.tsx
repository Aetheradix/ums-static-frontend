import FormCard from './FormCard';
import GridPanel from './GridPanel';
import Tabs from './Tabs';

export interface UploadValidationTabsProps<TValid = any, TInvalid = any> {
  isParsed: boolean;
  validData: TValid[];
  validColumns: Controls.ColumnProps<TValid>[];
  invalidData: TInvalid[];
  invalidColumns: Controls.ColumnProps<TInvalid>[];
}

export default function UploadValidationTabs<TValid, TInvalid>({
  isParsed,
  validData,
  validColumns,
  invalidData,
  invalidColumns,
}: UploadValidationTabsProps<TValid, TInvalid>) {
  if (!isParsed) return null;

  return (
    <FormCard title="Validation Results" icon="list">
      <Tabs
        tabs={[
          {
            title: `Valid Data (${validData.length})`,
            content: (
              <div className="pt-4">
                <GridPanel data={validData} columns={validColumns} />
              </div>
            ),
          },
          {
            title: `Invalid Data (${invalidData.length})`,
            content: (
              <div className="pt-4">
                <GridPanel data={invalidData} columns={invalidColumns} />
              </div>
            ),
          },
        ]}
      />
    </FormCard>
  );
}
