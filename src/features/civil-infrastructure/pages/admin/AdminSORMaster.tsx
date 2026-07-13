import { useEffect, useState } from 'react';
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
  type LabAgency,
  type TPIAgency,
  initialLabAgencies,
  initialTPIAgencies,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const initialNewSorData = [
  {
    id: '1',
    sorTypeCode: 'ROAD',
    chapterNo: 'Ch-1',
    subjectName: 'Excavation in ordinary soil',
    pageNo: '12',
    subTitle: 'Section A - Soil Excavation',
    serialNo: '1.1',
    serialNoDesc: 'Excavation for road foundation',
    workDesc: 'Excavation in ordinary soil up to 1.5m depth including dressing and disposal.',
    cementBags: '0',
    unit: 'Cum',
    rate: '450',
    effectiveDate: '2026-04-01',
    rateSet: true,
    percentage: '12',
  },
  {
    id: '2',
    sorTypeCode: 'BLDG',
    chapterNo: 'Ch-1',
    subjectName: 'M25 Grade Reinforcement Concrete',
    pageNo: '45',
    subTitle: 'Section C - Concrete works',
    serialNo: '3.4',
    serialNoDesc: 'RCC columns and beam structure',
    workDesc: 'Providing and laying M25 grade concrete including curing, testing, and shuttering.',
    cementBags: '6.2',
    unit: 'Cum',
    rate: '1200',
    effectiveDate: '2026-05-15',
    rateSet: false,
    percentage: '',
  },
];

const EMPTY_SOR: any = {
  sorTypeCode: '',
  chapterNo: '',
  subjectName: '',
  pageNo: '',
  subTitle: '',
  serialNo: '',
  serialNoDesc: '',
  workDesc: '',
  cementBags: '',
  unit: '',
  rate: '',
  effectiveDate: '',
  rateSet: false,
  percentage: '',
};

const EMPTY_TPI: Partial<TPIAgency> = {
  id: '',
  name: '',
  contactPerson: '',
  email: '',
  mobile: '',
  licenseNo: '',
  address: '',
  status: 'Active',
};

const EMPTY_LAB: Partial<LabAgency> = {
  id: '',
  name: '',
  contactPerson: '',
  email: '',
  mobile: '',
  nablAccreditation: '',
  scopeOfTesting: '',
  address: '',
  status: 'Active',
};

const initialSorTypes = [
  { id: 'T1', code: 'ROAD', type: 'Roads & Highways', description: 'Schedule of rates for construction and maintenance of roads and highways.' },
  { id: 'T2', code: 'BLDG', type: 'Buildings & Structures', description: 'Schedule of rates for residential, commercial, and institutional building works.' },
  { id: 'T3', code: 'ELEC', type: 'Electrical Works', description: 'Schedule of rates for internal and external electrical installations.' },
];

const initialSorChapters = [
  { id: 'C1', sorTypeCode: 'ROAD', chapterNo: 'Ch-1', chapterDesc: 'Earthwork and Site Clearance' },
  { id: 'C2', sorTypeCode: 'ROAD', chapterNo: 'Ch-2', chapterDesc: 'Sub-base and Base Courses' },
  { id: 'C3', sorTypeCode: 'BLDG', chapterNo: 'Ch-1', chapterDesc: 'Concrete and RCC Works' },
  { id: 'C4', sorTypeCode: 'BLDG', chapterNo: 'Ch-2', chapterDesc: 'Brick Masonry and Plastering' },
  { id: 'C5', sorTypeCode: 'ELEC', chapterNo: 'Ch-1', chapterDesc: 'Wiring and Conduit Installation' },
];

const initialSorSubjects = [
  { id: 'S1', sorTypeCode: 'ROAD', chapterNo: 'Ch-1', chapterDesc: 'Earthwork and Site Clearance', subjectName: 'Excavation in ordinary soil', subjectDesc: 'Excavation in ordinary soil up to 1.5m depth including dressing and disposal.', refIsCode: 'IS 1200 Part 1', newPara: 'Para 3.1.2' },
  { id: 'S2', sorTypeCode: 'BLDG', chapterNo: 'Ch-1', chapterDesc: 'Concrete and RCC Works', subjectName: 'M25 Grade Reinforcement Concrete', subjectDesc: 'Providing and laying M25 grade concrete including curing, testing, and shuttering.', refIsCode: 'IS 456:2000', newPara: 'Para 5.4' },
];

const initialSorUnits = [
  { id: 'U1', name: 'Cum', description: 'Cubic Meter - unit of volume measurement' },
  { id: 'U2', name: 'Sqm', description: 'Square Meter - unit of area measurement' },
  { id: 'U3', name: 'Kg', description: 'Kilogram - unit of mass/weight measurement' },
  { id: 'U4', name: 'Rmt', description: 'Running Meter - unit of length measurement' },
];

const initialProjects = [
  { id: 'P1', area: 'Academic Block-3 Construction', campus: 'Main Campus', location: 'Behind Central Library, adjacent to block-2' },
  { id: 'P2', area: 'Hostel Ground leveling', campus: 'South Campus', location: 'Sports complex parking annex' },
  { id: 'P3', area: 'Electrical substation wiring', campus: 'North Campus', location: 'Utility zone near north gate' },
];

export default function AdminSORMaster() {
  const [activeTab, setActiveTab] = useState<'SOR_TYPE' | 'SOR_CHAPTER' | 'SOR_SUBJECT' | 'UNIT' | 'SOR' | 'TPI' | 'LAB' | 'PROJECT'>('SOR_TYPE');

  // SOR Type State
  const [sorTypes, setSorTypes] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_sor_types');
    return saved ? JSON.parse(saved) : initialSorTypes;
  });
  const [sorTypePopup, setSorTypePopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [sorTypeForm, setSorTypeForm] = useState<any>({
    code: '',
    type: '',
    description: '',
  });

  // SOR Chapter State
  const [sorChapters, setSorChapters] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_sor_chapters');
    return saved ? JSON.parse(saved) : initialSorChapters;
  });
  const [sorChapterPopup, setSorChapterPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [sorChapterForm, setSorChapterForm] = useState<any>({
    sorTypeCode: '',
    chapterNo: '',
    chapterDesc: '',
  });

  // SOR Subject State
  const [sorSubjects, setSorSubjects] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_sor_subjects');
    return saved ? JSON.parse(saved) : initialSorSubjects;
  });
  const [sorSubjectPopup, setSorSubjectPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [sorSubjectForm, setSorSubjectForm] = useState<any>({
    sorTypeCode: '',
    chapterNo: '',
    chapterDesc: '',
    subjectName: '',
    subjectDesc: '',
    refIsCode: '',
    newPara: '',
  });

  // SOR Unit State
  const [sorUnits, setSorUnits] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_sor_units');
    return saved ? JSON.parse(saved) : initialSorUnits;
  });
  const [sorUnitPopup, setSorUnitPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [sorUnitForm, setSorUnitForm] = useState<any>({
    name: '',
    description: '',
  });

  // SOR State
  const [sorData, setSorData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_sor_items_v2');
    return saved ? JSON.parse(saved) : initialNewSorData;
  });
  const [sorPopup, setSorPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [sorForm, setSorForm] = useState<any>(EMPTY_SOR);

  // TPI State
  const [tpiData, setTpiData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_tpi_agencies');
    return saved ? JSON.parse(saved) : initialTPIAgencies;
  });
  const [tpiPopup, setTpiPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [tpiForm, setTpiForm] = useState<Partial<TPIAgency>>(EMPTY_TPI);

  // LAB State
  const [labData, setLabData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_lab_agencies');
    return saved ? JSON.parse(saved) : initialLabAgencies;
  });
  const [labPopup, setLabPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [labForm, setLabForm] = useState<Partial<LabAgency>>(EMPTY_LAB);

  // Project Master State
  const [projects, setProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const [projectPopup, setProjectPopup] = useState<{
    mode: 'closed' | 'create' | 'edit';
    item?: any;
  }>({ mode: 'closed' });
  const [projectForm, setProjectForm] = useState<any>({
    area: '',
    campus: 'Main Campus',
    location: '',
  });

  // Persists
  useEffect(() => {
    localStorage.setItem('civil_sor_types', JSON.stringify(sorTypes));
  }, [sorTypes]);

  useEffect(() => {
    localStorage.setItem('civil_sor_chapters', JSON.stringify(sorChapters));
  }, [sorChapters]);

  useEffect(() => {
    localStorage.setItem('civil_sor_subjects', JSON.stringify(sorSubjects));
  }, [sorSubjects]);

  useEffect(() => {
    localStorage.setItem('civil_sor_units', JSON.stringify(sorUnits));
  }, [sorUnits]);

  useEffect(() => {
    localStorage.setItem('civil_sor_items_v2', JSON.stringify(sorData));
  }, [sorData]);

  useEffect(() => {
    localStorage.setItem('civil_tpi_agencies', JSON.stringify(tpiData));
  }, [tpiData]);

  useEffect(() => {
    localStorage.setItem('civil_lab_agencies', JSON.stringify(labData));
  }, [labData]);

  useEffect(() => {
    localStorage.setItem('civil_projects', JSON.stringify(projects));
  }, [projects]);

  // SOR Type Actions
  const handleSaveSorType = () => {
    if (!sorTypeForm.code) {
      ToastService.error('SOR Type Code is required.');
      return;
    }
    if (!sorTypeForm.type) {
      ToastService.error('SOR Type is required.');
      return;
    }
    if (!sorTypeForm.description) {
      ToastService.error('Description is required.');
      return;
    }

    if (sorTypePopup.mode === 'create') {
      if (
        sorTypes.some(d => d.code.toLowerCase() === sorTypeForm.code.toLowerCase())
      ) {
        ToastService.error(`SOR Type with code ${sorTypeForm.code} already exists.`);
        return;
      }
      const newItem = { ...sorTypeForm, id: `T-${Date.now()}` };
      setSorTypes(prev => [newItem, ...prev]);
      ToastService.success('New SOR Type added successfully.');
    } else {
      setSorTypes(prev =>
        prev.map(d => (d.id === sorTypePopup.item.id ? { ...d, ...sorTypeForm } : d))
      );
      ToastService.success('SOR Type updated successfully.');
    }
    setSorTypePopup({ mode: 'closed' });
    setSorTypeForm({ code: '', type: '', description: '' });
  };

  // SOR Chapter Actions
  const handleSaveSorChapter = () => {
    if (!sorChapterForm.sorTypeCode) {
      ToastService.error('SOR Type is required.');
      return;
    }
    if (!sorChapterForm.chapterNo) {
      ToastService.error('Chapter No is required.');
      return;
    }
    if (!sorChapterForm.chapterDesc) {
      ToastService.error('Chapter Description is required.');
      return;
    }

    if (sorChapterPopup.mode === 'create') {
      if (
        sorChapters.some(
          d =>
            d.sorTypeCode === sorChapterForm.sorTypeCode &&
            d.chapterNo.toLowerCase() === sorChapterForm.chapterNo.toLowerCase()
        )
      ) {
        ToastService.error(`Chapter ${sorChapterForm.chapterNo} already exists for selected SOR Type.`);
        return;
      }
      const newItem = { ...sorChapterForm, id: `C-${Date.now()}` };
      setSorChapters(prev => [newItem, ...prev]);
      ToastService.success('New SOR Chapter added successfully.');
    } else {
      setSorChapters(prev =>
        prev.map(d => (d.id === sorChapterPopup.item.id ? { ...d, ...sorChapterForm } : d))
      );
      ToastService.success('SOR Chapter updated successfully.');
    }
    setSorChapterPopup({ mode: 'closed' });
    setSorChapterForm({ sorTypeCode: '', chapterNo: '', chapterDesc: '' });
  };

  // SOR Subject Actions
  const handleSaveSorSubject = () => {
    if (!sorSubjectForm.sorTypeCode) {
      ToastService.error('SOR Type is required.');
      return;
    }
    if (!sorSubjectForm.chapterNo) {
      ToastService.error('Chapter No is required.');
      return;
    }
    if (!sorSubjectForm.subjectName) {
      ToastService.error('Subject Name is required.');
      return;
    }

    if (sorSubjectPopup.mode === 'create') {
      const newItem = { ...sorSubjectForm, id: `S-${Date.now()}` };
      setSorSubjects(prev => [newItem, ...prev]);
      ToastService.success('New SOR Subject details added successfully.');
    } else {
      setSorSubjects(prev =>
        prev.map(d => (d.id === sorSubjectPopup.item.id ? { ...d, ...sorSubjectForm } : d))
      );
      ToastService.success('SOR Subject details updated successfully.');
    }
    setSorSubjectPopup({ mode: 'closed' });
    setSorSubjectForm({
      sorTypeCode: '',
      chapterNo: '',
      chapterDesc: '',
      subjectName: '',
      subjectDesc: '',
      refIsCode: '',
      newPara: '',
    });
  };

  // SOR Unit Actions
  const handleSaveSorUnit = () => {
    if (!sorUnitForm.name) {
      ToastService.error('Unit Name is required.');
      return;
    }

    if (sorUnitPopup.mode === 'create') {
      if (
        sorUnits.some(d => d.name.toLowerCase() === sorUnitForm.name.toLowerCase())
      ) {
        ToastService.error(`Unit with name ${sorUnitForm.name} already exists.`);
        return;
      }
      const newItem = { ...sorUnitForm, id: `U-${Date.now()}` };
      setSorUnits(prev => [newItem, ...prev]);
      ToastService.success('New Unit added successfully.');
    } else {
      setSorUnits(prev =>
        prev.map(d => (d.id === sorUnitPopup.item.id ? { ...d, ...sorUnitForm } : d))
      );
      ToastService.success('Unit updated successfully.');
    }
    setSorUnitPopup({ mode: 'closed' });
    setSorUnitForm({ name: '', description: '' });
  };

  // Project Actions
  const handleSaveProject = () => {
    if (!projectForm.area) {
      ToastService.error('Project Area is required.');
      return;
    }
    if (!projectForm.campus) {
      ToastService.error('Campus is required.');
      return;
    }

    if (projectPopup.mode === 'create') {
      const newItem = { ...projectForm, id: `P-${Date.now()}` };
      setProjects(prev => [newItem, ...prev]);
      ToastService.success('New Project added successfully.');
    } else {
      setProjects(prev =>
        prev.map(d => (d.id === projectPopup.item.id ? { ...d, ...projectForm } : d))
      );
      ToastService.success('Project updated successfully.');
    }
    setProjectPopup({ mode: 'closed' });
    setProjectForm({ area: '', campus: 'Main Campus', location: '' });
  };

  // SOR Actions
  const handleSaveSor = () => {
    if (!sorForm.sorTypeCode) {
      ToastService.error('SOR Type is required.');
      return;
    }
    if (!sorForm.chapterNo) {
      ToastService.error('Chapter No is required.');
      return;
    }
    if (!sorForm.subjectName) {
      ToastService.error('Subject Name is required.');
      return;
    }
    if (!sorForm.serialNo) {
      ToastService.error('Serial No is required.');
      return;
    }
    if (!sorForm.workDesc) {
      ToastService.error('Work Description is required.');
      return;
    }
    if (!sorForm.unit) {
      ToastService.error('Unit is required.');
      return;
    }
    if (!sorForm.rate) {
      ToastService.error('Rate is required.');
      return;
    }
    if (!sorForm.effectiveDate) {
      ToastService.error('Effective Date is required.');
      return;
    }

    if (sorPopup.mode === 'create') {
      const newItem = { ...sorForm, id: String(Date.now()) };
      setSorData(prev => [newItem, ...prev]);
      ToastService.success('New SOR Item added to government master registry.');
    } else {
      setSorData(prev =>
        prev.map(d => (d.id === sorPopup.item!.id ? { ...d, ...sorForm } : d))
      );
      ToastService.success('SOR Item updated successfully.');
    }
    setSorPopup({ mode: 'closed' });
    setSorForm(EMPTY_SOR);
  };

  // TPI Actions
  const handleSaveTpi = () => {
    if (!tpiForm.name) {
      ToastService.error('Agency Name is required.');
      return;
    }
    if (!tpiForm.licenseNo) {
      ToastService.error('License / Registration No is required.');
      return;
    }
    if (!tpiForm.contactPerson) {
      ToastService.error('Contact Person is required.');
      return;
    }

    if (tpiPopup.mode === 'create') {
      const newId = `TPI-${String(tpiData.length + 1).padStart(2, '0')}`;
      const newItem = { ...tpiForm, id: newId };
      setTpiData(prev => [...prev, newItem]);
      ToastService.success('New Third-Party Inspection Agency added.');
    } else {
      setTpiData(prev =>
        prev.map(d => (d.id === tpiPopup.item!.id ? { ...d, ...tpiForm } : d))
      );
      ToastService.success('TPI Agency updated successfully.');
    }
    setTpiPopup({ mode: 'closed' });
    setTpiForm(EMPTY_TPI);
  };

  // LAB Actions
  const handleSaveLab = () => {
    if (!labForm.name) {
      ToastService.error('Lab Name is required.');
      return;
    }
    if (!labForm.nablAccreditation) {
      ToastService.error('NABL Accreditation No is required.');
      return;
    }
    if (!labForm.contactPerson) {
      ToastService.error('Contact Person is required.');
      return;
    }

    if (labPopup.mode === 'create') {
      const newId = `LAB-${String(labData.length + 1).padStart(2, '0')}`;
      const newItem = { ...labForm, id: newId };
      setLabData(prev => [...prev, newItem]);
      ToastService.success('New Quality Lab Testing Agency added.');
    } else {
      setLabData(prev =>
        prev.map(d => (d.id === labPopup.item!.id ? { ...d, ...labForm } : d))
      );
      ToastService.success('Quality Lab Testing Agency updated.');
    }
    setLabPopup({ mode: 'closed' });
    setLabForm(EMPTY_LAB);
  };

  return (
    <FormPage
      title="Admin Master Registries"
      description="Manage Schedule of Rates (SOR), Third-Party Inspection (TPI) agencies, and accredited Quality Testing Labs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Master Registries' },
      ]}
    >
      {/* Premium Master Tiles Selection */}
      <div
        className="civil-stats-grid"
        style={{
          marginBottom: '1.5rem',
          cursor: 'pointer',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        }}
      >
        {[
          {
            key: 'SOR_TYPE',
            label: 'SOR Type Master',
            count: sorTypes.length,
            icon: 'tag',
            desc: 'SOR Category Types',
            color: '#0891b2',
            bg: activeTab === 'SOR_TYPE' ? '#ecfeff' : '#ffffff',
            border:
              activeTab === 'SOR_TYPE' ? '2px solid #0891b2' : '1px solid #e5e7eb',
          },
          {
            key: 'SOR_CHAPTER',
            label: 'SOR Chapter Master',
            count: sorChapters.length,
            icon: 'bookmark',
            desc: 'Chapters inside SOR Types',
            color: '#ea580c',
            bg: activeTab === 'SOR_CHAPTER' ? '#fff7ed' : '#ffffff',
            border:
              activeTab === 'SOR_CHAPTER' ? '2px solid #ea580c' : '1px solid #e5e7eb',
          },
          {
            key: 'SOR_SUBJECT',
            label: 'SOR Subject Master',
            count: sorSubjects.length,
            icon: 'book',
            desc: 'Subject and reference codes',
            color: '#db2777',
            bg: activeTab === 'SOR_SUBJECT' ? '#fdf2f8' : '#ffffff',
            border:
              activeTab === 'SOR_SUBJECT' ? '2px solid #db2777' : '1px solid #e5e7eb',
          },
          {
            key: 'UNIT',
            label: 'Unit Master',
            count: sorUnits.length,
            icon: 'box',
            desc: 'Measurement Units baseline',
            color: '#10b981',
            bg: activeTab === 'UNIT' ? '#ecfdf5' : '#ffffff',
            border:
              activeTab === 'UNIT' ? '2px solid #10b981' : '1px solid #e5e7eb',
          },
          {
            key: 'SOR',
            label: 'SOR Master',
            count: sorData.length,
            icon: 'list',
            desc: 'Government Schedule of Rates',
            color: '#0f766e',
            bg: activeTab === 'SOR' ? '#ccfbf1' : '#ffffff',
            border:
              activeTab === 'SOR' ? '2px solid #0f766e' : '1px solid #e5e7eb',
          },
          {
            key: 'TPI',
            label: 'Quality Agencies',
            count: tpiData.length,
            icon: 'verified-user',
            desc: 'Third Party Inspection',
            color: '#1d4ed8',
            bg: activeTab === 'TPI' ? '#dbeafe' : '#ffffff',
            border:
              activeTab === 'TPI' ? '2px solid #1d4ed8' : '1px solid #e5e7eb',
          },
          {
            key: 'LAB',
            label: 'Quality Testing Labs',
            count: labData.length,
            icon: 'map',
            desc: 'Accredited testing facilities',
            color: '#7c3aed',
            bg: activeTab === 'LAB' ? '#ede9fe' : '#ffffff',
            border:
              activeTab === 'LAB' ? '2px solid #7c3aed' : '1px solid #e5e7eb',
          },
          {
            key: 'PROJECT',
            label: 'Project Master',
            count: projects.length,
            icon: 'briefcase',
            desc: 'Infrastructure projects list',
            color: '#dc2626',
            bg: activeTab === 'PROJECT' ? '#fef2f2' : '#ffffff',
            border:
              activeTab === 'PROJECT' ? '2px solid #dc2626' : '1px solid #e5e7eb',
          },
        ].map(t => (
          <div
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              background: t.bg,
              border: t.border,
              borderRadius: '0.875rem',
              padding: '1.25rem',
              transition: 'all 0.2s',
              boxShadow:
                activeTab === t.key
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                  : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                }}
              >
                {t.desc}
              </div>
              <i
                className={`pi pi-${t.icon}`}
                style={{ color: t.color, fontSize: '1.25rem' }}
              />
            </div>
            <div
              style={{ fontSize: '1.5rem', fontWeight: 800, color: t.color }}
            >
              {t.label}
            </div>
            <div
              style={{
                fontSize: '0.8125rem',
                color: '#4b5563',
                marginTop: '0.25rem',
                fontWeight: 600,
              }}
            >
              Total Registered: {t.count}
            </div>
          </div>
        ))}
      </div>

      {/* SOR Type Registry View */}
      {activeTab === 'SOR_TYPE' && (
        <FormCard
          title="SOR Type Master"
          subtitle="Define high-level Schedule of Rates categories (e.g. Roads, Buildings, Electrical)."
        >
          <GridPanel
            data={sorTypes}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'code',
                header: 'SOR Type Code',
                cell: (s: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#0891b2',
                    }}
                  >
                    {s.code}
                  </span>
                ),
              },
              {
                field: 'type',
                header: 'SOR Type',
                cell: (s: any) => (
                  <span style={{ fontWeight: 600 }}>{s.type}</span>
                ),
              },
              {
                field: 'description',
                header: 'Description',
                cell: (s: any) => <span>{s.description}</span>,
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setSorTypeForm(item);
                      setSorTypePopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add SOR Type"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setSorTypeForm({ code: '', type: '', description: '' });
                  setSorTypePopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search SOR types..."
          />
        </FormCard>
      )}

      {/* SOR Chapter Registry View */}
      {activeTab === 'SOR_CHAPTER' && (
        <FormCard
          title="SOR Chapter Master"
          subtitle="Manage SOR chapters organized under defined SOR Types."
        >
          <GridPanel
            data={sorChapters}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'sorTypeCode',
                header: 'SOR Type Code',
                cell: (s: any) => (
                  <span
                    className="civil-pill cyan"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {s.sorTypeCode}
                  </span>
                ),
              },
              {
                field: 'chapterNo',
                header: 'Chapter No.',
                cell: (s: any) => (
                  <span style={{ fontWeight: 700 }}>{s.chapterNo}</span>
                ),
              },
              {
                field: 'chapterDesc',
                header: 'Chapter Description',
                cell: (s: any) => <span>{s.chapterDesc}</span>,
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setSorChapterForm(item);
                      setSorChapterPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add SOR Chapter"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setSorChapterForm({
                    sorTypeCode: sorTypes[0]?.code ?? '',
                    chapterNo: '',
                    chapterDesc: '',
                  });
                  setSorChapterPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search chapters..."
          />
        </FormCard>
      )}

      {/* SOR Subject Registry View */}
      {activeTab === 'SOR_SUBJECT' && (
        <FormCard
          title="SOR Subject Master"
          subtitle="Configure engineering subject items, standard references, and guidelines."
        >
          <GridPanel
            data={sorSubjects}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'sorTypeCode',
                header: 'SOR Type',
                cell: (s: any) => (
                  <span
                    className="civil-pill cyan"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {s.sorTypeCode}
                  </span>
                ),
              },
              {
                field: 'chapterNo',
                header: 'Chapter No',
                cell: (s: any) => (
                  <span style={{ fontWeight: 700 }}>{s.chapterNo}</span>
                ),
              },
              {
                field: 'chapterDesc',
                header: 'Chapter Description',
                cell: (s: any) => <span>{s.chapterDesc}</span>,
              },
              {
                field: 'subjectName',
                header: 'Subject Name',
                cell: (s: any) => (
                  <span style={{ fontWeight: 600 }}>{s.subjectName}</span>
                ),
              },
              {
                field: 'subjectDesc',
                header: 'Subject Description',
                cell: (s: any) => <span>{s.subjectDesc}</span>,
              },
              {
                field: 'refIsCode',
                header: 'Ref. IS Code',
                cell: (s: any) => (
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {s.refIsCode}
                  </span>
                ),
              },
              {
                field: 'newPara',
                header: 'New Para',
                cell: (s: any) => <span>{s.newPara}</span>,
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setSorSubjectForm(item);
                      setSorSubjectPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add SOR Subject"
                icon="plus"
                variant="primary"
                onClick={() => {
                  const defaultType = sorTypes[0]?.code ?? '';
                  const matchingChapters = sorChapters.filter(
                    c => c.sorTypeCode === defaultType
                  );
                  setSorSubjectForm({
                    sorTypeCode: defaultType,
                    chapterNo: matchingChapters[0]?.chapterNo ?? '',
                    chapterDesc: matchingChapters[0]?.chapterDesc ?? '',
                    subjectName: '',
                    subjectDesc: '',
                    refIsCode: '',
                    newPara: '',
                  });
                  setSorSubjectPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search subjects..."
          />
        </FormCard>
      )}

      {/* SOR Unit Registry View */}
      {activeTab === 'UNIT' && (
        <FormCard
          title="Unit Master"
          subtitle="Define baseline units of measurement for civil and infrastructure works."
        >
          <GridPanel
            data={sorUnits}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'name',
                header: 'Unit Name',
                cell: (s: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#10b981',
                    }}
                  >
                    {s.name}
                  </span>
                ),
              },
              {
                field: 'description',
                header: 'Description',
                cell: (s: any) => <span>{s.description}</span>,
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setSorUnitForm(item);
                      setSorUnitPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add Unit"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setSorUnitForm({ name: '', description: '' });
                  setSorUnitPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search units..."
          />
        </FormCard>
      )}

      {/* SOR Registry View */}
      {activeTab === 'SOR' && (
        <FormCard
          title="Schedule of Rates (SOR)"
          subtitle="Rates acting as the legal price baseline for engineering designs."
        >
          <GridPanel
            data={sorData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'sorTypeCode',
                header: 'SOR Type',
                cell: (s: any) => (
                  <span className="civil-pill cyan" style={{ fontSize: '0.65rem' }}>
                    {s.sorTypeCode}
                  </span>
                ),
              },
              {
                field: 'chapterNo',
                header: 'Chapter No.',
                cell: (s: any) => (
                  <span style={{ fontWeight: 700 }}>{s.chapterNo}</span>
                ),
              },
              {
                field: 'subjectName',
                header: 'Subject Name',
                cell: (s: any) => (
                  <span style={{ fontWeight: 600 }}>{s.subjectName}</span>
                ),
              },
              {
                field: 'pageNo',
                header: 'Page No.',
                cell: (s: any) => <span>{s.pageNo}</span>,
              },
              {
                field: 'subTitle',
                header: 'Sub Title',
                cell: (s: any) => <span>{s.subTitle}</span>,
              },
              {
                field: 'serialNo',
                header: 'Serial No.',
                cell: (s: any) => <span style={{ fontWeight: 700 }}>{s.serialNo}</span>,
              },
              {
                field: 'serialNoDesc',
                header: 'Serial Desc',
                cell: (s: any) => <span style={{ fontSize: '0.75rem' }}>{s.serialNoDesc}</span>,
              },
              {
                field: 'workDesc',
                header: 'Work Description',
                cell: (s: any) => (
                  <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                    {s.workDesc}
                  </span>
                ),
              },
              {
                field: 'cementBags',
                header: 'Cement Bags',
                cell: (s: any) => <span>{s.cementBags}</span>,
              },
              {
                field: 'unit',
                header: 'Unit',
                cell: (s: any) => (
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {s.unit}
                  </span>
                ),
              },
              {
                field: 'rate',
                header: 'Rate (₹)',
                cell: (s: any) => (
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{Number(s.rate).toLocaleString('en-IN')}
                  </span>
                ),
              },
              {
                field: 'effectiveDate',
                header: 'Effective Date',
                cell: (s: any) => (
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {s.effectiveDate}
                  </span>
                ),
              },
              {
                field: 'rateSet',
                header: 'Rate Set',
                cell: (s: any) => (
                  <span className={`civil-pill ${s.rateSet ? 'green' : 'gray'}`}>
                    {s.rateSet ? 'Yes' : 'No'}
                  </span>
                ),
              },
              {
                field: 'percentage',
                header: 'Percentage (%)',
                cell: (s: any) => (
                  <span>{s.rateSet && s.percentage ? `${s.percentage}%` : '-'}</span>
                ),
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setSorForm(item);
                      setSorPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add SOR Item"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setSorForm(EMPTY_SOR);
                  setSorPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search SOR items..."
          />
        </FormCard>
      )}

      {/* TPI Agencies View */}
      {activeTab === 'TPI' && (
        <FormCard
          title="Third-Party Inspection (TPI) Agencies"
          subtitle="Independent QA/QC engineering consultants authorized to stamp lab quality checks."
        >
          <GridPanel
            data={tpiData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'id',
                header: 'Agency ID',
                cell: (s: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#2563eb',
                    }}
                  >
                    {s.id}
                  </span>
                ),
              },
              {
                field: 'name',
                header: 'Agency Name',
                cell: (s: any) => (
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                ),
              },
              {
                field: 'licenseNo',
                header: 'License No',
                cell: (s: any) => (
                  <span
                    style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                  >
                    {s.licenseNo}
                  </span>
                ),
              },
              { field: 'contactPerson', header: 'Contact Person' },
              { field: 'email', header: 'Email ID' },
              { field: 'mobile', header: 'Mobile Number' },
              {
                field: 'status',
                header: 'Status',
                cell: (s: any) => (
                  <span
                    className={`civil-pill ${s.status === 'Active' ? 'green' : 'gray'}`}
                  >
                    {s.status}
                  </span>
                ),
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setTpiForm(item);
                      setTpiPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add TPI Agency"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setTpiForm(EMPTY_TPI);
                  setTpiPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search TPI agencies..."
          />
        </FormCard>
      )}

      {/* Quality Lab View */}
      {activeTab === 'LAB' && (
        <FormCard
          title="Quality Lab Testing Agencies"
          subtitle="Accredited testing facilities responsible for conducting material checks and issuing certificates."
        >
          <GridPanel
            data={labData}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'id',
                header: 'Lab ID',
                cell: (s: any) => (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#7c3aed',
                    }}
                  >
                    {s.id}
                  </span>
                ),
              },
              {
                field: 'name',
                header: 'Lab Facility',
                cell: (s: any) => (
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                ),
              },
              {
                field: 'nablAccreditation',
                header: 'NABL Accreditation No',
                cell: (s: any) => (
                  <span
                    style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                  >
                    {s.nablAccreditation}
                  </span>
                ),
              },
              {
                field: 'scopeOfTesting',
                header: 'Scope of Testing',
                cell: (s: any) => (
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {s.scopeOfTesting}
                  </span>
                ),
              },
              { field: 'contactPerson', header: 'Director / In-Charge' },
              { field: 'email', header: 'Email ID' },
              {
                field: 'status',
                header: 'Status',
                cell: (s: any) => (
                  <span
                    className={`civil-pill ${s.status === 'Active' ? 'green' : 'gray'}`}
                  >
                    {s.status}
                  </span>
                ),
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setLabForm(item);
                      setLabPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add Quality Lab"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setLabForm(EMPTY_LAB);
                  setLabPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search quality labs..."
          />
        </FormCard>
      )}

      {/* Project Master View */}
      {activeTab === 'PROJECT' && (
        <FormCard
          title="Project Master"
          subtitle="Configure civil engineering construction and infrastructure projects."
        >
          <GridPanel
            data={projects}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
              {
                field: 'area',
                header: 'Project Area',
                cell: (s: any) => <span style={{ fontWeight: 600 }}>{s.area}</span>,
              },
              {
                field: 'campus',
                header: 'Campus',
                cell: (s: any) => (
                  <span className="civil-pill blue" style={{ fontSize: '0.7rem' }}>
                    {s.campus}
                  </span>
                ),
              },
              {
                field: 'location',
                header: 'Location Description',
                cell: (s: any) => <span>{s.location}</span>,
              },
              {
                field: 'id',
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setProjectForm(item);
                      setProjectPopup({ mode: 'edit', item });
                    }}
                  />
                ),
              },
            ]}
            toolbar={
              <Button
                label="Add Project"
                icon="plus"
                variant="primary"
                onClick={() => {
                  setProjectForm({ area: '', campus: 'Main Campus', location: '' });
                  setProjectPopup({ mode: 'create' });
                }}
              />
            }
            searchBox
            searchPlaceholder="Search projects..."
          />
        </FormCard>
      )}

      {/* SOR Popup */}
      <FormPopup
        visible={sorPopup.mode !== 'closed'}
        onHide={() => setSorPopup({ mode: 'closed' })}
        title={
          sorPopup.mode === 'create' ? 'Add New SOR Item' : 'Edit SOR Item'
        }
        subtitle="Manage government-notified Schedule of Rates items."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="SOR Type *"
            data={sorTypes.map(t => ({ name: `${t.code} - ${t.type}`, value: t.code }))}
            textField="name"
            optionValue="value"
            value={sorForm.sorTypeCode}
            onChange={v => {
              const matchingChapters = sorChapters.filter(c => c.sorTypeCode === v);
              const defaultChapter = matchingChapters[0]?.chapterNo ?? '';
              const matchedSubject = sorSubjects.find(
                s => s.sorTypeCode === v && s.chapterNo === defaultChapter
              );
              setSorForm((f: any) => ({
                ...f,
                sorTypeCode: v as string,
                chapterNo: defaultChapter,
                subjectName: matchedSubject ? matchedSubject.subjectName : '',
              }));
            }}
          />
          <DropDownList
            label="Chapter Number *"
            data={sorChapters
              .filter(c => c.sorTypeCode === sorForm.sorTypeCode)
              .map(c => ({ name: c.chapterNo, value: c.chapterNo }))}
            textField="name"
            optionValue="value"
            value={sorForm.chapterNo}
            onChange={v => {
              const matchedSubject = sorSubjects.find(
                s => s.sorTypeCode === sorForm.sorTypeCode && s.chapterNo === v
              );
              setSorForm((f: any) => ({
                ...f,
                chapterNo: v as string,
                subjectName: matchedSubject ? matchedSubject.subjectName : '',
              }));
            }}
          />
        </FormGrid>

        <div style={{ marginTop: '1rem' }}>
          <FormGrid columns={2}>
            <TextBox
              label="Subject Name *"
              placeholder="Enter subject name..."
              value={sorForm.subjectName ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, subjectName: v }))}
              required
            />
            <TextBox
              label="Page No. *"
              placeholder="e.g. 14"
              value={sorForm.pageNo ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, pageNo: v }))}
              required
            />
          </FormGrid>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormGrid columns={2}>
            <TextBox
              label="Sub Title"
              placeholder="e.g. Section B"
              value={sorForm.subTitle ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, subTitle: v }))}
            />
            <TextBox
              label="Serial No. *"
              placeholder="e.g. 1.2"
              value={sorForm.serialNo ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, serialNo: v }))}
              required
            />
          </FormGrid>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormGrid columns={2}>
            <TextArea
              label="Serial No. Description"
              placeholder="Enter serial number details..."
              value={sorForm.serialNoDesc ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, serialNoDesc: v }))}
              rows={2}
            />
            <TextArea
              label="Work Description *"
              placeholder="Enter work details..."
              value={sorForm.workDesc ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, workDesc: v }))}
              rows={2}
              required
            />
          </FormGrid>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormGrid columns={2}>
            <TextBox
              label="No. of Cement Bags"
              placeholder="e.g. 5.5"
              value={sorForm.cementBags ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, cementBags: v }))}
            />
            <DropDownList
              label="Unit *"
              data={sorUnits.map(u => ({ name: u.name, value: u.name }))}
              textField="name"
              optionValue="value"
              value={sorForm.unit}
              onChange={v => setSorForm((f: any) => ({ ...f, unit: v as string }))}
            />
          </FormGrid>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormGrid columns={2}>
            <TextBox
              label="Rate (Rs) *"
              placeholder="e.g. 450"
              value={sorForm.rate ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, rate: v }))}
              required
            />
            <TextBox
              label="Effective Date *"
              type="date"
              value={sorForm.effectiveDate ?? ''}
              onChange={v => setSorForm((f: any) => ({ ...f, effectiveDate: v }))}
              required
            />
          </FormGrid>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="rateSet"
              checked={!!sorForm.rateSet}
              onChange={e => setSorForm((f: any) => ({ ...f, rateSet: e.target.checked }))}
              style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
            />
            <label htmlFor="rateSet" style={{ fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
              Rate Set
            </label>
          </div>

          {sorForm.rateSet && (
            <div style={{ flex: 1 }}>
              <TextBox
                label="Percentage (%) *"
                placeholder="e.g. 10"
                value={sorForm.percentage ?? ''}
                onChange={v => setSorForm((f: any) => ({ ...f, percentage: v }))}
                required
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setSorPopup({ mode: 'closed' })}
          />
          <Button
            label="Save SOR Item"
            variant="primary"
            icon="save"
            onClick={handleSaveSor}
          />
        </div>
      </FormPopup>

      {/* TPI Popup */}
      <FormPopup
        visible={tpiPopup.mode !== 'closed'}
        onHide={() => setTpiPopup({ mode: 'closed' })}
        title={
          tpiPopup.mode === 'create'
            ? 'Add TPI Quality Agency'
            : 'Edit TPI Quality Agency'
        }
        subtitle="Independent Quality Check Agency registry details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Agency Name *"
            placeholder="e.g. RITES Limited"
            value={tpiForm.name ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="License / Registration No *"
            placeholder="e.g. TPI-REG-2025-001"
            value={tpiForm.licenseNo ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, licenseNo: v }))}
            required
          />
        </FormGrid>

        <FormGrid columns={3}>
          <TextBox
            label="Contact Person Name *"
            placeholder="e.g. Shri R.K. Varma"
            value={tpiForm.contactPerson ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, contactPerson: v }))}
            required
          />
          <TextBox
            label="Contact Email ID"
            placeholder="e.g. info@rites.com"
            value={tpiForm.email ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, email: v }))}
          />
          <TextBox
            label="Mobile Number"
            placeholder="e.g. 9876543210"
            value={tpiForm.mobile ?? ''}
            onChange={v => setTpiForm(f => ({ ...f, mobile: v }))}
          />
        </FormGrid>

        <TextArea
          label="Office Address"
          placeholder="Enter complete administrative address..."
          value={tpiForm.address ?? ''}
          onChange={v => setTpiForm(f => ({ ...f, address: v }))}
          rows={2}
        />

        <div style={{ marginTop: '1rem' }}>
          <DropDownList
            label="Agency Lifecycle Status"
            data={['Active', 'Inactive'].map(v => ({ name: v, value: v }))}
            textField={'name' as any}
            optionValue="value"
            value={tpiForm.status}
            onChange={v => setTpiForm(f => ({ ...f, status: v as any }))}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setTpiPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Agency"
            variant="primary"
            icon="save"
            onClick={handleSaveTpi}
          />
        </div>
      </FormPopup>

      {/* LAB Popup */}
      <FormPopup
        visible={labPopup.mode !== 'closed'}
        onHide={() => setLabPopup({ mode: 'closed' })}
        title={
          labPopup.mode === 'create'
            ? 'Add Accredited Quality Lab'
            : 'Edit Accredited Quality Lab'
        }
        subtitle="Independent laboratory facility registry details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Laboratory / Facility Name *"
            placeholder="e.g. MANIT Material Testing Lab"
            value={labForm.name ?? ''}
            onChange={v => setLabForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="NABL Accreditation No *"
            placeholder="e.g. NABL-TC-8891"
            value={labForm.nablAccreditation ?? ''}
            onChange={v => setLabForm(f => ({ ...f, nablAccreditation: v }))}
            required
          />
        </FormGrid>

        <FormGrid columns={3}>
          <TextBox
            label="Lab Director / In-Charge *"
            placeholder="e.g. Dr. S. K. Gupta"
            value={labForm.contactPerson ?? ''}
            onChange={v => setLabForm(f => ({ ...f, contactPerson: v }))}
            required
          />
          <TextBox
            label="Contact Email ID"
            placeholder="e.g. testlab@manit.ac.in"
            value={labForm.email ?? ''}
            onChange={v => setLabForm(f => ({ ...f, email: v }))}
          />
          <TextBox
            label="Contact Mobile"
            placeholder="e.g. 7552901234"
            value={labForm.mobile ?? ''}
            onChange={v => setLabForm(f => ({ ...f, mobile: v }))}
          />
        </FormGrid>

        <TextBox
          label="Scope of Testing / Materials Allowed (comma separated) *"
          placeholder="e.g. Concrete, Steel, Soils, Aggregates, Bitumen"
          value={labForm.scopeOfTesting ?? ''}
          onChange={v => setLabForm(f => ({ ...f, scopeOfTesting: v }))}
          required
        />

        <TextArea
          label="Lab Address"
          placeholder="Enter complete facility address..."
          value={labForm.address ?? ''}
          onChange={v => setLabForm(f => ({ ...f, address: v }))}
          rows={2}
        />

        <div style={{ marginTop: '1rem' }}>
          <DropDownList
            label="Lab Operational Status"
            data={['Active', 'Inactive'].map(v => ({ name: v, value: v }))}
            textField={'name' as any}
            optionValue="value"
            value={labForm.status}
            onChange={v => setLabForm(f => ({ ...f, status: v as any }))}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setLabPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Lab"
            variant="primary"
            icon="save"
            onClick={handleSaveLab}
          />
        </div>
      </FormPopup>

      {/* SOR Type Popup */}
      <FormPopup
        visible={sorTypePopup.mode !== 'closed'}
        onHide={() => setSorTypePopup({ mode: 'closed' })}
        title={
          sorTypePopup.mode === 'create' ? 'Add New SOR Type' : 'Edit SOR Type'
        }
        subtitle="Manage Schedule of Rate category types."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="SOR Type Code *"
            placeholder="e.g. ROAD"
            value={sorTypeForm.code ?? ''}
            onChange={v => setSorTypeForm((f: any) => ({ ...f, code: v }))}
            required
            disabled={sorTypePopup.mode === 'edit'}
          />
          <TextBox
            label="SOR Type *"
            placeholder="e.g. Roads & Highways"
            value={sorTypeForm.type ?? ''}
            onChange={v => setSorTypeForm((f: any) => ({ ...f, type: v }))}
            required
          />
        </FormGrid>
        <div style={{ marginTop: '1rem' }}>
          <TextArea
            label="Description *"
            placeholder="Enter category description..."
            value={sorTypeForm.description ?? ''}
            onChange={v => setSorTypeForm((f: any) => ({ ...f, description: v }))}
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setSorTypePopup({ mode: 'closed' })}
          />
          <Button
            label="Save SOR Type"
            variant="primary"
            icon="save"
            onClick={handleSaveSorType}
          />
        </div>
      </FormPopup>

      {/* SOR Chapter Popup */}
      <FormPopup
        visible={sorChapterPopup.mode !== 'closed'}
        onHide={() => setSorChapterPopup({ mode: 'closed' })}
        title={
          sorChapterPopup.mode === 'create' ? 'Add New SOR Chapter' : 'Edit SOR Chapter'
        }
        subtitle="Manage chapters categorized under SOR Types."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="SOR Type *"
            data={sorTypes.map(t => ({ name: `${t.code} - ${t.type}`, value: t.code }))}
            textField="name"
            optionValue="value"
            value={sorChapterForm.sorTypeCode}
            onChange={v => setSorChapterForm((f: any) => ({ ...f, sorTypeCode: v as string }))}
          />
          <TextBox
            label="Chapter No. *"
            placeholder="e.g. Ch-1"
            value={sorChapterForm.chapterNo ?? ''}
            onChange={v => setSorChapterForm((f: any) => ({ ...f, chapterNo: v }))}
            required
          />
        </FormGrid>
        <div style={{ marginTop: '1rem' }}>
          <TextArea
            label="Chapter Description *"
            placeholder="Enter chapter description..."
            value={sorChapterForm.chapterDesc ?? ''}
            onChange={v => setSorChapterForm((f: any) => ({ ...f, chapterDesc: v }))}
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setSorChapterPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Chapter"
            variant="primary"
            icon="save"
            onClick={handleSaveSorChapter}
          />
        </div>
      </FormPopup>

      {/* SOR Subject Popup */}
      <FormPopup
        visible={sorSubjectPopup.mode !== 'closed'}
        onHide={() => setSorSubjectPopup({ mode: 'closed' })}
        title={
          sorSubjectPopup.mode === 'create' ? 'Add New SOR Subject' : 'Edit SOR Subject'
        }
        subtitle="Manage subject details under SOR types and chapters."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="SOR Type *"
            data={sorTypes.map(t => ({ name: `${t.code} - ${t.type}`, value: t.code }))}
            textField="name"
            optionValue="value"
            value={sorSubjectForm.sorTypeCode}
            onChange={v => {
              const matchingChapters = sorChapters.filter(c => c.sorTypeCode === v);
              setSorSubjectForm((f: any) => ({
                ...f,
                sorTypeCode: v as string,
                chapterNo: matchingChapters[0]?.chapterNo ?? '',
                chapterDesc: matchingChapters[0]?.chapterDesc ?? '',
              }));
            }}
          />
          <DropDownList
            label="Chapter No. *"
            data={sorChapters
              .filter(c => c.sorTypeCode === sorSubjectForm.sorTypeCode)
              .map(c => ({ name: c.chapterNo, value: c.chapterNo }))}
            textField="name"
            optionValue="value"
            value={sorSubjectForm.chapterNo}
            onChange={v => {
              const chapter = sorChapters.find(
                c => c.sorTypeCode === sorSubjectForm.sorTypeCode && c.chapterNo === v
              );
              setSorSubjectForm((f: any) => ({
                ...f,
                chapterNo: v as string,
                chapterDesc: chapter ? chapter.chapterDesc : '',
              }));
            }}
          />
        </FormGrid>

        <div style={{ marginTop: '1rem' }}>
          <TextArea
            label="Chapter Description (Autofilled)"
            placeholder="Chapter description will autofill..."
            value={sorSubjectForm.chapterDesc ?? ''}
            onChange={v => setSorSubjectForm((f: any) => ({ ...f, chapterDesc: v }))}
            rows={2}
            disabled
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormGrid columns={2}>
            <TextBox
              label="Subject Name *"
              placeholder="Enter subject name..."
              value={sorSubjectForm.subjectName ?? ''}
              onChange={v => setSorSubjectForm((f: any) => ({ ...f, subjectName: v }))}
              required
            />
            <TextBox
              label="Ref. IS Code"
              placeholder="e.g. IS 456:2000"
              value={sorSubjectForm.refIsCode ?? ''}
              onChange={v => setSorSubjectForm((f: any) => ({ ...f, refIsCode: v }))}
            />
          </FormGrid>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormGrid columns={2}>
            <TextArea
              label="Subject Description"
              placeholder="Enter subject technical details..."
              value={sorSubjectForm.subjectDesc ?? ''}
              onChange={v => setSorSubjectForm((f: any) => ({ ...f, subjectDesc: v }))}
              rows={2}
            />
            <TextBox
              label="New Para"
              placeholder="e.g. Para 5.4"
              value={sorSubjectForm.newPara ?? ''}
              onChange={v => setSorSubjectForm((f: any) => ({ ...f, newPara: v }))}
            />
          </FormGrid>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setSorSubjectPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Subject"
            variant="primary"
            icon="save"
            onClick={handleSaveSorSubject}
          />
        </div>
      </FormPopup>

      {/* SOR Unit Popup */}
      <FormPopup
        visible={sorUnitPopup.mode !== 'closed'}
        onHide={() => setSorUnitPopup({ mode: 'closed' })}
        title={
          sorUnitPopup.mode === 'create' ? 'Add New Unit' : 'Edit Unit'
        }
        subtitle="Manage baseline units of measurement."
        size="lg"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Unit Name *"
            placeholder="e.g. Sqm, Cum, Rmt, Tonne"
            value={sorUnitForm.name ?? ''}
            onChange={v => setSorUnitForm((f: any) => ({ ...f, name: v }))}
            required
            disabled={sorUnitPopup.mode === 'edit'}
          />
        </FormGrid>
        <div style={{ marginTop: '1rem' }}>
          <TextArea
            label="Description"
            placeholder="Enter unit description / conversion notes..."
            value={sorUnitForm.description ?? ''}
            onChange={v => setSorUnitForm((f: any) => ({ ...f, description: v }))}
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setSorUnitPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Unit"
            variant="primary"
            icon="save"
            onClick={handleSaveSorUnit}
          />
        </div>
      </FormPopup>

      {/* Project Popup */}
      <FormPopup
        visible={projectPopup.mode !== 'closed'}
        onHide={() => setProjectPopup({ mode: 'closed' })}
        title={
          projectPopup.mode === 'create' ? 'Add New Project' : 'Edit Project'
        }
        subtitle="Manage infrastructure construction and mapping baseline."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Project Area *"
            placeholder="e.g. Academic Block-3 Construction"
            value={projectForm.area ?? ''}
            onChange={v => setProjectForm((f: any) => ({ ...f, area: v }))}
            required
          />
          <DropDownList
            label="Campus *"
            data={['Main Campus', 'North Campus', 'South Campus', 'Off-Campus Centre'].map(v => ({ name: v, value: v }))}
            textField="name"
            optionValue="value"
            value={projectForm.campus}
            onChange={v => setProjectForm((f: any) => ({ ...f, campus: v as string }))}
          />
        </FormGrid>

        <div style={{ marginTop: '1rem' }}>
          <TextArea
            label="Location Description"
            placeholder="Enter location descriptions, land details..."
            value={projectForm.location ?? ''}
            onChange={v => setProjectForm((f: any) => ({ ...f, location: v }))}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setProjectPopup({ mode: 'closed' })}
          />
          <Button
            label="Save Project"
            variant="primary"
            icon="save"
            onClick={handleSaveProject}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
