import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../../civilStorage';
import { initialCivilProjects } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_PROJECTS = CIVIL_STORAGE_KEYS.PROJECTS;

export default function ProjectMaster() {
  const [data, setData] = useState<CivilManagement.CivilProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_PROJECTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Normalize if old schema
        return parsed.map((p: any) => ({
          id: p.id || `PROJ-${Math.random().toString(36).substring(2, 6)}`,
          name: p.name || p.area || 'Untitled Project',
          description: p.description || p.location || '',
          campus: p.campus || 'Main Campus',
          location: p.location || '',
          isActive: p.isActive !== false,
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return initialCivilProjects;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.CivilProject;
  }>({ mode: 'closed' });

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCampus, setFormCampus] = useState('Main Campus');
  const [formLocation, setFormLocation] = useState('');
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    civilStorage.set(STORAGE_PROJECTS, data);
  }, [data]);

  const openAdd = () => {
    setFormName('');
    setFormDesc('');
    setFormCampus('Main Campus');
    setFormLocation('');
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.CivilProject) => {
    setFormName(item.name);
    setFormDesc(item.description);
    setFormCampus(item.campus);
    setFormLocation(item.location);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formName.trim() || !formLocation.trim()) {
      ToastService.error('Project Name and Location are required.');
      return;
    }

    if (popup.mode === 'add') {
      const newItem: CivilManagement.CivilProject = {
        id: `PROJ-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        description: formDesc.trim(),
        campus: formCampus,
        location: formLocation.trim(),
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Project "${newItem.name}" created successfully.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                name: formName.trim(),
                description: formDesc.trim(),
                campus: formCampus,
                location: formLocation.trim(),
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`Project updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(`Project ${next ? 'Activated' : 'Deactivated'}.`);
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Project Master"
      description="Define civil infrastructure master projects, development zones, and strategic university campus schemes."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'Project Master' },
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem',
        }}
      >
        <Button
          label="Add New Project"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'id',
              header: 'Project Code',
              cell: (item: CivilManagement.CivilProject) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {item.id}
                </span>
              ),
            },
            {
              field: 'name',
              header: 'Project Scheme / Name',
              cell: (item: CivilManagement.CivilProject) => (
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              ),
            },
            {
              field: 'campus',
              header: 'Campus & Location',
              cell: (item: CivilManagement.CivilProject) => (
                <div>
                  <span
                    className="civil-pill blue"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {item.campus}
                  </span>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#4b5563',
                      marginTop: '2px',
                    }}
                  >
                    {item.location}
                  </div>
                </div>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.CivilProject) => (
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Click to toggle active status"
                >
                  <StatusBadge
                    label={item.isActive ? 'Active' : 'Inactive'}
                    variant={item.isActive ? 'success' : 'neutral'}
                  />
                </button>
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.CivilProject) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => openEdit(item)}
                  />
                  <Button
                    size="small"
                    label=""
                    icon={item.isActive ? 'lock' : 'unlock'}
                    variant="outlined"
                    onClick={() => toggleStatus(item.id)}
                  />
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search projects by name, code or campus..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add' ? 'Add Civil Project' : 'Edit Civil Project'
        }
        subtitle="Establish top-level development scheme under which individual works are registered."
        size="lg"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <TextBox
            label="Project Scheme Name"
            placeholder="e.g. Science Complex Development Phase II"
            value={formName}
            onChange={setFormName}
            required
          />
          <TextArea
            label="Project Scope & Description"
            placeholder="Detailed description of works encompassed under this scheme..."
            value={formDesc}
            onChange={setFormDesc}
            rows={3}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <DropDownList
              label="Campus"
              data={[
                { label: 'Main Campus', value: 'Main Campus' },
                { label: 'City Campus', value: 'City Campus' },
                { label: 'North Campus', value: 'North Campus' },
                { label: 'South Campus', value: 'South Campus' },
              ]}
              textField="label"
              optionValue="value"
              value={formCampus}
              onChange={val => setFormCampus(val as string)}
              required
            />
            <TextBox
              label="Site Location / Zone"
              placeholder="e.g. North Sector – Academic Zone Plot 12"
              value={formLocation}
              onChange={setFormLocation}
              required
            />
          </div>
          <DropDownList
            label="Status"
            data={[
              { label: 'Active (Works can be registered)', value: 'true' },
              { label: 'Inactive (Registration suspended)', value: 'false' },
            ]}
            textField="label"
            optionValue="value"
            value={formActive ? 'true' : 'false'}
            onChange={val => setFormActive(val === 'true')}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label={popup.mode === 'add' ? 'Create Project' : 'Save Changes'}
              variant="primary"
              icon="check"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
