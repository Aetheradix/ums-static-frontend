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
import { initialMandateDocuments, initialWorkCategories } from '../../../mocks';
import { civilUrls } from '../../../urls';
import '../../civil.css';

const STORAGE_DOCS = 'civil_mandate_documents';
const STORAGE_CATS = 'civil_work_categories';

export default function MandateDocumentMaster() {
  const [categories] = useState<CivilManagement.WorkCategoryMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_CATS);
    return saved ? JSON.parse(saved) : initialWorkCategories;
  });

  const [data, setData] = useState<CivilManagement.MandateDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_DOCS);
    return saved ? JSON.parse(saved) : initialMandateDocuments;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit';
    item?: CivilManagement.MandateDocument;
  }>({ mode: 'closed' });

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formMandatory, setFormMandatory] = useState(true);
  const [formMaxMB, setFormMaxMB] = useState('10');
  const [formFormats, setFormFormats] = useState('pdf');
  const [formCategories, setFormCategories] = useState<string[]>([]);
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_DOCS, JSON.stringify(data));
  }, [data]);

  const openAdd = () => {
    setFormName('');
    setFormDesc('');
    setFormMandatory(true);
    setFormMaxMB('10');
    setFormFormats('pdf');
    setFormCategories(categories.map(c => c.id));
    setFormActive(true);
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.MandateDocument) => {
    setFormName(item.name);
    setFormDesc(item.description);
    setFormMandatory(item.isMandatory);
    setFormMaxMB(item.maxFileSizeMB.toString());
    setFormFormats(item.allowedFormats.join(', '));
    setFormCategories(item.applicableCategories || []);
    setFormActive(item.isActive);
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (!formName.trim()) {
      ToastService.error('Document Name is required.');
      return;
    }

    const maxMbParsed = parseInt(formMaxMB, 10) || 10;
    const formatArr = formFormats
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    if (popup.mode === 'add') {
      const newItem: CivilManagement.MandateDocument = {
        id: `MD-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        description: formDesc.trim(),
        applicableCategories: formCategories,
        isMandatory: formMandatory,
        maxFileSizeMB: maxMbParsed,
        allowedFormats: formatArr.length > 0 ? formatArr : ['pdf'],
        isActive: formActive,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Mandate Document "${newItem.name}" added.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                name: formName.trim(),
                description: formDesc.trim(),
                applicableCategories: formCategories,
                isMandatory: formMandatory,
                maxFileSizeMB: maxMbParsed,
                allowedFormats: formatArr.length > 0 ? formatArr : ['pdf'],
                isActive: formActive,
              }
            : d
        )
      );
      ToastService.success(`Mandate Document updated.`);
    }
    setPopup({ mode: 'closed' });
  };

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(d => {
        if (d.id === id) {
          const next = !d.isActive;
          ToastService.info(
            `Document rule ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  const toggleCategorySelection = (catId: string) => {
    setFormCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  return (
    <FormPage
      title="Mandate Document Master"
      description="Define mandatory statutory clearance, technical drawings, and verification documents required during Work Registration."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Masters' },
        { label: 'Mandate Document' },
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
          label="Add Mandate Document"
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
              field: 'name',
              header: 'Document Requirement',
              cell: (item: CivilManagement.MandateDocument) => (
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
              field: 'isMandatory',
              header: 'Mandatory?',
              cell: (item: CivilManagement.MandateDocument) => (
                <span
                  className={`civil-pill ${item.isMandatory ? 'red' : 'gray'}`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {item.isMandatory ? 'Mandatory' : 'Optional'}
                </span>
              ),
            },
            {
              field: 'allowedFormats',
              header: 'Upload Constraints',
              cell: (item: CivilManagement.MandateDocument) => (
                <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                  <span>Max: {item.maxFileSizeMB} MB</span>
                  <div style={{ color: '#6b7280', marginTop: '2px' }}>
                    Formats: {item.allowedFormats.join(', ').toUpperCase()}
                  </div>
                </div>
              ),
            },
            {
              field: 'applicableCategories',
              header: 'Applicable Categories',
              cell: (item: CivilManagement.MandateDocument) => (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.25rem',
                    maxWidth: '240px',
                  }}
                >
                  {item.applicableCategories?.map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    return (
                      <span
                        key={catId}
                        className="civil-pill blue"
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.4rem',
                        }}
                      >
                        {cat?.code || catId}
                      </span>
                    );
                  })}
                </div>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              cell: (item: CivilManagement.MandateDocument) => (
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title="Click to toggle status"
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
              cell: (item: CivilManagement.MandateDocument) => (
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
          searchPlaceholder="Search document requirements..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'add'
            ? 'Add Mandate Document Rule'
            : 'Edit Mandate Document Rule'
        }
        subtitle="Specify document required during civil work registration."
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
            label="Document Title / Requirement Name"
            placeholder="e.g. Detailed Estimate & Preliminary Survey Report"
            value={formName}
            onChange={setFormName}
            required
          />
          <TextArea
            label="Instructions for Uploading Engineer"
            placeholder="Specify what should be contained in this document..."
            value={formDesc}
            onChange={setFormDesc}
            rows={2}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
            }}
          >
            <DropDownList
              label="Requirement Type"
              data={[
                { label: 'Mandatory (Blocks Submission)', value: 'true' },
                { label: 'Optional (Recommended)', value: 'false' },
              ]}
              textField="label"
              optionValue="value"
              value={formMandatory ? 'true' : 'false'}
              onChange={val => setFormMandatory(val === 'true')}
            />
            <TextBox
              label="Max File Size (MB)"
              placeholder="10"
              value={formMaxMB}
              onChange={setFormMaxMB}
            />
            <TextBox
              label="Allowed Formats"
              placeholder="pdf, jpg, png"
              value={formFormats}
              onChange={setFormFormats}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#374151',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Applicable Work Categories:
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
              }}
            >
              {categories.map(cat => {
                const checked = formCategories.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: checked
                        ? '1px solid #3b82f6'
                        : '1px solid #e5e7eb',
                      background: checked ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategorySelection(cat.id)}
                    />
                    <span>
                      <strong>{cat.code}</strong> — {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <DropDownList
            label="Status"
            data={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
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
              label={
                popup.mode === 'add' ? 'Create Requirement' : 'Save Changes'
              }
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
