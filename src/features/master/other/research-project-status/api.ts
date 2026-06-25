import { ApiService } from 'services';

const RESEARCH_PROJECT_STATUS_URL = 'master/research-project-status';

export function getResearchProjectStatus() {
  return ApiService.getList<Master.Other.ResearchProjectStatusItem>(
    RESEARCH_PROJECT_STATUS_URL
  );
}
