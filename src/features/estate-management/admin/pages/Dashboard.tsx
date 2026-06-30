import {
  FormCard,
  FormPage,
  StatCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  initialBuildings,
  initialFloors,
  initialRooms,
  initialHouses,
  initialOpenAreas,
  initialRoads,
  initialMaintenanceRequests,
  type Building,
} from '../../data';
import { estateUrls } from '../../urls';
import './Dashboard.css';

const activeBuildings = initialBuildings.filter(b => b.status === 'Active');
const totalFloors = initialFloors.filter(f => f.status === 'Active').length;
const totalRooms = initialRooms.filter(r => r.status === 'Active').length;
const washrooms = initialRooms.filter(
  r => r.roomType === 'Washroom' && r.status === 'Active'
).length;
const classrooms = initialRooms.filter(
  r => r.roomType === 'Classroom' && r.status === 'Active'
).length;
const labs = initialRooms.filter(
  r => r.roomType === 'Laboratory' && r.status === 'Active'
).length;
const confRooms = initialRooms.filter(
  r => r.roomType === 'Conference Room' && r.status === 'Active'
).length;
const houses = initialHouses.filter(h => h.status === 'Active').length;
const activeRoads = initialRoads.filter(r => r.status === 'Active').length;
const roadsWithLights = initialRoads.filter(
  r => r.streetLights && r.status === 'Active'
).length;
const openAreas = initialOpenAreas.filter(o => o.status === 'Active').length;
const pendingMR = initialMaintenanceRequests.filter(
  m => m.status !== 'Completed' && m.status !== 'Draft'
).length;

const buildingDistribution = initialBuildings
  .filter(b => b.status === 'Active')
  .map(b => ({
    name: b.name,
    floors: initialFloors.filter(f => f.buildingId === b.id).length,
    rooms: initialRooms.filter(r => r.buildingId === b.id).length,
    color: [
      '#3b82f6',
      '#8b5cf6',
      '#f59e0b',
      '#10b981',
      '#ef4444',
      '#06b6d4',
      '#ec4899',
      '#6366f1',
      '#14b8a6',
    ][initialBuildings.indexOf(b) % 9],
  }));
const maxRooms = Math.max(...buildingDistribution.map(b => b.rooms), 1);

const facilityStats = [
  {
    label: 'WiFi',
    count: activeBuildings.filter(b => b.wifi).length,
    color: '#3b82f6',
    bg: '#dbeafe',
  },
  {
    label: 'Fire Safety',
    count: activeBuildings.filter(b => b.fireFighting).length,
    color: '#ef4444',
    bg: '#fee2e2',
  },
  {
    label: 'Generator',
    count: activeBuildings.filter(b => b.generatorBackup).length,
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    label: 'UPS',
    count: activeBuildings.filter(b => b.ups).length,
    color: '#8b5cf6',
    bg: '#ede9fe',
  },
  {
    label: 'Elevator',
    count: activeBuildings.filter(b => b.elevator).length,
    color: '#10b981',
    bg: '#d1fae5',
  },
  {
    label: 'Ramp',
    count: activeBuildings.filter(b => b.disabledAccessRamp).length,
    color: '#06b6d4',
    bg: '#cffafe',
  },
  {
    label: 'CAS',
    count: activeBuildings.filter(b => b.cas).length,
    color: '#ec4899',
    bg: '#fce7f3',
  },
  {
    label: 'Rainwater',
    count: activeBuildings.filter(b => b.waterHarvesting).length,
    color: '#14b8a6',
    bg: '#ccfbf1',
  },
];

const residentialCount = activeBuildings.filter(b => b.isResidential).length;
const nonResidentialCount = activeBuildings.filter(
  b => !b.isResidential
).length;

const recentBuildings = initialBuildings.slice(0, 6);

export default function Dashboard() {
  return (
    <FormPage
      title="Estate Management Dashboard"
      description="Overview of university estate — buildings, infrastructure, roads, and maintenance."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Estate Management', to: estateUrls.portal },
        { label: 'Admin Portal', to: estateUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="ems-stats-grid">
        <StatCard
          title="Active Buildings"
          value={activeBuildings.length}
          icon="apartment"
          colorScheme="blue"
          trend={{ value: 2, direction: 'up', label: 'new this year' }}
        />
        <StatCard
          title="Total Floors"
          value={totalFloors}
          icon="layers"
          colorScheme="purple"
          subtitle={`${totalRooms} rooms across all buildings`}
        />
        <StatCard
          title="Houses"
          value={houses}
          icon="home"
          colorScheme="green"
          subtitle={`${residentialCount} residential buildings`}
        />
        <StatCard
          title="Active Roads"
          value={activeRoads}
          icon="add_road"
          colorScheme="orange"
          subtitle={`${roadsWithLights} with street lights`}
        />
      </div>

      <div className="ems-stats-grid">
        <StatCard
          title="Classrooms"
          value={classrooms}
          icon="school"
          colorScheme="indigo"
        />
        <StatCard
          title="Laboratories"
          value={labs}
          icon="science"
          colorScheme="red"
        />
        <StatCard
          title="Open Areas"
          value={openAreas}
          icon="park"
          colorScheme="teal"
        />
        <StatCard
          title="Pending Maintenance"
          value={pendingMR}
          icon="build"
          colorScheme="amber"
          subtitle={`${washrooms} active washrooms · ${confRooms} conf. rooms`}
        />
      </div>

      <div className="ems-charts-row">
        <FormCard title="Building-wise Room Distribution">
          {buildingDistribution.map(b => (
            <div key={b.name} className="ems-bar-row">
              <span className="ems-bar-label">{b.name}</span>
              <div className="ems-bar-track">
                <div
                  className="ems-bar-fill"
                  style={{
                    width: `${(b.rooms / maxRooms) * 100}%`,
                    background: b.color,
                  }}
                />
              </div>
              <span className="ems-bar-value">{b.rooms}</span>
              <span className="ems-bar-pct">{b.floors}F</span>
            </div>
          ))}
        </FormCard>

        <FormCard title="Facility Availability">
          <div className="ems-facility-grid">
            {facilityStats.map(f => (
              <div
                key={f.label}
                className="ems-facility-chip"
                style={{ background: f.bg }}
              >
                <span
                  className="ems-facility-chip-icon"
                  style={{ color: f.color }}
                >
                  {f.count}
                </span>
                <span className="ems-facility-chip-label">{f.label}</span>
                <span
                  className="ems-facility-chip-value"
                  style={{ color: f.color }}
                >
                  {Math.round((f.count / activeBuildings.length) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      <div className="ems-bottom-row">
        <FormCard title="Building Classification">
          <div className="ems-split-row">
            <div className="ems-split-item">
              <div
                className="ems-split-circle"
                style={{ background: '#3b82f6' }}
              >
                {nonResidentialCount}
              </div>
              <span className="ems-split-name">Non-Residential</span>
            </div>
            <div className="ems-split-item">
              <div
                className="ems-split-circle"
                style={{ background: '#10b981' }}
              >
                {residentialCount}
              </div>
              <span className="ems-split-name">Residential</span>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Green Buildings
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                {activeBuildings.filter(b => b.greenBuilding).length} buildings
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Total Plot Area
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                {activeBuildings
                  .reduce((s, b) => s + b.plotArea, 0)
                  .toLocaleString()}{' '}
                sq.m
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                Total Construction Cost
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                ₹
                {(
                  activeBuildings.reduce(
                    (s, b) => s + b.totalConstructionCost,
                    0
                  ) / 10000000
                ).toFixed(1)}{' '}
                Cr
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
                ETP/STP Connected
              </span>
              <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
                {
                  activeBuildings.filter(b => b.etpConnected || b.stpConnected)
                    .length
                }{' '}
                buildings
              </span>
            </div>
          </div>
        </FormCard>

        <FormCard title="Road & Footpath Coverage">
          {initialRoads
            .filter(r => r.status === 'Active')
            .slice(0, 5)
            .map(r => {
              const maxLen = Math.max(...initialRoads.map(rd => rd.length));
              const pct = (r.length / maxLen) * 100;
              const color = r.streetLights ? '#16a34a' : '#f59e0b';
              return (
                <div key={r.id} className="ems-info-row">
                  <span className="ems-info-label">{r.name}</span>
                  <div className="ems-info-track">
                    <div
                      className="ems-info-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span className="ems-info-pct" style={{ color }}>
                    {r.length} km
                  </span>
                </div>
              );
            })}
          <div
            style={{
              marginTop: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.813rem', color: '#6b7280' }}>
              Total Road Length
            </span>
            <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>
              {initialRoads
                .filter(r => r.status === 'Active')
                .reduce((s, r) => s + r.length, 0)
                .toFixed(1)}{' '}
              km
            </span>
          </div>
        </FormCard>
      </div>

      <div className="ems-full-row">
        <FormCard title="Recent Buildings">
          <GridPanel
            data={recentBuildings}
            pagination={false}
            columns={[
              {
                cell: (_: unknown, option: { rowIndex: number }) => (
                  <span className="font-semibold text-gray-700">
                    {option.rowIndex + 1}
                  </span>
                ),
                width: '50px',
              },
              { field: 'name', header: 'Building Name' },
              { field: 'campus', header: 'Campus', width: '150px' },
              { field: 'block', header: 'Block', width: '100px' },
              { field: 'numberOfFloors', header: 'Floors', width: '90px' },
              {
                field: 'structureType',
                header: 'Structure Type',
                width: '180px',
              },
              {
                field: 'status',
                header: 'Status',
                width: '100px',
                cell: (item: Building) => (
                  <StatusBadge
                    label={item.status}
                    variant={item.status === 'Active' ? 'approved' : 'rejected'}
                  />
                ),
              },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
