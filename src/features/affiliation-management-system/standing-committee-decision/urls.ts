export const standingCommitteeDecisionUrls = (baseUrl: string) => ({
  list: `${baseUrl}/standing-committee-decision`,
  create: `${baseUrl}/standing-committee-decision/create`,
  view: (id: string | number) =>
    `${baseUrl}/standing-committee-decision/view/${id}`,
});
