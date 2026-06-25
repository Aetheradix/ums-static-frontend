import { ApiService } from 'services';

const APPOINTED_CATEGORY_URL = 'master/appointed-category';

export function getAppointedCategories() {
  return ApiService.getList<Master.Other.AppointedCategoryItems>(
    APPOINTED_CATEGORY_URL
  );
}
