import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import './BulkSelectTable.css';

// ─── Bulk Action Definition ───────────────────────────────────────────────────
export interface BulkAction {
  label: string;
  icon: string;
  variant: 'success' | 'danger' | 'outlined' | 'primary';
  onClick: () => void;
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────
interface BulkActionBarProps {
  count: number;
  actions: BulkAction[];
  onClear: () => void;
}

function BulkActionBar({ count, actions, onClear }: BulkActionBarProps) {
  return (
    <div className="bst-bulk-bar">
      <div className="bst-bulk-bar-left">
        <span className="bst-bulk-bar-icon material-symbols-rounded">
          checklist
        </span>
        <span className="bst-bulk-bar-text">
          {count} candidate{count !== 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="bst-bulk-bar-actions">
        {actions.map(a => (
          <Button
            key={a.label}
            label={a.label}
            icon={a.icon}
            type="button"
            variant={a.variant}
            onClick={a.onClick}
          />
        ))}
        <Button
          label="Clear"
          icon="close"
          type="button"
          variant="outlined"
          onClick={onClear}
        />
      </div>
    </div>
  );
}

// ─── Column Definition ────────────────────────────────────────────────────────
export interface BulkColumn<T> {
  header: string;
  field?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  stopPropagation?: boolean;
}

// ─── Main Props ───────────────────────────────────────────────────────────────
export interface BulkSelectTableProps<T extends { id: string }> {
  data: T[];
  columns: BulkColumn<T>[];
  selected: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
  bulkActions?: BulkAction[];
  onClearSelection: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  totalCount?: number;
}

// ─── BulkSelectTable Component ────────────────────────────────────────────────
export default function BulkSelectTable<T extends { id: string }>({
  data,
  columns,
  selected,
  onToggleOne,
  onToggleAll,
  bulkActions = [],
  onClearSelection,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found.',
  totalCount,
}: BulkSelectTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState('');
  const isControlled = onSearchChange !== undefined;
  const currentSearch = isControlled ? (searchValue ?? '') : internalSearch;

  const handleSearchChange = (val: string) => {
    if (isControlled) onSearchChange!(val);
    else setInternalSearch(val);
  };

  const allIds = data.map(r => r.id);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id));
  const someSelected = selected.size > 0;

  const showSearch = searchValue !== undefined || onSearchChange !== undefined;

  return (
    <div className="bst-wrapper">
      {/* Search — matches GridPanel style */}
      {showSearch && (
        <div className="bst-search-row mb-3">
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={currentSearch}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="p-inputtext bst-search-input w-64 pl-40"
            />
          </div>
        </div>
      )}

      {/* Bulk Action Bar */}
      {someSelected && bulkActions.length > 0 && (
        <BulkActionBar
          count={selected.size}
          actions={bulkActions}
          onClear={onClearSelection}
        />
      )}

      {/* Table */}
      <div className="bst-table-wrap">
        <table className="bst-table">
          <thead className="bst-thead">
            <tr>
              <th className="bst-th-check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="bst-checkbox"
                  title="Select All"
                />
              </th>
              {columns.map(col => (
                <th key={col.header} className="bst-th">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className="bst-empty">
                <td colSpan={columns.length + 1}>{emptyMessage}</td>
              </tr>
            ) : (
              data.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onToggleOne(row.id)}
                  className={`bst-tr ${selected.has(row.id) ? 'bst-tr-selected' : ''}`}
                >
                  <td className="bst-td-check">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => onToggleOne(row.id)}
                      onClick={e => e.stopPropagation()}
                      className="bst-checkbox"
                    />
                  </td>
                  {columns.map(col => (
                    <td
                      key={col.header}
                      className={`bst-td ${col.className ?? ''}`}
                      onClick={
                        col.stopPropagation
                          ? e => e.stopPropagation()
                          : undefined
                      }
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.field
                          ? String(row[col.field] ?? '')
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {data.length > 0 && (
        <div className="bst-footer">
          <span>
            Showing {data.length} of {totalCount ?? data.length} entries
          </span>
          {someSelected && (
            <span className="bst-footer-count">{selected.size} selected</span>
          )}
        </div>
      )}
    </div>
  );
}
