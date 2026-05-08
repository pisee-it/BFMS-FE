export interface AdCompany {
  id: number;
  name: string;
  taxCode: string;
  contact: string;
}

export interface AdCompanyRequest {
  name: string;
  taxCode: string;
  contact: string;
}
