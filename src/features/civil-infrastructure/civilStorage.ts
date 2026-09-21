import { useCallback, useEffect, useState } from 'react';
import {
  boqItems,
  civilWorks,
  contractors,
  dlpRecords,
  eotRequests,
  initialCivilProjects,
  initialFundingSources,
  initialLabAgencies,
  initialMandateDocuments,
  initialMBStatuses,
  initialSORChapters,
  initialSORItemMasters,
  initialSORSubjects,
  initialSORTypes,
  initialStatusMasters,
  initialTechnicalPlans,
  initialTPIAgencies,
  initialVendorAgencies,
  initialWorkCategories,
  initialWorkDepartments,
  initialWorkSuspensions,
  mbEntries,
  milestones,
  progressLogs,
  qualityTests,
  raBills,
  sorItems,
  tenders,
  workOrders,
} from './mocks';

export const CIVIL_STORAGE_KEYS = {
  WORKS: 'civil_works',
  TENDERS: 'civil_tenders',
  WORK_ORDERS: 'civil_work_orders',
  MILESTONES: 'civil_milestones',
  MB_ENTRIES: 'civil_mb_entries',
  RA_BILLS: 'civil_ra_bills',
  QUALITY_TESTS: 'civil_quality_tests',
  DLP_RECORDS: 'civil_dlp_records',
  CONTRACTORS: 'civil_contractors',
  ASSETS: 'civil_assets',
  CC_REQUESTS: 'civil_cc_requests',
  EOT_REQUESTS: 'civil_eot_requests',
  TECHNICAL_PLANS: 'civil_technical_plans',
  PROGRESS_LOGS: 'civil_progress_logs',
  SETTLED_BILLS: 'civil_settled_bills',
  WORK_SUSPENSIONS: 'civil_work_suspensions',
  // Masters
  FUNDING_SOURCES: 'civil_funding_sources',
  WORK_DEPARTMENTS: 'civil_work_departments',
  WORK_CATEGORIES: 'civil_work_categories',
  PROJECTS: 'civil_projects',
  MANDATE_DOCUMENTS: 'civil_mandate_documents',
  TPI_AGENCIES: 'civil_tpi_agencies',
  LAB_AGENCIES: 'civil_lab_agencies',
  VENDOR_AGENCIES: 'civil_vendor_agencies',
  SOR_TYPES: 'civil_sor_types',
  SOR_CHAPTERS: 'civil_sor_chapters',
  SOR_SUBJECTS: 'civil_sor_subjects',
  SOR_ITEMS: 'civil_sor_items_v2',
  SOR_ITEMS_BASE: 'civil_sor_items',
  BOQ_ITEMS: 'civil_boq_items',
  MB_STATUSES: 'civil_mb_statuses',
  STATUS_MASTERS: 'civil_status_masters',
  STATUTORY_CLEARANCES: 'civil_statutory_clearances',
} as const;

export type CivilStorageKey =
  | (typeof CIVIL_STORAGE_KEYS)[keyof typeof CIVIL_STORAGE_KEYS]
  | string;

export const initialAssets = [
  {
    id: 'ASSET-2025-001',
    assetCode: 'ASSET/CW/2025/001',
    workId: '1',
    workCode: 'CW-2025-001',
    workName: 'New Academic Block – Science Wing',
    category: 'Building / Academic Complex',
    campus: 'Main Campus',
    location: 'Zone A – Plot 12',
    capitalizedDate: '2025-06-15',
    totalCost: 26200000,
    civilCost: 18340000,
    electricalCost: 3930000,
    plumbingCost: 2620000,
    fixturesCost: 1310000,
    custodianDepartment: 'Civil Engineering Dept',
    status: 'In Service',
    handoverDoc: 'Handover_Cert_CW_001.pdf',
    remarks:
      'Capitalized into university fixed asset register after successful joint completion inspection.',
  },
  {
    id: 'ASSET-2025-002',
    assetCode: 'ASSET/CW/2025/002',
    workId: '2',
    workCode: 'CW-2025-002',
    workName: 'Hostel No. 4 Renovation & Strengthening',
    category: 'Residential / Student Housing',
    campus: 'South Campus',
    location: 'Hostel Sector 3',
    capitalizedDate: '2025-07-01',
    totalCost: 12500000,
    civilCost: 8750000,
    electricalCost: 1875000,
    plumbingCost: 1250000,
    fixturesCost: 625000,
    custodianDepartment: 'Hostel Management Committee',
    status: 'In Service',
    handoverDoc: 'Handover_Cert_CW_002.pdf',
    remarks:
      'Structural strengthening and toilet block overhaul capitalized into hostel infrastructure asset register.',
  },
];

export const initialCCRequests = [
  {
    id: 'CC-REQ-001',
    workId: '1',
    workCode: 'CW-2025-001',
    workName: 'New Academic Block – Science Wing',
    requestDate: '2025-05-20',
    requestedBy: 'Er. Rajesh Sharma (EE)',
    contractorName: 'M/s Apex Infrastructure Ltd.',
    inspectionDate: '2025-05-28',
    inspectionCommittee:
      'Dean (Planning), Chief Engineer, University Architect, TPI Lead',
    snagListCompleted: true,
    tpiNocObtained: true,
    status: 'Approved',
    certificateNo: 'CC/UNI/CIVIL/2025/001',
    issueDate: '2025-06-01',
    issuedBy: 'Registrar & Chief Engineer',
    remarks:
      'All 4 wings inspected. Structure certified safe for academic occupation.',
  },
  {
    id: 'CC-REQ-002',
    workId: '2',
    workCode: 'CW-2025-002',
    workName: 'Hostel No. 4 Renovation & Strengthening',
    requestDate: '2025-06-10',
    requestedBy: 'Er. S.K. Verma (AE)',
    contractorName: 'M/s Buildcon Infra Projects',
    inspectionDate: '2025-06-18',
    inspectionCommittee: 'Chief Warden, Executive Engineer, Estate Officer',
    snagListCompleted: true,
    tpiNocObtained: true,
    status: 'Approved',
    certificateNo: 'CC/UNI/CIVIL/2025/002',
    issueDate: '2025-06-25',
    issuedBy: 'Chief Engineer',
    remarks:
      'Strengthening certified compliant with IS 13920 seismic standards.',
  },
];

export const initialSettledBills = [
  {
    id: 'FS-2025-001',
    workId: '1',
    workCode: 'CW-2025-001',
    workName: 'New Academic Block – Science Wing',
    contractorName: 'M/s Apex Infrastructure Ltd.',
    finalBillAmount: 26200000,
    retentionAmount: 1310000,
    pvcSettlement: 450000,
    settlementDate: '2025-06-10',
    status: 'Settled',
    settledBy: 'Senior Finance Officer',
  },
];

export const DEFAULT_DATA_MAP: Record<string, any> = {
  [CIVIL_STORAGE_KEYS.WORKS]: civilWorks,
  [CIVIL_STORAGE_KEYS.TENDERS]: tenders,
  [CIVIL_STORAGE_KEYS.WORK_ORDERS]: workOrders,
  [CIVIL_STORAGE_KEYS.MILESTONES]: milestones,
  [CIVIL_STORAGE_KEYS.MB_ENTRIES]: mbEntries,
  [CIVIL_STORAGE_KEYS.RA_BILLS]: raBills,
  [CIVIL_STORAGE_KEYS.QUALITY_TESTS]: qualityTests,
  [CIVIL_STORAGE_KEYS.DLP_RECORDS]: dlpRecords,
  [CIVIL_STORAGE_KEYS.CONTRACTORS]: contractors,
  [CIVIL_STORAGE_KEYS.ASSETS]: initialAssets,
  [CIVIL_STORAGE_KEYS.CC_REQUESTS]: initialCCRequests,
  [CIVIL_STORAGE_KEYS.EOT_REQUESTS]: eotRequests,
  [CIVIL_STORAGE_KEYS.TECHNICAL_PLANS]: initialTechnicalPlans,
  [CIVIL_STORAGE_KEYS.PROGRESS_LOGS]: progressLogs,
  [CIVIL_STORAGE_KEYS.SETTLED_BILLS]: initialSettledBills,
  [CIVIL_STORAGE_KEYS.WORK_SUSPENSIONS]: initialWorkSuspensions,
  [CIVIL_STORAGE_KEYS.FUNDING_SOURCES]: initialFundingSources,
  [CIVIL_STORAGE_KEYS.WORK_DEPARTMENTS]: initialWorkDepartments,
  [CIVIL_STORAGE_KEYS.WORK_CATEGORIES]: initialWorkCategories,
  [CIVIL_STORAGE_KEYS.PROJECTS]: initialCivilProjects,
  [CIVIL_STORAGE_KEYS.MANDATE_DOCUMENTS]: initialMandateDocuments,
  [CIVIL_STORAGE_KEYS.TPI_AGENCIES]: initialTPIAgencies,
  [CIVIL_STORAGE_KEYS.LAB_AGENCIES]: initialLabAgencies,
  [CIVIL_STORAGE_KEYS.VENDOR_AGENCIES]: initialVendorAgencies,
  [CIVIL_STORAGE_KEYS.SOR_TYPES]: initialSORTypes,
  [CIVIL_STORAGE_KEYS.SOR_CHAPTERS]: initialSORChapters,
  [CIVIL_STORAGE_KEYS.SOR_SUBJECTS]: initialSORSubjects,
  [CIVIL_STORAGE_KEYS.SOR_ITEMS]: initialSORItemMasters,
  [CIVIL_STORAGE_KEYS.SOR_ITEMS_BASE]: sorItems,
  [CIVIL_STORAGE_KEYS.BOQ_ITEMS]: boqItems,
  [CIVIL_STORAGE_KEYS.MB_STATUSES]: initialMBStatuses,
  [CIVIL_STORAGE_KEYS.STATUS_MASTERS]: initialStatusMasters,
};

const EVENT_NAME = 'civil_storage_update';

export function normalizeCivilItem(key: string, item: any): any {
  if (!item || typeof item !== 'object') return item;

  if (key === CIVIL_STORAGE_KEYS.SOR_TYPES) {
    return {
      ...item,
      id: String(item.id || `ST-${item.code || '01'}`),
      code: item.code || item.sorTypeCode || 'SOR',
      name:
        item.name ||
        item.type ||
        item.description ||
        item.code ||
        'Classification',
      description: item.description || item.name || item.type || '',
      isActive: item.isActive !== false,
    };
  }

  if (key === CIVIL_STORAGE_KEYS.SOR_CHAPTERS) {
    const rawNo = String(item.chapterNo || item.chapterNumber || '01').replace(
      /^Ch-+/i,
      ''
    );
    const mappedType =
      item.sorTypeId ||
      (item.sorTypeCode === 'ROAD'
        ? 'ST-02'
        : item.sorTypeCode === 'BLDG'
          ? 'ST-01'
          : item.sorTypeCode === 'ELEC'
            ? 'ST-03'
            : 'ST-01');
    return {
      ...item,
      id: String(item.id || `SCH-${rawNo}`),
      sorTypeId: String(mappedType),
      sorTypeName:
        item.sorTypeName ||
        (mappedType === 'ST-02'
          ? 'Roads, Pavements & Bridges'
          : mappedType === 'ST-03'
            ? 'Internal & External Electrical Works'
            : 'Building & Civil Works'),
      chapterNo: rawNo,
      chapterNumber: rawNo,
      name:
        item.name || item.chapterDesc || item.description || `Chapter ${rawNo}`,
      description: item.description || item.chapterDesc || item.name || '',
      isActive: item.isActive !== false,
    };
  }

  if (key === CIVIL_STORAGE_KEYS.SOR_SUBJECTS) {
    return {
      ...item,
      id: String(item.id || `SSU-${Date.now()}`),
      sorChapterId: String(item.sorChapterId || 'SCH-01'),
      sorChapterName:
        item.sorChapterName || item.chapterDesc || 'Chapter Works',
      sorTypeId: String(item.sorTypeId || 'ST-01'),
      name:
        item.name || item.subjectName || item.description || 'Subject Trade',
      referenceCode: item.referenceCode || item.refIsCode || undefined,
      paragraph: item.paragraph || item.newPara || undefined,
      isActive: item.isActive !== false,
    };
  }

  if (key === CIVIL_STORAGE_KEYS.FUNDING_SOURCES) {
    return {
      ...item,
      fundingSourceId: Number(item.fundingSourceId || item.id || 1),
      name:
        item.name || item.fundingSourceName || item.code || 'Funding Source',
      fundingSourceName:
        item.fundingSourceName || item.name || 'Funding Source',
      sourceType: item.sourceType || 'University',
      isActive: item.isActive !== false,
    };
  }

  if (key === CIVIL_STORAGE_KEYS.PROJECTS) {
    return {
      ...item,
      projectId: Number(item.projectId || item.id || 1),
      id: item.id || String(item.projectId || 1),
      projectDescription:
        item.projectDescription ||
        item.name ||
        item.area ||
        item.description ||
        'Civil Project',
      projectLocation:
        item.projectLocation || item.location || 'Campus Location',
      campusId: Number(item.campusId || 1),
      campusName: item.campusName || item.campus || 'Main Campus',
      isActive: item.isActive !== false,
    };
  }

  if (key === CIVIL_STORAGE_KEYS.MANDATE_DOCUMENTS) {
    const isReq =
      item.isRequired !== undefined
        ? !!item.isRequired
        : item.isMandatory !== undefined
          ? !!item.isMandatory
          : false;
    const allowMult =
      item.allowMultiple !== undefined
        ? !!item.allowMultiple
        : item.allowMultipleFiles !== undefined
          ? !!item.allowMultipleFiles
          : false;
    return {
      ...item,
      id: String(item.id || `MD-${Date.now()}`),
      name: item.name || item.documentName || item.title || 'Mandate Document',
      description: item.description || item.desc || '',
      isRequired: isReq,
      isMandatory: isReq,
      allowMultiple: allowMult,
      allowMultipleFiles: allowMult,
      isActive: item.isActive !== false,
    };
  }

  return item;
}

export const civilStorage = {
  get<T>(key: string, defaultVal?: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(it => normalizeCivilItem(key, it)) as T;
        }
        return normalizeCivilItem(key, parsed) as T;
      }
    } catch (e) {
      console.warn(`[civilStorage] Failed parsing ${key}`, e);
    }
    const fallback =
      defaultVal !== undefined ? defaultVal : (DEFAULT_DATA_MAP[key] as T);
    if (fallback !== undefined) {
      try {
        const normalized = Array.isArray(fallback)
          ? fallback.map(it => normalizeCivilItem(key, it))
          : normalizeCivilItem(key, fallback);
        localStorage.setItem(key, JSON.stringify(normalized));
        return normalized as T;
      } catch (e) {
        // quota exceeded or private mode
      }
    }
    return fallback as T;
  },

  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, { detail: { key, data } })
      );
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(`[civilStorage] Failed saving ${key}`, e);
    }
  },

  broadcast(): void {
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { all: true } })
    );
    window.dispatchEvent(new Event('storage'));
  },

  resetToDefaults(): void {
    Object.entries(DEFAULT_DATA_MAP).forEach(([k, v]) => {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {
        console.error(e);
      }
    });
    this.broadcast();
  },
};

/**
 * Reactive React hook that synchronizes state across all civil pages in real time.
 */
export function useCivilStorage<T>(
  key: string,
  initialDefault?: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() =>
    civilStorage.get<T>(key, initialDefault)
  );

  useEffect(() => {
    const handleCustomUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.all || detail.key === key) {
        setState(civilStorage.get<T>(key, initialDefault));
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === key) {
        setState(civilStorage.get<T>(key, initialDefault));
      }
    };

    window.addEventListener(EVENT_NAME, handleCustomUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [key, initialDefault]);

  const setStoredState = useCallback(
    (valOrFn: T | ((prev: T) => T)) => {
      const current = civilStorage.get<T>(key, initialDefault);
      const next =
        typeof valOrFn === 'function'
          ? (valOrFn as (prev: T) => T)(current)
          : valOrFn;
      civilStorage.set(key, next);
      setState(next);
    },
    [key, initialDefault]
  );

  return [state, setStoredState];
}
