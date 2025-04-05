import { IUser } from "./user";

export interface IInquiry {
  id: number;
  created_at: string;
  content: string
  parent: number;
  church_id: string;
  cafe_id: string;
  is_delete: boolean
}

export type IInquiryCustom = IInquiry & { church: IUser; cafe: IUser; user: IUser }