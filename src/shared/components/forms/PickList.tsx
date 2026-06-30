import React from 'react';
import './PickList.css';

interface PickListProps<TData extends { id: string }> {
  source: TData[];
  target: TData[];
  onChange?: (e: { source: TData[]; target: TData[] }) => void;
  sourceHeader?: string;
  targetHeader?: string;
  className?: string;
  itemTemplate?: (item: TData) => React.ReactNode;
  dataKey?: string;
  label?: (item: TData) => string;
}

export default function PickList<TData extends { id: string }>({
  source,
  target,
  onChange,
  sourceHeader = 'Available Items',
  targetHeader = 'Selected Items',
  className,
  itemTemplate,
}: PickListProps<TData>) {
  const [selectedSource, setSelectedSource] = React.useState<string[]>([]);
  const [selectedTarget, setSelectedTarget] = React.useState<string[]>([]);

  const toggleSource = (id: string) =>
    setSelectedSource(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const toggleTarget = (id: string) =>
    setSelectedTarget(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  // Move selected source → target
  const moveToTarget = () => {
    if (!selectedSource.length) return;
    const moving = source.filter(i => selectedSource.includes(i.id));
    const newSource = source.filter(i => !selectedSource.includes(i.id));
    const newTarget = [...target, ...moving];
    setSelectedSource([]);
    onChange?.({ source: newSource, target: newTarget });
  };

  // Move all source → target
  const moveAllToTarget = () => {
    onChange?.({ source: [], target: [...target, ...source] });
    setSelectedSource([]);
  };

  // Move selected target → source
  const moveToSource = () => {
    if (!selectedTarget.length) return;
    const moving = target.filter(i => selectedTarget.includes(i.id));
    const newTarget = target.filter(i => !selectedTarget.includes(i.id));
    const newSource = [...source, ...moving];
    setSelectedTarget([]);
    onChange?.({ source: newSource, target: newTarget });
  };

  // Move all target → source
  const moveAllToSource = () => {
    onChange?.({ source: [...source, ...target], target: [] });
    setSelectedTarget([]);
  };

  // Reorder selected target item up
  const moveUp = () => {
    if (!selectedTarget.length) return;
    const idx = target.findIndex(i => i.id === selectedTarget[0]);
    if (idx <= 0) return;
    const newTarget = [...target];
    [newTarget[idx - 1], newTarget[idx]] = [newTarget[idx], newTarget[idx - 1]];
    onChange?.({ source, target: newTarget });
  };

  // Reorder selected target item down
  const moveDown = () => {
    if (!selectedTarget.length) return;
    const idx = target.findIndex(i => i.id === selectedTarget[0]);
    if (idx < 0 || idx >= target.length - 1) return;
    const newTarget = [...target];
    [newTarget[idx], newTarget[idx + 1]] = [newTarget[idx + 1], newTarget[idx]];
    onChange?.({ source, target: newTarget });
  };

  return (
    <div className={`picklist-custom-wrapper ${className || ''}`}>
      {/* ── Source Panel ── */}
      <div className="picklist-panel">
        <div className="picklist-panel-header">
          <span className="material-symbols-rounded picklist-header-icon">
            list
          </span>
          {sourceHeader}
          {source.length > 0 && (
            <span className="picklist-count-badge">{source.length}</span>
          )}
        </div>
        <ul className="picklist-list">
          {source.length === 0 ? (
            <li className="picklist-empty">All items have been selected</li>
          ) : (
            source.map(item => (
              <li
                key={item.id}
                className={`picklist-item ${selectedSource.includes(item.id) ? 'picklist-item-selected' : ''}`}
                onClick={() => toggleSource(item.id)}
              >
                {itemTemplate ? (
                  itemTemplate(item)
                ) : (
                  <>
                    <span className="picklist-item-icon material-symbols-rounded">
                      {selectedSource.includes(item.id)
                        ? 'check_circle'
                        : 'radio_button_unchecked'}
                    </span>
                    <span className="picklist-item-label">
                      {(item as any).label}
                    </span>
                    <span className="material-symbols-rounded picklist-item-arrow">
                      chevron_right
                    </span>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ── Transfer Buttons ── */}
      <div className="picklist-controls">
        <button
          type="button"
          className="picklist-btn"
          onClick={moveToTarget}
          disabled={!selectedSource.length}
          title="Move selected to target"
        >
          <span className="material-symbols-rounded">chevron_right</span>
        </button>
        <button
          type="button"
          className="picklist-btn"
          onClick={moveAllToTarget}
          disabled={!source.length}
          title="Move all to target"
        >
          <span className="material-symbols-rounded">
            keyboard_double_arrow_right
          </span>
        </button>
        <button
          type="button"
          className="picklist-btn"
          onClick={moveToSource}
          disabled={!selectedTarget.length}
          title="Move selected to source"
        >
          <span className="material-symbols-rounded">chevron_left</span>
        </button>
        <button
          type="button"
          className="picklist-btn"
          onClick={moveAllToSource}
          disabled={!target.length}
          title="Move all to source"
        >
          <span className="material-symbols-rounded">
            keyboard_double_arrow_left
          </span>
        </button>
      </div>

      {/* ── Target Panel ── */}
      <div className="picklist-panel">
        <div className="picklist-panel-header">
          <span className="material-symbols-rounded picklist-header-icon">
            format_list_numbered
          </span>
          {targetHeader}
          {target.length > 0 && (
            <span className="picklist-count-badge picklist-count-badge-violet">
              {target.length}
            </span>
          )}
          {/* Up / Down reorder */}
          {target.length > 0 && (
            <div className="picklist-reorder-btns">
              <button
                type="button"
                className="picklist-reorder-btn"
                onClick={moveUp}
                disabled={!selectedTarget.length}
                title="Move up"
              >
                <span className="material-symbols-rounded">arrow_upward</span>
              </button>
              <button
                type="button"
                className="picklist-reorder-btn"
                onClick={moveDown}
                disabled={!selectedTarget.length}
                title="Move down"
              >
                <span className="material-symbols-rounded">arrow_downward</span>
              </button>
            </div>
          )}
        </div>
        <ul className="picklist-list">
          {target.length === 0 ? (
            <li className="picklist-empty">
              <span className="material-symbols-rounded picklist-empty-icon">
                swap_horiz
              </span>
              Select items from the left panel
            </li>
          ) : (
            target.map((item, idx) => (
              <li
                key={item.id}
                className={`picklist-item ${selectedTarget.includes(item.id) ? 'picklist-item-selected' : ''}`}
                onClick={() => toggleTarget(item.id)}
              >
                {itemTemplate ? (
                  <>
                    <span className="picklist-rank-badge">{idx + 1}</span>
                    {itemTemplate(item)}
                  </>
                ) : (
                  <>
                    <span className="picklist-rank-badge">{idx + 1}</span>
                    <span className="picklist-item-label">
                      {(item as any).label}
                    </span>
                    <span className="material-symbols-rounded picklist-item-drag">
                      drag_indicator
                    </span>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
