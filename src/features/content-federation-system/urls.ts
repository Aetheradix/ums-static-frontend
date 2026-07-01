const baseUrl = '/content-federation';

export const cfsUrls = {
  root: baseUrl,
  admin: {
    portal: `${baseUrl}/admin`,
    dashboard: `${baseUrl}/admin/dashboard`,
    settings: {
      hub: `${baseUrl}/admin/settings`,
      categories: `${baseUrl}/admin/settings/publishing-categories`,
      categoriesAdd: `${baseUrl}/admin/settings/publishing-categories/add`,
      categoriesEdit: (id: string | number) =>
        `${baseUrl}/admin/settings/publishing-categories/edit/${id}`,
      subCategories: `${baseUrl}/admin/settings/sub-publishing-categories`,
      subCategoriesAdd: `${baseUrl}/admin/settings/sub-publishing-categories/add`,
      subCategoriesEdit: (id: string | number) =>
        `${baseUrl}/admin/settings/sub-publishing-categories/edit/${id}`,
      workflow: `${baseUrl}/admin/settings/workflow`,
    },
    allContent: `${baseUrl}/admin/all-content`,
    activityLogs: `${baseUrl}/admin/activity-logs`,
    reports: `${baseUrl}/admin/reports`,
  },
  ouAdmin: {
    portal: `${baseUrl}/ou-admin`,
    dashboard: `${baseUrl}/ou-admin/dashboard`,
    myContent: `${baseUrl}/ou-admin/my-content`,
    addContent: `${baseUrl}/ou-admin/content/add`,
    editContent: (id: string | number) =>
      `${baseUrl}/ou-admin/content/edit/${id}`,
  },
  reviewer: {
    portal: `${baseUrl}/reviewer`,
    dashboard: `${baseUrl}/reviewer/dashboard`,
    pending: `${baseUrl}/reviewer/pending-review`,
    history: `${baseUrl}/reviewer/review-history`,
    detail: (id: string | number) => `${baseUrl}/reviewer/review/${id}`,
  },
  content: {
    view: (id: string | number) => `${baseUrl}/content/view/${id}`,
    versions: (id: string | number) => `${baseUrl}/content/versions/${id}`,
  },
  tracking: {
    list: `${baseUrl}/tracking`,
    lifecycle: (id: string | number) => `${baseUrl}/tracking/lifecycle/${id}`,
  },
  unauthorized: `${baseUrl}/unauthorized`,
};
