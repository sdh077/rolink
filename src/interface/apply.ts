import { IUser } from "./user";

export interface IApply {
  id: number;
  created_at: string;
  month: number;
  year: number;
  bean: number;
  user_id: string;
  use_yn: boolean;
  apply_donation: IDonation[];
  church: IUser
}

export interface IDonation {
  id: number;
  created_at: string;
  apply_bean_id: number;
  cafe_id: string;
  bean: number;
  cafe: IUser;
  apply_bean: IApply
}