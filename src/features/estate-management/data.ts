// ─── Settings Master Types ──────────────────────────────────────────────────

export interface SettingsMaster {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

// ─── Building & Sub-entities ────────────────────────────────────────────────

export interface Building {
  id: string;
  name: string;
  campus: string;
  block: string;
  status: 'Active' | 'Inactive';
  location: string;
  possessingDepartments: string;
  isResidential: boolean;
  greenBuilding: boolean;
  numberOfFloors: number;
  plotArea: number;
  buildingHeight: number;
  plinthArea: number;
  foundationDate: string;
  inaugurationDate: string;
  structureType: string;
  foundationType: string;
  roofingType: string;
  exteriorWallType: string;
  estimatedCost: number;
  tenderedCost: number;
  totalConstructionCost: number;
  wifi: boolean;
  fireFighting: boolean;
  generatorBackup: boolean;
  ups: boolean;
  escalator: boolean;
  elevator: boolean;
  disabledAccessRamp: boolean;
  cas: boolean;
  waterHarvesting: boolean;
  connectedSubstation: string;
  etpConnected: boolean;
  stpConnected: boolean;
  exteriorWallThickness: number;
  partitionWallThickness: number;
  parapetWallThickness: number;
  roofSlabThickness: number;
  wallPlasteringThickness: number;
  exteriorPaintableArea: number;
  exteriorGritPlasterArea: number;
  exteriorStoneWallArea: number;
  latitude: string;
  longitude: string;
  fitnessCertificateStatus: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  buildingName: string;
  floorLevel: string;
  floorCategory: string;
  flooringType: string;
  totalArea: number;
  usableArea: number;
  status: 'Active' | 'Inactive';
}

export interface Room {
  id: string;
  buildingId: string;
  floorId: string;
  buildingName: string;
  floorLevel: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  area: number;
  status: 'Active' | 'Inactive';
}

export interface House {
  id: string;
  buildingId: string;
  buildingName: string;
  houseNumber: string;
  houseType: string;
  occupantName: string;
  area: number;
  status: 'Active' | 'Inactive';
}

export interface OpenArea {
  id: string;
  campus: string;
  name: string;
  areaType: string;
  landmark: string;
  totalLandArea: number;
  status: 'Active' | 'Inactive';
}

export interface Road {
  id: string;
  name: string;
  length: number;
  width: number;
  roadType: string;
  streetLights: boolean;
  footpath1Length: number;
  footpath1Width: number;
  footpath1Type: string;
  footpath2Length: number;
  footpath2Width: number;
  footpath2Type: string;
  status: 'Active' | 'Inactive';
}

// ─── Maintenance ────────────────────────────────────────────────────────────

export interface MaintenanceRequest {
  id: string;
  requestType: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  organizationUnit: string;
  entityType: string;
  entityId: string;
  problemCategory: string;
  description: string;
  status:
    | 'Draft'
    | 'Submitted'
    | 'Assigned'
    | 'Inspection Pending'
    | 'Inspection Approved'
    | 'Completed';
  assignedToType: string;
  assignedTo: string;
  closureReport: string;
  createdDate: string;
  updatedDate: string;
}

export interface EstateMaintainer {
  id: string;
  maintainerType: string;
  userName: string;
  status: 'Active' | 'Inactive';
}

export interface MaintenanceHierarchy {
  id: string;
  typeOfWork: string;
  organizationUnit: string;
  defaultAuthority: string;
  verifier: string;
  approver: string;
  status: 'Active' | 'Inactive';
}

export interface WorkOrder {
  id: string;
  maintenanceRequestId: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  scheduledDate: string;
  dueDate: string;
  estimatedHours: number;
  costEstimate: number;
  status: 'Pending' | 'Verified' | 'Approved' | 'Completed' | 'Rejected';
  verifiedBy: string;
  approvedBy: string;
}

export interface WorkOrderTask {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  taskName: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completedAt: string;
}

// ─── Settings Master Data ───────────────────────────────────────────────────

export const initialExternalWallTypes: SettingsMaster[] = [
  { id: '1', name: 'Brick Wall', status: 'Active' },
  { id: '2', name: 'Concrete Wall', status: 'Active' },
  { id: '3', name: 'Stone Wall', status: 'Active' },
  { id: '4', name: 'Glass Curtain Wall', status: 'Active' },
  { id: '5', name: 'Cladding Wall', status: 'Inactive' },
  { id: '6', name: 'Composite Wall', status: 'Active' },
  { id: '7', name: 'Precast Concrete Panel', status: 'Active' },
  { id: '8', name: 'AAC Block Wall', status: 'Active' },
  { id: '9', name: 'Metal Sheet Wall', status: 'Inactive' },
  { id: '10', name: 'Timber Frame Wall', status: 'Active' },
];

export const initialFoundationTypes: SettingsMaster[] = [
  { id: '1', name: 'Isolated Footing', status: 'Active' },
  { id: '2', name: 'Strip Foundation', status: 'Active' },
  { id: '3', name: 'Raft Foundation', status: 'Active' },
  { id: '4', name: 'Pile Foundation', status: 'Active' },
  { id: '5', name: 'Combined Footing', status: 'Active' },
  { id: '6', name: 'Mat Foundation', status: 'Active' },
  { id: '7', name: 'Drilled Shaft', status: 'Inactive' },
  { id: '8', name: 'Caisson Foundation', status: 'Active' },
  { id: '9', name: 'Spread Footing', status: 'Active' },
  { id: '10', name: 'Deep Foundation', status: 'Active' },
];

export const initialRoofTypes: SettingsMaster[] = [
  { id: '1', name: 'Flat Roof', status: 'Active' },
  { id: '2', name: 'Gable Roof', status: 'Active' },
  { id: '3', name: 'Hip Roof', status: 'Active' },
  { id: '4', name: 'Metal Sheet Roof', status: 'Active' },
  { id: '5', name: 'Concrete Slab Roof', status: 'Active' },
  { id: '6', name: 'Tiled Roof', status: 'Inactive' },
  { id: '7', name: 'Dome Roof', status: 'Active' },
  { id: '8', name: 'Green Roof', status: 'Active' },
  { id: '9', name: 'Mansard Roof', status: 'Active' },
  { id: '10', name: 'Shed Roof', status: 'Active' },
];

export const initialSubstationTypes: SettingsMaster[] = [
  { id: '1', name: 'Step-Up Substation', status: 'Active' },
  { id: '2', name: 'Step-Down Substation', status: 'Active' },
  { id: '3', name: 'Distribution Substation', status: 'Active' },
  { id: '4', name: 'Switchyard', status: 'Active' },
  { id: '5', name: 'Indoor Substation', status: 'Active' },
  { id: '6', name: 'Outdoor Substation', status: 'Active' },
  { id: '7', name: 'Underground Substation', status: 'Inactive' },
  { id: '8', name: 'Pole-Mounted Substation', status: 'Active' },
  { id: '9', name: 'Converter Substation', status: 'Active' },
  { id: '10', name: 'Mobile Substation', status: 'Active' },
];

export const initialStructureTypes: SettingsMaster[] = [
  { id: '1', name: 'Academic Building', status: 'Active' },
  { id: '2', name: 'Administrative Building', status: 'Active' },
  { id: '3', name: 'Residential Quarters', status: 'Active' },
  { id: '4', name: 'Service Building', status: 'Active' },
  { id: '5', name: 'Laboratory Complex', status: 'Active' },
  { id: '6', name: 'Library', status: 'Active' },
  { id: '7', name: 'Sports Complex', status: 'Active' },
  { id: '8', name: 'Hostel Block', status: 'Active' },
  { id: '9', name: 'Hospital/Health Centre', status: 'Active' },
  { id: '10', name: 'Workshop/Garage', status: 'Inactive' },
];

export const initialWindowTypes: SettingsMaster[] = [
  { id: '1', name: 'Sliding Window', status: 'Active' },
  { id: '2', name: 'Casement Window', status: 'Active' },
  { id: '3', name: 'Fixed Window', status: 'Active' },
  { id: '4', name: 'Louvered Window', status: 'Active' },
  { id: '5', name: 'Bay Window', status: 'Active' },
  { id: '6', name: 'Awning Window', status: 'Inactive' },
  { id: '7', name: 'Double-Hung Window', status: 'Active' },
  { id: '8', name: 'Pivot Window', status: 'Active' },
  { id: '9', name: 'Hopper Window', status: 'Active' },
  { id: '10', name: 'Tilt-Turn Window', status: 'Active' },
];

export const initialDoorTypes: SettingsMaster[] = [
  { id: '1', name: 'Wooden Panel Door', status: 'Active' },
  { id: '2', name: 'Metal Door', status: 'Active' },
  { id: '3', name: 'Sliding Glass Door', status: 'Active' },
  { id: '4', name: 'Fire-Resistant Door', status: 'Active' },
  { id: '5', name: 'Revolving Door', status: 'Active' },
  { id: '6', name: 'Flush Door', status: 'Active' },
  { id: '7', name: 'Collapsible Gate', status: 'Inactive' },
  { id: '8', name: 'Automatic Sensor Door', status: 'Active' },
  { id: '9', name: 'PVC Door', status: 'Active' },
  { id: '10', name: 'Rolling Shutter', status: 'Active' },
];

export const initialRailingTypes: SettingsMaster[] = [
  { id: '1', name: 'Stainless Steel Railing', status: 'Active' },
  { id: '2', name: 'Glass Railing', status: 'Active' },
  { id: '3', name: 'Wooden Railing', status: 'Active' },
  { id: '4', name: 'Aluminum Railing', status: 'Active' },
  { id: '5', name: 'Wrought Iron Railing', status: 'Active' },
  { id: '6', name: 'Cable Railing', status: 'Inactive' },
  { id: '7', name: 'Concrete Railing', status: 'Active' },
  { id: '8', name: 'Composite Railing', status: 'Active' },
  { id: '9', name: 'Bamboo Railing', status: 'Inactive' },
  { id: '10', name: 'PVC Railing', status: 'Active' },
];

export const initialBlocks: SettingsMaster[] = [
  { id: '1', name: 'Block A', status: 'Active' },
  { id: '2', name: 'Block B', status: 'Active' },
  { id: '3', name: 'Block C', status: 'Active' },
  { id: '4', name: 'Block D', status: 'Active' },
  { id: '5', name: 'Block E', status: 'Active' },
  { id: '6', name: 'Block F', status: 'Inactive' },
  { id: '7', name: 'Block G', status: 'Active' },
  { id: '8', name: 'Block H', status: 'Active' },
  { id: '9', name: 'Block J', status: 'Active' },
  { id: '10', name: 'Block K', status: 'Active' },
];

export const initialFloorLevels: SettingsMaster[] = [
  { id: '1', name: 'Basement', status: 'Active' },
  { id: '2', name: 'Ground Floor', status: 'Active' },
  { id: '3', name: 'First Floor', status: 'Active' },
  { id: '4', name: 'Second Floor', status: 'Active' },
  { id: '5', name: 'Third Floor', status: 'Active' },
  { id: '6', name: 'Fourth Floor', status: 'Active' },
  { id: '7', name: 'Fifth Floor', status: 'Active' },
  { id: '8', name: 'Sixth Floor', status: 'Active' },
  { id: '9', name: 'Terrace', status: 'Active' },
  { id: '10', name: 'Mezzanine', status: 'Active' },
];

export const initialFloorCategories: SettingsMaster[] = [
  { id: '1', name: 'Residential', status: 'Active' },
  { id: '2', name: 'Commercial', status: 'Active' },
  { id: '3', name: 'Administrative', status: 'Active' },
  { id: '4', name: 'Parking', status: 'Active' },
  { id: '5', name: 'Service', status: 'Active' },
  { id: '6', name: 'Academic', status: 'Active' },
  { id: '7', name: 'Storage', status: 'Active' },
  { id: '8', name: 'Utility', status: 'Active' },
  { id: '9', name: 'Recreation', status: 'Inactive' },
  { id: '10', name: 'Medical', status: 'Active' },
];

export const initialFlooringTypes: SettingsMaster[] = [
  { id: '1', name: 'Vitrified Tiles', status: 'Active' },
  { id: '2', name: 'Marble Flooring', status: 'Active' },
  { id: '3', name: 'Wooden Flooring', status: 'Active' },
  { id: '4', name: 'Vinyl Flooring', status: 'Active' },
  { id: '5', name: 'Concrete Flooring', status: 'Active' },
  { id: '6', name: 'Carpet Flooring', status: 'Active' },
  { id: '7', name: 'Granite Flooring', status: 'Active' },
  { id: '8', name: 'Epoxy Flooring', status: 'Active' },
  { id: '9', name: 'Kota Stone', status: 'Active' },
  { id: '10', name: 'Ceramic Tiles', status: 'Inactive' },
];

export const initialRoomTypes: SettingsMaster[] = [
  { id: '1', name: 'Classroom', status: 'Active' },
  { id: '2', name: 'Conference Room', status: 'Active' },
  { id: '3', name: 'Office', status: 'Active' },
  { id: '4', name: 'Laboratory', status: 'Active' },
  { id: '5', name: 'Server Room', status: 'Active' },
  { id: '6', name: 'Storage Room', status: 'Active' },
  { id: '7', name: 'Utility Room', status: 'Active' },
  { id: '8', name: 'Washroom', status: 'Active' },
  { id: '9', name: 'Library Hall', status: 'Active' },
  { id: '10', name: 'Seminar Hall', status: 'Active' },
];

export const initialHouseTypes: SettingsMaster[] = [
  { id: '1', name: 'Type-1 (Junior)', status: 'Active' },
  { id: '2', name: 'Type-2 (Senior)', status: 'Active' },
  { id: '3', name: 'Type-3 (Professor)', status: 'Active' },
  { id: '4', name: 'Type-4 (HoD)', status: 'Active' },
  { id: '5', name: 'Type-5 (Dean)', status: 'Active' },
  { id: '6', name: 'Type-6 (Director/VC)', status: 'Active' },
  { id: '7', name: 'Guest House Unit', status: 'Active' },
  { id: '8', name: 'Staff Quarters', status: 'Active' },
  { id: '9', name: 'Duplex Unit', status: 'Inactive' },
  { id: '10', name: 'Single Room Unit', status: 'Active' },
];

export const initialOpenAreaTypes: SettingsMaster[] = [
  { id: '1', name: 'Garden', status: 'Active' },
  { id: '2', name: 'Park', status: 'Active' },
  { id: '3', name: 'Playground', status: 'Active' },
  { id: '4', name: 'Courtyard', status: 'Active' },
  { id: '5', name: 'Parking Lot', status: 'Active' },
  { id: '6', name: 'Sports Ground', status: 'Active' },
  { id: '7', name: 'Botanical Area', status: 'Active' },
  { id: '8', name: 'Open-Air Auditorium', status: 'Active' },
  { id: '9', name: 'Water Body/Pond', status: 'Inactive' },
  { id: '10', name: 'Nursery', status: 'Active' },
];

export const initialRoadTypes: SettingsMaster[] = [
  { id: '1', name: 'Main Asphalt Road', status: 'Active' },
  { id: '2', name: 'Internal Concrete Road', status: 'Active' },
  { id: '3', name: 'Gravel Road', status: 'Active' },
  { id: '4', name: 'Service Lane', status: 'Active' },
  { id: '5', name: 'Ring Road', status: 'Active' },
  { id: '6', name: 'Access Road', status: 'Active' },
  { id: '7', name: 'Dual Carriageway', status: 'Active' },
  { id: '8', name: 'Cobblestone Road', status: 'Inactive' },
  { id: '9', name: 'Paved Pathway', status: 'Active' },
  { id: '10', name: 'Bituminous Road', status: 'Active' },
];

export const initialFootpathTypes: SettingsMaster[] = [
  { id: '1', name: 'Concrete Footpath', status: 'Active' },
  { id: '2', name: 'Tiled Footpath', status: 'Active' },
  { id: '3', name: 'Paved Footpath', status: 'Active' },
  { id: '4', name: 'Gravel Footpath', status: 'Active' },
  { id: '5', name: 'Asphalt Footpath', status: 'Active' },
  { id: '6', name: 'Brick Footpath', status: 'Active' },
  { id: '7', name: 'Interlocking Block', status: 'Active' },
  { id: '8', name: 'Natural Stone', status: 'Inactive' },
  { id: '9', name: 'Rubber Paved', status: 'Active' },
  { id: '10', name: 'Wooden Boardwalk', status: 'Active' },
];

export const initialCampusKeys: SettingsMaster[] = [
  { id: '1', name: 'Main Campus', status: 'Active' },
  { id: '2', name: 'North Campus', status: 'Active' },
  { id: '3', name: 'South Campus', status: 'Active' },
  { id: '4', name: 'East Campus', status: 'Active' },
  { id: '5', name: 'City Centre Campus', status: 'Active' },
  { id: '6', name: 'Research Park Campus', status: 'Active' },
  { id: '7', name: 'Medical Campus', status: 'Active' },
  { id: '8', name: 'Engineering Campus', status: 'Active' },
  { id: '9', name: 'Law Campus', status: 'Inactive' },
  { id: '10', name: 'Satellite Campus', status: 'Active' },
];

export const initialMaintenanceRequestTypes: SettingsMaster[] = [
  { id: '1', name: 'Corrective Maintenance', status: 'Active' },
  { id: '2', name: 'Preventive Maintenance', status: 'Active' },
  { id: '3', name: 'Emergency Repair', status: 'Active' },
  { id: '4', name: 'Renovation', status: 'Active' },
  { id: '5', name: 'Inspection Request', status: 'Active' },
  { id: '6', name: 'Upgrade Request', status: 'Active' },
  { id: '7', name: 'Breakdown Maintenance', status: 'Active' },
  { id: '8', name: 'Cosmetic Repair', status: 'Active' },
  { id: '9', name: 'Safety Audit', status: 'Active' },
  { id: '10', name: 'General Maintenance', status: 'Inactive' },
];

export const initialMaintenanceIssueCategories: SettingsMaster[] = [
  { id: '1', name: 'Electrical', status: 'Active' },
  { id: '2', name: 'Plumbing', status: 'Active' },
  { id: '3', name: 'Civil/Structural', status: 'Active' },
  { id: '4', name: 'HVAC', status: 'Active' },
  { id: '5', name: 'Carpentry', status: 'Active' },
  { id: '6', name: 'Painting', status: 'Active' },
  { id: '7', name: 'Landscaping', status: 'Active' },
  { id: '8', name: 'IT/Network', status: 'Active' },
  { id: '9', name: 'Fire Safety', status: 'Active' },
  { id: '10', name: 'Pest Control', status: 'Inactive' },
];

export const initialMaintenanceTypes: SettingsMaster[] = [
  { id: '1', name: 'Electrical Work', status: 'Active' },
  { id: '2', name: 'Plumbing Work', status: 'Active' },
  { id: '3', name: 'Masonry Work', status: 'Active' },
  { id: '4', name: 'Welding Work', status: 'Active' },
  { id: '5', name: 'Painting Work', status: 'Active' },
  { id: '6', name: 'Waterproofing', status: 'Active' },
  { id: '7', name: 'Glazing Work', status: 'Active' },
  { id: '8', name: 'Flooring Work', status: 'Active' },
  { id: '9', name: 'Roofing Repair', status: 'Active' },
  { id: '10', name: 'General Labour', status: 'Active' },
];

// ─── Buildings ──────────────────────────────────────────────────────────────

export const initialBuildings: Building[] = [
  {
    id: 'BLD-001',
    name: 'Central Academic Block',
    campus: 'Main Campus',
    block: 'Block A',
    status: 'Active',
    location: 'Near Main Gate, East Wing',
    possessingDepartments: 'Computer Science, Mathematics',
    isResidential: false,
    greenBuilding: true,
    numberOfFloors: 5,
    plotArea: 4200,
    buildingHeight: 22.5,
    plinthArea: 3800,
    foundationDate: '2008-03-15',
    inaugurationDate: '2010-08-20',
    structureType: 'Academic Building',
    foundationType: 'Raft Foundation',
    roofingType: 'Flat Roof',
    exteriorWallType: 'Brick Wall',
    estimatedCost: 45000000,
    tenderedCost: 42000000,
    totalConstructionCost: 48500000,
    wifi: true,
    fireFighting: true,
    generatorBackup: true,
    ups: true,
    escalator: false,
    elevator: true,
    disabledAccessRamp: true,
    cas: true,
    waterHarvesting: true,
    connectedSubstation: 'Distribution Substation',
    etpConnected: false,
    stpConnected: true,
    exteriorWallThickness: 23,
    partitionWallThickness: 11.5,
    parapetWallThickness: 11.5,
    roofSlabThickness: 15,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 3200,
    exteriorGritPlasterArea: 800,
    exteriorStoneWallArea: 400,
    latitude: '28.6139',
    longitude: '77.2090',
    fitnessCertificateStatus: 'Valid',
  },
  {
    id: 'BLD-002',
    name: 'Science & Technology Centre',
    campus: 'Main Campus',
    block: 'Block B',
    status: 'Active',
    location: 'Adjacent to Library Complex',
    possessingDepartments: 'Physics, Chemistry, Electronics',
    isResidential: false,
    greenBuilding: false,
    numberOfFloors: 4,
    plotArea: 3600,
    buildingHeight: 18,
    plinthArea: 3200,
    foundationDate: '2012-06-10',
    inaugurationDate: '2014-11-25',
    structureType: 'Laboratory Complex',
    foundationType: 'Pile Foundation',
    roofingType: 'Flat Roof',
    exteriorWallType: 'Concrete Wall',
    estimatedCost: 65000000,
    tenderedCost: 60000000,
    totalConstructionCost: 68000000,
    wifi: true,
    fireFighting: true,
    generatorBackup: true,
    ups: true,
    escalator: false,
    elevator: true,
    disabledAccessRamp: true,
    cas: true,
    waterHarvesting: false,
    connectedSubstation: 'Step-Down Substation',
    etpConnected: true,
    stpConnected: true,
    exteriorWallThickness: 30,
    partitionWallThickness: 15,
    parapetWallThickness: 11.5,
    roofSlabThickness: 18,
    wallPlasteringThickness: 2,
    exteriorPaintableArea: 2800,
    exteriorGritPlasterArea: 600,
    exteriorStoneWallArea: 200,
    latitude: '28.6145',
    longitude: '77.2095',
    fitnessCertificateStatus: 'Valid',
  },
  {
    id: 'BLD-003',
    name: 'Administrative Block',
    campus: 'Main Campus',
    block: 'Block A',
    status: 'Active',
    location: 'Central Campus, opposite Main Auditorium',
    possessingDepartments: 'Administration, Finance, HR',
    isResidential: false,
    greenBuilding: false,
    numberOfFloors: 3,
    plotArea: 2800,
    buildingHeight: 14,
    plinthArea: 2500,
    foundationDate: '2005-01-20',
    inaugurationDate: '2007-04-15',
    structureType: 'Administrative Building',
    foundationType: 'Strip Foundation',
    roofingType: 'Flat Roof',
    exteriorWallType: 'Brick Wall',
    estimatedCost: 25000000,
    tenderedCost: 23000000,
    totalConstructionCost: 27000000,
    wifi: true,
    fireFighting: true,
    generatorBackup: true,
    ups: true,
    escalator: false,
    elevator: true,
    disabledAccessRamp: true,
    cas: true,
    waterHarvesting: true,
    connectedSubstation: 'Distribution Substation',
    etpConnected: false,
    stpConnected: true,
    exteriorWallThickness: 23,
    partitionWallThickness: 11.5,
    parapetWallThickness: 11.5,
    roofSlabThickness: 15,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 2200,
    exteriorGritPlasterArea: 500,
    exteriorStoneWallArea: 300,
    latitude: '28.6135',
    longitude: '77.2085',
    fitnessCertificateStatus: 'Valid',
  },
  {
    id: 'BLD-004',
    name: 'Faculty Residences — Type-3',
    campus: 'North Campus',
    block: 'Block D',
    status: 'Active',
    location: 'North Campus Residential Colony',
    possessingDepartments: 'Estate Office',
    isResidential: true,
    greenBuilding: false,
    numberOfFloors: 2,
    plotArea: 5200,
    buildingHeight: 8,
    plinthArea: 4800,
    foundationDate: '2015-09-01',
    inaugurationDate: '2017-12-10',
    structureType: 'Residential Quarters',
    foundationType: 'Isolated Footing',
    roofingType: 'Flat Roof',
    exteriorWallType: 'Brick Wall',
    estimatedCost: 35000000,
    tenderedCost: 32000000,
    totalConstructionCost: 37000000,
    wifi: true,
    fireFighting: false,
    generatorBackup: false,
    ups: false,
    escalator: false,
    elevator: false,
    disabledAccessRamp: true,
    cas: false,
    waterHarvesting: true,
    connectedSubstation: 'Distribution Substation',
    etpConnected: false,
    stpConnected: true,
    exteriorWallThickness: 23,
    partitionWallThickness: 11.5,
    parapetWallThickness: 11.5,
    roofSlabThickness: 12,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 4500,
    exteriorGritPlasterArea: 0,
    exteriorStoneWallArea: 0,
    latitude: '28.6180',
    longitude: '77.2060',
    fitnessCertificateStatus: 'Valid',
  },
  {
    id: 'BLD-005',
    name: 'Central Library',
    campus: 'Main Campus',
    block: 'Block C',
    status: 'Active',
    location: 'Heart of Campus, near Clock Tower',
    possessingDepartments: 'Library Sciences',
    isResidential: false,
    greenBuilding: true,
    numberOfFloors: 4,
    plotArea: 5000,
    buildingHeight: 20,
    plinthArea: 4500,
    foundationDate: '2010-02-14',
    inaugurationDate: '2012-07-01',
    structureType: 'Library',
    foundationType: 'Raft Foundation',
    roofingType: 'Dome Roof',
    exteriorWallType: 'Glass Curtain Wall',
    estimatedCost: 80000000,
    tenderedCost: 75000000,
    totalConstructionCost: 85000000,
    wifi: true,
    fireFighting: true,
    generatorBackup: true,
    ups: true,
    escalator: true,
    elevator: true,
    disabledAccessRamp: true,
    cas: true,
    waterHarvesting: true,
    connectedSubstation: 'Step-Down Substation',
    etpConnected: false,
    stpConnected: true,
    exteriorWallThickness: 20,
    partitionWallThickness: 10,
    parapetWallThickness: 10,
    roofSlabThickness: 20,
    wallPlasteringThickness: 2,
    exteriorPaintableArea: 1500,
    exteriorGritPlasterArea: 200,
    exteriorStoneWallArea: 1800,
    latitude: '28.6142',
    longitude: '77.2088',
    fitnessCertificateStatus: 'Valid',
  },
  {
    id: 'BLD-006',
    name: 'Sports Complex',
    campus: 'South Campus',
    block: 'Block E',
    status: 'Active',
    location: 'South Campus, near Sports Ground',
    possessingDepartments: 'Physical Education',
    isResidential: false,
    greenBuilding: false,
    numberOfFloors: 2,
    plotArea: 8000,
    buildingHeight: 12,
    plinthArea: 7200,
    foundationDate: '2018-04-10',
    inaugurationDate: '2020-01-26',
    structureType: 'Sports Complex',
    foundationType: 'Combined Footing',
    roofingType: 'Metal Sheet Roof',
    exteriorWallType: 'Concrete Wall',
    estimatedCost: 55000000,
    tenderedCost: 50000000,
    totalConstructionCost: 58000000,
    wifi: true,
    fireFighting: true,
    generatorBackup: true,
    ups: false,
    escalator: false,
    elevator: false,
    disabledAccessRamp: true,
    cas: false,
    waterHarvesting: false,
    connectedSubstation: 'Distribution Substation',
    etpConnected: false,
    stpConnected: false,
    exteriorWallThickness: 25,
    partitionWallThickness: 15,
    parapetWallThickness: 11.5,
    roofSlabThickness: 10,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 5000,
    exteriorGritPlasterArea: 0,
    exteriorStoneWallArea: 0,
    latitude: '28.6100',
    longitude: '77.2110',
    fitnessCertificateStatus: 'Valid',
  },
  {
    id: 'BLD-007',
    name: 'Boys Hostel Block-1',
    campus: 'East Campus',
    block: 'Block G',
    status: 'Active',
    location: 'East Campus, Hostel Zone',
    possessingDepartments: 'Hostel Administration',
    isResidential: false,
    greenBuilding: false,
    numberOfFloors: 6,
    plotArea: 3000,
    buildingHeight: 24,
    plinthArea: 2700,
    foundationDate: '2016-08-15',
    inaugurationDate: '2019-03-20',
    structureType: 'Hostel Block',
    foundationType: 'Pile Foundation',
    roofingType: 'Flat Roof',
    exteriorWallType: 'AAC Block Wall',
    estimatedCost: 40000000,
    tenderedCost: 37000000,
    totalConstructionCost: 43000000,
    wifi: true,
    fireFighting: true,
    generatorBackup: true,
    ups: true,
    escalator: false,
    elevator: true,
    disabledAccessRamp: true,
    cas: false,
    waterHarvesting: true,
    connectedSubstation: 'Distribution Substation',
    etpConnected: false,
    stpConnected: true,
    exteriorWallThickness: 20,
    partitionWallThickness: 10,
    parapetWallThickness: 10,
    roofSlabThickness: 15,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 3800,
    exteriorGritPlasterArea: 400,
    exteriorStoneWallArea: 0,
    latitude: '28.6160',
    longitude: '77.2130',
    fitnessCertificateStatus: 'Valid',
  },
  {
    id: 'BLD-008',
    name: 'Health Centre',
    campus: 'Main Campus',
    block: 'Block B',
    status: 'Active',
    location: 'Near Administrative Block',
    possessingDepartments: 'Medical Services',
    isResidential: false,
    greenBuilding: false,
    numberOfFloors: 2,
    plotArea: 1500,
    buildingHeight: 9,
    plinthArea: 1350,
    foundationDate: '2003-11-05',
    inaugurationDate: '2005-06-15',
    structureType: 'Hospital/Health Centre',
    foundationType: 'Strip Foundation',
    roofingType: 'Flat Roof',
    exteriorWallType: 'Brick Wall',
    estimatedCost: 12000000,
    tenderedCost: 11000000,
    totalConstructionCost: 13000000,
    wifi: true,
    fireFighting: true,
    generatorBackup: true,
    ups: true,
    escalator: false,
    elevator: true,
    disabledAccessRamp: true,
    cas: true,
    waterHarvesting: false,
    connectedSubstation: 'Distribution Substation',
    etpConnected: false,
    stpConnected: true,
    exteriorWallThickness: 23,
    partitionWallThickness: 11.5,
    parapetWallThickness: 11.5,
    roofSlabThickness: 12,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 1200,
    exteriorGritPlasterArea: 200,
    exteriorStoneWallArea: 0,
    latitude: '28.6137',
    longitude: '77.2083',
    fitnessCertificateStatus: 'Expired',
  },
  {
    id: 'BLD-009',
    name: 'Engineering Workshop',
    campus: 'Engineering Campus',
    block: 'Block H',
    status: 'Inactive',
    location: 'Engineering Campus, behind Lab Complex',
    possessingDepartments: 'Mechanical, Civil Engineering',
    isResidential: false,
    greenBuilding: false,
    numberOfFloors: 1,
    plotArea: 2200,
    buildingHeight: 6,
    plinthArea: 2000,
    foundationDate: '1998-07-20',
    inaugurationDate: '2000-01-10',
    structureType: 'Workshop/Garage',
    foundationType: 'Spread Footing',
    roofingType: 'Metal Sheet Roof',
    exteriorWallType: 'Stone Wall',
    estimatedCost: 8000000,
    tenderedCost: 7500000,
    totalConstructionCost: 9000000,
    wifi: false,
    fireFighting: true,
    generatorBackup: false,
    ups: false,
    escalator: false,
    elevator: false,
    disabledAccessRamp: false,
    cas: false,
    waterHarvesting: false,
    connectedSubstation: 'Pole-Mounted Substation',
    etpConnected: false,
    stpConnected: false,
    exteriorWallThickness: 35,
    partitionWallThickness: 23,
    parapetWallThickness: 11.5,
    roofSlabThickness: 8,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 1800,
    exteriorGritPlasterArea: 0,
    exteriorStoneWallArea: 1200,
    latitude: '28.6200',
    longitude: '77.2150',
    fitnessCertificateStatus: 'Expired',
  },
  {
    id: 'BLD-010',
    name: 'Staff Quarters — Type-1',
    campus: 'North Campus',
    block: 'Block D',
    status: 'Active',
    location: 'North Campus, Staff Colony',
    possessingDepartments: 'Estate Office',
    isResidential: true,
    greenBuilding: false,
    numberOfFloors: 2,
    plotArea: 3500,
    buildingHeight: 7.5,
    plinthArea: 3200,
    foundationDate: '2020-01-15',
    inaugurationDate: '2022-06-30',
    structureType: 'Residential Quarters',
    foundationType: 'Isolated Footing',
    roofingType: 'Flat Roof',
    exteriorWallType: 'AAC Block Wall',
    estimatedCost: 28000000,
    tenderedCost: 26000000,
    totalConstructionCost: 30000000,
    wifi: true,
    fireFighting: false,
    generatorBackup: false,
    ups: false,
    escalator: false,
    elevator: false,
    disabledAccessRamp: true,
    cas: false,
    waterHarvesting: true,
    connectedSubstation: 'Distribution Substation',
    etpConnected: false,
    stpConnected: true,
    exteriorWallThickness: 20,
    partitionWallThickness: 10,
    parapetWallThickness: 10,
    roofSlabThickness: 12,
    wallPlasteringThickness: 1.5,
    exteriorPaintableArea: 3000,
    exteriorGritPlasterArea: 0,
    exteriorStoneWallArea: 0,
    latitude: '28.6185',
    longitude: '77.2055',
    fitnessCertificateStatus: 'Valid',
  },
];

// ─── Floors ─────────────────────────────────────────────────────────────────

export const initialFloors: Floor[] = [
  {
    id: 'FLR-001',
    buildingId: 'BLD-001',
    buildingName: 'Central Academic Block',
    floorLevel: 'Ground Floor',
    floorCategory: 'Academic',
    flooringType: 'Vitrified Tiles',
    totalArea: 760,
    usableArea: 700,
    status: 'Active',
  },
  {
    id: 'FLR-002',
    buildingId: 'BLD-001',
    buildingName: 'Central Academic Block',
    floorLevel: 'First Floor',
    floorCategory: 'Academic',
    flooringType: 'Vitrified Tiles',
    totalArea: 760,
    usableArea: 710,
    status: 'Active',
  },
  {
    id: 'FLR-003',
    buildingId: 'BLD-001',
    buildingName: 'Central Academic Block',
    floorLevel: 'Second Floor',
    floorCategory: 'Academic',
    flooringType: 'Marble Flooring',
    totalArea: 760,
    usableArea: 700,
    status: 'Active',
  },
  {
    id: 'FLR-004',
    buildingId: 'BLD-002',
    buildingName: 'Science & Technology Centre',
    floorLevel: 'Ground Floor',
    floorCategory: 'Academic',
    flooringType: 'Epoxy Flooring',
    totalArea: 800,
    usableArea: 750,
    status: 'Active',
  },
  {
    id: 'FLR-005',
    buildingId: 'BLD-002',
    buildingName: 'Science & Technology Centre',
    floorLevel: 'First Floor',
    floorCategory: 'Academic',
    flooringType: 'Epoxy Flooring',
    totalArea: 800,
    usableArea: 740,
    status: 'Active',
  },
  {
    id: 'FLR-006',
    buildingId: 'BLD-003',
    buildingName: 'Administrative Block',
    floorLevel: 'Ground Floor',
    floorCategory: 'Administrative',
    flooringType: 'Marble Flooring',
    totalArea: 833,
    usableArea: 780,
    status: 'Active',
  },
  {
    id: 'FLR-007',
    buildingId: 'BLD-003',
    buildingName: 'Administrative Block',
    floorLevel: 'First Floor',
    floorCategory: 'Administrative',
    flooringType: 'Marble Flooring',
    totalArea: 833,
    usableArea: 770,
    status: 'Active',
  },
  {
    id: 'FLR-008',
    buildingId: 'BLD-005',
    buildingName: 'Central Library',
    floorLevel: 'Ground Floor',
    floorCategory: 'Academic',
    flooringType: 'Granite Flooring',
    totalArea: 1125,
    usableArea: 1050,
    status: 'Active',
  },
  {
    id: 'FLR-009',
    buildingId: 'BLD-005',
    buildingName: 'Central Library',
    floorLevel: 'First Floor',
    floorCategory: 'Academic',
    flooringType: 'Granite Flooring',
    totalArea: 1125,
    usableArea: 1040,
    status: 'Active',
  },
  {
    id: 'FLR-010',
    buildingId: 'BLD-007',
    buildingName: 'Boys Hostel Block-1',
    floorLevel: 'Ground Floor',
    floorCategory: 'Residential',
    flooringType: 'Vitrified Tiles',
    totalArea: 450,
    usableArea: 420,
    status: 'Active',
  },
  {
    id: 'FLR-011',
    buildingId: 'BLD-004',
    buildingName: 'Faculty Residences — Type-3',
    floorLevel: 'Ground Floor',
    floorCategory: 'Residential',
    flooringType: 'Vitrified Tiles',
    totalArea: 2400,
    usableArea: 2200,
    status: 'Active',
  },
  {
    id: 'FLR-012',
    buildingId: 'BLD-006',
    buildingName: 'Sports Complex',
    floorLevel: 'Ground Floor',
    floorCategory: 'Recreation',
    flooringType: 'Wooden Flooring',
    totalArea: 3600,
    usableArea: 3400,
    status: 'Active',
  },
];

// ─── Rooms ──────────────────────────────────────────────────────────────────

export const initialRooms: Room[] = [
  {
    id: 'RM-001',
    buildingId: 'BLD-001',
    floorId: 'FLR-001',
    buildingName: 'Central Academic Block',
    floorLevel: 'Ground Floor',
    roomNumber: 'CAB-G01',
    roomType: 'Classroom',
    capacity: 60,
    area: 85,
    status: 'Active',
  },
  {
    id: 'RM-002',
    buildingId: 'BLD-001',
    floorId: 'FLR-001',
    buildingName: 'Central Academic Block',
    floorLevel: 'Ground Floor',
    roomNumber: 'CAB-G02',
    roomType: 'Classroom',
    capacity: 60,
    area: 85,
    status: 'Active',
  },
  {
    id: 'RM-003',
    buildingId: 'BLD-001',
    floorId: 'FLR-001',
    buildingName: 'Central Academic Block',
    floorLevel: 'Ground Floor',
    roomNumber: 'CAB-G03',
    roomType: 'Seminar Hall',
    capacity: 120,
    area: 180,
    status: 'Active',
  },
  {
    id: 'RM-004',
    buildingId: 'BLD-001',
    floorId: 'FLR-002',
    buildingName: 'Central Academic Block',
    floorLevel: 'First Floor',
    roomNumber: 'CAB-101',
    roomType: 'Office',
    capacity: 4,
    area: 30,
    status: 'Active',
  },
  {
    id: 'RM-005',
    buildingId: 'BLD-002',
    floorId: 'FLR-004',
    buildingName: 'Science & Technology Centre',
    floorLevel: 'Ground Floor',
    roomNumber: 'STC-G01',
    roomType: 'Laboratory',
    capacity: 30,
    area: 120,
    status: 'Active',
  },
  {
    id: 'RM-006',
    buildingId: 'BLD-002',
    floorId: 'FLR-004',
    buildingName: 'Science & Technology Centre',
    floorLevel: 'Ground Floor',
    roomNumber: 'STC-G02',
    roomType: 'Laboratory',
    capacity: 25,
    area: 100,
    status: 'Active',
  },
  {
    id: 'RM-007',
    buildingId: 'BLD-002',
    floorId: 'FLR-005',
    buildingName: 'Science & Technology Centre',
    floorLevel: 'First Floor',
    roomNumber: 'STC-101',
    roomType: 'Server Room',
    capacity: 2,
    area: 40,
    status: 'Active',
  },
  {
    id: 'RM-008',
    buildingId: 'BLD-003',
    floorId: 'FLR-006',
    buildingName: 'Administrative Block',
    floorLevel: 'Ground Floor',
    roomNumber: 'ADM-G01',
    roomType: 'Office',
    capacity: 8,
    area: 50,
    status: 'Active',
  },
  {
    id: 'RM-009',
    buildingId: 'BLD-003',
    floorId: 'FLR-006',
    buildingName: 'Administrative Block',
    floorLevel: 'Ground Floor',
    roomNumber: 'ADM-G02',
    roomType: 'Conference Room',
    capacity: 20,
    area: 65,
    status: 'Active',
  },
  {
    id: 'RM-010',
    buildingId: 'BLD-005',
    floorId: 'FLR-008',
    buildingName: 'Central Library',
    floorLevel: 'Ground Floor',
    roomNumber: 'LIB-G01',
    roomType: 'Library Hall',
    capacity: 200,
    area: 500,
    status: 'Active',
  },
  {
    id: 'RM-011',
    buildingId: 'BLD-003',
    floorId: 'FLR-007',
    buildingName: 'Administrative Block',
    floorLevel: 'First Floor',
    roomNumber: 'ADM-101',
    roomType: 'Washroom',
    capacity: 0,
    area: 15,
    status: 'Active',
  },
  {
    id: 'RM-012',
    buildingId: 'BLD-001',
    floorId: 'FLR-003',
    buildingName: 'Central Academic Block',
    floorLevel: 'Second Floor',
    roomNumber: 'CAB-201',
    roomType: 'Classroom',
    capacity: 45,
    area: 70,
    status: 'Active',
  },
];

// ─── Houses ─────────────────────────────────────────────────────────────────

export const initialHouses: House[] = [
  {
    id: 'HSE-001',
    buildingId: 'BLD-004',
    buildingName: 'Faculty Residences — Type-3',
    houseNumber: 'FR-3/01',
    houseType: 'Type-3 (Professor)',
    occupantName: 'Dr. Suresh Menon',
    area: 120,
    status: 'Active',
  },
  {
    id: 'HSE-002',
    buildingId: 'BLD-004',
    buildingName: 'Faculty Residences — Type-3',
    houseNumber: 'FR-3/02',
    houseType: 'Type-3 (Professor)',
    occupantName: 'Dr. Anjali Sharma',
    area: 120,
    status: 'Active',
  },
  {
    id: 'HSE-003',
    buildingId: 'BLD-004',
    buildingName: 'Faculty Residences — Type-3',
    houseNumber: 'FR-3/03',
    houseType: 'Type-3 (Professor)',
    occupantName: '',
    area: 120,
    status: 'Active',
  },
  {
    id: 'HSE-004',
    buildingId: 'BLD-010',
    buildingName: 'Staff Quarters — Type-1',
    houseNumber: 'SQ-1/01',
    houseType: 'Type-1 (Junior)',
    occupantName: 'Mr. Ravi Kumar',
    area: 55,
    status: 'Active',
  },
  {
    id: 'HSE-005',
    buildingId: 'BLD-010',
    buildingName: 'Staff Quarters — Type-1',
    houseNumber: 'SQ-1/02',
    houseType: 'Type-1 (Junior)',
    occupantName: 'Ms. Priya Singh',
    area: 55,
    status: 'Active',
  },
  {
    id: 'HSE-006',
    buildingId: 'BLD-010',
    buildingName: 'Staff Quarters — Type-1',
    houseNumber: 'SQ-1/03',
    houseType: 'Type-1 (Junior)',
    occupantName: '',
    area: 55,
    status: 'Active',
  },
  {
    id: 'HSE-007',
    buildingId: 'BLD-010',
    buildingName: 'Staff Quarters — Type-1',
    houseNumber: 'SQ-1/04',
    houseType: 'Single Room Unit',
    occupantName: 'Mr. Arjun Das',
    area: 35,
    status: 'Active',
  },
  {
    id: 'HSE-008',
    buildingId: 'BLD-004',
    buildingName: 'Faculty Residences — Type-3',
    houseNumber: 'FR-3/04',
    houseType: 'Type-3 (Professor)',
    occupantName: 'Dr. Kavita Nair',
    area: 120,
    status: 'Active',
  },
  {
    id: 'HSE-009',
    buildingId: 'BLD-010',
    buildingName: 'Staff Quarters — Type-1',
    houseNumber: 'SQ-1/05',
    houseType: 'Staff Quarters',
    occupantName: 'Mr. Deepak Verma',
    area: 45,
    status: 'Inactive',
  },
  {
    id: 'HSE-010',
    buildingId: 'BLD-004',
    buildingName: 'Faculty Residences — Type-3',
    houseNumber: 'FR-3/05',
    houseType: 'Type-3 (Professor)',
    occupantName: '',
    area: 120,
    status: 'Active',
  },
];

// ─── Open Areas ─────────────────────────────────────────────────────────────

export const initialOpenAreas: OpenArea[] = [
  {
    id: 'OA-001',
    campus: 'Main Campus',
    name: 'Central Botanical Garden',
    areaType: 'Garden',
    landmark: 'Near Central Library',
    totalLandArea: 5200,
    status: 'Active',
  },
  {
    id: 'OA-002',
    campus: 'Main Campus',
    name: "Students' Park",
    areaType: 'Park',
    landmark: 'Opposite Boys Hostel',
    totalLandArea: 3500,
    status: 'Active',
  },
  {
    id: 'OA-003',
    campus: 'South Campus',
    name: 'Cricket Ground',
    areaType: 'Sports Ground',
    landmark: 'Behind Sports Complex',
    totalLandArea: 15000,
    status: 'Active',
  },
  {
    id: 'OA-004',
    campus: 'Main Campus',
    name: 'Main Parking Area',
    areaType: 'Parking Lot',
    landmark: 'Near Main Gate',
    totalLandArea: 4800,
    status: 'Active',
  },
  {
    id: 'OA-005',
    campus: 'North Campus',
    name: 'Faculty Club Courtyard',
    areaType: 'Courtyard',
    landmark: 'Adjacent to Faculty Residences',
    totalLandArea: 1200,
    status: 'Active',
  },
  {
    id: 'OA-006',
    campus: 'Main Campus',
    name: 'Rose Garden',
    areaType: 'Garden',
    landmark: 'Behind Administrative Block',
    totalLandArea: 800,
    status: 'Active',
  },
  {
    id: 'OA-007',
    campus: 'East Campus',
    name: 'Basketball Court',
    areaType: 'Playground',
    landmark: 'Hostel Zone',
    totalLandArea: 600,
    status: 'Active',
  },
  {
    id: 'OA-008',
    campus: 'South Campus',
    name: 'Football Field',
    areaType: 'Sports Ground',
    landmark: 'South Campus Sports Area',
    totalLandArea: 7200,
    status: 'Active',
  },
  {
    id: 'OA-009',
    campus: 'Main Campus',
    name: 'Open-Air Theatre',
    areaType: 'Open-Air Auditorium',
    landmark: 'Central Campus',
    totalLandArea: 2000,
    status: 'Active',
  },
  {
    id: 'OA-010',
    campus: 'Research Park Campus',
    name: 'Incubation Centre Lawn',
    areaType: 'Courtyard',
    landmark: 'Research Park Gate',
    totalLandArea: 1500,
    status: 'Inactive',
  },
];

// ─── Roads ──────────────────────────────────────────────────────────────────

export const initialRoads: Road[] = [
  {
    id: 'RD-001',
    name: 'University Main Road',
    length: 2.4,
    width: 12,
    roadType: 'Main Asphalt Road',
    streetLights: true,
    footpath1Length: 2400,
    footpath1Width: 2,
    footpath1Type: 'Concrete Footpath',
    footpath2Length: 2400,
    footpath2Width: 2,
    footpath2Type: 'Concrete Footpath',
    status: 'Active',
  },
  {
    id: 'RD-002',
    name: 'Academic Ring Road',
    length: 1.8,
    width: 8,
    roadType: 'Ring Road',
    streetLights: true,
    footpath1Length: 1800,
    footpath1Width: 1.5,
    footpath1Type: 'Tiled Footpath',
    footpath2Length: 0,
    footpath2Width: 0,
    footpath2Type: '',
    status: 'Active',
  },
  {
    id: 'RD-003',
    name: 'North Campus Internal Road',
    length: 0.9,
    width: 6,
    roadType: 'Internal Concrete Road',
    streetLights: true,
    footpath1Length: 900,
    footpath1Width: 1.5,
    footpath1Type: 'Paved Footpath',
    footpath2Length: 900,
    footpath2Width: 1,
    footpath2Type: 'Gravel Footpath',
    status: 'Active',
  },
  {
    id: 'RD-004',
    name: 'Hostel Zone Access Road',
    length: 0.6,
    width: 7,
    roadType: 'Access Road',
    streetLights: true,
    footpath1Length: 600,
    footpath1Width: 1.5,
    footpath1Type: 'Interlocking Block',
    footpath2Length: 0,
    footpath2Width: 0,
    footpath2Type: '',
    status: 'Active',
  },
  {
    id: 'RD-005',
    name: 'Service Lane — South',
    length: 0.4,
    width: 4,
    roadType: 'Service Lane',
    streetLights: false,
    footpath1Length: 0,
    footpath1Width: 0,
    footpath1Type: '',
    footpath2Length: 0,
    footpath2Width: 0,
    footpath2Type: '',
    status: 'Active',
  },
  {
    id: 'RD-006',
    name: 'Sports Complex Approach',
    length: 0.5,
    width: 6,
    roadType: 'Internal Concrete Road',
    streetLights: true,
    footpath1Length: 500,
    footpath1Width: 2,
    footpath1Type: 'Concrete Footpath',
    footpath2Length: 500,
    footpath2Width: 1.5,
    footpath2Type: 'Tiled Footpath',
    status: 'Active',
  },
  {
    id: 'RD-007',
    name: 'Research Park Boulevard',
    length: 1.2,
    width: 10,
    roadType: 'Dual Carriageway',
    streetLights: true,
    footpath1Length: 1200,
    footpath1Width: 2.5,
    footpath1Type: 'Paved Footpath',
    footpath2Length: 1200,
    footpath2Width: 2.5,
    footpath2Type: 'Paved Footpath',
    status: 'Active',
  },
  {
    id: 'RD-008',
    name: 'Old Gravel Path',
    length: 0.3,
    width: 3,
    roadType: 'Gravel Road',
    streetLights: false,
    footpath1Length: 0,
    footpath1Width: 0,
    footpath1Type: '',
    footpath2Length: 0,
    footpath2Width: 0,
    footpath2Type: '',
    status: 'Inactive',
  },
  {
    id: 'RD-009',
    name: 'Medical Campus Road',
    length: 0.7,
    width: 7,
    roadType: 'Bituminous Road',
    streetLights: true,
    footpath1Length: 700,
    footpath1Width: 1.5,
    footpath1Type: 'Brick Footpath',
    footpath2Length: 0,
    footpath2Width: 0,
    footpath2Type: '',
    status: 'Active',
  },
  {
    id: 'RD-010',
    name: 'VIP Entry Road',
    length: 0.3,
    width: 8,
    roadType: 'Main Asphalt Road',
    streetLights: true,
    footpath1Length: 300,
    footpath1Width: 2,
    footpath1Type: 'Natural Stone',
    footpath2Length: 300,
    footpath2Width: 2,
    footpath2Type: 'Natural Stone',
    status: 'Active',
  },
];

// ─── Maintenance Requests ───────────────────────────────────────────────────

export const initialMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'MR-001',
    requestType: 'Corrective Maintenance',
    priority: 'High',
    organizationUnit: 'Computer Science',
    entityType: 'Building',
    entityId: 'Central Academic Block',
    problemCategory: 'Electrical',
    description:
      'Flickering lights in corridor on 2nd floor, affecting multiple classrooms.',
    status: 'Completed',
    assignedToType: 'Electrical Work',
    assignedTo: 'Mr. Vinod Electrician',
    closureReport: 'Replaced faulty MCB and wiring in distribution board.',
    createdDate: '2025-11-10',
    updatedDate: '2025-11-15',
  },
  {
    id: 'MR-002',
    requestType: 'Emergency Repair',
    priority: 'Critical',
    organizationUnit: 'Administration',
    entityType: 'Building',
    entityId: 'Administrative Block',
    problemCategory: 'Plumbing',
    description:
      'Burst water pipe in washroom on ground floor. Water flooding the corridor.',
    status: 'Completed',
    assignedToType: 'Plumbing Work',
    assignedTo: 'Mr. Ramesh Plumber',
    closureReport: 'Replaced burst GI pipe with CPVC pipe. Sealed all joints.',
    createdDate: '2025-12-01',
    updatedDate: '2025-12-02',
  },
  {
    id: 'MR-003',
    requestType: 'Preventive Maintenance',
    priority: 'Medium',
    organizationUnit: 'Library Sciences',
    entityType: 'Building',
    entityId: 'Central Library',
    problemCategory: 'HVAC',
    description:
      'Annual maintenance of centralized air conditioning system in the reading halls.',
    status: 'Assigned',
    assignedToType: 'General Labour',
    assignedTo: 'M/s Cool Air Services',
    closureReport: '',
    createdDate: '2026-01-05',
    updatedDate: '2026-01-08',
  },
  {
    id: 'MR-004',
    requestType: 'Renovation',
    priority: 'Low',
    organizationUnit: 'Physics',
    entityType: 'Room',
    entityId: 'STC-G01',
    problemCategory: 'Painting',
    description:
      'Re-painting required in the ground floor physics lab. Walls showing dampness patches.',
    status: 'Inspection Approved',
    assignedToType: 'Painting Work',
    assignedTo: 'Mr. Sunil Painter',
    closureReport: '',
    createdDate: '2026-01-12',
    updatedDate: '2026-01-20',
  },
  {
    id: 'MR-005',
    requestType: 'Corrective Maintenance',
    priority: 'High',
    organizationUnit: 'Hostel Administration',
    entityType: 'Building',
    entityId: 'Boys Hostel Block-1',
    problemCategory: 'Civil/Structural',
    description:
      'Cracks observed on parapet wall of terrace. Needs immediate structural assessment.',
    status: 'Inspection Pending',
    assignedToType: 'Masonry Work',
    assignedTo: 'M/s Buildsafe Contractors',
    closureReport: '',
    createdDate: '2026-02-01',
    updatedDate: '2026-02-05',
  },
  {
    id: 'MR-006',
    requestType: 'Inspection Request',
    priority: 'Medium',
    organizationUnit: 'Medical Services',
    entityType: 'Building',
    entityId: 'Health Centre',
    problemCategory: 'Fire Safety',
    description:
      'Annual fire safety inspection and extinguisher recharge for Health Centre.',
    status: 'Submitted',
    assignedToType: '',
    assignedTo: '',
    closureReport: '',
    createdDate: '2026-02-10',
    updatedDate: '2026-02-10',
  },
  {
    id: 'MR-007',
    requestType: 'Upgrade Request',
    priority: 'Low',
    organizationUnit: 'Computer Science',
    entityType: 'Room',
    entityId: 'CAB-G01',
    problemCategory: 'IT/Network',
    description:
      'Upgrade LAN cabling from Cat-5 to Cat-6A for improved network speed in classroom G01.',
    status: 'Draft',
    assignedToType: '',
    assignedTo: '',
    closureReport: '',
    createdDate: '2026-02-15',
    updatedDate: '2026-02-15',
  },
  {
    id: 'MR-008',
    requestType: 'Corrective Maintenance',
    priority: 'Medium',
    organizationUnit: 'Physical Education',
    entityType: 'Building',
    entityId: 'Sports Complex',
    problemCategory: 'Carpentry',
    description:
      'Damaged wooden flooring in indoor badminton court needs repair/replacement.',
    status: 'Assigned',
    assignedToType: 'General Labour',
    assignedTo: 'Mr. Ashok Carpenter',
    closureReport: '',
    createdDate: '2026-02-18',
    updatedDate: '2026-02-20',
  },
  {
    id: 'MR-009',
    requestType: 'Preventive Maintenance',
    priority: 'Medium',
    organizationUnit: 'Estate Office',
    entityType: 'Building',
    entityId: 'Faculty Residences — Type-3',
    problemCategory: 'Plumbing',
    description:
      'Annual plumbing inspection and maintenance for all faculty residences in Block D.',
    status: 'Submitted',
    assignedToType: '',
    assignedTo: '',
    closureReport: '',
    createdDate: '2026-02-20',
    updatedDate: '2026-02-20',
  },
  {
    id: 'MR-010',
    requestType: 'General Maintenance',
    priority: 'Low',
    organizationUnit: 'Estate Office',
    entityType: 'Road',
    entityId: 'Old Gravel Path',
    problemCategory: 'Landscaping',
    description:
      'Overgrown vegetation along the old gravel path near engineering campus.',
    status: 'Draft',
    assignedToType: '',
    assignedTo: '',
    closureReport: '',
    createdDate: '2026-02-22',
    updatedDate: '2026-02-22',
  },
];

// ─── Estate Maintainers ─────────────────────────────────────────────────────

export const initialEstateMaintainers: EstateMaintainer[] = [
  {
    id: '1',
    maintainerType: 'Electrical Work',
    userName: 'Mr. Vinod Electrician',
    status: 'Active',
  },
  {
    id: '2',
    maintainerType: 'Plumbing Work',
    userName: 'Mr. Ramesh Plumber',
    status: 'Active',
  },
  {
    id: '3',
    maintainerType: 'Masonry Work',
    userName: 'M/s Buildsafe Contractors',
    status: 'Active',
  },
  {
    id: '4',
    maintainerType: 'Painting Work',
    userName: 'Mr. Sunil Painter',
    status: 'Active',
  },
  {
    id: '5',
    maintainerType: 'Welding Work',
    userName: 'Mr. Tarun Welder',
    status: 'Active',
  },
  {
    id: '6',
    maintainerType: 'Waterproofing',
    userName: 'M/s AquaShield Solutions',
    status: 'Active',
  },
  {
    id: '7',
    maintainerType: 'Glazing Work',
    userName: 'Mr. Ajay Glazier',
    status: 'Inactive',
  },
  {
    id: '8',
    maintainerType: 'Flooring Work',
    userName: 'M/s FloorTech Services',
    status: 'Active',
  },
  {
    id: '9',
    maintainerType: 'Roofing Repair',
    userName: 'M/s RoofCare Ltd.',
    status: 'Active',
  },
  {
    id: '10',
    maintainerType: 'General Labour',
    userName: 'Mr. Ashok Carpenter',
    status: 'Active',
  },
];

// ─── Maintenance Hierarchies ────────────────────────────────────────────────

export const initialMaintenanceHierarchies: MaintenanceHierarchy[] = [
  {
    id: '1',
    typeOfWork: 'Electrical Work',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Mr. Sanjay Kumar',
    approver: 'Dr. R.K. Gupta',
    status: 'Active',
  },
  {
    id: '2',
    typeOfWork: 'Plumbing Work',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Mr. Sanjay Kumar',
    approver: 'Dr. R.K. Gupta',
    status: 'Active',
  },
  {
    id: '3',
    typeOfWork: 'Masonry Work',
    organizationUnit: 'Civil Engineering',
    defaultAuthority: 'Prof. M.L. Sharma',
    verifier: 'Er. Amit Verma',
    approver: 'Prof. M.L. Sharma',
    status: 'Active',
  },
  {
    id: '4',
    typeOfWork: 'Painting Work',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Mr. Sanjay Kumar',
    approver: 'Dr. R.K. Gupta',
    status: 'Active',
  },
  {
    id: '5',
    typeOfWork: 'General Labour',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Mr. Pradeep Singh',
    approver: 'Dr. R.K. Gupta',
    status: 'Active',
  },
  {
    id: '6',
    typeOfWork: 'Waterproofing',
    organizationUnit: 'Civil Engineering',
    defaultAuthority: 'Prof. M.L. Sharma',
    verifier: 'Er. Amit Verma',
    approver: 'Prof. M.L. Sharma',
    status: 'Active',
  },
  {
    id: '7',
    typeOfWork: 'Roofing Repair',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Er. Amit Verma',
    approver: 'Dr. R.K. Gupta',
    status: 'Active',
  },
  {
    id: '8',
    typeOfWork: 'Welding Work',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Mr. Sanjay Kumar',
    approver: 'Dr. R.K. Gupta',
    status: 'Inactive',
  },
  {
    id: '9',
    typeOfWork: 'Flooring Work',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Mr. Pradeep Singh',
    approver: 'Dr. R.K. Gupta',
    status: 'Active',
  },
  {
    id: '10',
    typeOfWork: 'Glazing Work',
    organizationUnit: 'Estate Office',
    defaultAuthority: 'Dr. R.K. Gupta',
    verifier: 'Mr. Sanjay Kumar',
    approver: 'Dr. R.K. Gupta',
    status: 'Active',
  },
];

// ─── Work Orders ────────────────────────────────────────────────────────────

export const initialWorkOrders: WorkOrder[] = [
  {
    id: 'WO-001',
    maintenanceRequestId: 'MR-004',
    title: 'Re-painting of Physics Lab STC-G01',
    description:
      'Complete re-painting of ground floor physics lab including dampness treatment and primer application.',
    priority: 'Low',
    scheduledDate: '2026-02-01',
    dueDate: '2026-02-15',
    estimatedHours: 48,
    costEstimate: 75000,
    status: 'Approved',
    verifiedBy: 'Mr. Sanjay Kumar',
    approvedBy: 'Dr. R.K. Gupta',
  },
  {
    id: 'WO-002',
    maintenanceRequestId: 'MR-005',
    title: 'Structural Assessment of Hostel Parapet',
    description:
      'Detailed structural assessment and repair of parapet wall cracks on terrace of Boys Hostel Block-1.',
    priority: 'High',
    scheduledDate: '2026-02-10',
    dueDate: '2026-02-28',
    estimatedHours: 120,
    costEstimate: 250000,
    status: 'Verified',
    verifiedBy: 'Er. Amit Verma',
    approvedBy: '',
  },
  {
    id: 'WO-003',
    maintenanceRequestId: 'MR-001',
    title: 'Electrical Rewiring — CAB 2nd Floor',
    description:
      'Complete rewiring of 2nd floor corridor and replacement of faulty MCBs.',
    priority: 'High',
    scheduledDate: '2025-11-11',
    dueDate: '2025-11-14',
    estimatedHours: 16,
    costEstimate: 35000,
    status: 'Completed',
    verifiedBy: 'Mr. Sanjay Kumar',
    approvedBy: 'Dr. R.K. Gupta',
  },
  {
    id: 'WO-004',
    maintenanceRequestId: 'MR-002',
    title: 'Emergency Pipe Replacement — Admin Block',
    description:
      'Replace burst GI pipe with CPVC in ground floor washroom and seal all joints.',
    priority: 'Critical',
    scheduledDate: '2025-12-01',
    dueDate: '2025-12-02',
    estimatedHours: 8,
    costEstimate: 18000,
    status: 'Completed',
    verifiedBy: 'Mr. Sanjay Kumar',
    approvedBy: 'Dr. R.K. Gupta',
  },
  {
    id: 'WO-005',
    maintenanceRequestId: 'MR-008',
    title: 'Badminton Court Floor Repair',
    description:
      'Repair and partial replacement of damaged wooden flooring panels in indoor badminton court.',
    priority: 'Medium',
    scheduledDate: '2026-03-01',
    dueDate: '2026-03-15',
    estimatedHours: 40,
    costEstimate: 120000,
    status: 'Pending',
    verifiedBy: '',
    approvedBy: '',
  },
  {
    id: 'WO-006',
    maintenanceRequestId: 'MR-003',
    title: 'Library HVAC Annual Servicing',
    description:
      'Complete servicing of all AC units in the library reading halls including filter replacement and gas recharge.',
    priority: 'Medium',
    scheduledDate: '2026-01-15',
    dueDate: '2026-01-25',
    estimatedHours: 24,
    costEstimate: 95000,
    status: 'Pending',
    verifiedBy: '',
    approvedBy: '',
  },
  {
    id: 'WO-007',
    maintenanceRequestId: 'MR-001',
    title: 'Install LED Panel Lights — CAB',
    description:
      'Replace old tube lights with LED panels on 2nd floor classrooms.',
    priority: 'Medium',
    scheduledDate: '2025-11-15',
    dueDate: '2025-11-20',
    estimatedHours: 12,
    costEstimate: 42000,
    status: 'Completed',
    verifiedBy: 'Mr. Sanjay Kumar',
    approvedBy: 'Dr. R.K. Gupta',
  },
  {
    id: 'WO-008',
    maintenanceRequestId: 'MR-004',
    title: 'Anti-Dampness Treatment — STC Lab',
    description: 'Apply waterproof coating on interior walls before painting.',
    priority: 'Low',
    scheduledDate: '2026-01-25',
    dueDate: '2026-01-30',
    estimatedHours: 16,
    costEstimate: 30000,
    status: 'Approved',
    verifiedBy: 'Mr. Sanjay Kumar',
    approvedBy: 'Dr. R.K. Gupta',
  },
  {
    id: 'WO-009',
    maintenanceRequestId: 'MR-005',
    title: 'Parapet Crack Sealing',
    description: 'Seal visible cracks using epoxy injection method.',
    priority: 'High',
    scheduledDate: '2026-02-12',
    dueDate: '2026-02-18',
    estimatedHours: 20,
    costEstimate: 55000,
    status: 'Verified',
    verifiedBy: 'Er. Amit Verma',
    approvedBy: '',
  },
  {
    id: 'WO-010',
    maintenanceRequestId: 'MR-002',
    title: 'Washroom Tile Repair — Admin Block',
    description:
      'Replace damaged tiles in ground floor washroom after pipe repair.',
    priority: 'Low',
    scheduledDate: '2025-12-05',
    dueDate: '2025-12-08',
    estimatedHours: 12,
    costEstimate: 15000,
    status: 'Completed',
    verifiedBy: 'Mr. Pradeep Singh',
    approvedBy: 'Dr. R.K. Gupta',
  },
];

// ─── Work Order Tasks ───────────────────────────────────────────────────────

export const initialWorkOrderTasks: WorkOrderTask[] = [
  {
    id: 'WOT-001',
    workOrderId: 'WO-001',
    workOrderTitle: 'Re-painting of Physics Lab STC-G01',
    taskName: 'Surface Preparation',
    description: 'Scrape old paint and fill wall cracks with putty.',
    status: 'Completed',
    completedAt: '2026-02-03',
  },
  {
    id: 'WOT-002',
    workOrderId: 'WO-001',
    workOrderTitle: 'Re-painting of Physics Lab STC-G01',
    taskName: 'Primer Application',
    description: 'Apply two coats of primer on all walls.',
    status: 'Completed',
    completedAt: '2026-02-05',
  },
  {
    id: 'WOT-003',
    workOrderId: 'WO-001',
    workOrderTitle: 'Re-painting of Physics Lab STC-G01',
    taskName: 'Final Paint Coats',
    description: 'Apply two coats of emulsion paint.',
    status: 'In Progress',
    completedAt: '',
  },
  {
    id: 'WOT-004',
    workOrderId: 'WO-002',
    workOrderTitle: 'Structural Assessment of Hostel Parapet',
    taskName: 'Visual Inspection',
    description:
      'Document all visible cracks with photographs and measurements.',
    status: 'Completed',
    completedAt: '2026-02-11',
  },
  {
    id: 'WOT-005',
    workOrderId: 'WO-002',
    workOrderTitle: 'Structural Assessment of Hostel Parapet',
    taskName: 'Non-Destructive Testing',
    description: 'Perform ultrasonic pulse velocity test on parapet.',
    status: 'In Progress',
    completedAt: '',
  },
  {
    id: 'WOT-006',
    workOrderId: 'WO-003',
    workOrderTitle: 'Electrical Rewiring — CAB 2nd Floor',
    taskName: 'Old Wiring Removal',
    description: 'Remove all old cables from conduits.',
    status: 'Completed',
    completedAt: '2025-11-12',
  },
  {
    id: 'WOT-007',
    workOrderId: 'WO-003',
    workOrderTitle: 'Electrical Rewiring — CAB 2nd Floor',
    taskName: 'New Cable Installation',
    description: 'Pull new FRLS cables through conduits.',
    status: 'Completed',
    completedAt: '2025-11-13',
  },
  {
    id: 'WOT-008',
    workOrderId: 'WO-003',
    workOrderTitle: 'Electrical Rewiring — CAB 2nd Floor',
    taskName: 'MCB Replacement',
    description: 'Replace faulty MCBs in distribution board.',
    status: 'Completed',
    completedAt: '2025-11-14',
  },
  {
    id: 'WOT-009',
    workOrderId: 'WO-005',
    workOrderTitle: 'Badminton Court Floor Repair',
    taskName: 'Damage Assessment',
    description:
      'Identify all damaged panels and measure replacement quantities.',
    status: 'Pending',
    completedAt: '',
  },
  {
    id: 'WOT-010',
    workOrderId: 'WO-005',
    workOrderTitle: 'Badminton Court Floor Repair',
    taskName: 'Panel Procurement',
    description: 'Procure matching hardwood panels from approved vendor.',
    status: 'Pending',
    completedAt: '',
  },
];
