import { ApiService } from 'services';

const ADDRESS_TYPE_URL = `master/address-type`;

export function getAddressType() {
  return ApiService.getList<Master.Other.AddressTypeItem>(ADDRESS_TYPE_URL);
}
