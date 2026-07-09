import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { integrationPortals } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminIntegrationDashboard() {
  const [portals, setPortals] = useState(integrationPortals);
  const [selected, setSelected] = useState(integrationPortals[0]);
  const [endpoint, setEndpoint] = useState(selected.endpoint);

  const handleUpdate = () => {
    setPortals(prev =>
      prev.map(p => {
        if (p.id === selected.id) {
          return { ...p, endpoint };
        }
        return p;
      })
    );
    ToastService.success(
      `API parameters successfully saved for ${selected.acronym}.`
    );
  };

  const handleSyncForce = (id: string) => {
    ToastService.success(
      `Manual sync request sent to gateway for API ID: ${id}`
    );
  };

  return (
    <FormPage
      title="Government & eOffice Integration Gateway"
      description="Monitor eOffice connectivity, synchronize UGC e-Samadhan or CM Helpline tickets, and review audit records."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Integration Dashboard' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.5fr 1fr' }}
      >
        {/* Left Side list */}
        <FormCard title="API Gateway Connections" icon="api">
          <div className="space-y-3">
            {portals.map(p => {
              const isSelected = selected.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelected(p);
                    setEndpoint(p.endpoint);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                      <span className="flex h-2 w-2 relative shrink-0">
                        <span
                          className={`grv-blink absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            p.status === 'Connected'
                              ? 'bg-emerald-400'
                              : p.status === 'Syncing'
                                ? 'bg-cyan-400'
                                : 'bg-red-400'
                          }`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            p.status === 'Connected'
                              ? 'bg-emerald-500'
                              : p.status === 'Syncing'
                                ? 'bg-cyan-500'
                                : 'bg-red-500'
                          }`}
                        ></span>
                      </span>
                      {p.name} ({p.acronym})
                    </span>
                    <span
                      className={`grv-status-pill ${p.status === 'Connected' ? 'active' : p.status === 'Syncing' ? 'syncing' : 'sla-breached'}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mb-2">
                    {p.endpoint}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2">
                    <span>Synced: {p.totalSynced} items</span>
                    <span className="text-red-600">
                      Failed: {p.failedRequests}
                    </span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleSyncForce(p.id);
                      }}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-150 font-bold px-2 py-0.5 rounded"
                    >
                      Trigger Sync
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        {/* Right Side Endpoint details config */}
        <div className="space-y-4">
          <FormCard title={`API Details: ${selected.acronym}`} icon="settings">
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-2 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-1">
                  Gateway Details:
                </span>
                {selected.description}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                <div className="grv-info-field">
                  <span className="grv-info-label">Last Sync timestamp</span>
                  <span className="grv-info-value font-mono">
                    {selected.lastSync}
                  </span>
                </div>
                <div className="grv-info-field">
                  <span className="grv-info-label">Queue Pending syncs</span>
                  <span className="grv-info-value font-mono text-amber-600">
                    {selected.pendingRequests} items
                  </span>
                </div>
              </div>

              <TextBox
                label="REST API Gateway Endpoint URL *"
                value={endpoint}
                onChange={setEndpoint}
                required
              />

              <TextBox
                label="Authentication API secret key *"
                value="SEC_************************"
                onChange={() => {}}
                disabled
              />

              <div className="flex gap-2 border-t border-slate-100 pt-4 mt-6">
                <Button
                  label="Update Endpoint Parameters"
                  icon="save"
                  variant="primary"
                  onClick={handleUpdate}
                  className="w-full"
                />
              </div>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
