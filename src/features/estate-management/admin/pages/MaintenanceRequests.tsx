import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  type MaintenanceRequest,
  type EstateMaintainer,
  type MaintenanceHierarchy,
  type SettingsMaster,
  initialMaintenanceRequests,
  initialEstateMaintainers,
  initialMaintenanceHierarchies,
  initialMaintenanceRequestTypes,
  initialMaintenanceIssueCategories,
  initialMaintenanceTypes,
  initialBuildings,
  initialRooms,
  initialRoads,
  initialOpenAreas,
} from '../../data';
import { estateUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'createRequest' }
  | { mode: 'editRequest'; item: MaintenanceRequest }
  | { mode: 'createMaintainer' }
  | { mode: 'editMaintainer'; item: EstateMaintainer }
  | { mode: 'createHierarchy' }
  | { mode: 'editHierarchy'; item: MaintenanceHierarchy }
  | { mode: 'createSetting'; category: string }
  | { mode: 'editSetting'; category: string; item: SettingsMaster };

const PRIORITY_OPTIONS = [
  { name: 'Low', value: 'Low' },
  { name: 'Medium', value: 'Medium' },
  { name: 'High', value: 'High' },
  { name: 'Critical', value: 'Critical' },
];

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const REQ_STATUS_OPTIONS = [
  { name: 'Draft', value: 'Draft' },
  { name: 'Submitted', value: 'Submitted' },
  { name: 'Assigned', value: 'Assigned' },
  { name: 'Inspection Pending', value: 'Inspection Pending' },
  { name: 'Inspection Approved', value: 'Inspection Approved' },
  { name: 'Completed', value: 'Completed' },
];

const ENTITY_TYPE_OPTIONS = [
  { name: 'Building', value: 'Building' },
  { name: 'Room', value: 'Room' },
  { name: 'Road', value: 'Road' },
  { name: 'Open Area', value: 'Open Area' },
];

const EMPTY_REQUEST = {
  requestType: '',
  priority: 'Medium',
  organizationUnit: '',
  entityType: 'Building',
  entityId: '',
  problemCategory: '',
  description: '',
  status: 'Draft',
  assignedToType: '',
  assignedTo: '',
  closureReport: '',
  createdDate: '',
  updatedDate: '',
};
const EMPTY_MAINTAINER = { maintainerType: '', userName: '', status: 'Active' };
const EMPTY_HIERARCHY = {
  typeOfWork: '',
  organizationUnit: '',
  defaultAuthority: '',
  verifier: '',
  approver: '',
  status: 'Active',
};
const EMPTY_SETTING = { name: '', status: 'Active' };

const activeOptions = (items: { name: string; status: string }[]) =>
  items
    .filter(i => i.status === 'Active')
    .map(i => ({ name: i.name, value: i.name }));

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(
    initialMaintenanceRequests
  );
  const [maintainers, setMaintainers] = useState<EstateMaintainer[]>(
    initialEstateMaintainers
  );
  const [hierarchies, setHierarchies] = useState<MaintenanceHierarchy[]>(
    initialMaintenanceHierarchies
  );

  const [reqTypes, setReqTypes] = useState<SettingsMaster[]>(
    initialMaintenanceRequestTypes
  );
  const [issueCats, setIssueCats] = useState<SettingsMaster[]>(
    initialMaintenanceIssueCategories
  );
  const [maintTypes, setMaintTypes] = useState<SettingsMaster[]>(
    initialMaintenanceTypes
  );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [reqForm, setReqForm] = useState(EMPTY_REQUEST);
  const [maintForm, setMaintForm] = useState(EMPTY_MAINTAINER);
  const [hieForm, setHieForm] = useState(EMPTY_HIERARCHY);
  const [setForm, setSetForm] = useState(EMPTY_SETTING);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setReqForm(EMPTY_REQUEST);
    setMaintForm(EMPTY_MAINTAINER);
    setHieForm(EMPTY_HIERARCHY);
    setSetForm(EMPTY_SETTING);
  }, []);

  const handleSaveRequest = () => {
    if (popup.mode === 'createRequest') {
      const item: MaintenanceRequest = {
        id: `MR-${Date.now()}`,
        ...reqForm,
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
      } as unknown as MaintenanceRequest;
      setRequests(prev => [...prev, item]);
      ToastService.success('Maintenance Request created successfully.');
    } else if (popup.mode === 'editRequest') {
      setRequests(prev =>
        prev.map(r =>
          r.id === popup.item.id
            ? ({
                ...r,
                ...reqForm,
                updatedDate: new Date().toISOString().split('T')[0],
              } as unknown as MaintenanceRequest)
            : r
        )
      );
      ToastService.success('Maintenance Request updated successfully.');
    }
    closePopup();
  };

  const handleSaveMaintainer = () => {
    if (popup.mode === 'createMaintainer') {
      setMaintainers(prev => [
        ...prev,
        { id: String(Date.now()), ...maintForm } as unknown as EstateMaintainer,
      ]);
      ToastService.success('Maintainer added successfully.');
    } else if (popup.mode === 'editMaintainer') {
      setMaintainers(prev =>
        prev.map(m =>
          m.id === popup.item.id
            ? ({ ...m, ...maintForm } as unknown as EstateMaintainer)
            : m
        )
      );
      ToastService.success('Maintainer updated successfully.');
    }
    closePopup();
  };

  const handleSaveHierarchy = () => {
    if (popup.mode === 'createHierarchy') {
      setHierarchies(prev => [
        ...prev,
        {
          id: String(Date.now()),
          ...hieForm,
        } as unknown as MaintenanceHierarchy,
      ]);
      ToastService.success('Approval hierarchy added successfully.');
    } else if (popup.mode === 'editHierarchy') {
      setHierarchies(prev =>
        prev.map(h =>
          h.id === popup.item.id
            ? ({ ...h, ...hieForm } as unknown as MaintenanceHierarchy)
            : h
        )
      );
      ToastService.success('Approval hierarchy updated successfully.');
    }
    closePopup();
  };

  const handleSaveSetting = () => {
    if (popup.mode === 'createSetting') {
      const cat = popup.category;
      const newItem = {
        id: String(Date.now()),
        name: setForm.name,
        status: setForm.status as 'Active' | 'Inactive',
      };
      if (cat === 'reqType') setReqTypes(prev => [...prev, newItem]);
      else if (cat === 'issueCat') setIssueCats(prev => [...prev, newItem]);
      else if (cat === 'maintType') setMaintTypes(prev => [...prev, newItem]);
      ToastService.success('Setting added successfully.');
    } else if (popup.mode === 'editSetting') {
      const cat = popup.category;
      const targetId = popup.item.id;
      const update = (prev: SettingsMaster[]) =>
        prev.map(i =>
          i.id === targetId
            ? {
                ...i,
                name: setForm.name,
                status: setForm.status as 'Active' | 'Inactive',
              }
            : i
        );
      if (cat === 'reqType') setReqTypes(update);
      else if (cat === 'issueCat') setIssueCats(update);
      else if (cat === 'maintType') setMaintTypes(update);
      ToastService.success('Setting updated successfully.');
    }
    closePopup();
  };

  const openEditRequest = (item: MaintenanceRequest) => {
    setReqForm({
      requestType: item.requestType,
      priority: item.priority,
      organizationUnit: item.organizationUnit,
      entityType: item.entityType,
      entityId: item.entityId,
      problemCategory: item.problemCategory,
      description: item.description,
      status: item.status,
      assignedToType: item.assignedToType,
      assignedTo: item.assignedTo,
      closureReport: item.closureReport,
      createdDate: item.createdDate,
      updatedDate: item.updatedDate,
    });
    setPopup({ mode: 'editRequest', item });
  };

  const openEditMaintainer = (item: EstateMaintainer) => {
    setMaintForm({
      maintainerType: item.maintainerType,
      userName: item.userName,
      status: item.status,
    });
    setPopup({ mode: 'editMaintainer', item });
  };

  const openEditHierarchy = (item: MaintenanceHierarchy) => {
    setHieForm({
      typeOfWork: item.typeOfWork,
      organizationUnit: item.organizationUnit,
      defaultAuthority: item.defaultAuthority,
      verifier: item.verifier,
      approver: item.approver,
      status: item.status,
    });
    setPopup({ mode: 'editHierarchy', item });
  };

  const openEditSetting = (category: string, item: SettingsMaster) => {
    setSetForm({ name: item.name, status: item.status });
    setPopup({ mode: 'editSetting', category, item });
  };

  // Determine entity list based on selected entity type
  const entityOptions = (() => {
    if (reqForm.entityType === 'Building')
      return initialBuildings.map(b => ({ name: b.name, value: b.name }));
    if (reqForm.entityType === 'Room')
      return initialRooms.map(r => ({
        name: `${r.buildingName} — ${r.roomNumber}`,
        value: r.roomNumber,
      }));
    if (reqForm.entityType === 'Road')
      return initialRoads.map(r => ({ name: r.name, value: r.name }));
    if (reqForm.entityType === 'Open Area')
      return initialOpenAreas.map(o => ({ name: o.name, value: o.name }));
    return [];
  })();

  const maintainerOptions = maintainers
    .filter(m => m.status === 'Active')
    .map(m => ({ name: m.userName, value: m.userName }));

  return (
    <FormPage
      title="Maintenance Requests"
      description="Manage corrective, preventive, and emergency repairs across university infrastructure."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Maintenance Requests' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'Requests',
            content: (
              <FormCard>
                <GridPanel
                  data={requests}
                  onEdit={openEditRequest}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'Request ID', width: '110px' },
                    { field: 'requestType', header: 'Type', width: '160px' },
                    {
                      field: 'problemCategory',
                      header: 'Category',
                      width: '120px',
                    },
                    {
                      field: 'priority',
                      header: 'Priority',
                      width: '100px',
                      cell: (item: MaintenanceRequest) => (
                        <StatusBadge
                          label={item.priority}
                          variant={
                            item.priority === 'Critical' ||
                            item.priority === 'High'
                              ? 'rejected'
                              : 'neutral'
                          }
                        />
                      ),
                    },
                    {
                      field: 'entityType',
                      header: 'Entity Type',
                      width: '110px',
                    },
                    { field: 'entityId', header: 'Entity' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '140px',
                      cell: (item: MaintenanceRequest) => (
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Completed'
                              ? 'approved'
                              : item.status === 'Draft'
                                ? 'neutral'
                                : 'pending'
                          }
                        />
                      ),
                    },
                  ]}
                  toolbar={
                    <Button
                      label="Create Request"
                      icon="plus"
                      variant="primary"
                      onClick={() => setPopup({ mode: 'createRequest' })}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Maintainers',
            content: (
              <FormCard>
                <GridPanel
                  data={maintainers}
                  onEdit={openEditMaintainer}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'ID', width: '80px' },
                    { field: 'userName', header: 'Maintainer Name' },
                    {
                      field: 'maintainerType',
                      header: 'Work Specialization',
                      width: '220px',
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '100px',
                      cell: (item: EstateMaintainer) => (
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Active' ? 'approved' : 'rejected'
                          }
                        />
                      ),
                    },
                  ]}
                  toolbar={
                    <Button
                      label="Add Maintainer"
                      icon="plus"
                      variant="primary"
                      onClick={() => setPopup({ mode: 'createMaintainer' })}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Approval Hierarchies',
            content: (
              <FormCard>
                <GridPanel
                  data={hierarchies}
                  onEdit={openEditHierarchy}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'ID', width: '80px' },
                    {
                      field: 'typeOfWork',
                      header: 'Type of Work',
                      width: '160px',
                    },
                    {
                      field: 'organizationUnit',
                      header: 'Org Unit',
                      width: '180px',
                    },
                    { field: 'verifier', header: 'Verifier', width: '160px' },
                    { field: 'approver', header: 'Approver', width: '160px' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '100px',
                      cell: (item: MaintenanceHierarchy) => (
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Active' ? 'approved' : 'rejected'
                          }
                        />
                      ),
                    },
                  ]}
                  toolbar={
                    <Button
                      label="Configure Hierarchy"
                      icon="plus"
                      variant="primary"
                      onClick={() => setPopup({ mode: 'createHierarchy' })}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Maintenance Settings',
            content: (
              <div className="flex flex-col gap-6">
                <FormCard title="Request Types">
                  <GridPanel
                    data={reqTypes}
                    onEdit={(item: SettingsMaster) =>
                      openEditSetting('reqType', item)
                    }
                    columns={[
                      {
                        cell: (_: unknown, option: { rowIndex: number }) => (
                          <span className="font-semibold text-gray-700">
                            {option.rowIndex + 1}
                          </span>
                        ),
                        width: '50px',
                      },
                      { field: 'name', header: 'Request Type Name' },
                      {
                        field: 'status',
                        header: 'Status',
                        width: '100px',
                        cell: (item: SettingsMaster) => (
                          <StatusBadge
                            label={item.status}
                            variant={
                              item.status === 'Active' ? 'approved' : 'rejected'
                            }
                          />
                        ),
                      },
                    ]}
                    toolbar={
                      <Button
                        label="Add Request Type"
                        icon="plus"
                        variant="primary"
                        onClick={() =>
                          setPopup({
                            mode: 'createSetting',
                            category: 'reqType',
                          })
                        }
                      />
                    }
                  />
                </FormCard>

                <FormCard title="Issue Categories">
                  <GridPanel
                    data={issueCats}
                    onEdit={(item: SettingsMaster) =>
                      openEditSetting('issueCat', item)
                    }
                    columns={[
                      {
                        cell: (_: unknown, option: { rowIndex: number }) => (
                          <span className="font-semibold text-gray-700">
                            {option.rowIndex + 1}
                          </span>
                        ),
                        width: '50px',
                      },
                      { field: 'name', header: 'Category Name' },
                      {
                        field: 'status',
                        header: 'Status',
                        width: '100px',
                        cell: (item: SettingsMaster) => (
                          <StatusBadge
                            label={item.status}
                            variant={
                              item.status === 'Active' ? 'approved' : 'rejected'
                            }
                          />
                        ),
                      },
                    ]}
                    toolbar={
                      <Button
                        label="Add Issue Category"
                        icon="plus"
                        variant="primary"
                        onClick={() =>
                          setPopup({
                            mode: 'createSetting',
                            category: 'issueCat',
                          })
                        }
                      />
                    }
                  />
                </FormCard>

                <FormCard title="Maintenance/Work Types">
                  <GridPanel
                    data={maintTypes}
                    onEdit={(item: SettingsMaster) =>
                      openEditSetting('maintType', item)
                    }
                    columns={[
                      {
                        cell: (_: unknown, option: { rowIndex: number }) => (
                          <span className="font-semibold text-gray-700">
                            {option.rowIndex + 1}
                          </span>
                        ),
                        width: '50px',
                      },
                      { field: 'name', header: 'Work Type Name' },
                      {
                        field: 'status',
                        header: 'Status',
                        width: '100px',
                        cell: (item: SettingsMaster) => (
                          <StatusBadge
                            label={item.status}
                            variant={
                              item.status === 'Active' ? 'approved' : 'rejected'
                            }
                          />
                        ),
                      },
                    ]}
                    toolbar={
                      <Button
                        label="Add Work Type"
                        icon="plus"
                        variant="primary"
                        onClick={() =>
                          setPopup({
                            mode: 'createSetting',
                            category: 'maintType',
                          })
                        }
                      />
                    }
                  />
                </FormCard>
              </div>
            ),
          },
        ]}
      />

      {/* ── Request Popup ── */}
      <FormPopup
        visible={popup.mode === 'createRequest' || popup.mode === 'editRequest'}
        onHide={closePopup}
        title={
          popup.mode === 'createRequest'
            ? 'Create Maintenance Request'
            : 'Edit Maintenance Request'
        }
        subtitle="Fill in request details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Request Type"
            data={activeOptions(reqTypes)}
            textField="name"
            optionValue="value"
            value={reqForm.requestType}
            onChange={v =>
              setReqForm(f => ({ ...f, requestType: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Priority"
            data={PRIORITY_OPTIONS}
            textField="name"
            optionValue="value"
            value={reqForm.priority}
            onChange={v =>
              setReqForm(f => ({
                ...f,
                priority: String(v ?? 'Medium') as any,
              }))
            }
            required
          />
          <TextBox
            label="Organization Unit"
            placeholder="e.g. Computer Science"
            value={reqForm.organizationUnit}
            onChange={v => setReqForm(f => ({ ...f, organizationUnit: v }))}
            required
          />
          <DropDownList
            label="Entity Type"
            data={ENTITY_TYPE_OPTIONS}
            textField="name"
            optionValue="value"
            value={reqForm.entityType}
            onChange={v =>
              setReqForm(f => ({
                ...f,
                entityType: String(v ?? 'Building'),
                entityId: '',
              }))
            }
            required
          />
          <DropDownList
            label="Entity"
            data={entityOptions}
            textField="name"
            optionValue="value"
            value={reqForm.entityId}
            onChange={v =>
              setReqForm(f => ({ ...f, entityId: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Problem Category"
            data={activeOptions(issueCats)}
            textField="name"
            optionValue="value"
            value={reqForm.problemCategory}
            onChange={v =>
              setReqForm(f => ({ ...f, problemCategory: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Status"
            data={REQ_STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={reqForm.status}
            onChange={v =>
              setReqForm(f => ({ ...f, status: String(v ?? 'Draft') as any }))
            }
          />
          <DropDownList
            label="Assigned Maintainer Specialization"
            data={activeOptions(maintTypes)}
            textField="name"
            optionValue="value"
            value={reqForm.assignedToType}
            onChange={v =>
              setReqForm(f => ({ ...f, assignedToType: String(v ?? '') }))
            }
          />
          <DropDownList
            label="Assigned Maintainer Name"
            data={maintainerOptions}
            textField="name"
            optionValue="value"
            value={reqForm.assignedTo}
            onChange={v =>
              setReqForm(f => ({ ...f, assignedTo: String(v ?? '') }))
            }
          />
          <TextArea
            label="Problem Description"
            placeholder="Detailed description of the issue"
            value={reqForm.description}
            onChange={v => setReqForm(f => ({ ...f, description: v }))}
            required
          />
          <TextArea
            label="Closure Report"
            placeholder="Maintenance actions taken"
            value={reqForm.closureReport}
            onChange={v => setReqForm(f => ({ ...f, closureReport: v }))}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSaveRequest} />
        </div>
      </FormPopup>

      {/* ── Maintainer Popup ── */}
      <FormPopup
        visible={
          popup.mode === 'createMaintainer' || popup.mode === 'editMaintainer'
        }
        onHide={closePopup}
        title={
          popup.mode === 'createMaintainer'
            ? 'Add Maintainer'
            : 'Edit Maintainer'
        }
        subtitle="Fill in maintainer credentials."
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Maintainer Name"
            placeholder="e.g. Mr. Vinod Electrician"
            value={maintForm.userName}
            onChange={v => setMaintForm(f => ({ ...f, userName: v }))}
            required
          />
          <DropDownList
            label="Work Specialization"
            data={activeOptions(maintTypes)}
            textField="name"
            optionValue="value"
            value={maintForm.maintainerType}
            onChange={v =>
              setMaintForm(f => ({ ...f, maintainerType: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={maintForm.status}
            onChange={v =>
              setMaintForm(f => ({
                ...f,
                status: String(v ?? 'Active') as any,
              }))
            }
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Save"
            variant="primary"
            onClick={handleSaveMaintainer}
          />
        </div>
      </FormPopup>

      {/* ── Hierarchy Popup ── */}
      <FormPopup
        visible={
          popup.mode === 'createHierarchy' || popup.mode === 'editHierarchy'
        }
        onHide={closePopup}
        title={
          popup.mode === 'createHierarchy'
            ? 'Configure Approval Hierarchy'
            : 'Edit Approval Hierarchy'
        }
        subtitle="Configure verification and approval personnel."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Type of Work"
            data={activeOptions(maintTypes)}
            textField="name"
            optionValue="value"
            value={hieForm.typeOfWork}
            onChange={v =>
              setHieForm(f => ({ ...f, typeOfWork: String(v ?? '') }))
            }
            required
          />
          <TextBox
            label="Organization Unit"
            placeholder="e.g. Estate Office"
            value={hieForm.organizationUnit}
            onChange={v => setHieForm(f => ({ ...f, organizationUnit: v }))}
            required
          />
          <TextBox
            label="Verifier Name"
            placeholder="e.g. Sanjay Kumar"
            value={hieForm.verifier}
            onChange={v => setHieForm(f => ({ ...f, verifier: v }))}
            required
          />
          <TextBox
            label="Approver Name"
            placeholder="e.g. Dr. R.K. Gupta"
            value={hieForm.approver}
            onChange={v => setHieForm(f => ({ ...f, approver: v }))}
            required
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={hieForm.status}
            onChange={v =>
              setHieForm(f => ({ ...f, status: String(v ?? 'Active') as any }))
            }
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button
            label="Save"
            variant="primary"
            onClick={handleSaveHierarchy}
          />
        </div>
      </FormPopup>

      {/* ── Settings Category Popup ── */}
      <FormPopup
        visible={popup.mode === 'createSetting' || popup.mode === 'editSetting'}
        onHide={closePopup}
        title={popup.mode === 'createSetting' ? 'Add Setting' : 'Edit Setting'}
        subtitle="Fill in setting item."
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Name"
            placeholder="Enter name"
            value={setForm.name}
            onChange={v => setSetForm(f => ({ ...f, name: v }))}
            required
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={setForm.status}
            onChange={v =>
              setSetForm(f => ({ ...f, status: String(v ?? 'Active') }))
            }
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSaveSetting} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
