export function getAvailableFacilities() {
  return [
    { id: 1, facilityName: 'Play Ground', isActive: true },
    { id: 2, facilityName: 'Library', isActive: true },
    { id: 3, facilityName: 'Laboratory', isActive: true },
    { id: 4, facilityName: 'Boys Hostel', isActive: true },
    { id: 5, facilityName: 'Girls Hostel', isActive: true },
    { id: 6, facilityName: 'Medical Room', isActive: true },
    { id: 7, facilityName: 'Canteen', isActive: true },
    { id: 8, facilityName: 'Transport Facility', isActive: true },
    { id: 9, facilityName: 'CCTV', isActive: true },
    { id: 10, facilityName: 'Pool', isActive: true },
    { id: 11, facilityName: 'Computer Lab', isActive: true },
  ] as unknown as CollegeMaster.AvailableFacilityItem[];
}

export async function getAvailableFacility(id: number) {
  return {
    id,
    facilityName: 'Mock Facility',
    isActive: true,
  } as unknown as CollegeMaster.AvailableFacilityItem;
}

export async function createAvailableFacility(
  _form: CollegeMaster.AvailableFacilityForm
) {
  return {
    ..._form,
    id: Math.floor(Math.random() * 1000),
  } as unknown as CollegeMaster.AvailableFacilityItem;
}

export async function updateAvailableFacility(
  _id: number,
  _form: CollegeMaster.AvailableFacilityForm
): Promise<boolean> {
  return true;
}

export async function deleteAvailableFacility(_id: number): Promise<boolean> {
  return true;
}

export async function patchAvailableFacilityStatus(
  _id: number
): Promise<boolean> {
  return true;
}
