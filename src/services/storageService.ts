
import { User, Insured, Policy, Claim, Announcement, ClaimDocument } from '../types';

const STORAGE_KEYS = {
  USERS: 'generali_users',
  INSURED: 'generali_insured',
  POLICIES: 'generali_policies',
  CLAIMS: 'generali_claims',
  ANNOUNCEMENTS: 'generali_announcements',
  DOCUMENTS: 'generali_documents',
  INITIALIZED: 'generali_initialized'
};

const INITIAL_DATA = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', hospital_name: 'Generali HQ' },
    { id: 2, username: 'hospital_user', password: 'pass123', role: 'user', hospital_name: 'Bangkok General Hospital' }
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

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DATA.users));
    localStorage.setItem(STORAGE_KEYS.INSURED, JSON.stringify(INITIAL_DATA.insured));
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(INITIAL_DATA.policies));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_DATA.announcements));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
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
  }
};
