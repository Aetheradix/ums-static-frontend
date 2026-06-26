import { ApiService } from 'services';

const ADDRESS_TYPE_URL = `master/address-type`;

export function getAddressType() {
  //   return ApiService.getList<Master.Other.AddressTypeItem>(ADDRESS_TYPE_URL);
  ApiService;
  ADDRESS_TYPE_URL;
  return Promise.resolve([
    { id: 1, name: 'Permanent', text: 'Permanent', isActive: true },
    { id: 2, name: 'Present', text: 'Present', isActive: true },
    { id: 3, name: 'Local Guardian', text: 'Local Guardian', isActive: true },
  ] as unknown as Master.Other.AddressTypeItem[]);
}
