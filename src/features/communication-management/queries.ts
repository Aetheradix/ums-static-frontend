import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGroup,
  createMailingList,
  getCommunications,
  getGroups,
  getMailingLists,
  type GroupFormValues,
  type MailingListFormValues,
} from './api';
import type { Group, MailingList } from './mocks';

const COMMS_QK = ['@comm/communications'];
const GROUPS_QK = ['@comm/groups'];
const LISTS_QK = ['@comm/mailing-lists'];

// ─── Communications ─────────────────────────────────────────────────────────

export function useCommunicationsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: COMMS_QK,
    queryFn: getCommunications,
  });
  return { data, isLoading };
}

// ─── Groups ─────────────────────────────────────────────────────────────────

export function useGroupsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: GROUPS_QK,
    queryFn: getGroups,
  });
  return { data, isLoading };
}

export function useCreateGroupMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: GroupFormValues) => createGroup(form),
    onSuccess(data) {
      const prev = qc.getQueryData<Group[]>(GROUPS_QK) ?? [];
      qc.setQueryData(GROUPS_QK, [data, ...prev]);
    },
  });
}

// ─── Mailing Lists ──────────────────────────────────────────────────────────

export function useMailingListsQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: LISTS_QK,
    queryFn: getMailingLists,
  });
  return { data, isLoading };
}

export function useCreateMailingListMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: MailingListFormValues) => createMailingList(form),
    onSuccess(data) {
      const prev = qc.getQueryData<MailingList[]>(LISTS_QK) ?? [];
      qc.setQueryData(LISTS_QK, [data, ...prev]);
    },
  });
}
