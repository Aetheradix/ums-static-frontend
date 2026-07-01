// ─── Networking & Communication Management — mock API layer ─────────────────
import {
  communications as COMMUNICATIONS,
  groups as GROUPS,
  mailingLists as MAILING_LISTS,
  type Communication,
  type Group,
  type MailingList,
} from './mocks';

export interface GroupFormValues {
  name: string;
  type: Group['type'];
  description: string;
  memberCount: number;
}

export interface MailingListFormValues {
  name: string;
  description: string;
  memberCount: number;
}

// ─── Communications ─────────────────────────────────────────────────────────

export async function getCommunications(): Promise<Communication[]> {
  return Promise.resolve([...COMMUNICATIONS]);
}

// ─── Groups ─────────────────────────────────────────────────────────────────

export async function getGroups(): Promise<Group[]> {
  return Promise.resolve([...GROUPS]);
}

export async function createGroup(form: GroupFormValues): Promise<Group> {
  return Promise.resolve({
    id: Date.now(),
    name: form.name,
    type: form.type,
    description: form.description,
    memberCount: form.memberCount,
  });
}

// ─── Mailing Lists ──────────────────────────────────────────────────────────

export async function getMailingLists(): Promise<MailingList[]> {
  return Promise.resolve([...MAILING_LISTS]);
}

export async function createMailingList(
  form: MailingListFormValues
): Promise<MailingList> {
  return Promise.resolve({
    id: Date.now(),
    name: form.name,
    description: form.description,
    memberCount: form.memberCount,
  });
}
