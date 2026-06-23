import { apiFetch } from "./api";

export interface OddsTicket {
  id: number;
  ticket_number: string;
  design_purpose: string;
  status: string;
  deadline: string;
  category?: { name: string };
  requester?: { name: string };
  assignedDesigner?: { name: string };
  brief?: any;
  important_matrix?: string;
}

export const getOddsTickets = async (): Promise<OddsTicket[]> => {
  const response = await apiFetch<any>("/odds/tickets");
  return response.data?.data || [];
};

export const getOddsTicket = async (id: string): Promise<OddsTicket> => {
  const response = await apiFetch<any>(`/odds/tickets/${id}`);
  return response.data;
};

export const createOddsTicket = async (data: any): Promise<OddsTicket> => {
  const response = await apiFetch<any>("/odds/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
};

export const getOddsCategories = async (): Promise<any[]> => {
  const response = await apiFetch<any>("/odds/categories");
  return response.data;
};
