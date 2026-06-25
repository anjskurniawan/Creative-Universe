import { apiFetch } from "./api";

type ApiSuccessResponse<T> = {
  status: "success";
  data: T;
  message?: string;
};

type PaginatedResponse<T> = {
  data: T[];
};

type UserSummary = {
  id?: number;
  name?: string;
};

export interface OddsTicketBrief {
  target_audience?: string;
  key_message?: string;
  description?: string;
  references?: string;
  ai_summary?: string;
}

export interface OddsCategory {
  id: number;
  name: string;
}

export interface OddsTicket {
  id: number;
  ticket_number: string;
  design_purpose: string;
  status: string;
  deadline: string;
  category?: OddsCategory;
  requester?: UserSummary;
  assignedDesigner?: UserSummary;
  brief?: OddsTicketBrief;
  important_matrix?: string;
}

export type CreateOddsTicketInput = {
  design_purpose: string;
  category_id: string;
  deadline: string;
  brand: string;
  channel: string;
  important_matrix: string;
  target_audience: string;
  key_message: string;
  description: string;
  required_outputs: string[];
  references: string;
};

export const getOddsTickets = async (): Promise<OddsTicket[]> => {
  const response = await apiFetch<ApiSuccessResponse<PaginatedResponse<OddsTicket>>>("/odds/tickets");
  return response.data?.data || [];
};

export const getOddsTicket = async (id: string): Promise<OddsTicket> => {
  const response = await apiFetch<ApiSuccessResponse<OddsTicket>>(`/odds/tickets/${id}`);
  return response.data;
};

export const createOddsTicket = async (data: CreateOddsTicketInput): Promise<OddsTicket> => {
  const response = await apiFetch<ApiSuccessResponse<OddsTicket>>("/odds/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
};

export const getOddsCategories = async (): Promise<OddsCategory[]> => {
  const response = await apiFetch<ApiSuccessResponse<OddsCategory[]>>("/odds/categories");
  return response.data;
};
