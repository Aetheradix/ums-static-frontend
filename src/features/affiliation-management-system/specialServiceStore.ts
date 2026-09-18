import { mockSpecialServiceApprovals } from './special-service-request-approval/mockData';
import type {
  SpecialServiceApprovalItem,
  SpecialServiceApprovalStatus,
} from './special-service-request-approval/types';

const STORAGE_KEY = 'ams-special-service-requests';

export function getSpecialServiceRequests(): SpecialServiceApprovalItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: SpecialServiceApprovalItem[];
    if (!raw) {
      list = mockSpecialServiceApprovals;
    } else {
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed) ? parsed : mockSpecialServiceApprovals;
    }

    // Only allow 'Pending Scrutiny', 'Approved', 'Deficiency Raised'
    let modified = false;
    list = list.map(item => {
      const s = item.status as string;
      if (s === 'Clarification Required') {
        modified = true;
        return { ...item, status: 'Pending Scrutiny' as const };
      }
      if (s === 'Rejected') {
        modified = true;
        return { ...item, status: 'Deficiency Raised' as const };
      }
      return item;
    });

    if (!raw || modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    return list;
  } catch {
    return mockSpecialServiceApprovals;
  }
}

export function saveSpecialServiceRequest(
  item: SpecialServiceApprovalItem
): void {
  try {
    const existing = getSpecialServiceRequests();
    const index = existing.findIndex(
      e => e.id === item.id || e.applicationNo === item.applicationNo
    );

    let updated: SpecialServiceApprovalItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...item };
    } else {
      updated = [item, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('ams_special_service_updated'));
  } catch {
    // Storage fallback
  }
}

export function updateSpecialServiceDecision(
  id: string,
  status: SpecialServiceApprovalStatus,
  orderNo: string,
  remarks: string,
  documents?: { id: string; isVerified: boolean }[]
): SpecialServiceApprovalItem | undefined {
  try {
    const existing = getSpecialServiceRequests();
    const target = existing.find(e => e.id === id);
    if (!target) return undefined;

    const updatedItem: SpecialServiceApprovalItem = {
      ...target,
      status,
      committeeOrderNo: orderNo.trim(),
      scrutinyRemarks: remarks.trim(),
      reviewedBy: 'University DCDC Standing Committee',
      reviewedDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      documents: documents
        ? target.documents.map(d => {
            const match = documents.find(m => m.id === d.id);
            return match ? { ...d, isVerified: match.isVerified } : d;
          })
        : target.documents,
    };

    saveSpecialServiceRequest(updatedItem);
    return updatedItem;
  } catch {
    return undefined;
  }
}

export function raiseSpecialServiceDeficiency(
  id: string,
  remarks: string
): SpecialServiceApprovalItem | undefined {
  try {
    const existing = getSpecialServiceRequests();
    const target = existing.find(e => e.id === id);
    if (!target) return undefined;

    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const updatedItem: SpecialServiceApprovalItem = {
      ...target,
      status: 'Deficiency Raised',
      scrutinyRemarks: remarks.trim(),
      deficiencyDetails: {
        remarks: remarks.trim(),
        raisedDate: formattedDate,
        raisedBy: 'University DCDC Standing Committee',
      },
      reviewedBy: 'University DCDC Standing Committee',
      reviewedDate: formattedDate,
    };

    saveSpecialServiceRequest(updatedItem);
    return updatedItem;
  } catch {
    return undefined;
  }
}
