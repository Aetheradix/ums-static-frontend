import { ApiService } from 'services';

const MEMBERSHIP_ACTIVITY_TYPE_URL = `master/membership-activity-type`;

export function getMembershipActivityTypes() {
  return ApiService.getList<Master.Other.MembershipActivityTypeItem>(
    MEMBERSHIP_ACTIVITY_TYPE_URL
  );
}
