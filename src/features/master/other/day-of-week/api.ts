import { ApiService } from 'services';

const DAY_OF_WEEK_URL = 'master/day-of-week';

export function getDayOfWeek() {
  return ApiService.getList<Master.Other.DayOfWeekItem>(DAY_OF_WEEK_URL);
}
