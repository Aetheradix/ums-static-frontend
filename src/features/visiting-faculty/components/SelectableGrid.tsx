import { Column } from 'primereact/column';
import { Button } from 'shared/components/buttons';
import { GridPanel } from 'shared/new-components';

export interface SelectableColumn<T> {
  header: string;
  field?: keyof T & string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface SelectableAction {
  label: string;
  icon: string;
  variant: 'primary' | 'success' | 'danger' | 'warning' | 'outlined';
  onClick: () => void;
}

/**
 * Paginated, searchable grid with a checkbox column and a bulk-action bar —
 * built for queues that grow to thousands of rows (scrutiny, attendance,
 * approvals). Selection survives paging and searching (`dataKey="id"`).
 */
export default function SelectableGrid<T extends { id: string }>({
  data,
  columns,
  selected,
  onSelectionChange,
  actions,
  noun = 'record',
  searchPlaceholder = 'Search...',
  isSelectable,
  toolbar,
  searchFields,
}: {
  data: T[];
  columns: SelectableColumn<T>[];
  selected: T[];
  onSelectionChange: (rows: T[]) => void;
  actions: SelectableAction[];
  noun?: string;
  searchPlaceholder?: string;
  isSelectable?: (row: T) => boolean;
  toolbar?: React.ReactElement;
  /** Fields the search box matches — include every text the user searches by. */
  searchFields?: (keyof T)[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-950/40">
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
            <i className="pi pi-check-square mr-2" />
            {selected.length} {noun}
            {selected.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex flex-wrap gap-2">
            {actions.map(a => (
              <Button
                key={a.label}
                label={a.label}
                icon={a.icon}
                variant={a.variant}
                size="small"
                onClick={a.onClick}
              />
            ))}
            <Button
              label="Clear"
              icon="times"
              variant="outlined"
              size="small"
              onClick={() => onSelectionChange([])}
            />
          </div>
        </div>
      )}
      <GridPanel
        data={data}
        dataKey="id"
        searchBox
        searchPlaceholder={searchPlaceholder}
        toolbar={toolbar}
        searchFields={searchFields}
        selectionMode="checkbox"
        selection={selected}
        onSelectionChange={e => onSelectionChange(e.value as T[])}
        isDataSelectable={isSelectable ? e => isSelectable(e.data) : undefined}
      >
        <Column selectionMode="multiple" className="w-12" />
        {columns.map(c => (
          <Column
            key={c.header}
            header={c.header}
            field={c.field}
            sortable={c.sortable}
            body={c.cell ? (row: T) => c.cell!(row) : undefined}
          />
        ))}
      </GridPanel>
    </div>
  );
}
