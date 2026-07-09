import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type ProgressLog,
  progressLogs as initialLogs,
  civilWorks,
  milestones as initialMilestones,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function ProgressMonitoring() {
  const [civilWorksList] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const WORK_OPTIONS = civilWorksList
    .filter((w: any) => w.status === 'In Progress')
    .map((w: any) => ({ name: `${w.workId} — ${w.name}`, value: w.id }));

  const [milestones] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestones');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = parsed.map((m: any) => {
        const mockM = initialMilestones.find((mw: any) => mw.id === m.id);
        if (mockM && mockM.qualityTestRequired) {
          return {
            ...m,
            testName: m.testName || mockM.testName,
            testType: m.testType || mockM.testType,
            materialTested: m.materialTested || mockM.materialTested,
            labName: m.labName || mockM.labName,
            requiredValue: m.requiredValue || mockM.requiredValue,
          };
        }
        return m;
      });
      const parsedIds = new Set(merged.map((m: any) => m.id));
      const missing = initialMilestones.filter((m: any) => !parsedIds.has(m.id));
      const finalMerged = [...merged, ...missing];
      localStorage.setItem('civil_milestones', JSON.stringify(finalMerged));
      return finalMerged;
    }
    return initialMilestones;
  });

  const [logs, setLogs] = useState(initialLogs);
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'view';
    item?: ProgressLog;
  }>({ mode: 'closed' });
  const [workId, setWorkId] = useState('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');
  const [progress, setProgress] = useState('');
  const [description, setDescription] = useState('');
  const [geoLat, setGeoLat] = useState('23.1815');
  const [geoLon, setGeoLon] = useState('77.4200');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [issues, setIssues] = useState('');
  const [weather, setWeather] = useState('Clear');

  // Auto-resolve GPS Lat and Lon coordinates per project
  useState(() => {
    if (workId === '1') {
      setGeoLat('23.1815');
      setGeoLon('77.4200');
    } else if (workId === '2') {
      setGeoLat('23.1750');
      setGeoLon('77.4120');
    } else if (workId === '3') {
      setGeoLat('23.1800');
      setGeoLon('77.4250');
    }
  });

  // Keep coordinates updated when workId changes
  useState(() => {
    if (workId === '1') {
      setGeoLat('23.1815');
      setGeoLon('77.4200');
    } else if (workId === '2') {
      setGeoLat('23.1750');
      setGeoLon('77.4120');
    } else if (workId === '3') {
      setGeoLat('23.1800');
      setGeoLon('77.4250');
    }
  });

  const handleSave = () => {
    if (!workId || !description) {
      ToastService.error('Work and description are required.');
      return;
    }
    const availableMilestones = milestones.filter((m: any) => m.workId === workId);
    if (availableMilestones.length > 0 && !selectedMilestoneId) {
      ToastService.error('Please select the milestone.');
      return;
    }
    if (uploadedPhotos.length === 0) {
      ToastService.error('At least one Geo-tagged Photo upload is required.');
      return;
    }
    const pct = Number(progress);
    if (pct < 0 || pct > 100) {
      ToastService.error('Progress must be 0–100%.');
      return;
    }

    const matchedMilestone = milestones.find((m: any) => m.id === selectedMilestoneId);
    const newLog: ProgressLog = {
      id: String(Date.now()),
      workId,
      logDate: new Date().toISOString().split('T')[0],
      engineerName: 'Er. Rajesh Verma (Logged In)',
      physicalProgress: pct,
      description,
      geoLatitude: geoLat,
      geoLongitude: geoLon,
      photoCount: uploadedPhotos.length,
      issues: issues || undefined,
      weatherCondition: weather,
      milestoneId: selectedMilestoneId,
      milestoneName: matchedMilestone ? matchedMilestone.milestoneName : undefined,
    };
    setLogs(prev => [newLog, ...prev]);
    ToastService.success('Progress log registered with geo-coordinates.');
    setPopup({ mode: 'closed' });
    setWorkId('');
    setSelectedMilestoneId('');
    setProgress('');
    setDescription('');
    setIssues('');
    setUploadedPhotos([]);
  };

  return (
    <FormPage
      title="Progress Monitoring & Field Logs"
      description="Site supervisors update incremental progress with mandatory geo-tagged/time-stamped images and variance notes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Progress Monitoring' },
      ]}
    >
      <div
        style={{
          background: '#f0f9ff',
          border: '1px solid #7dd3fc',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#0c4a6e',
          marginBottom: '1.25rem',
        }}
      >
        <strong>📍 Geo-tagged Inspection Requirement:</strong> Every progress
        update must include GPS Latitude, Longitude, Date & Time Stamp, Device
        Information, and Engineer Name to ensure location authenticity per ERP
        policy.
      </div>

      <FormCard>
        <GridPanel
          data={logs}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workId',
              header: 'Work ID',
              cell: (l: ProgressLog) => {
                const work = civilWorksList.find((w: any) => w.id === l.workId);
                return (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                      fontSize: '0.75rem',
                    }}
                  >
                    {work?.workId ?? l.workId}
                  </span>
                );
              },
            },
            {
              field: 'workName' as any,
              header: 'Work Name',
              cell: (l: ProgressLog) => {
                const work = civilWorksList.find((w: any) => w.id === l.workId);
                return (
                  <span style={{ fontWeight: 600 }}>{work?.name ?? '—'}</span>
                );
              },
            },
            {
              field: 'milestoneName',
              header: 'Milestone Stage',
              cell: (l: ProgressLog) => (
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {l.milestoneName || '—'}
                </span>
              ),
            },
            {
              field: 'category' as any,
              header: 'Work Type',
              cell: (l: ProgressLog) => {
                const work = civilWorksList.find((w: any) => w.id === l.workId);
                return (
                  <span style={{ fontSize: '0.75rem' }}>
                    {work?.category ?? '—'}
                  </span>
                );
              },
            },
            {
              field: 'department' as any,
              header: 'Category',
              cell: (l: ProgressLog) => {
                const work = civilWorksList.find((w: any) => w.id === l.workId);
                return (
                  <span style={{ fontSize: '0.75rem' }}>
                    {work?.department ?? '—'}
                  </span>
                );
              },
            },
            {
              field: 'workBasis' as any,
              header: 'Work Basis',
              cell: (l: ProgressLog) => {
                const work = civilWorksList.find((w: any) => w.id === l.workId);
                return (
                  <span
                    className={`civil-pill ${work?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                    style={{ fontSize: '0.65rem' }}
                  >
                    {work?.workBasis ?? 'SOR Based'}
                  </span>
                );
              },
            },
            { field: 'logDate', header: 'Date' },
            {
              field: 'engineerName',
              header: 'Engineer',
              cell: (l: ProgressLog) => (
                <span style={{ fontSize: '0.75rem' }}>{l.engineerName}</span>
              ),
            },
            {
              field: 'physicalProgress',
              header: 'Progress %',
              cell: (l: ProgressLog) => (
                <div className="civil-progress-bar-wrap">
                  <div className="civil-progress-bar-track">
                    <div
                      className={`civil-progress-bar-fill ${l.physicalProgress >= 75 ? 'high' : l.physicalProgress >= 40 ? 'medium' : 'low'}`}
                      style={{ width: `${l.physicalProgress}%` }}
                    />
                  </div>
                  <span
                    style={{ fontSize: '0.7rem', color: '#6b7280', width: 30 }}
                  >
                    {l.physicalProgress}%
                  </span>
                </div>
              ),
            },
            {
              field: 'geoLatitude',
              header: 'Geo Location',
              cell: (l: ProgressLog) => (
                <span style={{ fontSize: '0.72rem', color: '#2563eb' }}>
                  📍 {l.geoLatitude}, {l.geoLongitude}
                </span>
              ),
            },
            {
              field: 'photoCount',
              header: 'Photos',
              cell: (l: ProgressLog) => <span>📷 {l.photoCount}</span>,
            },
            {
              field: 'weatherCondition',
              header: 'Weather',
              cell: (l: ProgressLog) => (
                <span style={{ fontSize: '0.75rem' }}>
                  {l.weatherCondition}
                </span>
              ),
            },
            {
              field: 'issues',
              header: 'Issues',
              cell: (l: ProgressLog) =>
                l.issues ? (
                  <span
                    className="civil-pill red"
                    style={{ fontSize: '0.65rem' }}
                  >
                    ⚠ {l.issues.substring(0, 25)}...
                  </span>
                ) : (
                  <span className="civil-pill green">None</span>
                ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: ProgressLog) => (
                <Button
                  size="small"
                  label=""
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'view', item })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Log Field Progress"
              icon="map-marker"
              variant="primary"
              onClick={() => {
                 setWorkId('');
                 setSelectedMilestoneId('');
                 setProgress('');
                 setDescription('');
                 setIssues('');
                 setUploadedPhotos([]);
                 setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search logs..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'Log Field Progress Update'
            : `Progress Log — ${popup.item?.logDate}`
        }
        subtitle="Geo-tagged field report with photographic evidence."
        size="lg"
      >
        {popup.mode === 'create' ? (
          <>
            <FormGrid columns={3}>
              <DropDownList
                label="Work *"
                data={WORK_OPTIONS}
                textField={'name' as any}
                optionValue="value"
                value={workId}
                onChange={v => {
                  setWorkId(v as string);
                  setSelectedMilestoneId('');
                  // Update coordinates dynamically on change
                  if (v === '1') {
                    setGeoLat('23.1815');
                    setGeoLon('77.4200');
                  } else if (v === '2') {
                    setGeoLat('23.1750');
                    setGeoLon('77.4120');
                  } else if (v === '3') {
                    setGeoLat('23.1800');
                    setGeoLon('77.4250');
                  }
                }}
              />
              <DropDownList
                label="Select Milestone *"
                data={milestones
                  .filter((m: any) => m.workId === workId)
                  .map((m: any) => ({
                    name: `${m.milestoneName} (Milestone ${m.sequenceNo})`,
                    value: m.id,
                  }))}
                textField="name"
                optionValue="value"
                value={selectedMilestoneId}
                onChange={v => setSelectedMilestoneId(v as string)}
                required
              />
              <TextBox
                label="Physical Progress (%) *"
                placeholder="0–100"
                value={progress}
                onChange={setProgress}
                required
              />
            </FormGrid>

            {selectedMilestoneId && (() => {
              const matchedMilestone = milestones.find((m: any) => m.id === selectedMilestoneId);
              if (!matchedMilestone) return null;
              
              return (
                <div
                  style={{
                    padding: '0.875rem 1.125rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '0.8125rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                    📋 Milestone Target Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem 1rem', color: '#475569' }}>
                    <div>
                      <strong style={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Scope / Description</strong>
                      <span>{matchedMilestone.description || '—'}</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Timeline Dates</strong>
                      <span>📅 {matchedMilestone.plannedStartDate} to {matchedMilestone.plannedEndDate}</span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Quality Test Gate?</strong>
                      <span>{matchedMilestone.qualityTestRequired ? `Yes (${matchedMilestone.testName || 'Required'})` : 'No'}</span>
                    </div>
                    {matchedMilestone.qualityTestRequired && (
                      <div>
                        <strong style={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Test Passed/Cleared?</strong>
                        <span
                          style={{
                            fontWeight: 600,
                            color: matchedMilestone.qualityTestStatus === 'Pass' ? '#16a34a' : '#ef4444',
                          }}
                        >
                          {matchedMilestone.qualityTestStatus === 'Pass' ? '✓ Yes, Passed' : '✗ Pending / Failed'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
            <TextArea
              label="Progress Description *"
              placeholder="Describe work done today, quantities, locations, sections..."
              value={description}
              onChange={setDescription}
              rows={3}
              required
            />
            <FormCard title="🌍 Mandatory Geo-tagging">
              <FormGrid columns={2}>
                 <TextBox
                   label="GPS Latitude *"
                   value={geoLat}
                   disabled
                   required
                 />
                 <TextBox
                   label="GPS Longitude *"
                   value={geoLon}
                   disabled
                   required
                 />
               </FormGrid>
              <FormGrid columns={3}>
                <DropDownList
                  label="Weather Condition"
                  data={[
                    'Clear',
                    'Partly Cloudy',
                    'Overcast',
                    'Rainy',
                    'Heavy Rain',
                  ].map(v => ({ name: v, value: v }))}
                  textField="name"
                  optionValue="value"
                  value={weather}
                  onChange={v => setWeather(v as string)}
                />
                <TextBox
                  label="Calculated Photos Count"
                  value={String(uploadedPhotos.length)}
                  disabled
                />
                <TextBox
                  label="Auto: Date & Time"
                  value={new Date().toLocaleString('en-IN')}
                  onChange={() => {}}
                  disabled
                />
              </FormGrid>

              <div style={{ marginTop: '0.875rem', marginBottom: '0.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.375rem',
                  }}
                >
                  Upload Geo-tagged Photos * (Multiple Files Allowed)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => {
                    const files = e.target.files;
                    if (files) {
                      const fileNames = Array.from(files).map(f => f.name);
                      setUploadedPhotos(prev => {
                        const next = [...prev];
                        fileNames.forEach(name => {
                          if (!next.includes(name)) {
                            next.push(name);
                          }
                        });
                        return next;
                      });
                    }
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    fontSize: '0.8125rem',
                    color: '#4b5563',
                    padding: '0.5rem',
                    background: '#f9fafb',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                  }}
                />
                {uploadedPhotos.length > 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                    Selected files:
                    <div style={{ color: '#475569', fontWeight: 400, marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {uploadedPhotos.map((name, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#f1f5f9',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            border: '1px solid #cbd5e1',
                          }}
                        >
                          {name}
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedPhotos(prev => prev.filter(item => item !== name));
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              padding: '0 2px',
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => setUploadedPhotos([])}
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          borderRadius: '4px',
                          color: '#991b1b',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '0.125rem 0.5rem',
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  background: '#f0f9ff',
                  borderRadius: '0.625rem',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.72rem',
                  color: '#0c4a6e',
                  marginTop: '0.5rem',
                }}
              >
                Auto: Engineer: Er. Rajesh Verma (Logged In) | Device: Chrome
                Browser
              </div>
            </FormCard>
            <TextArea
              label="Issues / Roadblocks (Optional)"
              placeholder="Delays, material shortages, site access problems..."
              value={issues}
              onChange={setIssues}
              rows={2}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Submit Field Progress Log"
                variant="primary"
                icon="map-marker"
                onClick={handleSave}
              />
            </div>
          </>
        ) : (
          popup.item && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem 2rem',
                fontSize: '0.8125rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
              }}
            >
              {[
                 [
                   'Work ID',
                   civilWorks.find(w => w.id === popup.item!.workId)?.workId ??
                     '—',
                 ],
                 ['Milestone Stage', popup.item.milestoneName ?? '—'],
                 ['Log Date', popup.item.logDate],
                 ['Physical Progress', `${popup.item.physicalProgress}%`],
                ['Engineer', popup.item.engineerName],
                [
                  'GPS Location',
                  `${popup.item.geoLatitude}, ${popup.item.geoLongitude}`,
                ],
                ['Photos Uploaded', String(popup.item.photoCount)],
                ['Weather', popup.item.weatherCondition],
                ['Issues', popup.item.issues ?? 'None'],
                ['Description', popup.item.description],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </FormPopup>
    </FormPage>
  );
}
