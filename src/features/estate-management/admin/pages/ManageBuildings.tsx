import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextBox,
  Switch,
  NumberBox,
} from 'shared/components/forms';
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
  type Building,
  type Floor,
  type Room,
  type House,
  initialBuildings,
  initialFloors,
  initialRooms,
  initialHouses,
  initialCampusKeys,
  initialBlocks,
  initialStructureTypes,
  initialFoundationTypes,
  initialRoofTypes,
  initialExternalWallTypes,
  initialSubstationTypes,
  initialFloorLevels,
  initialFloorCategories,
  initialFlooringTypes,
  initialRoomTypes,
  initialHouseTypes,
} from '../../data';
import { estateUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'createBuilding' }
  | { mode: 'editBuilding'; item: Building }
  | { mode: 'createFloor' }
  | { mode: 'editFloor'; item: Floor }
  | { mode: 'createRoom' }
  | { mode: 'editRoom'; item: Room }
  | { mode: 'createHouse' }
  | { mode: 'editHouse'; item: House };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const BOOL_OPTIONS = [
  { name: 'Yes', value: 'Yes' },
  { name: 'No', value: 'No' },
];

const EMPTY_BUILDING = {
  name: '',
  campus: '',
  block: '',
  status: 'Active',
  location: '',
  possessingDepartments: '',
  isResidential: false,
  greenBuilding: false,
  numberOfFloors: 0,
  plotArea: 0,
  buildingHeight: 0,
  plinthArea: 0,
  foundationDate: '',
  inaugurationDate: '',
  structureType: '',
  foundationType: '',
  roofingType: '',
  exteriorWallType: '',
  estimatedCost: 0,
  tenderedCost: 0,
  totalConstructionCost: 0,
  wifi: false,
  fireFighting: false,
  generatorBackup: false,
  ups: false,
  escalator: false,
  elevator: false,
  disabledAccessRamp: false,
  cas: false,
  waterHarvesting: false,
  connectedSubstation: '',
  etpConnected: false,
  stpConnected: false,
  exteriorWallThickness: 0,
  partitionWallThickness: 0,
  parapetWallThickness: 0,
  roofSlabThickness: 0,
  wallPlasteringThickness: 0,
  exteriorPaintableArea: 0,
  exteriorGritPlasterArea: 0,
  exteriorStoneWallArea: 0,
  latitude: '',
  longitude: '',
  fitnessCertificateStatus: '',
};

const EMPTY_FLOOR = {
  buildingId: '',
  floorLevel: '',
  floorCategory: '',
  flooringType: '',
  totalArea: 0,
  usableArea: 0,
  status: 'Active',
};
const EMPTY_ROOM = {
  buildingId: '',
  floorId: '',
  roomNumber: '',
  roomType: '',
  capacity: 0,
  area: 0,
  status: 'Active',
};
const EMPTY_HOUSE = {
  buildingId: '',
  houseNumber: '',
  houseType: '',
  occupantName: '',
  area: 0,
  status: 'Active',
};

const activeOptions = (items: { id: string; name: string; status: string }[]) =>
  items
    .filter(i => i.status === 'Active')
    .map(i => ({ name: i.name, value: i.name }));

export default function ManageBuildings() {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [houses, setHouses] = useState<House[]>(initialHouses);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [bldgForm, setBldgForm] = useState(EMPTY_BUILDING);
  const [flrForm, setFlrForm] = useState(EMPTY_FLOOR);
  const [rmForm, setRmForm] = useState(EMPTY_ROOM);
  const [hseForm, setHseForm] = useState(EMPTY_HOUSE);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setBldgForm(EMPTY_BUILDING);
    setFlrForm(EMPTY_FLOOR);
    setRmForm(EMPTY_ROOM);
    setHseForm(EMPTY_HOUSE);
  }, []);

  const handleSaveBuilding = () => {
    if (popup.mode === 'createBuilding') {
      const item: Building = {
        id: `BLD-${Date.now()}`,
        ...bldgForm,
      } as unknown as Building;
      setBuildings(prev => [...prev, item]);
      ToastService.success('Building created successfully.');
    } else if (popup.mode === 'editBuilding') {
      setBuildings(prev =>
        prev.map(b =>
          b.id === popup.item.id
            ? ({ ...b, ...bldgForm } as unknown as Building)
            : b
        )
      );
      ToastService.success('Building updated successfully.');
    }
    closePopup();
  };

  const handleSaveFloor = () => {
    const bldg = buildings.find(b => b.id === flrForm.buildingId);
    if (popup.mode === 'createFloor') {
      const item: Floor = {
        id: `FLR-${Date.now()}`,
        ...flrForm,
        buildingName: bldg?.name || '',
      } as unknown as Floor;
      setFloors(prev => [...prev, item]);
      ToastService.success('Floor added successfully.');
    } else if (popup.mode === 'editFloor') {
      setFloors(prev =>
        prev.map(f =>
          f.id === popup.item.id
            ? ({
                ...f,
                ...flrForm,
                buildingName: bldg?.name || f.buildingName,
              } as unknown as Floor)
            : f
        )
      );
      ToastService.success('Floor updated successfully.');
    }
    closePopup();
  };

  const handleSaveRoom = () => {
    const bldg = buildings.find(b => b.id === rmForm.buildingId);
    const flr = floors.find(f => f.id === rmForm.floorId);
    if (popup.mode === 'createRoom') {
      const item: Room = {
        id: `RM-${Date.now()}`,
        ...rmForm,
        buildingName: bldg?.name || '',
        floorLevel: flr?.floorLevel || '',
      } as unknown as Room;
      setRooms(prev => [...prev, item]);
      ToastService.success('Room added successfully.');
    } else if (popup.mode === 'editRoom') {
      setRooms(prev =>
        prev.map(r =>
          r.id === popup.item.id
            ? ({
                ...r,
                ...rmForm,
                buildingName: bldg?.name || r.buildingName,
                floorLevel: flr?.floorLevel || r.floorLevel,
              } as unknown as Room)
            : r
        )
      );
      ToastService.success('Room updated successfully.');
    }
    closePopup();
  };

  const handleSaveHouse = () => {
    const bldg = buildings.find(b => b.id === hseForm.buildingId);
    if (popup.mode === 'createHouse') {
      const item: House = {
        id: `HSE-${Date.now()}`,
        ...hseForm,
        buildingName: bldg?.name || '',
      } as unknown as House;
      setHouses(prev => [...prev, item]);
      ToastService.success('House added successfully.');
    } else if (popup.mode === 'editHouse') {
      setHouses(prev =>
        prev.map(h =>
          h.id === popup.item.id
            ? ({
                ...h,
                ...hseForm,
                buildingName: bldg?.name || h.buildingName,
              } as unknown as House)
            : h
        )
      );
      ToastService.success('House updated successfully.');
    }
    closePopup();
  };

  const openEditBuilding = (item: Building) => {
    setBldgForm({
      name: item.name,
      campus: item.campus,
      block: item.block,
      status: item.status,
      location: item.location,
      possessingDepartments: item.possessingDepartments,
      isResidential: item.isResidential,
      greenBuilding: item.greenBuilding,
      numberOfFloors: item.numberOfFloors,
      plotArea: item.plotArea,
      buildingHeight: item.buildingHeight,
      plinthArea: item.plinthArea,
      foundationDate: item.foundationDate,
      inaugurationDate: item.inaugurationDate,
      structureType: item.structureType,
      foundationType: item.foundationType,
      roofingType: item.roofingType,
      exteriorWallType: item.exteriorWallType,
      estimatedCost: item.estimatedCost,
      tenderedCost: item.tenderedCost,
      totalConstructionCost: item.totalConstructionCost,
      wifi: item.wifi,
      fireFighting: item.fireFighting,
      generatorBackup: item.generatorBackup,
      ups: item.ups,
      escalator: item.escalator,
      elevator: item.elevator,
      disabledAccessRamp: item.disabledAccessRamp,
      cas: item.cas,
      waterHarvesting: item.waterHarvesting,
      connectedSubstation: item.connectedSubstation,
      etpConnected: item.etpConnected,
      stpConnected: item.stpConnected,
      exteriorWallThickness: item.exteriorWallThickness,
      partitionWallThickness: item.partitionWallThickness,
      parapetWallThickness: item.parapetWallThickness,
      roofSlabThickness: item.roofSlabThickness,
      wallPlasteringThickness: item.wallPlasteringThickness,
      exteriorPaintableArea: item.exteriorPaintableArea,
      exteriorGritPlasterArea: item.exteriorGritPlasterArea,
      exteriorStoneWallArea: item.exteriorStoneWallArea,
      latitude: item.latitude,
      longitude: item.longitude,
      fitnessCertificateStatus: item.fitnessCertificateStatus,
    });
    setPopup({ mode: 'editBuilding', item });
  };

  const openEditFloor = (item: Floor) => {
    setFlrForm({
      buildingId: item.buildingId,
      floorLevel: item.floorLevel,
      floorCategory: item.floorCategory,
      flooringType: item.flooringType,
      totalArea: item.totalArea,
      usableArea: item.usableArea,
      status: item.status,
    });
    setPopup({ mode: 'editFloor', item });
  };

  const openEditRoom = (item: Room) => {
    setRmForm({
      buildingId: item.buildingId,
      floorId: item.floorId,
      roomNumber: item.roomNumber,
      roomType: item.roomType,
      capacity: item.capacity,
      area: item.area,
      status: item.status,
    });
    setPopup({ mode: 'editRoom', item });
  };

  const openEditHouse = (item: House) => {
    setHseForm({
      buildingId: item.buildingId,
      houseNumber: item.houseNumber,
      houseType: item.houseType,
      occupantName: item.occupantName,
      area: item.area,
      status: item.status,
    });
    setPopup({ mode: 'editHouse', item });
  };

  const buildingOptions = buildings.map(b => ({
    name: `${b.name} (${b.id})`,
    value: b.id,
  }));
  const floorOptions = floors.map(f => ({
    name: `${f.buildingName} — ${f.floorLevel} (${f.id})`,
    value: f.id,
  }));
  const residentialBuildings = buildings
    .filter(b => b.isResidential)
    .map(b => ({ name: `${b.name} (${b.id})`, value: b.id }));

  return (
    <FormPage
      title="Manage Buildings"
      description="Add, update, and manage buildings with their floors, rooms, and houses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Manage Buildings' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'Buildings',
            content: (
              <FormCard>
                <GridPanel
                  data={buildings}
                  onEdit={openEditBuilding}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'Building ID', width: '110px' },
                    { field: 'name', header: 'Building Name' },
                    { field: 'campus', header: 'Campus', width: '130px' },
                    { field: 'block', header: 'Block', width: '90px' },
                    {
                      field: 'numberOfFloors',
                      header: 'Floors',
                      width: '70px',
                    },
                    {
                      field: 'structureType',
                      header: 'Structure Type',
                      width: '160px',
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '100px',
                      cell: (item: Building) => (
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
                      label="Add Building"
                      icon="plus"
                      variant="primary"
                      onClick={() => setPopup({ mode: 'createBuilding' })}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Floors',
            content: (
              <FormCard>
                <GridPanel
                  data={floors}
                  onEdit={openEditFloor}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'Floor ID', width: '100px' },
                    { field: 'buildingName', header: 'Building' },
                    { field: 'floorLevel', header: 'Level', width: '130px' },
                    {
                      field: 'floorCategory',
                      header: 'Category',
                      width: '130px',
                    },
                    {
                      field: 'flooringType',
                      header: 'Flooring',
                      width: '140px',
                    },
                    {
                      field: 'totalArea',
                      header: 'Total Area (sq.m)',
                      width: '130px',
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '100px',
                      cell: (item: Floor) => (
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
                      label="Add Floor"
                      icon="plus"
                      variant="primary"
                      onClick={() => setPopup({ mode: 'createFloor' })}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Rooms',
            content: (
              <FormCard>
                <GridPanel
                  data={rooms}
                  onEdit={openEditRoom}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'Room ID', width: '100px' },
                    {
                      field: 'buildingName',
                      header: 'Building',
                      width: '180px',
                    },
                    { field: 'floorLevel', header: 'Floor', width: '120px' },
                    { field: 'roomNumber', header: 'Room No', width: '100px' },
                    { field: 'roomType', header: 'Type', width: '130px' },
                    { field: 'capacity', header: 'Capacity', width: '90px' },
                    { field: 'area', header: 'Area (sq.m)', width: '100px' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '100px',
                      cell: (item: Room) => (
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
                      label="Add Room"
                      icon="plus"
                      variant="primary"
                      onClick={() => setPopup({ mode: 'createRoom' })}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Houses',
            content: (
              <FormCard>
                <GridPanel
                  data={houses}
                  onEdit={openEditHouse}
                  columns={[
                    {
                      cell: (_: unknown, option: { rowIndex: number }) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    { field: 'id', header: 'House ID', width: '100px' },
                    { field: 'buildingName', header: 'Building' },
                    {
                      field: 'houseNumber',
                      header: 'House No',
                      width: '110px',
                    },
                    { field: 'houseType', header: 'Type', width: '150px' },
                    {
                      field: 'occupantName',
                      header: 'Occupant',
                      cell: (item: House) => (
                        <span>{item.occupantName || '— Vacant —'}</span>
                      ),
                    },
                    { field: 'area', header: 'Area (sq.m)', width: '100px' },
                    {
                      field: 'status',
                      header: 'Status',
                      width: '100px',
                      cell: (item: House) => (
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
                      label="Add House"
                      icon="plus"
                      variant="primary"
                      onClick={() => setPopup({ mode: 'createHouse' })}
                    />
                  }
                  searchBox
                />
              </FormCard>
            ),
          },
        ]}
      />

      {/* ── Building Popup ── */}
      <FormPopup
        visible={
          popup.mode === 'createBuilding' || popup.mode === 'editBuilding'
        }
        onHide={closePopup}
        title={
          popup.mode === 'createBuilding' ? 'Add Building' : 'Edit Building'
        }
        subtitle="Fill in the building details."
        size="xl"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Building Name"
            placeholder="e.g. Central Academic Block"
            value={bldgForm.name}
            onChange={v => setBldgForm(f => ({ ...f, name: v }))}
            required
          />
          <DropDownList
            label="Campus"
            data={activeOptions(initialCampusKeys)}
            textField="name"
            optionValue="value"
            value={bldgForm.campus}
            onChange={v =>
              setBldgForm(f => ({ ...f, campus: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Block"
            data={activeOptions(initialBlocks)}
            textField="name"
            optionValue="value"
            value={bldgForm.block}
            onChange={v => setBldgForm(f => ({ ...f, block: String(v ?? '') }))}
            required
          />
          <DropDownList
            label="Building Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={bldgForm.status}
            onChange={v =>
              setBldgForm(f => ({ ...f, status: String(v ?? 'Active') }))
            }
            required
          />
          <TextBox
            label="Location"
            placeholder="Physical location description"
            value={bldgForm.location}
            onChange={v => setBldgForm(f => ({ ...f, location: v }))}
          />
          <TextBox
            label="Possessing Departments"
            placeholder="e.g. CS, Mathematics"
            value={bldgForm.possessingDepartments}
            onChange={v =>
              setBldgForm(f => ({ ...f, possessingDepartments: v }))
            }
          />
          <DropDownList
            label="Structure Type"
            data={activeOptions(initialStructureTypes)}
            textField="name"
            optionValue="value"
            value={bldgForm.structureType}
            onChange={v =>
              setBldgForm(f => ({ ...f, structureType: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Foundation Type"
            data={activeOptions(initialFoundationTypes)}
            textField="name"
            optionValue="value"
            value={bldgForm.foundationType}
            onChange={v =>
              setBldgForm(f => ({ ...f, foundationType: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Roofing Type"
            data={activeOptions(initialRoofTypes)}
            textField="name"
            optionValue="value"
            value={bldgForm.roofingType}
            onChange={v =>
              setBldgForm(f => ({ ...f, roofingType: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Exterior Wall Type"
            data={activeOptions(initialExternalWallTypes)}
            textField="name"
            optionValue="value"
            value={bldgForm.exteriorWallType}
            onChange={v =>
              setBldgForm(f => ({ ...f, exteriorWallType: String(v ?? '') }))
            }
            required
          />
          <NumberBox
            label="Number of Floors"
            value={bldgForm.numberOfFloors}
            onChange={v => setBldgForm(f => ({ ...f, numberOfFloors: v ?? 0 }))}
            required
          />
          <NumberBox
            label="Plot Area (Sq. m)"
            value={bldgForm.plotArea}
            onChange={v => setBldgForm(f => ({ ...f, plotArea: v ?? 0 }))}
          />
          <NumberBox
            label="Building Height (m)"
            value={bldgForm.buildingHeight}
            onChange={v => setBldgForm(f => ({ ...f, buildingHeight: v ?? 0 }))}
          />
          <NumberBox
            label="Plinth Area (Sq. m)"
            value={bldgForm.plinthArea}
            onChange={v => setBldgForm(f => ({ ...f, plinthArea: v ?? 0 }))}
          />
          <TextBox
            label="Foundation Date"
            placeholder="YYYY-MM-DD"
            value={bldgForm.foundationDate}
            onChange={v => setBldgForm(f => ({ ...f, foundationDate: v }))}
          />
          <TextBox
            label="Inauguration Date"
            placeholder="YYYY-MM-DD"
            value={bldgForm.inaugurationDate}
            onChange={v => setBldgForm(f => ({ ...f, inaugurationDate: v }))}
          />
          <NumberBox
            label="Estimated Cost (₹)"
            value={bldgForm.estimatedCost}
            onChange={v => setBldgForm(f => ({ ...f, estimatedCost: v ?? 0 }))}
          />
          <NumberBox
            label="Tendered Cost (₹)"
            value={bldgForm.tenderedCost}
            onChange={v => setBldgForm(f => ({ ...f, tenderedCost: v ?? 0 }))}
          />
          <NumberBox
            label="Total Construction Cost (₹)"
            value={bldgForm.totalConstructionCost}
            onChange={v =>
              setBldgForm(f => ({ ...f, totalConstructionCost: v ?? 0 }))
            }
          />
          <DropDownList
            label="Connected Substation"
            data={activeOptions(initialSubstationTypes)}
            textField="name"
            optionValue="value"
            value={bldgForm.connectedSubstation}
            onChange={v =>
              setBldgForm(f => ({ ...f, connectedSubstation: String(v ?? '') }))
            }
          />
          <TextBox
            label="Latitude"
            placeholder="e.g. 28.6139"
            value={bldgForm.latitude}
            onChange={v => setBldgForm(f => ({ ...f, latitude: v }))}
          />
          <TextBox
            label="Longitude"
            placeholder="e.g. 77.2090"
            value={bldgForm.longitude}
            onChange={v => setBldgForm(f => ({ ...f, longitude: v }))}
          />
          <DropDownList
            label="Fitness Certificate"
            data={[
              { name: 'Valid', value: 'Valid' },
              { name: 'Expired', value: 'Expired' },
              { name: 'Not Available', value: 'Not Available' },
            ]}
            textField="name"
            optionValue="value"
            value={bldgForm.fitnessCertificateStatus}
            onChange={v =>
              setBldgForm(f => ({
                ...f,
                fitnessCertificateStatus: String(v ?? ''),
              }))
            }
          />
          <DropDownList
            label="Is Residential?"
            data={BOOL_OPTIONS}
            textField="name"
            optionValue="value"
            value={bldgForm.isResidential ? 'Yes' : 'No'}
            onChange={v =>
              setBldgForm(f => ({ ...f, isResidential: v === 'Yes' }))
            }
          />
          <DropDownList
            label="Green Building?"
            data={BOOL_OPTIONS}
            textField="name"
            optionValue="value"
            value={bldgForm.greenBuilding ? 'Yes' : 'No'}
            onChange={v =>
              setBldgForm(f => ({ ...f, greenBuilding: v === 'Yes' }))
            }
          />
        </FormGrid>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2">
            Facility Availability
          </p>
          <FormGrid columns={4}>
            <Switch
              label="WiFi"
              checked={bldgForm.wifi}
              onChange={v => setBldgForm(f => ({ ...f, wifi: v }))}
            />
            <Switch
              label="Fire Fighting"
              checked={bldgForm.fireFighting}
              onChange={v => setBldgForm(f => ({ ...f, fireFighting: v }))}
            />
            <Switch
              label="Generator Backup"
              checked={bldgForm.generatorBackup}
              onChange={v => setBldgForm(f => ({ ...f, generatorBackup: v }))}
            />
            <Switch
              label="UPS"
              checked={bldgForm.ups}
              onChange={v => setBldgForm(f => ({ ...f, ups: v }))}
            />
            <Switch
              label="Escalator"
              checked={bldgForm.escalator}
              onChange={v => setBldgForm(f => ({ ...f, escalator: v }))}
            />
            <Switch
              label="Elevator/Lift"
              checked={bldgForm.elevator}
              onChange={v => setBldgForm(f => ({ ...f, elevator: v }))}
            />
            <Switch
              label="Disabled Access Ramp"
              checked={bldgForm.disabledAccessRamp}
              onChange={v =>
                setBldgForm(f => ({ ...f, disabledAccessRamp: v }))
              }
            />
            <Switch
              label="CAS System"
              checked={bldgForm.cas}
              onChange={v => setBldgForm(f => ({ ...f, cas: v }))}
            />
            <Switch
              label="Water Harvesting"
              checked={bldgForm.waterHarvesting}
              onChange={v => setBldgForm(f => ({ ...f, waterHarvesting: v }))}
            />
            <Switch
              label="ETP Connected"
              checked={bldgForm.etpConnected}
              onChange={v => setBldgForm(f => ({ ...f, etpConnected: v }))}
            />
            <Switch
              label="STP Connected"
              checked={bldgForm.stpConnected}
              onChange={v => setBldgForm(f => ({ ...f, stpConnected: v }))}
            />
          </FormGrid>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2">
            Wall & Slab Thickness (cm)
          </p>
          <FormGrid columns={3}>
            <NumberBox
              label="Exterior Wall"
              value={bldgForm.exteriorWallThickness}
              onChange={v =>
                setBldgForm(f => ({ ...f, exteriorWallThickness: v ?? 0 }))
              }
            />
            <NumberBox
              label="Partition Wall"
              value={bldgForm.partitionWallThickness}
              onChange={v =>
                setBldgForm(f => ({ ...f, partitionWallThickness: v ?? 0 }))
              }
            />
            <NumberBox
              label="Parapet Wall"
              value={bldgForm.parapetWallThickness}
              onChange={v =>
                setBldgForm(f => ({ ...f, parapetWallThickness: v ?? 0 }))
              }
            />
            <NumberBox
              label="Roof Slab"
              value={bldgForm.roofSlabThickness}
              onChange={v =>
                setBldgForm(f => ({ ...f, roofSlabThickness: v ?? 0 }))
              }
            />
            <NumberBox
              label="Wall Plastering"
              value={bldgForm.wallPlasteringThickness}
              onChange={v =>
                setBldgForm(f => ({ ...f, wallPlasteringThickness: v ?? 0 }))
              }
            />
          </FormGrid>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2">
            Exterior Surface Areas (Sq. m)
          </p>
          <FormGrid columns={3}>
            <NumberBox
              label="Paintable Area"
              value={bldgForm.exteriorPaintableArea}
              onChange={v =>
                setBldgForm(f => ({ ...f, exteriorPaintableArea: v ?? 0 }))
              }
            />
            <NumberBox
              label="Grit Plaster Area"
              value={bldgForm.exteriorGritPlasterArea}
              onChange={v =>
                setBldgForm(f => ({ ...f, exteriorGritPlasterArea: v ?? 0 }))
              }
            />
            <NumberBox
              label="Stone Wall Area"
              value={bldgForm.exteriorStoneWallArea}
              onChange={v =>
                setBldgForm(f => ({ ...f, exteriorStoneWallArea: v ?? 0 }))
              }
            />
          </FormGrid>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSaveBuilding} />
        </div>
      </FormPopup>

      {/* ── Floor Popup ── */}
      <FormPopup
        visible={popup.mode === 'createFloor' || popup.mode === 'editFloor'}
        onHide={closePopup}
        title={popup.mode === 'createFloor' ? 'Add Floor' : 'Edit Floor'}
        subtitle="Fill in the floor details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Building"
            data={buildingOptions}
            textField="name"
            optionValue="value"
            value={flrForm.buildingId}
            onChange={v =>
              setFlrForm(f => ({ ...f, buildingId: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Floor Level"
            data={activeOptions(initialFloorLevels)}
            textField="name"
            optionValue="value"
            value={flrForm.floorLevel}
            onChange={v =>
              setFlrForm(f => ({ ...f, floorLevel: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Floor Category"
            data={activeOptions(initialFloorCategories)}
            textField="name"
            optionValue="value"
            value={flrForm.floorCategory}
            onChange={v =>
              setFlrForm(f => ({ ...f, floorCategory: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Flooring Type"
            data={activeOptions(initialFlooringTypes)}
            textField="name"
            optionValue="value"
            value={flrForm.flooringType}
            onChange={v =>
              setFlrForm(f => ({ ...f, flooringType: String(v ?? '') }))
            }
            required
          />
          <NumberBox
            label="Total Area (Sq. m)"
            value={flrForm.totalArea}
            onChange={v => setFlrForm(f => ({ ...f, totalArea: v ?? 0 }))}
            required
          />
          <NumberBox
            label="Usable Area (Sq. m)"
            value={flrForm.usableArea}
            onChange={v => setFlrForm(f => ({ ...f, usableArea: v ?? 0 }))}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={flrForm.status}
            onChange={v =>
              setFlrForm(f => ({ ...f, status: String(v ?? 'Active') }))
            }
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSaveFloor} />
        </div>
      </FormPopup>

      {/* ── Room Popup ── */}
      <FormPopup
        visible={popup.mode === 'createRoom' || popup.mode === 'editRoom'}
        onHide={closePopup}
        title={popup.mode === 'createRoom' ? 'Add Room' : 'Edit Room'}
        subtitle="Fill in the room details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Building"
            data={buildingOptions}
            textField="name"
            optionValue="value"
            value={rmForm.buildingId}
            onChange={v =>
              setRmForm(f => ({ ...f, buildingId: String(v ?? '') }))
            }
            required
          />
          <DropDownList
            label="Floor"
            data={floorOptions}
            textField="name"
            optionValue="value"
            value={rmForm.floorId}
            onChange={v => setRmForm(f => ({ ...f, floorId: String(v ?? '') }))}
            required
          />
          <TextBox
            label="Room Number"
            placeholder="e.g. CAB-G01"
            value={rmForm.roomNumber}
            onChange={v => setRmForm(f => ({ ...f, roomNumber: v }))}
            required
          />
          <DropDownList
            label="Room Type"
            data={activeOptions(initialRoomTypes)}
            textField="name"
            optionValue="value"
            value={rmForm.roomType}
            onChange={v =>
              setRmForm(f => ({ ...f, roomType: String(v ?? '') }))
            }
            required
          />
          <NumberBox
            label="Capacity"
            value={rmForm.capacity}
            onChange={v => setRmForm(f => ({ ...f, capacity: v ?? 0 }))}
          />
          <NumberBox
            label="Area (Sq. m)"
            value={rmForm.area}
            onChange={v => setRmForm(f => ({ ...f, area: v ?? 0 }))}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={rmForm.status}
            onChange={v =>
              setRmForm(f => ({ ...f, status: String(v ?? 'Active') }))
            }
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSaveRoom} />
        </div>
      </FormPopup>

      {/* ── House Popup ── */}
      <FormPopup
        visible={popup.mode === 'createHouse' || popup.mode === 'editHouse'}
        onHide={closePopup}
        title={popup.mode === 'createHouse' ? 'Add House' : 'Edit House'}
        subtitle="Fill in the house details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Building (Residential)"
            data={residentialBuildings}
            textField="name"
            optionValue="value"
            value={hseForm.buildingId}
            onChange={v =>
              setHseForm(f => ({ ...f, buildingId: String(v ?? '') }))
            }
            required
          />
          <TextBox
            label="House Number"
            placeholder="e.g. FR-3/01"
            value={hseForm.houseNumber}
            onChange={v => setHseForm(f => ({ ...f, houseNumber: v }))}
            required
          />
          <DropDownList
            label="House Type"
            data={activeOptions(initialHouseTypes)}
            textField="name"
            optionValue="value"
            value={hseForm.houseType}
            onChange={v =>
              setHseForm(f => ({ ...f, houseType: String(v ?? '') }))
            }
            required
          />
          <TextBox
            label="Occupant Name"
            placeholder="Leave blank if vacant"
            value={hseForm.occupantName}
            onChange={v => setHseForm(f => ({ ...f, occupantName: v }))}
          />
          <NumberBox
            label="Area (Sq. m)"
            value={hseForm.area}
            onChange={v => setHseForm(f => ({ ...f, area: v ?? 0 }))}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={hseForm.status}
            onChange={v =>
              setHseForm(f => ({ ...f, status: String(v ?? 'Active') }))
            }
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSaveHouse} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
