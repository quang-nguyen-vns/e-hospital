
import { User, Insured, Policy, Claim, Announcement, ClaimDocument, HospitalUser, Hospital, GeneraliUser } from '../types';

const STORAGE_KEYS = {
  USERS: 'generali_users',
  HOSPITALS: 'generali_hospitals',
  GENERALI_USERS: 'generali_internal_users',
  INSURED: 'generali_insured',
  POLICIES: 'generali_policies',
  CLAIMS: 'generali_claims',
  ANNOUNCEMENTS: 'generali_announcements',
  DOCUMENTS: 'generali_documents',
  HOSPITAL_USERS: 'generali_hospital_users',
  INITIALIZED: 'generali_initialized'
};
const INITIAL_HOSPITALS: Hospital[] = [
  { id: 1, name: 'Bangkok General Hospital', code: 'BGH', address: '123 Rama IV Rd, Bangkok', status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 2, name: 'Phuket International Hospital', code: 'PIH', address: '456 Patong Beach, Phuket', status: 'active', createdAt: '2025-02-15T00:00:00Z' }
];

const INITIAL_GENERALI_USERS: GeneraliUser[] = [
  { id: 1, name: 'Admin User', email: 'admin@generali.th', username: 'admin', role: 'admin', department: 'IT Administration', status: 'active', lastLogin: '2026-03-01T10:00:00Z', createdAt: '2024-01-01T00:00:00Z' }
];

const INITIAL_HOSPITAL_USERS: HospitalUser[] = [
  {
    id: 1,
    hospital_id: 1,
    name: 'Somchai Phongsakorn',
    email: 'somchai.p@bangkokgeneral.th',
    username: 'somchai.p',
    role: 'receptionist',
    department: 'Outpatient Registration',
    status: 'active',
    lastLogin: '2026-03-03T08:15:00Z',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    hospital_id: 1,
    name: 'Nattaya Jirakul',
    email: 'nattaya.j@bangkokgeneral.th',
    username: 'nattaya.j',
    role: 'nurse_coordinator',
    department: 'IPD Ward B',
    status: 'active',
    lastLogin: '2026-03-02T13:40:00Z',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 3,
    hospital_id: 1,
    name: 'Wanchai Thongsuk',
    email: 'wanchai.t@bangkokgeneral.th',
    username: 'wanchai.t',
    role: 'billing_staff',
    department: 'Finance & Billing',
    status: 'active',
    lastLogin: '2026-03-03T09:55:00Z',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 4,
    hospital_id: 2,
    name: 'Prapha Limchaikul',
    email: 'prapha.l@bangkokgeneral.th',
    username: 'prapha.l',
    role: 'doctor',
    department: 'Emergency Room',
    status: 'active',
    lastLogin: '2026-03-01T22:10:00Z',
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 5,
    hospital_id: 2,
    name: 'Kittipong Sermsirichai',
    email: 'kittipong.s@bangkokgeneral.th',
    username: 'kittipong.s',
    role: 'it_admin',
    department: 'IT Department',
    status: 'active',
    lastLogin: '2026-02-28T17:30:00Z',
    createdAt: '2024-04-05T00:00:00Z',
  },
  {
    id: 6,
    hospital_id: 1,
    name: 'Malee Charoenwong',
    email: 'malee.c@bangkokgeneral.th',
    username: 'malee.c',
    role: 'nurse_coordinator',
    department: 'OPD Clinic',
    status: 'inactive',
    lastLogin: '2026-01-10T11:00:00Z',
    createdAt: '2024-01-10T00:00:00Z',
  },
];

const INITIAL_DATA = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', hospital_name: 'Generali HQ' },
    { id: 2, username: 'hospital_admin', password: 'pass123', role: 'hospital_admin', hospital_name: 'Bangkok General Hospital' }
  ],
  insured: [
    { id: 1, first_name: 'John', last_name: 'Doe', dob: '1985-05-15', gender: 'Male', id_card: '1234567890123', policy_no: 'POL-001' },
    { id: 2, first_name: 'Jane', last_name: 'Smith', dob: '1990-08-22', gender: 'Female', id_card: '9876543210987', policy_no: 'POL-002' }
  ],
  policies: [
    { id: 1, policy_no: 'POL-001', plan_name: 'Premium Gold', opd_limit: 5000, ipd_limit: 100000, dental_limit: 2000, co_payment: 0, deductible: 0, status: 'Active' },
    { id: 2, policy_no: 'POL-002', plan_name: 'Silver Care', opd_limit: 2000, ipd_limit: 50000, dental_limit: 0, co_payment: 10, deductible: 1000, status: 'Active' }
  ],
  announcements: [
    { id: 1, title: 'System Maintenance', content: 'Scheduled maintenance on March 15th from 02:00 to 04:00 AM.', type: 'Maintenance', created_at: new Date().toISOString() },
    { id: 2, title: 'New Feature: IPD Auto-Adjudication', content: 'We have launched a new feature for faster IPD claim processing.', type: 'Update', created_at: new Date().toISOString() }
  ],
  claims: [
    { id: 1, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'OPD', treatment_date: '2026-02-28', physician_name: 'Dr. Somchai Wirote', symptoms: 'Fever, headache, fatigue for 3 days', diagnosis: 'Acute viral pharyngitis (J02.9)', treatment_plan: 'Antipyretics, rest, hydration. Follow-up in 5 days if no improvement.', amount: 1850, status: 'APPROVED', admin_comments: 'All documents verified. Claim approved within OPD limit.', created_at: '2026-02-28T09:30:00Z' },
    { id: 2, insured_id: 2, first_name: 'Jane', last_name: 'Smith', policy_no: 'POL-002', claim_type: 'IPD', treatment_date: '2026-02-20', admission_date: '2026-02-20', discharge_date: '2026-02-24', physician_name: 'Dr. Piyaporn Kanit', symptoms: 'Severe abdominal pain, nausea, vomiting', diagnosis: 'Acute appendicitis (K35.89)', treatment_plan: 'Emergency laparoscopic appendectomy. 4-night observation post-op.', amount: 78500, status: 'PAID', admin_comments: 'Pre-auth obtained. Payment processed to hospital account.', created_at: '2026-02-20T14:15:00Z' },
    { id: 3, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'DENTAL', treatment_date: '2026-02-15', physician_name: 'Dr. Anchisa Dental', symptoms: 'Tooth pain, sensitivity to cold', diagnosis: 'Dental caries requiring root canal (K02.1)', treatment_plan: 'Root canal treatment, temporary crown placement.', amount: 1200, status: 'APPROVED', admin_comments: 'Within dental limit. Approved.', created_at: '2026-02-15T11:00:00Z' },
    { id: 4, insured_id: 2, first_name: 'Jane', last_name: 'Smith', policy_no: 'POL-002', claim_type: 'ER', treatment_date: '2026-02-10', physician_name: 'Dr. Prapha Limchaikul', symptoms: 'Chest pain, shortness of breath, dizziness', diagnosis: 'Non-cardiac chest pain — musculoskeletal origin (M79.3)', treatment_plan: 'ECG normal. Pain relief administered. Discharged with NSAIDs.', amount: 4200, status: 'APPROVED', admin_comments: 'ER visit confirmed. Amount within policy limit.', created_at: '2026-02-10T22:45:00Z' },
    { id: 5, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'OPD', treatment_date: '2026-03-01', physician_name: 'Dr. Montri Supa', symptoms: 'Chronic lower back pain radiating to left leg', diagnosis: 'Lumbar disc herniation L4-L5 (M51.1)', treatment_plan: 'Physiotherapy x6 sessions, muscle relaxants, refer to orthopedics.', amount: 2400, status: 'UNDER_REVIEW', admin_comments: '', created_at: '2026-03-01T10:00:00Z' },
    { id: 6, insured_id: 2, first_name: 'Jane', last_name: 'Smith', policy_no: 'POL-002', claim_type: 'OPD', treatment_date: '2026-03-02', physician_name: 'Dr. Chanpen Rattana', symptoms: 'Skin rash, itching, swelling on forearms', diagnosis: 'Allergic contact dermatitis (L23.9)', treatment_plan: 'Topical corticosteroids, antihistamine, avoid allergen.', amount: 950, status: 'SUBMITTED', admin_comments: '', created_at: '2026-03-02T08:20:00Z' },
    { id: 7, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'IPD', treatment_date: '2026-01-18', admission_date: '2026-01-18', discharge_date: '2026-01-21', physician_name: 'Dr. Surapong Vejjakit', symptoms: 'High fever 39.5°C, chills, muscle aches', diagnosis: 'Dengue fever without warning signs (A90)', treatment_plan: 'IV fluid support, daily platelet monitoring for 3 days.', amount: 22000, status: 'PAID', admin_comments: 'Lab results confirmed dengue. Paid.', created_at: '2026-01-18T07:30:00Z' },
    { id: 8, insured_id: 2, first_name: 'Jane', last_name: 'Smith', policy_no: 'POL-002', claim_type: 'OPD', treatment_date: '2026-03-03', physician_name: 'Dr. Rungnapa Chai', symptoms: 'Blurred vision, eye redness and discharge', diagnosis: 'Acute conjunctivitis (H10.3)', treatment_plan: 'Antibiotic eye drops x7 days.', amount: 680, status: 'SUBMITTED', admin_comments: '', created_at: '2026-03-03T07:50:00Z' },
    { id: 9, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'OPD', treatment_date: '2026-01-05', physician_name: 'Dr. Montri Supa', symptoms: 'Persistent cough, mild fever, loss of smell', diagnosis: 'COVID-19 mild case (U07.1)', treatment_plan: 'Home isolation, antiviral medication, symptomatic treatment.', amount: 1650, status: 'REJECTED', admin_comments: 'COVID treatment excluded per policy clause 7.3. Claim rejected.', created_at: '2026-01-05T13:00:00Z' },
    { id: 10, insured_id: 2, first_name: 'Jane', last_name: 'Smith', policy_no: 'POL-002', claim_type: 'DENTAL', treatment_date: '2026-02-25', physician_name: 'Dr. Anchisa Dental', symptoms: 'Missing molar, difficulty chewing', diagnosis: 'Dental implant required (Z98.818)', treatment_plan: 'Single implant placement and crown.', amount: 35000, status: 'REJECTED', admin_comments: 'Implants not covered under Silver Care plan. Refer to policy schedule.', created_at: '2026-02-25T15:30:00Z' },
    { id: 11, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'ER', treatment_date: '2026-02-05', physician_name: 'Dr. Prapha Limchaikul', symptoms: 'Laceration on right hand from kitchen knife', diagnosis: 'Open wound of right hand (S61.409)', treatment_plan: '5 sutures applied, tetanus booster, wound dressing x3 days.', amount: 3800, status: 'APPROVED', admin_comments: 'ER trauma claim confirmed. Approved.', created_at: '2026-02-05T19:20:00Z' },
    { id: 12, insured_id: 2, first_name: 'Jane', last_name: 'Smith', policy_no: 'POL-002', claim_type: 'IPD', treatment_date: '2026-02-27', admission_date: '2026-02-27', discharge_date: '2026-03-01', physician_name: 'Dr. Piyaporn Kanit', symptoms: 'Productive cough, fever 38.8°C, difficulty breathing', diagnosis: 'Community-acquired pneumonia (J18.9)', treatment_plan: 'IV antibiotics, chest physiotherapy, oxygen support — 2-night admission.', amount: 18500, status: 'PENDING_DOCUMENTS', admin_comments: 'Please supply chest X-ray report and discharge summary to proceed.', created_at: '2026-02-27T11:00:00Z' },
    { id: 13, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'OPD', treatment_date: '2026-01-22', physician_name: 'Dr. Chanpen Rattana', symptoms: 'Frequent urination, burning sensation', diagnosis: 'Urinary tract infection (N39.0)', treatment_plan: 'Urine culture taken. 7-day antibiotic course prescribed.', amount: 1100, status: 'APPROVED', admin_comments: '', created_at: '2026-01-22T10:45:00Z' },
    { id: 14, insured_id: 2, first_name: 'Jane', last_name: 'Smith', policy_no: 'POL-002', claim_type: 'OPD', treatment_date: '2026-03-03', physician_name: 'Dr. Rungnapa Chai', symptoms: 'Migraine headache, photophobia, nausea', diagnosis: 'Migraine without aura (G43.009)', treatment_plan: 'Triptans prescribed. Neurology referral recommended.', amount: 1750, status: 'UNDER_REVIEW', admin_comments: '', created_at: '2026-03-03T09:15:00Z' },
    { id: 15, insured_id: 1, first_name: 'John', last_name: 'Doe', policy_no: 'POL-001', claim_type: 'IPD', treatment_date: '2026-03-02', admission_date: '2026-03-02', discharge_date: '', physician_name: 'Dr. Surapong Vejjakit', symptoms: 'Sudden severe headache, altered consciousness briefly', diagnosis: 'Transient ischaemic attack (G45.9) — observation required', treatment_plan: 'MRI brain ordered. Neurological monitoring. Anti-platelet therapy started.', amount: 45000, status: 'RESUBMITTED', admin_comments: 'MRI report received. Awaiting neurology specialist sign-off.', created_at: '2026-03-02T16:40:00Z' }
  ]
};

const DATA_VERSION = '4'; // bump this whenever INITIAL_DATA changes

export const initStorage = () => {
  const storedVersion = localStorage.getItem('generali_data_version');

  // Wipe and re-seed if version mismatch (or first run)
  if (storedVersion !== DATA_VERSION) {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DATA.users));
    localStorage.setItem(STORAGE_KEYS.INSURED, JSON.stringify(INITIAL_DATA.insured));
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(INITIAL_DATA.policies));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_DATA.announcements));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_DATA.claims));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(INITIAL_HOSPITALS));
    localStorage.setItem(STORAGE_KEYS.GENERALI_USERS, JSON.stringify(INITIAL_GENERALI_USERS));
    localStorage.setItem(STORAGE_KEYS.HOSPITAL_USERS, JSON.stringify(INITIAL_HOSPITAL_USERS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem('generali_data_version', DATA_VERSION);
  }

  // Ensure hospital users are seeded even for any edge case
  if (!localStorage.getItem(STORAGE_KEYS.HOSPITAL_USERS)) {
    localStorage.setItem(STORAGE_KEYS.HOSPITAL_USERS, JSON.stringify(INITIAL_HOSPITAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOSPITALS)) {
    localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(INITIAL_HOSPITALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GENERALI_USERS)) {
    localStorage.setItem(STORAGE_KEYS.GENERALI_USERS, JSON.stringify(INITIAL_GENERALI_USERS));
  }
};


const getItems = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItems = <T>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const storageService = {
  login: async (username: string, password: string): Promise<{ success: boolean, user?: User, message?: string }> => {
    const users = getItems<any>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return {
        success: true,
        user: { id: user.id, username: user.username, role: user.role, hospital: user.hospital_name }
      };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  getDashboardData: async () => {
    const claims = getItems<Claim>(STORAGE_KEYS.CLAIMS);
    const announcements = getItems<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS);

    const stats = {
      total: { count: claims.length },
      pending: { count: claims.filter(c => ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_DOCUMENTS', 'RESUBMITTED'].includes(c.status)).length },
      approved: { count: claims.filter(c => c.status === 'APPROVED').length },
      rejected: { count: claims.filter(c => c.status === 'REJECTED').length }
    };

    return { stats, announcements: announcements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5) };
  },

  searchInsured: async (q: string, type: string, dob?: string): Promise<Insured[]> => {
    const insured = getItems<Insured>(STORAGE_KEYS.INSURED);
    return insured.filter(item => {
      if (type === 'policy') return item.policy_no.toLowerCase().includes(q.toLowerCase());
      if (type === 'id') return item.id_card.includes(q);

      const nameMatch = (item.first_name + ' ' + item.last_name).toLowerCase().includes(q.toLowerCase());
      if (dob) return nameMatch && item.dob === dob;
      return nameMatch;
    });
  },

  getPolicyDetails: async (policyNo: string): Promise<{ policy: Policy, insured: Insured } | null> => {
    const policies = getItems<Policy>(STORAGE_KEYS.POLICIES);
    const insuredList = getItems<Insured>(STORAGE_KEYS.INSURED);
    const policy = policies.find(p => p.policy_no === policyNo);
    const insured = insuredList.find(i => i.policy_no === policyNo);
    if (policy && insured) return { policy, insured };
    return null;
  },

  submitClaim: async (claimData: any): Promise<{ success: boolean, claimId: number }> => {
    const claims = getItems<Claim>(STORAGE_KEYS.CLAIMS);
    const newClaim: Claim = {
      ...claimData,
      id: claims.length + 1,
      status: 'SUBMITTED',
      created_at: new Date().toISOString(),
      treatment_date: new Date().toISOString().split('T')[0]
    };
    claims.push(newClaim);
    setItems(STORAGE_KEYS.CLAIMS, claims);
    return { success: true, claimId: newClaim.id };
  },

  getClaimHistory: async (): Promise<Claim[]> => {
    const claims = getItems<Claim>(STORAGE_KEYS.CLAIMS);
    const insuredList = getItems<Insured>(STORAGE_KEYS.INSURED);
    const hospitals = getItems<Hospital>(STORAGE_KEYS.HOSPITALS);

    return claims.map(c => {
      const insured = insuredList.find(i => i.id === c.insured_id);
      const mappedHospitalId = c.hospital_id || (c.id % 2 === 0 ? 2 : 1);
      const hospitalName = hospitals.find(h => h.id === mappedHospitalId)?.name || 'Unknown Hospital';

      return {
        ...c,
        first_name: insured?.first_name || '',
        last_name: insured?.last_name || '',
        policy_no: insured?.policy_no || '',
        hospital_id: mappedHospitalId,
        hospital_name: hospitalName
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  updateClaim: async (id: number, status: string, admin_comments: string): Promise<{ success: boolean }> => {
    const claims = getItems<Claim>(STORAGE_KEYS.CLAIMS);
    const index = claims.findIndex(c => c.id === id);
    if (index !== -1) {
      claims[index].status = status;
      claims[index].admin_comments = admin_comments;
      setItems(STORAGE_KEYS.CLAIMS, claims);
      return { success: true };
    }
    return { success: false };
  },

  uploadDocument: async (claimId: number, docData: any): Promise<{ success: boolean, documentId: number }> => {
    const documents = getItems<ClaimDocument>(STORAGE_KEYS.DOCUMENTS);
    const newDoc: ClaimDocument = {
      ...docData,
      id: documents.length + 1,
      claim_id: claimId,
      uploaded_at: new Date().toISOString()
    };
    documents.push(newDoc);
    setItems(STORAGE_KEYS.DOCUMENTS, documents);
    return { success: true, documentId: newDoc.id };
  },

  getDocuments: async (claimId: number): Promise<ClaimDocument[]> => {
    const documents = getItems<ClaimDocument>(STORAGE_KEYS.DOCUMENTS);
    return documents.filter(d => d.claim_id === claimId);
  },

  // Hospital User Management (RBAC)
  getHospitalUsers: async (): Promise<HospitalUser[]> => {
    return getItems<HospitalUser>(STORAGE_KEYS.HOSPITAL_USERS);
  },

  createHospitalUser: async (data: Omit<HospitalUser, 'id' | 'lastLogin' | 'createdAt'>): Promise<{ success: boolean, user: HospitalUser }> => {
    const users = getItems<HospitalUser>(STORAGE_KEYS.HOSPITAL_USERS);
    const newUser: HospitalUser = {
      ...data,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      lastLogin: 'Never',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setItems(STORAGE_KEYS.HOSPITAL_USERS, users);
    return { success: true, user: newUser };
  },

  updateHospitalUser: async (id: number, data: Partial<HospitalUser>): Promise<{ success: boolean }> => {
    const users = getItems<HospitalUser>(STORAGE_KEYS.HOSPITAL_USERS);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      setItems(STORAGE_KEYS.HOSPITAL_USERS, users);
      return { success: true };
    }
    return { success: false };
  },

  deactivateHospitalUser: async (id: number, status: 'active' | 'inactive'): Promise<{ success: boolean }> => {
    const users = getItems<HospitalUser>(STORAGE_KEYS.HOSPITAL_USERS);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index].status = status;
      setItems(STORAGE_KEYS.HOSPITAL_USERS, users);
      return { success: true };
    }
    return { success: false };
  },

  deleteHospitalUser: async (id: number): Promise<{ success: boolean }> => {
    const users = getItems<HospitalUser>(STORAGE_KEYS.HOSPITAL_USERS);
    const filtered = users.filter(u => u.id !== id);
    setItems(STORAGE_KEYS.HOSPITAL_USERS, filtered);
    return { success: true };
  },

  // Hospital Management
  getHospitals: async (): Promise<Hospital[]> => {
    return getItems<Hospital>(STORAGE_KEYS.HOSPITALS);
  },

  createHospital: async (data: Omit<Hospital, 'id' | 'createdAt'>): Promise<{ success: boolean, hospital: Hospital }> => {
    const hospitals = getItems<Hospital>(STORAGE_KEYS.HOSPITALS);
    const newHospital: Hospital = {
      ...data,
      id: hospitals.length > 0 ? Math.max(...hospitals.map(h => h.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
    };
    hospitals.push(newHospital);
    setItems(STORAGE_KEYS.HOSPITALS, hospitals);
    return { success: true, hospital: newHospital };
  },

  updateHospital: async (id: number, data: Partial<Hospital>): Promise<{ success: boolean }> => {
    const hospitals = getItems<Hospital>(STORAGE_KEYS.HOSPITALS);
    const index = hospitals.findIndex(h => h.id === id);
    if (index !== -1) {
      hospitals[index] = { ...hospitals[index], ...data };
      setItems(STORAGE_KEYS.HOSPITALS, hospitals);
      return { success: true };
    }
    return { success: false };
  },

  deleteHospital: async (id: number): Promise<{ success: boolean }> => {
    const hospitals = getItems<Hospital>(STORAGE_KEYS.HOSPITALS);
    setItems(STORAGE_KEYS.HOSPITALS, hospitals.filter(h => h.id !== id));
    return { success: true };
  },

  // Generali User Management
  getGeneraliUsers: async (): Promise<GeneraliUser[]> => {
    return getItems<GeneraliUser>(STORAGE_KEYS.GENERALI_USERS);
  },

  createGeneraliUser: async (data: Omit<GeneraliUser, 'id' | 'lastLogin' | 'createdAt'>): Promise<{ success: boolean, user: GeneraliUser }> => {
    const users = getItems<GeneraliUser>(STORAGE_KEYS.GENERALI_USERS);
    const newUser: GeneraliUser = {
      ...data,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      lastLogin: 'Never',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setItems(STORAGE_KEYS.GENERALI_USERS, users);
    return { success: true, user: newUser };
  },

  updateGeneraliUser: async (id: number, data: Partial<GeneraliUser>): Promise<{ success: boolean }> => {
    const users = getItems<GeneraliUser>(STORAGE_KEYS.GENERALI_USERS);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      setItems(STORAGE_KEYS.GENERALI_USERS, users);
      return { success: true };
    }
    return { success: false };
  },

  deleteGeneraliUser: async (id: number): Promise<{ success: boolean }> => {
    const users = getItems<GeneraliUser>(STORAGE_KEYS.GENERALI_USERS);
    setItems(STORAGE_KEYS.GENERALI_USERS, users.filter(u => u.id !== id));
    return { success: true };
  },

  // Admin Dashboard Data
  getAdminDashboardData: async () => {
    const claims = getItems<Claim>(STORAGE_KEYS.CLAIMS);
    const hospitals = getItems<Hospital>(STORAGE_KEYS.HOSPITALS);

    // Aggregating mock claims data (since claims dont have hospital_id initially, we will randomly assign them or group them to BGH, PIH)
    // To be realistic we assign them to hospital 1 or 2 based on ID odd/even
    const claimsWithHospitals = claims.map(c => ({
      ...c,
      hospital_id: c.id % 2 === 0 ? 2 : 1
    }));

    return {
      totalClaims: claims.length,
      totalAmount: claims.reduce((sum, c) => sum + (c.amount || 0), 0),
      approvedClaims: claims.filter(c => c.status === 'APPROVED' || c.status === 'PAID').length,
      claimsByHospital: hospitals.map(h => ({
        hospital: h.name,
        count: claimsWithHospitals.filter(c => c.hospital_id === h.id).length,
        approved: claimsWithHospitals.filter(c => c.hospital_id === h.id && (c.status === 'APPROVED' || c.status === 'PAID')).length,
        rejected: claimsWithHospitals.filter(c => c.hospital_id === h.id && c.status === 'REJECTED').length,
        amount: claimsWithHospitals.filter(c => c.hospital_id === h.id).reduce((sum, c) => sum + (c.amount || 0), 0)
      }))
    };
  }
};
