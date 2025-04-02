import { IApply } from "./apply";

export interface IDonationInfo {
  id: string;
  created_at: string;
  name: string;
  identity_number: string;
  address: string[];
}

export interface IUser {
  id: string;
  created_at: string;
  name: string;
  tel: string;
  people: string;
  address: string;
  type: string;
}
export interface AddressData {
  zonecode: string;
  address: string;
  addressType: 'R' | 'J';
  userSelectedType: 'R' | 'J';
  jibunAddress: string;
  roadAddress: string;
  bname: string;
  buildingName: string;
  apartment: 'Y' | 'N';
}
export type IChurch = IUser & { apply_bean: IApply[] }