import { IApply } from "./apply";

export interface IUser {
  id: string;
  created_at: string;
  name: string;
  tel: string;
  people: string;
  address: string;
  type: string;
}

export type IChurch = IUser & { apply_bean: IApply[] }