import { ApiService } from 'services';

const PERFORMANCE_RATING_URL = `master/performance-rating`;

export function getPerformanceRatings() {
  return ApiService.getList<Master.Other.PerformanceRatingItem>(
    PERFORMANCE_RATING_URL
  );
}
