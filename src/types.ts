
export interface User {
  id: number;
  username: string;
  role: string;
  hospital: string;
}

export interface Insured {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  id_card: string;
  policy_no: string;
}

export interface Policy {
  policy_no: string;
  plan_name: string;
  opd_limit: number;
  ipd_limit: number;
  dental_limit: number;
  co_payment: number;
  deductible: number;
  status: string;
}

export interface Claim {
  id: number;
  insured_id: number;
  first_name: string;
  last_name: string;
  policy_no: string;
  claim_type: string;
  treatment_date: string;
  admission_date?: string;
  discharge_date?: string;
  physician_name?: string;
  symptoms?: string;
  diagnosis: string;
  treatment_plan?: string;
  amount: number;
  status: string;
  admin_comments?: string;
  created_at: string;
}

export interface ClaimDocument {
  id: number;
  claim_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  created_at: string;
}
