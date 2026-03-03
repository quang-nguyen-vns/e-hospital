
import { User, Insured, Policy, Claim, Announcement, ClaimDocument, HospitalUser } from '../types';

const STORAGE_KEYS = {
  USERS: 'generali_users',
  INSURED: 'generali_insured',
  POLICIES: 'generali_policies',
  CLAIMS: 'generali_claims',
  ANNOUNCEMENTS: 'generali_announcements',
  DOCUMENTS: 'generali_documents',
  HOSPITAL_USERS: 'generali_hospital_users',
  INITIALIZED: 'generali_initialized'
};

const INITIAL_HOSPITAL_USERS: HospitalUser[] = [
  {
    id: 1,
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
  ]
};

const DATA_VERSION = '2'; // bump this whenever INITIAL_DATA changes

export const initStorage = () => {
  const storedVersion = localStorage.getItem('generali_data_version');

  // Wipe and re-seed if version mismatch (or first run)
  if (storedVersion !== DATA_VERSION) {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DATA.users));
    localStorage.setItem(STORAGE_KEYS.INSURED, JSON.stringify(INITIAL_DATA.insured));
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(INITIAL_DATA.policies));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_DATA.announcements));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.HOSPITAL_USERS, JSON.stringify(INITIAL_HOSPITAL_USERS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem('generali_data_version', DATA_VERSION);
  }

  // Ensure hospital users are seeded even for any edge case
  if (!localStorage.getItem(STORAGE_KEYS.HOSPITAL_USERS)) {
    localStorage.setItem(STORAGE_KEYS.HOSPITAL_USERS, JSON.stringify(INITIAL_HOSPITAL_USERS));
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

    return claims.map(c => {
      const insured = insuredList.find(i => i.id === c.insured_id);
      return {
        ...c,
        first_name: insured?.first_name || '',
        last_name: insured?.last_name || '',
        policy_no: insured?.policy_no || ''
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
};
