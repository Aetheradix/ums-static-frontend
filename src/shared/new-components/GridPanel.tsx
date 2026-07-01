import { useState } from 'react';
import { Grid } from '../components/grid';
import './GridPanel.css';

interface GridPanelProps<T> extends Omit<
  Controls.GridProps<T>,
  'emptyMessage'
> {
  title?: string;
  toolbar?: React.ReactElement;
  searchBox?: boolean;
  searchPlaceholder?: string;
  exportExcel?: boolean;
  onExportExcel?: () => void;
  isExporting?: boolean;
  print?: boolean;
  onPrint?: () => void;
  isPrint?: boolean;
  cellMemo?: boolean;
  actionButtons?: React.ReactElement;
  onValueChange?: (value: T[]) => void;
  onSort?: (e: { sortField?: string; sortOrder?: number }) => void;
  onFilter?: (e: { globalFilter?: string }) => void;
  sortField?: string | null;
  sortOrder?: number | null;
  emptyMessage?: React.ReactNode;
}

export default function GridPanel<T>({
  title,
  toolbar,
  searchBox = false,
  searchPlaceholder = 'Search...',
  exportExcel = false,
  onExportExcel,
  isExporting,
  print = false,
  onPrint,
  isPrint,
  cellMemo = true,
  actionButtons,
  onValueChange,
  onSort,
  onFilter,
  sortField,
  sortOrder,
  emptyMessage,
  ...rest
}: GridPanelProps<T>) {
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('');

  const currentGlobalFilter = rest.globalFilter ?? internalGlobalFilter;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInternalGlobalFilter(value);
    if (onFilter) {
      onFilter({ globalFilter: value });
    }
  };

  const defaultEmptyState = (
    <div className="flex flex-col items-center justify-center p-12 text-gray-400">
      <i className="pi pi-folder-open text-5xl mb-4 text-gray-300"></i>
      <h3 className="text-lg font-semibold text-gray-600 mb-1">
        No Records Found
      </h3>
      <p className="text-sm">
        There is no data available to display in this table.
      </p>
    </div>
  );

  return (
    <div className="grid-panel-wrapper">
      <div className="grid-panel-header mb-3">
        {searchBox ? (
          <div className="flex w-full items-center justify-between">
            <div className="relative">
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={currentGlobalFilter}
                onChange={handleSearchChange}
                className="p-inputtext w-64 pl-40"
              />
            </div>
            <div className="flex items-center gap-3">
              {toolbar}
              {actionButtons}
            </div>
          </div>
        ) : (
          <>
            <span className="grid-panel-title">{title}</span>
            <div className="grid-panel-toolbar">
              {toolbar}
              {actionButtons}
            </div>
          </>
        )}
      </div>
      <Grid
        {...rest}
        globalFilter={currentGlobalFilter}
        cellMemo={cellMemo}
        onValueChange={onValueChange}
        onSort={onSort}
        onFilter={onFilter}
        sortField={sortField}
        sortOrder={sortOrder}
        emptyMessage={(emptyMessage || defaultEmptyState) as any}
      />
    </div>
  );
}
