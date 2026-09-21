import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, FileUpload, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../../civilStorage';
import { initialCivilProjects } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const CAMPUS_OPTIONS = [
  { label: 'Main Campus', value: 1 },
  { label: 'City Campus', value: 2 },
  { label: 'North Campus', value: 3 },
  { label: 'South Campus', value: 4 },
];

export default function ProjectMaster() {
  const [data, setData] = useCivilStorage<CivilManagement.CivilProject[]>(
    CIVIL_STORAGE_KEYS.PROJECTS,
    initialCivilProjects
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.CivilProject;
  }>({ mode: 'closed' });

  const [formDescription, setFormDescription] = useState('');
  const [formCampusId, setFormCampusId] = useState<number>(1);
  const [formLocation, setFormLocation] = useState('');
  const [formDocument, setFormDocument] = useState<File | null>(null);

  const openAdd = () => {
    setFormDescription('');
    setFormCampusId(1);
    setFormLocation('');
    setFormDocument(null);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.CivilProject) => {
    setFormDescription(item.projectDescription || item.name || '');
    setFormCampusId(item.campusId || 1);
    setFormLocation(item.projectLocation || item.location || '');
    setFormDocument(null);
    setPopup({ mode: 'edit', item });
  };

  const handleReset = () => {
    if (popup.mode === 'edit' && popup.item) {
      setFormDescription(
        popup.item.projectDescription || popup.item.name || ''
      );
      setFormCampusId(popup.item.campusId || 1);
      setFormLocation(popup.item.projectLocation || popup.item.location || '');
      setFormDocument(null);
    } else {
      setFormDescription('');
      setFormCampusId(1);
      setFormLocation('');
      setFormDocument(null);
    }
  };

  const handleSave = () => {
    if (!formDescription.trim()) {
      ToastService.error('Project Description is required.');
      return;
    }

    const campusObj =
      CAMPUS_OPTIONS.find(c => c.value === Number(formCampusId)) ||
      CAMPUS_OPTIONS[0];

    if (popup.mode === 'add') {
      const nextId = data.length + 1;
      const newItem: CivilManagement.CivilProject = {
        projectId: nextId,
        id: `PROJ-${String(nextId).padStart(2, '0')}`,
        projectDescription: formDescription.trim(),
        name: formDescription.trim(),
        projectLocation: formLocation.trim() || undefined,
        location: formLocation.trim() || undefined,
        campusId: Number(formCampusId),
        campusName: campusObj.label,
        campus: campusObj.label,
        projectDocument: formDocument ? formDocument.name : undefined,
        isActive: true,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `Project "${newItem.projectDescription}" created successfully.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.projectId === popup.item!.projectId || d.id === popup.item!.id
            ? {
                ...d,
                projectDescription: formDescription.trim(),
                name: formDescription.trim(),
                projectLocation: formLocation.trim() || undefined,
                location: formLocation.trim() || undefined,
                campusId: Number(formCampusId),
                campusName: campusObj.label,
                campus: campusObj.label,
                projectDocument: formDocument
                  ? formDocument.name
                  : d.projectDocument,
              }
            : d
        )
      );
      ToastService.success(`Project updated successfully.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (item: CivilManagement.CivilProject) => {
    setData(prev =>
      prev.map(d => {
        if (d.projectId === item.projectId || d.id === item.id) {
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
      title="Civil Project Master"
      description="Manage civil construction projects linked to university campuses."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'External Masters', to: civilUrls.externalMastersMenu },
        { label: 'Civil Project Master' },
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
          label="Create"
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
              field: 'campusName',
              header: 'Campus Name',
              cell: (item: CivilManagement.CivilProject) => (
                <span style={{ fontWeight: 500 }}>
                  {item.campusName || item.campus || 'Main Campus'}
                </span>
              ),
            },
            {
              field: 'projectDescription',
              header: 'Project Description',
              cell: (item: CivilManagement.CivilProject) => (
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {item.projectDescription || item.name}
                </span>
              ),
            },
            {
              field: 'projectLocation',
              header: 'Project Location',
              cell: (item: CivilManagement.CivilProject) => (
                <span>{item.projectLocation || item.location || 'N/A'}</span>
              ),
            },
            {
              field: 'projectDocument',
              header: 'Project Document',
              cell: (item: CivilManagement.CivilProject) => {
                if (!item.projectDocument) {
                  return <span style={{ color: '#9ca3af' }}>N/A</span>;
                }
                return (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.25rem 0.625rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#1d4ed8',
                      backgroundColor: '#eff6ff',
                      borderRadius: '0.375rem',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    📄 {item.projectDocument}
                  </span>
                );
              },
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.CivilProject) => (
                <button
                  type="button"
                  onClick={() => toggleStatus(item)}
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
              field: 'projectId',
              header: 'Action',
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
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search projects..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={popup.mode === 'add' ? 'Create Project' : 'Edit Project'}
        subtitle={
          popup.mode === 'add'
            ? 'Fill in the details to add a new civil project.'
            : 'Update the civil project details.'
        }
        size="lg"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem',
            }}
          >
            <DropDownList
              label="University Campus"
              data={CAMPUS_OPTIONS}
              textField="label"
              optionValue="value"
              value={formCampusId}
              onChange={val => setFormCampusId(Number(val))}
              required
            />
            <TextBox
              label="Project Description"
              placeholder="Enter Project Description (e.g. Block A Construction)"
              value={formDescription}
              onChange={setFormDescription}
              required
            />
            <TextBox
              label="Project Location"
              placeholder="Enter Location / Address"
              value={formLocation}
              onChange={setFormLocation}
            />
          </div>

          <FileUpload
            label="Project Document"
            accept=".pdf,.png,.jpg,.jpeg,image/*"
            mode="file"
            uploadNote="Upload project document (.pdf, .png, .jpg, .jpeg)"
            value={formDocument}
            onChange={file => setFormDocument(file)}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Reset"
              icon="times"
              variant="outlined"
              onClick={handleReset}
            />
            <Button
              label="Save"
              variant="primary"
              icon="save"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
