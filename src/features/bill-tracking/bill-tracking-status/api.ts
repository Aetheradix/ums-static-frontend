import { BT_TRACKING_DATA } from '../mock-data';

export const getBillTrackingDetails = async (billRef: string) => {
  // Simulate API delay
  await new Promise(res => setTimeout(res, 500));
  return BT_TRACKING_DATA.find(t => t.billRef === billRef) || null;
};
