import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { auth, db, googleProvider, firebaseProjectId, firestoreDatabaseName, isFirebaseConfigured, cleanFirestoreData } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import {
  Tenant,
  AppUser,
  UserRole,
  Student,
  StaffMember,
  ClassStream,
  CBCSubject,
  AssessmentRecord,
  FeeStructureItem,
  FeePayment,
  FeeInvoice,
  AttendanceRecord,
  TimetableSlot,
  Assignment,
  DisciplineIncident,
  SchoolCalendarEvent,
  NotificationBroadcast,
  AuditLog,
  PrimaryGradeLevel,
  TenantStatus,
  TenantPlan,
  PermissionAction,
  PermissionResource,
  CollegeDepartment,
  CollegeCourse,
  CollegeStudent,
  LibraryBook,
  HostelRoom,
  RetailProduct,
  RetailSale,
  RetailSupplier,
  RetailCustomer,
  HospitalPatient,
  MedicalConsultation,
  PharmacyItem,
  SystemAttentionItem,
  SearchResultItem,
  TheologyProgram,
  TheologyUnit,
  TheologyStudent,
  MinistryPracticumLog,
  TheologyLibraryResource,
  CollegeFeeStructureItem,
  CollegeInvoice,
  CollegePayment,
  TheologyFeePayment,
  TheologyInvoice,
  HospitalBillingInvoice,
  HospitalBillingPayment,
  HospitalServiceTariff,
  RetailCustomerInvoice,
  RetailCustomerPayment,
  SubscriptionTierConfig,
  DEFAULT_SUBSCRIPTION_TIERS
} from '../types';
import {
  INITIAL_TENANTS,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_CLASSES,
  INITIAL_CBC_SUBJECTS,
  INITIAL_ASSESSMENTS,
  INITIAL_FEE_STRUCTURE,
  INITIAL_PAYMENTS,
  INITIAL_INVOICES,
  INITIAL_ATTENDANCE,
  INITIAL_TIMETABLE,
  INITIAL_ASSIGNMENTS,
  INITIAL_DISCIPLINE,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COLLEGE_DEPARTMENTS,
  INITIAL_COLLEGE_COURSES,
  INITIAL_COLLEGE_STUDENTS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_HOSTEL_ROOMS,
  INITIAL_RETAIL_PRODUCTS,
  INITIAL_RETAIL_SALES,
  INITIAL_RETAIL_SUPPLIERS,
  INITIAL_RETAIL_CUSTOMERS,
  INITIAL_HOSPITAL_PATIENTS,
  INITIAL_MEDICAL_CONSULTATIONS,
  INITIAL_PHARMACY_ITEMS,
  INITIAL_THEOLOGY_PROGRAMS,
  INITIAL_THEOLOGY_STUDENTS,
  INITIAL_THEOLOGY_PRACTICUM_LOGS,
  INITIAL_THEOLOGY_LIBRARY,
  INITIAL_COLLEGE_FEE_STRUCTURE,
  INITIAL_COLLEGE_INVOICES,
  INITIAL_COLLEGE_PAYMENTS,
  INITIAL_THEOLOGY_INVOICES,
  INITIAL_THEOLOGY_PAYMENTS,
  INITIAL_HOSPITAL_TARIFFS,
  INITIAL_HOSPITAL_INVOICES,
  INITIAL_HOSPITAL_PAYMENTS,
  INITIAL_RETAIL_INVOICES,
  INITIAL_RETAIL_PAYMENTS
} from '../data/initialData';

import {
  getEffectiveHostname,
  resolveTenantFromHost,
  navigateToTenantSubdomain,
  navigateToPlatform
} from '../services/TenantResolver';

interface AuthContextType {
  user: AppUser | null;
  tenant: Tenant | null;
  isPlatformMode: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  switchUserPersona: (userId: string) => void;
  switchTenantAsSuperAdmin: (tenantId: string) => void;
  switchToPlatformMaster: () => void;

  // Platform & Super Admin operations
  allTenants: Tenant[];
  allPlatformUsers: AppUser[];
  allUsers: AppUser[];
  createTenant: (tenantData: Omit<Tenant, 'id' | 'createdAt'>, adminDetails?: { name: string; email: string }) => Promise<Tenant>;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  updateTenantSettings: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  deleteTenant: (tenantId: string) => Promise<void>;
  updateTenantStatus: (tenantId: string, status: TenantStatus) => Promise<void>;
  updateTenantPlan: (tenantId: string, plan: TenantPlan) => Promise<void>;
  toggleTenantModule: (tenantId: string, moduleId: string) => Promise<void>;
  subscriptionTiers: SubscriptionTierConfig[];
  updateSubscriptionTier: (tierId: TenantPlan, updates: Partial<SubscriptionTierConfig>) => Promise<void>;
  resetSubscriptionTiers: () => Promise<void>;
  createPlatformUser: (userData: Omit<AppUser, 'uid' | 'createdAt'>) => Promise<AppUser>;
  updatePlatformUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  toggleUserActiveStatus: (userId: string) => Promise<void>;

  // Current Tenant isolated data & operations
  students: Student[];
  staff: StaffMember[];
  classes: ClassStream[];
  subjects: CBCSubject[];
  assessments: AssessmentRecord[];
  feeStructure: FeeStructureItem[];
  payments: FeePayment[];
  invoices: FeeInvoice[];
  attendance: AttendanceRecord[];
  timetable: TimetableSlot[];
  assignments: Assignment[];
  discipline: DisciplineIncident[];
  events: SchoolCalendarEvent[];
  notifications: NotificationBroadcast[];
  auditLogs: AuditLog[];

  // College Data
  collegeDepartments: CollegeDepartment[];
  collegeCourses: CollegeCourse[];
  collegeStudents: CollegeStudent[];
  libraryBooks: LibraryBook[];
  hostelRooms: HostelRoom[];
  collegeFeeStructures: CollegeFeeStructureItem[];
  collegeInvoices: CollegeInvoice[];
  collegePayments: CollegePayment[];

  // Retail Data
  retailProducts: RetailProduct[];
  retailSales: RetailSale[];
  retailSuppliers: RetailSupplier[];
  retailCustomers: RetailCustomer[];
  retailInvoices: RetailCustomerInvoice[];
  retailCustomerPayments: RetailCustomerPayment[];

  // Hospital Data
  hospitalPatients: HospitalPatient[];
  medicalConsultations: MedicalConsultation[];
  pharmacyItems: PharmacyItem[];
  hospitalTariffs: HospitalServiceTariff[];
  hospitalInvoices: HospitalBillingInvoice[];
  hospitalPayments: HospitalBillingPayment[];

  // Theology Data (Certificate to Bachelor of Theology)
  theologyPrograms: TheologyProgram[];
  theologyStudents: TheologyStudent[];
  theologyPracticumLogs: MinistryPracticumLog[];
  theologyLibraryResources: TheologyLibraryResource[];
  theologyInvoices: TheologyInvoice[];
  theologyPayments: TheologyFeePayment[];

  // Action Center & Attention Items
  needsAttentionItems: SystemAttentionItem[];

  // Global Search Utility
  searchCurrentTenant: (query: string) => SearchResultItem[];

  // Tenant CRUD actions (School)
  admitStudent: (student: Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'feeBalance' | 'totalBilled' | 'totalPaid'>) => Promise<Student>;
  updateStudent: (studentId: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  promoteStudents: (studentIds: string[], targetGrade: PrimaryGradeLevel | 'Graduated') => Promise<void>;

  addStaff: (staffData: Omit<StaffMember, 'id' | 'tenantId'>) => Promise<StaffMember>;
  updateStaff: (staffId: string, updates: Partial<StaffMember>) => Promise<void>;

  addClassStream: (classData: Omit<ClassStream, 'id' | 'tenantId' | 'enrolledCount'>) => Promise<ClassStream>;
  updateClassStream: (classId: string, updates: Partial<ClassStream>) => Promise<void>;

  recordAssessment: (assessment: Omit<AssessmentRecord, 'id' | 'tenantId' | 'percentage'>) => Promise<AssessmentRecord>;
  markAttendanceBatch: (records: Omit<AttendanceRecord, 'id' | 'tenantId' | 'recordedAt'>[]) => Promise<void>;

  addFeeStructureItem: (item: Omit<FeeStructureItem, 'id' | 'tenantId'>) => Promise<FeeStructureItem>;
  recordPayment: (payment: Omit<FeePayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>) => Promise<FeePayment>;
  reversePayment: (paymentId: string, reason: string) => Promise<void>;
  generateInvoicesForGrade: (grade: PrimaryGradeLevel, term: 'TERM_1' | 'TERM_2' | 'TERM_3', year: string) => Promise<number>;

  saveTimetableSlot: (slot: Omit<TimetableSlot, 'id' | 'tenantId'>) => Promise<TimetableSlot>;
  deleteTimetableSlot: (slotId: string) => Promise<void>;

  createAssignment: (assignment: Omit<Assignment, 'id' | 'tenantId' | 'assignedDate'>) => Promise<Assignment>;
  reportDisciplineIncident: (incident: Omit<DisciplineIncident, 'id' | 'tenantId'>) => Promise<DisciplineIncident>;
  resolveDisciplineIncident: (incidentId: string, actionTaken: string) => Promise<void>;

  createEvent: (event: Omit<SchoolCalendarEvent, 'id' | 'tenantId'>) => Promise<SchoolCalendarEvent>;
  sendNotificationBroadcast: (broadcast: Omit<NotificationBroadcast, 'id' | 'tenantId' | 'sentAt' | 'status'>) => Promise<NotificationBroadcast>;

  // College Actions
  addCollegeCourse: (course: Omit<CollegeCourse, 'id' | 'tenantId' | 'enrolledStudentsCount'>) => Promise<CollegeCourse>;
  addCollegeDepartment: (dept: Omit<CollegeDepartment, 'id' | 'tenantId' | 'facultyCount' | 'courseCount'>) => Promise<CollegeDepartment>;
  admitCollegeStudent: (student: Omit<CollegeStudent, 'id' | 'tenantId' | 'feeBalance' | 'totalBilled' | 'totalPaid'>) => Promise<CollegeStudent>;
  addLibraryBook: (book: Omit<LibraryBook, 'id' | 'tenantId' | 'status'>) => Promise<LibraryBook>;
  addCollegeFeeStructureItem: (item: Omit<CollegeFeeStructureItem, 'id' | 'tenantId'>) => Promise<CollegeFeeStructureItem>;
  generateCollegeInvoice: (invoice: Omit<CollegeInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'createdAt'>) => Promise<CollegeInvoice>;
  recordCollegePayment: (payment: Omit<CollegePayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>) => Promise<CollegePayment>;

  // Retail Actions
  recordRetailSale: (saleData: Omit<RetailSale, 'id' | 'tenantId' | 'receiptNumber' | 'createdAt' | 'status'>) => Promise<RetailSale>;
  addRetailProduct: (product: Omit<RetailProduct, 'id' | 'tenantId' | 'status'>) => Promise<RetailProduct>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  addRetailSupplier: (supplier: Omit<RetailSupplier, 'id' | 'tenantId' | 'balanceOwed' | 'totalPurchased'>) => Promise<RetailSupplier>;
  addRetailCustomer: (customer: Omit<RetailCustomer, 'id' | 'tenantId' | 'currentCredit' | 'totalSpend' | 'lastPurchaseDate'>) => Promise<RetailCustomer>;
  createRetailCustomerInvoice: (invoice: Omit<RetailCustomerInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'issueDate'>) => Promise<RetailCustomerInvoice>;
  recordRetailCustomerPayment: (payment: Omit<RetailCustomerPayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>) => Promise<RetailCustomerPayment>;

  // Hospital Actions
  admitHospitalPatient: (patient: Omit<HospitalPatient, 'id' | 'tenantId' | 'lastVisitDate' | 'status'>) => Promise<HospitalPatient>;
  recordMedicalConsultation: (consultation: Omit<MedicalConsultation, 'id' | 'tenantId' | 'date' | 'status'>) => Promise<MedicalConsultation>;
  createHospitalInvoice: (invoice: Omit<HospitalBillingInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'invoiceDate'>) => Promise<HospitalBillingInvoice>;
  recordHospitalPayment: (payment: Omit<HospitalBillingPayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>) => Promise<HospitalBillingPayment>;
  addHospitalTariff: (tariff: Omit<HospitalServiceTariff, 'id' | 'tenantId'>) => Promise<HospitalServiceTariff>;

  // Theology Actions (Certificate, Diploma, Higher Diploma, Bachelor of Theology)
  addTheologyProgram: (program: Omit<TheologyProgram, 'id' | 'tenantId' | 'enrolledStudentsCount'>) => Promise<TheologyProgram>;
  updateTheologyProgram: (programId: string, updates: Partial<TheologyProgram>) => Promise<void>;
  admitTheologyStudent: (student: Omit<TheologyStudent, 'id' | 'tenantId' | 'feeBalance' | 'totalBilled' | 'totalPaid' | 'practicumHoursCompleted' | 'sermonsEvaluatedCount'>) => Promise<TheologyStudent>;
  updateTheologyStudent: (studentId: string, updates: Partial<TheologyStudent>) => Promise<void>;
  recordMinistryPracticumLog: (log: Omit<MinistryPracticumLog, 'id' | 'tenantId' | 'status'>) => Promise<MinistryPracticumLog>;
  verifyMinistryPracticumLog: (logId: string, status: 'VERIFIED' | 'NEEDS_REVISION', feedback?: string) => Promise<void>;
  addTheologyLibraryResource: (resource: Omit<TheologyLibraryResource, 'id' | 'tenantId' | 'status'>) => Promise<TheologyLibraryResource>;
  generateTheologyInvoice: (invoice: Omit<TheologyInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'createdAt'>) => Promise<TheologyInvoice>;
  recordTheologyPayment: (payment: Omit<TheologyFeePayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>) => Promise<TheologyFeePayment>;

  // Permissions & Security Checkers
  canAccessModule: (moduleName: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (action: PermissionAction, resource?: PermissionResource) => boolean;

  // Cloud Firestore Sync Actions
  isSyncingFirestore: boolean;
  lastFirestoreSyncTime: string | null;
  firebaseProjectId: string;
  firestoreDatabaseName: string;
  syncAllDataToFirestore: () => Promise<{ success: boolean; count: number; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTenants, setAllTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem('davetech_all_tenants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TENANTS;
  });
  const [allUsers, setAllUsers] = useState<AppUser[]>(() => {
    try {
      const saved = localStorage.getItem('davetech_all_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('davetech_all_tenants', JSON.stringify(allTenants));
    } catch {}
  }, [allTenants]);

  useEffect(() => {
    try {
      localStorage.setItem('davetech_all_users', JSON.stringify(allUsers));
    } catch {}
  }, [allUsers]);

  const [tenant, setTenant] = useState<Tenant | null>(() => {
    let tenantsList = INITIAL_TENANTS;
    try {
      const saved = localStorage.getItem('davetech_all_tenants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) tenantsList = parsed;
      }
    } catch {}
    const res = resolveTenantFromHost(getEffectiveHostname(), tenantsList);
    if (res.type === 'TENANT') return res.tenant;
    return tenantsList[0];
  });

  const [isPlatformMode, setIsPlatformMode] = useState<boolean>(() => {
    let tenantsList = INITIAL_TENANTS;
    try {
      const saved = localStorage.getItem('davetech_all_tenants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) tenantsList = parsed;
      }
    } catch {}
    const res = resolveTenantFromHost(getEffectiveHostname(), tenantsList);
    return res.type === 'PLATFORM';
  });

  const [user, setUser] = useState<AppUser | null>(() => {
    let tenantsList = INITIAL_TENANTS;
    let usersList = INITIAL_USERS;
    try {
      const savedT = localStorage.getItem('davetech_all_tenants');
      if (savedT) {
        const parsed = JSON.parse(savedT);
        if (Array.isArray(parsed) && parsed.length > 0) tenantsList = parsed;
      }
      const savedU = localStorage.getItem('davetech_all_users');
      if (savedU) {
        const parsedU = JSON.parse(savedU);
        if (Array.isArray(parsedU) && parsedU.length > 0) usersList = parsedU;
      }
    } catch {}
    const res = resolveTenantFromHost(getEffectiveHostname(), tenantsList);
    if (res.type === 'TENANT') {
      const matchedUser = usersList.find(u => u.tenantId === res.tenant.id);
      return matchedUser || usersList[0];
    }
    return usersList[0]; // Default to Super Admin for Platform Master
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSyncingFirestore, setIsSyncingFirestore] = useState<boolean>(false);
  const [lastFirestoreSyncTime, setLastFirestoreSyncTime] = useState<string | null>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTierConfig[]>(() => {
    try {
      const saved = localStorage.getItem('davetech_subscription_tiers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SUBSCRIPTION_TIERS;
  });

  // Tenant Collections (Isolated per tenantId)
  const [studentsMap, setStudentsMap] = useState<Record<string, Student[]>>(INITIAL_STUDENTS);
  const [staffMap, setStaffMap] = useState<Record<string, StaffMember[]>>(INITIAL_STAFF);
  const [classesMap, setClassesMap] = useState<Record<string, ClassStream[]>>(INITIAL_CLASSES);
  const [subjectsList] = useState<CBCSubject[]>(INITIAL_CBC_SUBJECTS);
  const [assessmentsMap, setAssessmentsMap] = useState<Record<string, AssessmentRecord[]>>(INITIAL_ASSESSMENTS);
  const [feeStructureMap, setFeeStructureMap] = useState<Record<string, FeeStructureItem[]>>(INITIAL_FEE_STRUCTURE);
  const [paymentsMap, setPaymentsMap] = useState<Record<string, FeePayment[]>>(INITIAL_PAYMENTS);
  const [invoicesMap, setInvoicesMap] = useState<Record<string, FeeInvoice[]>>(INITIAL_INVOICES);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord[]>>(INITIAL_ATTENDANCE);
  const [timetableMap, setTimetableMap] = useState<Record<string, TimetableSlot[]>>(INITIAL_TIMETABLE);
  const [assignmentsMap, setAssignmentsMap] = useState<Record<string, Assignment[]>>(INITIAL_ASSIGNMENTS);
  const [disciplineMap, setDisciplineMap] = useState<Record<string, DisciplineIncident[]>>(INITIAL_DISCIPLINE);
  const [eventsMap, setEventsMap] = useState<Record<string, SchoolCalendarEvent[]>>(INITIAL_EVENTS);
  const [notificationsMap, setNotificationsMap] = useState<Record<string, NotificationBroadcast[]>>(INITIAL_NOTIFICATIONS);
  const [auditLogsMap, setAuditLogsMap] = useState<Record<string, AuditLog[]>>(INITIAL_AUDIT_LOGS);

  // College Data Collections
  const [collegeDepartmentsMap, setCollegeDepartmentsMap] = useState<Record<string, CollegeDepartment[]>>(INITIAL_COLLEGE_DEPARTMENTS);
  const [collegeCoursesMap, setCollegeCoursesMap] = useState<Record<string, CollegeCourse[]>>(INITIAL_COLLEGE_COURSES);
  const [collegeStudentsMap, setCollegeStudentsMap] = useState<Record<string, CollegeStudent[]>>(INITIAL_COLLEGE_STUDENTS);
  const [libraryBooksMap, setLibraryBooksMap] = useState<Record<string, LibraryBook[]>>(INITIAL_LIBRARY_BOOKS);
  const [hostelRoomsMap] = useState<Record<string, HostelRoom[]>>(INITIAL_HOSTEL_ROOMS);
  const [collegeFeeStructureMap, setCollegeFeeStructureMap] = useState<Record<string, CollegeFeeStructureItem[]>>(INITIAL_COLLEGE_FEE_STRUCTURE);
  const [collegeInvoicesMap, setCollegeInvoicesMap] = useState<Record<string, CollegeInvoice[]>>(INITIAL_COLLEGE_INVOICES);
  const [collegePaymentsMap, setCollegePaymentsMap] = useState<Record<string, CollegePayment[]>>(INITIAL_COLLEGE_PAYMENTS);

  // Retail Data Collections
  const [retailProductsMap, setRetailProductsMap] = useState<Record<string, RetailProduct[]>>(INITIAL_RETAIL_PRODUCTS);
  const [retailSalesMap, setRetailSalesMap] = useState<Record<string, RetailSale[]>>(INITIAL_RETAIL_SALES);
  const [retailSuppliersMap, setRetailSuppliersMap] = useState<Record<string, RetailSupplier[]>>(INITIAL_RETAIL_SUPPLIERS);
  const [retailCustomersMap, setRetailCustomersMap] = useState<Record<string, RetailCustomer[]>>(INITIAL_RETAIL_CUSTOMERS);
  const [retailInvoicesMap, setRetailInvoicesMap] = useState<Record<string, RetailCustomerInvoice[]>>(INITIAL_RETAIL_INVOICES);
  const [retailCustomerPaymentsMap, setRetailCustomerPaymentsMap] = useState<Record<string, RetailCustomerPayment[]>>(INITIAL_RETAIL_PAYMENTS);

  // Hospital Data Collections
  const [hospitalPatientsMap, setHospitalPatientsMap] = useState<Record<string, HospitalPatient[]>>(INITIAL_HOSPITAL_PATIENTS);
  const [medicalConsultationsMap, setMedicalConsultationsMap] = useState<Record<string, MedicalConsultation[]>>(INITIAL_MEDICAL_CONSULTATIONS);
  const [pharmacyItemsMap] = useState<Record<string, PharmacyItem[]>>(INITIAL_PHARMACY_ITEMS);
  const [hospitalTariffsMap, setHospitalTariffsMap] = useState<Record<string, HospitalServiceTariff[]>>(INITIAL_HOSPITAL_TARIFFS);
  const [hospitalInvoicesMap, setHospitalInvoicesMap] = useState<Record<string, HospitalBillingInvoice[]>>(INITIAL_HOSPITAL_INVOICES);
  const [hospitalPaymentsMap, setHospitalPaymentsMap] = useState<Record<string, HospitalBillingPayment[]>>(INITIAL_HOSPITAL_PAYMENTS);

  // Theology Data Collections (Certificate, Diploma, Higher Diploma, Bachelor of Theology)
  const [theologyProgramsMap, setTheologyProgramsMap] = useState<Record<string, TheologyProgram[]>>(INITIAL_THEOLOGY_PROGRAMS);
  const [theologyStudentsMap, setTheologyStudentsMap] = useState<Record<string, TheologyStudent[]>>(INITIAL_THEOLOGY_STUDENTS);
  const [theologyPracticumLogsMap, setTheologyPracticumLogsMap] = useState<Record<string, MinistryPracticumLog[]>>(INITIAL_THEOLOGY_PRACTICUM_LOGS);
  const [theologyLibraryMap, setTheologyLibraryMap] = useState<Record<string, TheologyLibraryResource[]>>(INITIAL_THEOLOGY_LIBRARY);
  const [theologyInvoicesMap, setTheologyInvoicesMap] = useState<Record<string, TheologyInvoice[]>>(INITIAL_THEOLOGY_INVOICES);
  const [theologyPaymentsMap, setTheologyPaymentsMap] = useState<Record<string, TheologyFeePayment[]>>(INITIAL_THEOLOGY_PAYMENTS);

  const clearError = () => setError(null);

  // Live Firebase Auth Listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'platform_users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as AppUser;
              setUser(userData);
              if (userData.tenantId) {
                const tenantDoc = await getDoc(doc(db, 'tenants', userData.tenantId));
                if (tenantDoc.exists()) {
                  setTenant(tenantDoc.data() as Tenant);
                }
              }
            }
          } catch {
            // Graceful fallback
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const logAuditEvent = useCallback((action: string, details: string, category: AuditLog['category'] = 'SETTINGS') => {
    if (!tenant || !user) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tenantId: tenant.id,
      userId: user.uid,
      userEmail: user.email,
      action,
      details,
      category,
      timestamp: new Date().toISOString()
    };
    setAuditLogsMap(prev => ({
      ...prev,
      [tenant.id]: [newLog, ...(prev[tenant.id] || [])]
    }));
  }, [tenant, user]);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userRef = doc(db, 'platform_users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUser: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email || 'user@davetech.io',
          displayName: fbUser.displayName || 'Enterprise Administrator',
          tenantId: 'tenant-st-austins',
          tenantName: "St. Austin's Academy",
          role: 'TENANT_ADMIN',
          isActive: true,
          photoURL: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (err: unknown) {
      console.warn('Firebase Popup Notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchUserPersona = (userId: string) => {
    const target = allUsers.find(u => u.uid === userId);
    if (!target) return;
    setUser(target);

    if (target.role === 'SUPER_ADMIN') {
      setIsPlatformMode(true);
      // Keep a valid tenant reference for fallback
      const defaultTenant = allTenants.find(t => t.id === target.tenantId) || allTenants[0];
      setTenant(defaultTenant);
    } else {
      setIsPlatformMode(false);
      const targetTenant = allTenants.find(t => t.id === target.tenantId) || allTenants[0];
      setTenant(targetTenant);
    }
  };

  const switchToPlatformMaster = () => {
    navigateToPlatform();
  };

  const switchTenantAsSuperAdmin = (tenantId: string) => {
    if (tenantId === 'davetech-main-platform' || tenantId === 'PLATFORM' || tenantId === 'ALL') {
      navigateToPlatform();
      return;
    }
    const target = allTenants.find(t => t.id === tenantId);
    if (!target) return;
    const subdomain = target.subdomain || target.code.toLowerCase();
    navigateToTenantSubdomain(subdomain);
  };

  // SUPER ADMIN ACTIONS
  const createTenant = async (
    tenantData: Omit<Tenant, 'id' | 'createdAt'>, 
    adminDetails?: { name: string; email: string }
  ): Promise<Tenant> => {
    const rawSubdomain = tenantData.subdomain || tenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSubdomain = rawSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '') || `tenant${Date.now().toString().slice(-4)}`;
    const newTenantId = `tenant-${cleanSubdomain}-${Date.now().toString().slice(-4)}`;
    const newTenant: Tenant = {
      ...tenantData,
      id: newTenantId,
      subdomain: cleanSubdomain,
      dnsStatus: tenantData.dnsStatus || 'CONFIGURED',
      createdAt: new Date().toISOString(),
      stats: {
        studentCount: 0,
        staffCount: adminDetails ? 1 : 0,
        totalFeeCollected: 0,
        totalFeeBalance: 0
      }
    };

    setAllTenants(prev => [newTenant, ...prev]);

    if (adminDetails) {
      const newAdmin: AppUser = {
        uid: `user-admin-${Date.now().toString().slice(-4)}`,
        email: adminDetails.email,
        displayName: adminDetails.name,
        tenantId: newTenantId,
        tenantName: newTenant.name,
        role: 'TENANT_ADMIN',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setAllUsers(prev => [newAdmin, ...prev]);
    }

    setStudentsMap(prev => ({ ...prev, [newTenantId]: [] }));
    setStaffMap(prev => ({ ...prev, [newTenantId]: [] }));
    setClassesMap(prev => ({ ...prev, [newTenantId]: [] }));
    setPaymentsMap(prev => ({ ...prev, [newTenantId]: [] }));
    setInvoicesMap(prev => ({ ...prev, [newTenantId]: [] }));
    setAttendanceMap(prev => ({ ...prev, [newTenantId]: [] }));
    setTimetableMap(prev => ({ ...prev, [newTenantId]: [] }));
    setAssignmentsMap(prev => ({ ...prev, [newTenantId]: [] }));
    setDisciplineMap(prev => ({ ...prev, [newTenantId]: [] }));
    setEventsMap(prev => ({ ...prev, [newTenantId]: [] }));
    setNotificationsMap(prev => ({ ...prev, [newTenantId]: [] }));
    setAuditLogsMap(prev => ({
      ...prev,
      [newTenantId]: [{
        id: `log-${Date.now()}`,
        tenantId: newTenantId,
        userId: user?.uid || 'super-admin',
        userEmail: user?.email || 'admin@davetech.io',
        action: 'TENANT_CREATED',
        details: `Created new organization ${newTenant.name} (${newTenant.code})`,
        category: 'SETTINGS',
        timestamp: new Date().toISOString()
      }]
    }));

    try {
      await setDoc(doc(db, 'tenants', newTenantId), newTenant);
    } catch {
      // Local state active
    }

    return newTenant;
  };

  const updateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
    setAllTenants(prev => prev.map(t => t.id === tenantId ? { ...t, ...updates } : t));
    if (tenant?.id === tenantId) {
      setTenant(prev => prev ? { ...prev, ...updates } : null);
    }
    logAuditEvent('TENANT_UPDATED', `Updated organization profile parameters: ${Object.keys(updates).join(', ')}`);
    try {
      await updateDoc(doc(db, 'tenants', tenantId), updates);
    } catch {
      // Fallback
    }
  };

  const deleteTenant = async (tenantId: string) => {
    setAllTenants(prev => prev.filter(t => t.id !== tenantId));
    if (tenant?.id === tenantId) {
      const remaining = allTenants.filter(t => t.id !== tenantId);
      setTenant(remaining[0] || null);
    }
    logAuditEvent('TENANT_DELETED', `Deleted tenant workspace ${tenantId}`);
  };

  const updateTenantStatus = async (tenantId: string, status: TenantStatus) => {
    setAllTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status } : t));
    if (tenant?.id === tenantId) {
      setTenant(prev => prev ? { ...prev, status } : null);
    }
    logAuditEvent('TENANT_STATUS_CHANGED', `Changed tenant status to ${status}`);
    try {
      await updateDoc(doc(db, 'tenants', tenantId), { status });
    } catch {
      // Fallback
    }
  };

  const updateTenantPlan = async (tenantId: string, plan: TenantPlan) => {
    setAllTenants(prev => prev.map(t => t.id === tenantId ? { ...t, plan } : t));
    if (tenant?.id === tenantId) {
      setTenant(prev => prev ? { ...prev, plan } : null);
    }
    logAuditEvent('PLAN_UPGRADED', `Updated organization subscription plan to ${plan}`);
    try {
      await updateDoc(doc(db, 'tenants', tenantId), { plan });
    } catch {
      // Local fallback
    }
  };

  const updateSubscriptionTier = async (tierId: TenantPlan, updates: Partial<SubscriptionTierConfig>) => {
    setSubscriptionTiers(prev => {
      const updated = prev.map(t => t.id === tierId ? { ...t, ...updates } : t);
      try {
        localStorage.setItem('davetech_subscription_tiers', JSON.stringify(updated));
      } catch {
        // Storage fallback
      }
      return updated;
    });
    logAuditEvent('SUBSCRIPTION_TIER_EDITED', `Super Admin updated subscription tier configuration for ${tierId}: ${Object.keys(updates).join(', ')}`, 'SETTINGS');
    try {
      await setDoc(doc(db, 'platform_settings', `tier_${tierId.toLowerCase()}`), updates, { merge: true });
    } catch {
      // Local state fallback
    }
  };

  const resetSubscriptionTiers = async () => {
    setSubscriptionTiers(DEFAULT_SUBSCRIPTION_TIERS);
    try {
      localStorage.setItem('davetech_subscription_tiers', JSON.stringify(DEFAULT_SUBSCRIPTION_TIERS));
    } catch {
      // Storage fallback
    }
    logAuditEvent('SUBSCRIPTION_TIERS_RESET', `Super Admin reset platform subscription tiers to factory defaults`, 'SETTINGS');
  };

  const toggleTenantModule = async (tenantId: string, moduleId: string) => {
    setAllTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      const hasMod = t.modules.includes(moduleId);
      const newModules = hasMod ? t.modules.filter(m => m !== moduleId) : [...t.modules, moduleId];
      return { ...t, modules: newModules };
    }));
    if (tenant?.id === tenantId) {
      const hasMod = tenant.modules.includes(moduleId);
      const newModules = hasMod ? tenant.modules.filter(m => m !== moduleId) : [...tenant.modules, moduleId];
      setTenant({ ...tenant, modules: newModules });
    }
    logAuditEvent('MODULE_TOGGLED', `Toggled ERP module ${moduleId}`);
  };

  const createPlatformUser = async (userData: Omit<AppUser, 'uid' | 'createdAt'>): Promise<AppUser> => {
    const newUser: AppUser = {
      ...userData,
      uid: `user-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    setAllUsers(prev => [newUser, ...prev]);
    logAuditEvent('USER_CREATED', `Created new user account for ${newUser.displayName} (${newUser.role})`);
    return newUser;
  };

  const updatePlatformUserRole = async (userId: string, newRole: UserRole) => {
    setAllUsers(prev => prev.map(u => u.uid === userId ? { ...u, role: newRole } : u));
    if (user?.uid === userId) {
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    logAuditEvent('USER_ROLE_CHANGED', `Changed user ${userId} role to ${newRole}`);
  };

  const toggleUserActiveStatus = async (userId: string) => {
    setAllUsers(prev => prev.map(u => u.uid === userId ? { ...u, isActive: !u.isActive } : u));
    logAuditEvent('USER_STATUS_TOGGLED', `Toggled active status for user ${userId}`);
  };

  // TENANT ISOLATED DATA GETTERS
  const currentTenantId = tenant?.id || 'tenant-st-austins';
  const students = useMemo(() => studentsMap[currentTenantId] || [], [studentsMap, currentTenantId]);
  const staff = useMemo(() => staffMap[currentTenantId] || [], [staffMap, currentTenantId]);
  const classes = useMemo(() => classesMap[currentTenantId] || [], [classesMap, currentTenantId]);
  const subjects = useMemo(() => subjectsList.filter(s => s.tenantId === currentTenantId || (!s.tenantId && currentTenantId === 'tenant-st-austins')), [subjectsList, currentTenantId]);
  const assessments = useMemo(() => assessmentsMap[currentTenantId] || [], [assessmentsMap, currentTenantId]);
  const feeStructure = useMemo(() => feeStructureMap[currentTenantId] || [], [feeStructureMap, currentTenantId]);
  const payments = useMemo(() => paymentsMap[currentTenantId] || [], [paymentsMap, currentTenantId]);
  const invoices = useMemo(() => invoicesMap[currentTenantId] || [], [invoicesMap, currentTenantId]);
  const attendance = useMemo(() => attendanceMap[currentTenantId] || [], [attendanceMap, currentTenantId]);
  const timetable = useMemo(() => timetableMap[currentTenantId] || [], [timetableMap, currentTenantId]);
  const assignments = useMemo(() => assignmentsMap[currentTenantId] || [], [assignmentsMap, currentTenantId]);
  const discipline = useMemo(() => disciplineMap[currentTenantId] || [], [disciplineMap, currentTenantId]);
  const events = useMemo(() => eventsMap[currentTenantId] || [], [eventsMap, currentTenantId]);
  const notifications = useMemo(() => notificationsMap[currentTenantId] || [], [notificationsMap, currentTenantId]);
  const auditLogs = useMemo(() => auditLogsMap[currentTenantId] || [], [auditLogsMap, currentTenantId]);

  // College Getters
  const collegeDepartments = useMemo(() => collegeDepartmentsMap[currentTenantId] || [], [collegeDepartmentsMap, currentTenantId]);
  const collegeCourses = useMemo(() => collegeCoursesMap[currentTenantId] || [], [collegeCoursesMap, currentTenantId]);
  const collegeStudents = useMemo(() => collegeStudentsMap[currentTenantId] || [], [collegeStudentsMap, currentTenantId]);
  const libraryBooks = useMemo(() => libraryBooksMap[currentTenantId] || [], [libraryBooksMap, currentTenantId]);
  const hostelRooms = useMemo(() => hostelRoomsMap[currentTenantId] || [], [hostelRoomsMap, currentTenantId]);
  const collegeFeeStructures = useMemo(() => collegeFeeStructureMap[currentTenantId] || [], [collegeFeeStructureMap, currentTenantId]);
  const collegeInvoices = useMemo(() => collegeInvoicesMap[currentTenantId] || [], [collegeInvoicesMap, currentTenantId]);
  const collegePayments = useMemo(() => collegePaymentsMap[currentTenantId] || [], [collegePaymentsMap, currentTenantId]);

  // Retail Getters
  const retailProducts = useMemo(() => retailProductsMap[currentTenantId] || [], [retailProductsMap, currentTenantId]);
  const retailSales = useMemo(() => retailSalesMap[currentTenantId] || [], [retailSalesMap, currentTenantId]);
  const retailSuppliers = useMemo(() => retailSuppliersMap[currentTenantId] || [], [retailSuppliersMap, currentTenantId]);
  const retailCustomers = useMemo(() => retailCustomersMap[currentTenantId] || [], [retailCustomersMap, currentTenantId]);
  const retailInvoices = useMemo(() => retailInvoicesMap[currentTenantId] || [], [retailInvoicesMap, currentTenantId]);
  const retailCustomerPayments = useMemo(() => retailCustomerPaymentsMap[currentTenantId] || [], [retailCustomerPaymentsMap, currentTenantId]);

  // Hospital Getters
  const hospitalPatients = useMemo(() => hospitalPatientsMap[currentTenantId] || [], [hospitalPatientsMap, currentTenantId]);
  const medicalConsultations = useMemo(() => medicalConsultationsMap[currentTenantId] || [], [medicalConsultationsMap, currentTenantId]);
  const pharmacyItems = useMemo(() => pharmacyItemsMap[currentTenantId] || [], [pharmacyItemsMap, currentTenantId]);
  const hospitalTariffs = useMemo(() => hospitalTariffsMap[currentTenantId] || [], [hospitalTariffsMap, currentTenantId]);
  const hospitalInvoices = useMemo(() => hospitalInvoicesMap[currentTenantId] || [], [hospitalInvoicesMap, currentTenantId]);
  const hospitalPayments = useMemo(() => hospitalPaymentsMap[currentTenantId] || [], [hospitalPaymentsMap, currentTenantId]);

  // Theology Getters (Certificate, Diploma, Higher Diploma, Bachelor of Theology)
  const theologyPrograms = useMemo(() => theologyProgramsMap[currentTenantId] || [], [theologyProgramsMap, currentTenantId]);
  const theologyStudents = useMemo(() => theologyStudentsMap[currentTenantId] || [], [theologyStudentsMap, currentTenantId]);
  const theologyPracticumLogs = useMemo(() => theologyPracticumLogsMap[currentTenantId] || [], [theologyPracticumLogsMap, currentTenantId]);
  const theologyLibraryResources = useMemo(() => theologyLibraryMap[currentTenantId] || [], [theologyLibraryMap, currentTenantId]);
  const theologyInvoices = useMemo(() => theologyInvoicesMap[currentTenantId] || [], [theologyInvoicesMap, currentTenantId]);
  const theologyPayments = useMemo(() => theologyPaymentsMap[currentTenantId] || [], [theologyPaymentsMap, currentTenantId]);

  // Dynamic "Needs Attention" Items calculation
  const needsAttentionItems = useMemo<SystemAttentionItem[]>(() => {
    const items: SystemAttentionItem[] = [];
    if (!tenant) return items;

    if (tenant.type === 'PRIMARY_SCHOOL' || tenant.type === 'SECONDARY_SCHOOL') {
      const highBalanceStudents = students.filter(s => s.feeBalance > 15000);
      if (highBalanceStudents.length > 0) {
        items.push({
          id: 'attn-fees-01',
          tenantId: tenant.id,
          title: `${highBalanceStudents.length} Learners with High Outstanding Balances`,
          description: `Total outstanding exceeds KES ${highBalanceStudents.reduce((a, b) => a + b.feeBalance, 0).toLocaleString()}. Automated SMS reminder recommended.`,
          severity: 'WARNING',
          category: 'FINANCE',
          actionLabel: 'View Fee Debtors',
          actionRoute: 'school-fees',
          timestamp: new Date().toISOString()
        });
      }

      const openIncidents = discipline.filter(d => d.status === 'OPEN');
      if (openIncidents.length > 0) {
        items.push({
          id: 'attn-disc-01',
          tenantId: tenant.id,
          title: `${openIncidents.length} Pending Discipline Cases Requiring Action`,
          description: `Incidents recorded without resolution or parent follow-up notes.`,
          severity: 'WARNING',
          category: 'DISCIPLINE',
          actionLabel: 'Review Cases',
          actionRoute: 'school-discipline',
          timestamp: new Date().toISOString()
        });
      }

      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendance.filter(a => a.date === today);
      if (todayAttendance.length === 0 && students.length > 0) {
        items.push({
          id: 'attn-att-01',
          tenantId: tenant.id,
          title: "Today's Daily Roll Call Incomplete",
          description: "Morning attendance register has not been submitted for all active streams.",
          severity: 'INFO',
          category: 'ATTENDANCE',
          actionLabel: 'Take Roll Call',
          actionRoute: 'school-attendance',
          timestamp: new Date().toISOString()
        });
      }
    } else if (tenant.type === 'RETAIL' || tenant.type === 'BUSINESS') {
      const lowStock = retailProducts.filter(p => p.currentStock <= p.minStockAlert);
      if (lowStock.length > 0) {
        items.push({
          id: 'attn-stock-01',
          tenantId: tenant.id,
          title: `${lowStock.length} Products at or Below Reorder Threshold`,
          description: `Critical items: ${lowStock.map(p => p.name).slice(0, 2).join(', ')}`,
          severity: 'CRITICAL',
          category: 'INVENTORY',
          actionLabel: 'Restock Inventory',
          actionRoute: 'retail-inventory',
          timestamp: new Date().toISOString()
        });
      }
    } else if (tenant.type === 'COLLEGE' || tenant.type === 'UNIVERSITY') {
      const pendingDues = collegeStudents.filter(s => s.feeBalance > 20000);
      if (pendingDues.length > 0) {
        items.push({
          id: 'attn-col-fees',
          tenantId: tenant.id,
          title: `${pendingDues.length} College Students with Exam Clearance Block`,
          description: `Outstanding semester tuition fees require finance office verification.`,
          severity: 'WARNING',
          category: 'FINANCE',
          actionLabel: 'Review Students',
          actionRoute: 'college-students',
          timestamp: new Date().toISOString()
        });
      }

      // Check Theology Practicum Logs & Fieldwork Hours
      if (theologyStudents.length > 0) {
        const behindPracticum = theologyStudents.filter(s => s.practicumHoursCompleted < s.requiredPracticumHours * 0.4 && s.yearOfStudy >= 2);
        if (behindPracticum.length > 0) {
          items.push({
            id: 'attn-theo-prac',
            tenantId: tenant.id,
            title: `${behindPracticum.length} Theology Seminarians Behind Fieldwork Practicum Hours`,
            description: `Ordination tracks require minimum ministry logs before final semester clearance.`,
            severity: 'WARNING',
            category: 'ACADEMICS',
            actionLabel: 'View Ministry Logs',
            actionRoute: 'theology-practicum',
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    return items;
  }, [tenant, students, discipline, attendance, retailProducts, collegeStudents, theologyStudents]);

  // Global Search Utility across current tenant
  const searchCurrentTenant = useCallback((query: string): SearchResultItem[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // Search School Students
    (students || []).forEach(s => {
      if (
        (s.firstName || '').toLowerCase().includes(q) ||
        (s.lastName || '').toLowerCase().includes(q) ||
        (s.admissionNo || '').toLowerCase().includes(q) ||
        (s.grade || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: s.id,
          title: `${s.firstName || ''} ${s.lastName || ''} (${s.admissionNo || ''})`,
          subtitle: `${s.grade || ''} ${s.stream || ''} • Balance: KES ${(s.feeBalance || 0).toLocaleString()}`,
          type: 'STUDENT',
          route: 'school-students',
          metadata: s.admissionNo
        });
      }
    });

    // Search Staff
    (staff || []).forEach(st => {
      if (
        (st.fullName || '').toLowerCase().includes(q) ||
        (st.email || '').toLowerCase().includes(q) ||
        (st.designation || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: st.id,
          title: st.fullName,
          subtitle: `${st.designation || ''} • ${st.phone || ''}`,
          type: 'STAFF',
          route: 'school-staff'
        });
      }
    });

    // Search Invoices
    (invoices || []).forEach(inv => {
      if (
        (inv.invoiceNo || '').toLowerCase().includes(q) ||
        (inv.studentName || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: inv.id,
          title: `Invoice ${inv.invoiceNo || ''} (${inv.studentName || ''})`,
          subtitle: `Amount: KES ${(inv.totalBilled || 0).toLocaleString()} • Status: ${inv.status}`,
          type: 'INVOICE',
          route: 'school-fees'
        });
      }
    });

    // Search Payments
    (payments || []).forEach(p => {
      if (
        (p.receiptNo || '').toLowerCase().includes(q) ||
        (p.transactionCode || '').toLowerCase().includes(q) ||
        (p.studentName || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          title: `Receipt ${p.receiptNo || ''} - ${p.studentName || ''}`,
          subtitle: `KES ${(p.amount || 0).toLocaleString()} via ${p.paymentMethod || 'CASH'} (${p.transactionCode || ''})`,
          type: 'PAYMENT',
          route: 'school-fees'
        });
      }
    });

    // Search Retail Products
    (retailProducts || []).forEach(prod => {
      if (
        (prod.name || '').toLowerCase().includes(q) ||
        (prod.sku || '').toLowerCase().includes(q) ||
        (prod.category || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: prod.id,
          title: prod.name,
          subtitle: `SKU: ${prod.sku} • Stock: ${prod.currentStock} ${prod.unit} • Price: KES ${prod.sellingPrice}`,
          type: 'PRODUCT',
          route: 'retail-pos'
        });
      }
    });

    // Search College Courses
    (collegeCourses || []).forEach(c => {
      if (
        (c.title || '').toLowerCase().includes(q) ||
        (c.code || '').toLowerCase().includes(q)
      ) {
        results.push({
          id: c.id,
          title: `${c.code}: ${c.title}`,
          subtitle: `${c.departmentName || ''} • ${c.level || ''}`,
          type: 'COURSE',
          route: 'college-courses'
        });
      }
    });

    return results.slice(0, 15);
  }, [students, staff, invoices, payments, retailProducts, collegeCourses]);

  // STUDENT CRUD
  const admitStudent = async (studentData: Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'feeBalance' | 'totalBilled' | 'totalPaid'>): Promise<Student> => {
    if (!tenant) throw new Error("No active tenant");

    const gradeFeeItems = feeStructure.filter(f => f.grade === studentData.grade || f.grade === 'ALL');
    const totalBilled = gradeFeeItems.reduce((sum, item) => sum + item.amount, 0) || 65000;

    const newStudent: Student = {
      ...studentData,
      id: `stud-${Date.now().toString().slice(-6)}`,
      tenantId: tenant.id,
      feeBalance: totalBilled,
      totalBilled,
      totalPaid: 0,
      createdAt: new Date().toISOString()
    };

    setStudentsMap(prev => ({
      ...prev,
      [tenant.id]: [newStudent, ...(prev[tenant.id] || [])]
    }));

    setClassesMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(c => 
        c.grade === newStudent.grade && c.streamName === newStudent.stream
          ? { ...c, enrolledCount: c.enrolledCount + 1 }
          : c
      )
    }));

    const newInvoice: FeeInvoice = {
      id: `inv-${Date.now()}`,
      tenantId: tenant.id,
      invoiceNo: `INV-${tenant.code}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      studentId: newStudent.id,
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      admissionNo: newStudent.admissionNo,
      grade: newStudent.grade,
      term: tenant.currentTerm,
      academicYear: tenant.currentAcademicYear,
      items: gradeFeeItems.length > 0 
        ? gradeFeeItems.map(g => ({ category: g.category, amount: g.amount }))
        : [{ category: 'Tuition Fee', amount: 65000 }],
      totalBilled,
      totalPaid: 0,
      balance: totalBilled,
      dueDate: '2025-02-15',
      createdAt: new Date().toISOString(),
      status: 'UNPAID'
    };

    setInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: [newInvoice, ...(prev[tenant.id] || [])]
    }));

    logAuditEvent('STUDENT_ADMITTED', `Enrolled learner ${newStudent.firstName} ${newStudent.lastName} (${newStudent.admissionNo}) into ${newStudent.grade} ${newStudent.stream}`, 'ADMISSION');
    return newStudent;
  };

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    if (!tenant) return;
    setStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => s.id === studentId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)
    }));
    logAuditEvent('STUDENT_UPDATED', `Updated details for student ID ${studentId}`, 'ADMISSION');
  };

  const deleteStudent = async (studentId: string) => {
    if (!tenant) return;
    setStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).filter(s => s.id !== studentId)
    }));
    logAuditEvent('STUDENT_DELETED', `Deleted student ID ${studentId} from roster`, 'ADMISSION');
  };

  const promoteStudents = async (studentIds: string[], targetGrade: PrimaryGradeLevel | 'Graduated') => {
    if (!tenant) return;
    setStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (!studentIds.includes(s.id)) return s;
        if (targetGrade === 'Graduated') {
          return { ...s, status: 'GRADUATED' };
        }
        return { ...s, grade: targetGrade };
      })
    }));
    logAuditEvent('STUDENTS_PROMOTED', `Promoted ${studentIds.length} learners to ${targetGrade}`, 'ACADEMICS');
  };

  // STAFF CRUD
  const addStaff = async (staffData: Omit<StaffMember, 'id' | 'tenantId'>): Promise<StaffMember> => {
    if (!tenant) throw new Error("No active tenant");
    const newStaff: StaffMember = {
      ...staffData,
      id: `staff-${Date.now().toString().slice(-4)}`,
      tenantId: tenant.id
    };
    setStaffMap(prev => ({
      ...prev,
      [tenant.id]: [newStaff, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('STAFF_HIRED', `Added staff member ${newStaff.fullName} (${newStaff.designation})`, 'SETTINGS');
    return newStaff;
  };

  const updateStaff = async (staffId: string, updates: Partial<StaffMember>) => {
    if (!tenant) return;
    setStaffMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => s.id === staffId ? { ...s, ...updates } : s)
    }));
    logAuditEvent('STAFF_UPDATED', `Updated staff record for ${staffId}`, 'SETTINGS');
  };

  // CLASSES & STREAMS
  const addClassStream = async (classData: Omit<ClassStream, 'id' | 'tenantId' | 'enrolledCount'>): Promise<ClassStream> => {
    if (!tenant) throw new Error("No active tenant");
    const newClass: ClassStream = {
      ...classData,
      id: `cls-${Date.now().toString().slice(-4)}`,
      tenantId: tenant.id,
      enrolledCount: 0
    };
    setClassesMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []), newClass]
    }));
    logAuditEvent('CLASS_CREATED', `Created class stream ${newClass.grade} ${newClass.streamName}`, 'ACADEMICS');
    return newClass;
  };

  const updateClassStream = async (classId: string, updates: Partial<ClassStream>) => {
    if (!tenant) return;
    setClassesMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(c => c.id === classId ? { ...c, ...updates } : c)
    }));
  };

  // ASSESSMENTS
  const recordAssessment = async (assessmentData: Omit<AssessmentRecord, 'id' | 'tenantId' | 'percentage'>): Promise<AssessmentRecord> => {
    if (!tenant) throw new Error("No active tenant");
    const percentage = Math.round((assessmentData.rawScore / assessmentData.maxScore) * 100);
    const newRecord: AssessmentRecord = {
      ...assessmentData,
      id: `ass-${Date.now()}`,
      tenantId: tenant.id,
      percentage
    };
    setAssessmentsMap(prev => ({
      ...prev,
      [tenant.id]: [newRecord, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('ASSESSMENT_RECORDED', `Logged ${assessmentData.subjectName} assessment score (${percentage}%) for ${assessmentData.studentName}`, 'ACADEMICS');
    return newRecord;
  };

  // ATTENDANCE
  const markAttendanceBatch = async (records: Omit<AttendanceRecord, 'id' | 'tenantId' | 'recordedAt'>[]) => {
    if (!tenant) return;
    const now = new Date().toISOString();
    const formattedRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${Date.now()}-${idx}`,
      tenantId: tenant.id,
      recordedAt: now
    }));

    setAttendanceMap(prev => {
      const existing = prev[tenant.id] || [];
      const filtered = existing.filter(e => !records.some(r => r.date === e.date && r.studentId === e.studentId));
      return {
        ...prev,
        [tenant.id]: [...formattedRecords, ...filtered]
      };
    });
    logAuditEvent('ATTENDANCE_MARKED', `Submitted roll call for ${records.length} students on ${records[0]?.date}`, 'ACADEMICS');
  };

  // FEES & PAYMENTS
  const addFeeStructureItem = async (item: Omit<FeeStructureItem, 'id' | 'tenantId'>): Promise<FeeStructureItem> => {
    if (!tenant) throw new Error("No active tenant");
    const newItem: FeeStructureItem = {
      ...item,
      id: `fee-item-${Date.now()}`,
      tenantId: tenant.id
    };
    setFeeStructureMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []), newItem]
    }));
    logAuditEvent('FEE_STRUCTURE_UPDATED', `Added fee item ${newItem.category} (KES ${newItem.amount}) for ${newItem.grade}`, 'FINANCE');
    return newItem;
  };

  const recordPayment = async (paymentData: Omit<FeePayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>): Promise<FeePayment> => {
    if (!tenant) throw new Error("No active tenant");
    const receiptNo = `REC-${tenant.code}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: FeePayment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      tenantId: tenant.id,
      receiptNo,
      status: 'CONFIRMED'
    };

    setPaymentsMap(prev => ({
      ...prev,
      [tenant.id]: [newPayment, ...(prev[tenant.id] || [])]
    }));

    setStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (s.id === newPayment.studentId) {
          const newPaid = s.totalPaid + newPayment.amount;
          const newBalance = Math.max(0, s.totalBilled - newPaid);
          return { ...s, totalPaid: newPaid, feeBalance: newBalance };
        }
        return s;
      })
    }));

    setInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(inv => {
        if (inv.studentId === newPayment.studentId && inv.balance > 0) {
          const paidToInvoice = Math.min(inv.balance, newPayment.amount);
          const newBalance = inv.balance - paidToInvoice;
          return {
            ...inv,
            totalPaid: inv.totalPaid + paidToInvoice,
            balance: newBalance,
            status: newBalance === 0 ? 'PAID' : 'PARTIAL'
          };
        }
        return inv;
      })
    }));

    logAuditEvent('PAYMENT_RECEIPTED', `Recorded fee payment of KES ${newPayment.amount.toLocaleString()} for ${newPayment.studentName} via ${newPayment.paymentMethod} (${newPayment.receiptNo})`, 'FINANCE');
    return newPayment;
  };

  const reversePayment = async (paymentId: string, reason: string) => {
    if (!tenant) return;
    const targetPayment = (paymentsMap[tenant.id] || []).find(p => p.id === paymentId);
    if (!targetPayment || targetPayment.status === 'REVERSED') return;

    setPaymentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(p => p.id === paymentId ? { ...p, status: 'REVERSED', notes: `Reversed: ${reason}` } : p)
    }));

    setStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (s.id === targetPayment.studentId) {
          const newPaid = Math.max(0, s.totalPaid - targetPayment.amount);
          const newBalance = s.totalBilled - newPaid;
          return { ...s, totalPaid: newPaid, feeBalance: newBalance };
        }
        return s;
      })
    }));

    logAuditEvent('PAYMENT_REVERSED', `Reversed receipt ${targetPayment.receiptNo} of KES ${targetPayment.amount}. Reason: ${reason}`, 'FINANCE');
  };

  const generateInvoicesForGrade = async (grade: PrimaryGradeLevel, term: 'TERM_1' | 'TERM_2' | 'TERM_3', year: string): Promise<number> => {
    if (!tenant) return 0;
    const gradeStudents = (studentsMap[tenant.id] || []).filter(s => s.grade === grade && s.status === 'ACTIVE');
    const feeItems = (feeStructureMap[tenant.id] || []).filter(f => f.grade === grade || f.grade === 'ALL');
    const totalAmount = feeItems.reduce((sum, item) => sum + item.amount, 0) || 60000;

    const newInvoices: FeeInvoice[] = gradeStudents.map(s => ({
      id: `inv-${Date.now()}-${s.id}`,
      tenantId: tenant.id,
      invoiceNo: `INV-${tenant.code}-${year}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      admissionNo: s.admissionNo,
      grade: s.grade,
      term,
      academicYear: year,
      items: feeItems.map(f => ({ category: f.category, amount: f.amount })),
      totalBilled: totalAmount,
      totalPaid: 0,
      balance: totalAmount,
      dueDate: `${year}-02-28`,
      createdAt: new Date().toISOString(),
      status: 'UNPAID'
    }));

    setInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: [...newInvoices, ...(prev[tenant.id] || [])]
    }));

    setStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (s.grade === grade && s.status === 'ACTIVE') {
          return {
            ...s,
            totalBilled: s.totalBilled + totalAmount,
            feeBalance: s.feeBalance + totalAmount
          };
        }
        return s;
      })
    }));

    logAuditEvent('BATCH_INVOICES_GENERATED', `Generated ${newInvoices.length} invoices for ${grade} for ${term} ${year}`, 'FINANCE');
    return newInvoices.length;
  };

  // TIMETABLE & ASSIGNMENTS
  const saveTimetableSlot = async (slotData: Omit<TimetableSlot, 'id' | 'tenantId'>): Promise<TimetableSlot> => {
    if (!tenant) throw new Error("No active tenant");
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `slot-${Date.now()}`,
      tenantId: tenant.id
    };
    setTimetableMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []).filter(s => !(s.dayOfWeek === newSlot.dayOfWeek && s.startTime === newSlot.startTime && s.grade === newSlot.grade && s.stream === newSlot.stream)), newSlot]
    }));
    return newSlot;
  };

  const deleteTimetableSlot = async (slotId: string) => {
    if (!tenant) return;
    setTimetableMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).filter(s => s.id !== slotId)
    }));
  };

  const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'tenantId' | 'assignedDate'>): Promise<Assignment> => {
    if (!tenant) throw new Error("No active tenant");
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assgn-${Date.now()}`,
      tenantId: tenant.id,
      assignedDate: new Date().toISOString().split('T')[0]
    };
    setAssignmentsMap(prev => ({
      ...prev,
      [tenant.id]: [newAssignment, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('ASSIGNMENT_CREATED', `Published homework "${newAssignment.title}" for ${newAssignment.grade} ${newAssignment.stream}`, 'ACADEMICS');
    return newAssignment;
  };

  // DISCIPLINE
  const reportDisciplineIncident = async (incidentData: Omit<DisciplineIncident, 'id' | 'tenantId'>): Promise<DisciplineIncident> => {
    if (!tenant) throw new Error("No active tenant");
    const newIncident: DisciplineIncident = {
      ...incidentData,
      id: `disc-${Date.now()}`,
      tenantId: tenant.id
    };
    setDisciplineMap(prev => ({
      ...prev,
      [tenant.id]: [newIncident, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('DISCIPLINE_INCIDENT_REPORTED', `Reported ${newIncident.severity} incident for ${newIncident.studentName}`, 'SETTINGS');
    return newIncident;
  };

  const resolveDisciplineIncident = async (incidentId: string, actionTaken: string) => {
    if (!tenant) return;
    setDisciplineMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(d => d.id === incidentId ? { ...d, status: 'RESOLVED', actionTaken } : d)
    }));
    logAuditEvent('DISCIPLINE_RESOLVED', `Marked incident ${incidentId} as resolved`, 'SETTINGS');
  };

  // EVENTS & BROADCASTS
  const createEvent = async (eventData: Omit<SchoolCalendarEvent, 'id' | 'tenantId'>): Promise<SchoolCalendarEvent> => {
    if (!tenant) throw new Error("No active tenant");
    const newEvt: SchoolCalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      tenantId: tenant.id
    };
    setEventsMap(prev => ({
      ...prev,
      [tenant.id]: [newEvt, ...(prev[tenant.id] || [])]
    }));
    return newEvt;
  };

  const sendNotificationBroadcast = async (broadcastData: Omit<NotificationBroadcast, 'id' | 'tenantId' | 'sentAt' | 'status'>): Promise<NotificationBroadcast> => {
    if (!tenant) throw new Error("No active tenant");
    const newBroadcast: NotificationBroadcast = {
      ...broadcastData,
      id: `notif-${Date.now()}`,
      tenantId: tenant.id,
      sentAt: new Date().toISOString(),
      status: 'SENT'
    };
    setNotificationsMap(prev => ({
      ...prev,
      [tenant.id]: [newBroadcast, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('SMS_BROADCAST_SENT', `Dispatched SMS/Notification broadcast "${newBroadcast.title}" to ${newBroadcast.recipientCount} recipients`, 'SETTINGS');
    return newBroadcast;
  };

  // COLLEGE ACTIONS
  const addCollegeCourse = async (courseData: Omit<CollegeCourse, 'id' | 'tenantId' | 'enrolledStudentsCount'>): Promise<CollegeCourse> => {
    if (!tenant) throw new Error("No active tenant");
    const newCourse: CollegeCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      tenantId: tenant.id,
      enrolledStudentsCount: 0
    };
    setCollegeCoursesMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []), newCourse]
    }));
    logAuditEvent('COURSE_CREATED', `Added college course ${newCourse.code} - ${newCourse.title}`);
    return newCourse;
  };

  const addCollegeDepartment = async (deptData: Omit<CollegeDepartment, 'id' | 'tenantId' | 'facultyCount' | 'courseCount'>): Promise<CollegeDepartment> => {
    if (!tenant) throw new Error("No active tenant");
    const newDept: CollegeDepartment = {
      ...deptData,
      id: `dept-${Date.now()}`,
      tenantId: tenant.id,
      facultyCount: 1,
      courseCount: 0
    };
    setCollegeDepartmentsMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []), newDept]
    }));
    return newDept;
  };

  const admitCollegeStudent = async (studentData: Omit<CollegeStudent, 'id' | 'tenantId' | 'feeBalance' | 'totalBilled' | 'totalPaid'>): Promise<CollegeStudent> => {
    if (!tenant) throw new Error("No active tenant");
    const targetCourse = (collegeCoursesMap[tenant.id] || []).find(c => c.id === studentData.courseId);
    const semesterTuition = targetCourse?.tuitionPerSemester || 65000;

    const newStudent: CollegeStudent = {
      ...studentData,
      id: `cstud-${Date.now()}`,
      tenantId: tenant.id,
      feeBalance: semesterTuition,
      totalBilled: semesterTuition,
      totalPaid: 0
    };
    setCollegeStudentsMap(prev => ({
      ...prev,
      [tenant.id]: [newStudent, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('COLLEGE_STUDENT_ADMITTED', `Enrolled college student ${newStudent.fullName} (${newStudent.regNo}) into ${newStudent.courseName}`);
    return newStudent;
  };

  const addLibraryBook = async (bookData: Omit<LibraryBook, 'id' | 'tenantId' | 'status'>): Promise<LibraryBook> => {
    if (!tenant) throw new Error("No active tenant");
    const newBook: LibraryBook = {
      ...bookData,
      id: `lib-${Date.now()}`,
      tenantId: tenant.id,
      status: bookData.availableCopies > 2 ? 'AVAILABLE' : 'LOW_STOCK'
    };
    setLibraryBooksMap(prev => ({
      ...prev,
      [tenant.id]: [newBook, ...(prev[tenant.id] || [])]
    }));
    return newBook;
  };

  const addCollegeFeeStructureItem = async (itemData: Omit<CollegeFeeStructureItem, 'id' | 'tenantId'>): Promise<CollegeFeeStructureItem> => {
    if (!tenant) throw new Error("No active tenant");
    const newItem: CollegeFeeStructureItem = {
      ...itemData,
      id: `cfee-${Date.now()}`,
      tenantId: tenant.id
    };
    setCollegeFeeStructureMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []), newItem]
    }));
    logAuditEvent('COLLEGE_FEE_STRUCTURE_ADDED', `Added college fee item: ${newItem.courseName} - ${newItem.level} (KES ${newItem.totalSemesterFee.toLocaleString()})`, 'FINANCE');
    return newItem;
  };

  const generateCollegeInvoice = async (invoiceData: Omit<CollegeInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'createdAt'>): Promise<CollegeInvoice> => {
    if (!tenant) throw new Error("No active tenant");
    const invoiceNo = `C-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: CollegeInvoice = {
      ...invoiceData,
      id: `cinv-${Date.now()}`,
      tenantId: tenant.id,
      invoiceNo,
      createdAt: new Date().toISOString(),
      status: invoiceData.paidAmount >= invoiceData.totalAmount ? 'PAID' : invoiceData.paidAmount > 0 ? 'PARTIAL' : 'UNPAID',
      balance: Math.max(0, invoiceData.totalAmount - (invoiceData.paidAmount || 0))
    };

    setCollegeInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: [newInvoice, ...(prev[tenant.id] || [])]
    }));

    setCollegeStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (s.id === invoiceData.studentId) {
          return {
            ...s,
            totalBilled: s.totalBilled + invoiceData.totalAmount,
            feeBalance: s.feeBalance + invoiceData.totalAmount
          };
        }
        return s;
      })
    }));

    logAuditEvent('COLLEGE_INVOICE_GENERATED', `Generated college invoice ${invoiceNo} for ${invoiceData.studentName} (KES ${invoiceData.totalAmount.toLocaleString()})`, 'FINANCE');
    return newInvoice;
  };

  const recordCollegePayment = async (paymentData: Omit<CollegePayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>): Promise<CollegePayment> => {
    if (!tenant) throw new Error("No active tenant");
    const receiptNo = `C-REC-${Date.now().toString().slice(-6)}`;
    const newPayment: CollegePayment = {
      ...paymentData,
      id: `cpay-${Date.now()}`,
      tenantId: tenant.id,
      receiptNo,
      status: 'COMPLETED'
    };

    setCollegePaymentsMap(prev => ({
      ...prev,
      [tenant.id]: [newPayment, ...(prev[tenant.id] || [])]
    }));

    setCollegeStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (s.id === paymentData.studentId) {
          return {
            ...s,
            totalPaid: s.totalPaid + paymentData.amount,
            feeBalance: Math.max(0, s.feeBalance - paymentData.amount)
          };
        }
        return s;
      })
    }));

    if (paymentData.invoiceId) {
      setCollegeInvoicesMap(prev => ({
        ...prev,
        [tenant.id]: (prev[tenant.id] || []).map(inv => {
          if (inv.id === paymentData.invoiceId) {
            const newPaid = inv.paidAmount + paymentData.amount;
            const newBalance = Math.max(0, inv.totalAmount - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              balance: newBalance,
              status: newBalance === 0 ? 'PAID' : 'PARTIAL'
            };
          }
          return inv;
        })
      }));
    }

    logAuditEvent('COLLEGE_PAYMENT_RECORDED', `Recorded college fee payment ${receiptNo} of KES ${paymentData.amount.toLocaleString()} for ${paymentData.studentName}`, 'FINANCE');
    return newPayment;
  };

  // THEOLOGY ACTIONS (Certificate, Diploma, Higher Diploma, Bachelor of Theology)
  const addTheologyProgram = async (programData: Omit<TheologyProgram, 'id' | 'tenantId' | 'enrolledStudentsCount'>): Promise<TheologyProgram> => {
    if (!tenant) throw new Error("No active tenant");
    const newProgram: TheologyProgram = {
      ...programData,
      id: `theo-prog-${Date.now()}`,
      tenantId: tenant.id,
      enrolledStudentsCount: 0
    };
    setTheologyProgramsMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []), newProgram]
    }));
    logAuditEvent('THEOLOGY_PROGRAM_CREATED', `Created theology program: ${newProgram.code} - ${newProgram.title} (${newProgram.level})`, 'ACADEMICS');
    return newProgram;
  };

  const updateTheologyProgram = async (programId: string, updates: Partial<TheologyProgram>) => {
    if (!tenant) return;
    setTheologyProgramsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(p => p.id === programId ? { ...p, ...updates } : p)
    }));
    logAuditEvent('THEOLOGY_PROGRAM_UPDATED', `Updated theology program: ${programId}`, 'ACADEMICS');
  };

  const admitTheologyStudent = async (studentData: Omit<TheologyStudent, 'id' | 'tenantId' | 'feeBalance' | 'totalBilled' | 'totalPaid' | 'practicumHoursCompleted' | 'sermonsEvaluatedCount'>): Promise<TheologyStudent> => {
    if (!tenant) throw new Error("No active tenant");
    const targetProgram = (theologyProgramsMap[tenant.id] || []).find(p => p.id === studentData.programId);
    const semesterTuition = targetProgram?.tuitionPerSemester || 45000;

    const newStudent: TheologyStudent = {
      ...studentData,
      id: `theo-stud-${Date.now()}`,
      tenantId: tenant.id,
      feeBalance: semesterTuition,
      totalBilled: semesterTuition,
      totalPaid: 0,
      practicumHoursCompleted: 0,
      sermonsEvaluatedCount: 0
    };
    setTheologyStudentsMap(prev => ({
      ...prev,
      [tenant.id]: [newStudent, ...(prev[tenant.id] || [])]
    }));
    // Update program enrolled count
    setTheologyProgramsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(p => p.id === studentData.programId ? { ...p, enrolledStudentsCount: p.enrolledStudentsCount + 1 } : p)
    }));
    logAuditEvent('THEOLOGY_STUDENT_ADMITTED', `Admitted theology candidate ${newStudent.fullName} (${newStudent.regNo}) to ${newStudent.programTitle}`, 'ACADEMICS');
    return newStudent;
  };

  const updateTheologyStudent = async (studentId: string, updates: Partial<TheologyStudent>) => {
    if (!tenant) return;
    setTheologyStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => s.id === studentId ? { ...s, ...updates } : s)
    }));
    logAuditEvent('THEOLOGY_STUDENT_UPDATED', `Updated seminarian record for student ${studentId}`, 'ACADEMICS');
  };

  const recordMinistryPracticumLog = async (logData: Omit<MinistryPracticumLog, 'id' | 'tenantId' | 'status'>): Promise<MinistryPracticumLog> => {
    if (!tenant) throw new Error("No active tenant");
    const newLog: MinistryPracticumLog = {
      ...logData,
      id: `prac-${Date.now()}`,
      tenantId: tenant.id,
      status: 'LOGGED'
    };
    setTheologyPracticumLogsMap(prev => ({
      ...prev,
      [tenant.id]: [newLog, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('PRACTICUM_LOG_RECORDED', `Recorded ${newLog.hoursLogged} ministry practicum hours for ${newLog.studentName}`, 'ACADEMICS');
    return newLog;
  };

  const verifyMinistryPracticumLog = async (logId: string, status: 'VERIFIED' | 'NEEDS_REVISION', feedback?: string) => {
    if (!tenant) return;
    let studentId = '';
    let hoursToAdd = 0;

    setTheologyPracticumLogsMap(prev => {
      const currentLogs = prev[tenant.id] || [];
      return {
        ...prev,
        [tenant.id]: currentLogs.map(l => {
          if (l.id === logId) {
            studentId = l.studentId;
            hoursToAdd = l.hoursLogged;
            return {
              ...l,
              status,
              feedbackSupervisor: feedback || l.feedbackSupervisor,
              approvedByDeanAt: status === 'VERIFIED' ? new Date().toISOString() : undefined
            };
          }
          return l;
        })
      };
    });

    if (status === 'VERIFIED' && studentId && hoursToAdd > 0) {
      setTheologyStudentsMap(prev => ({
        ...prev,
        [tenant.id]: (prev[tenant.id] || []).map(s => {
          if (s.id === studentId) {
            return {
              ...s,
              practicumHoursCompleted: s.practicumHoursCompleted + hoursToAdd
            };
          }
          return s;
        })
      }));
    }

    logAuditEvent('PRACTICUM_LOG_VERIFIED', `Dean verified ministry log ${logId} as ${status}`, 'ACADEMICS');
  };

  const addTheologyLibraryResource = async (resourceData: Omit<TheologyLibraryResource, 'id' | 'tenantId' | 'status'>): Promise<TheologyLibraryResource> => {
    if (!tenant) throw new Error("No active tenant");
    const newResource: TheologyLibraryResource = {
      ...resourceData,
      id: `theo-lib-${Date.now()}`,
      tenantId: tenant.id,
      status: 'AVAILABLE'
    };
    setTheologyLibraryMap(prev => ({
      ...prev,
      [tenant.id]: [newResource, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('THEOLOGY_RESOURCE_ADDED', `Added divinity & patristic resource: ${newResource.title}`, 'ACADEMICS');
    return newResource;
  };

  const generateTheologyInvoice = async (invoiceData: Omit<TheologyInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'createdAt'>): Promise<TheologyInvoice> => {
    if (!tenant) throw new Error("No active tenant");
    const invoiceNo = `TH-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = invoiceData.totalAmount || (Number(invoiceData.tuitionAmount || 0) + Number(invoiceData.practicumFee || 0) + Number(invoiceData.ordinationLevy || 0) - Number(invoiceData.sponsorDiscountOrBursary || 0));
    const paidAmount = invoiceData.paidAmount || invoiceData.totalPaid || 0;
    const balance = Math.max(0, totalAmount - paidAmount);
    const newInvoice: TheologyInvoice = {
      ...invoiceData,
      id: `thinv-${Date.now()}`,
      tenantId: tenant.id,
      invoiceNo,
      totalAmount,
      paidAmount,
      totalBilled: totalAmount,
      totalPaid: paidAmount,
      balance,
      createdAt: new Date().toISOString(),
      status: paidAmount >= totalAmount ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID'
    };

    setTheologyInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: [newInvoice, ...(prev[tenant.id] || [])]
    }));

    setTheologyStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (s.id === invoiceData.studentId) {
          return {
            ...s,
            totalBilled: s.totalBilled + totalAmount,
            feeBalance: s.feeBalance + totalAmount
          };
        }
        return s;
      })
    }));

    logAuditEvent('THEOLOGY_INVOICE_GENERATED', `Generated seminary invoice ${invoiceNo} for ${invoiceData.studentName} (KES ${totalAmount.toLocaleString()})`, 'FINANCE');
    return newInvoice;
  };

  const recordTheologyPayment = async (paymentData: Omit<TheologyFeePayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>): Promise<TheologyFeePayment> => {
    if (!tenant) throw new Error("No active tenant");
    const receiptNo = `TH-REC-${Date.now().toString().slice(-6)}`;
    const newPayment: TheologyFeePayment = {
      ...paymentData,
      id: `thpay-${Date.now()}`,
      tenantId: tenant.id,
      receiptNo,
      status: 'COMPLETED'
    };

    setTheologyPaymentsMap(prev => ({
      ...prev,
      [tenant.id]: [newPayment, ...(prev[tenant.id] || [])]
    }));

    setTheologyStudentsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(s => {
        if (s.id === paymentData.studentId) {
          return {
            ...s,
            totalPaid: s.totalPaid + paymentData.amount,
            feeBalance: Math.max(0, s.feeBalance - paymentData.amount)
          };
        }
        return s;
      })
    }));

    if (paymentData.invoiceId) {
      setTheologyInvoicesMap(prev => ({
        ...prev,
        [tenant.id]: (prev[tenant.id] || []).map(inv => {
          if (inv.id === paymentData.invoiceId) {
            const newPaid = (inv.paidAmount || 0) + paymentData.amount;
            const newBalance = Math.max(0, (inv.totalAmount || 0) - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              totalPaid: newPaid,
              balance: newBalance,
              status: newBalance === 0 ? 'PAID' : 'PARTIAL'
            };
          }
          return inv;
        })
      }));
    }

    logAuditEvent('THEOLOGY_PAYMENT_RECORDED', `Recorded seminary payment ${receiptNo} for ${paymentData.studentName} (KES ${paymentData.amount.toLocaleString()}) [${paymentData.sponsorName || paymentData.sponsorshipType || paymentData.paymentMethod}]`, 'FINANCE');
    return newPayment;
  };

  // RETAIL ACTIONS
  const recordRetailSale = async (saleData: Omit<RetailSale, 'id' | 'tenantId' | 'receiptNumber' | 'createdAt' | 'status'>): Promise<RetailSale> => {
    if (!tenant) throw new Error("No active tenant");
    const receiptNumber = `REC-${tenant.code}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSale: RetailSale = {
      ...saleData,
      id: `sale-${Date.now()}`,
      tenantId: tenant.id,
      receiptNumber,
      createdAt: new Date().toISOString(),
      status: 'COMPLETED'
    };

    setRetailSalesMap(prev => ({
      ...prev,
      [tenant.id]: [newSale, ...(prev[tenant.id] || [])]
    }));

    setRetailProductsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(prod => {
        const saleItem = newSale.items.find(item => item.productId === prod.id);
        if (saleItem) {
          const updatedStock = Math.max(0, prod.currentStock - saleItem.quantity);
          const newStatus = updatedStock === 0 ? 'OUT_OF_STOCK' : updatedStock <= prod.minStockAlert ? 'LOW_STOCK' : 'IN_STOCK';
          return { ...prod, currentStock: updatedStock, status: newStatus };
        }
        return prod;
      })
    }));

    logAuditEvent('RETAIL_SALE_COMPLETED', `Completed ${newSale.saleType} POS sale (${newSale.receiptNumber}) for KES ${newSale.totalAmount.toLocaleString()} via ${newSale.paymentMethod}`, 'FINANCE');
    return newSale;
  };

  const addRetailProduct = async (productData: Omit<RetailProduct, 'id' | 'tenantId' | 'status'>): Promise<RetailProduct> => {
    if (!tenant) throw new Error("No active tenant");
    const newProduct: RetailProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      tenantId: tenant.id,
      status: productData.currentStock <= 0 ? 'OUT_OF_STOCK' : productData.currentStock <= productData.minStockAlert ? 'LOW_STOCK' : 'IN_STOCK'
    };
    setRetailProductsMap(prev => ({
      ...prev,
      [tenant.id]: [newProduct, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('PRODUCT_ADDED', `Added inventory product ${newProduct.name} (${newProduct.sku})`);
    return newProduct;
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    if (!tenant) return;
    setRetailProductsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(p => {
        if (p.id === productId) {
          const status = newStock <= 0 ? 'OUT_OF_STOCK' : newStock <= p.minStockAlert ? 'LOW_STOCK' : 'IN_STOCK';
          return { ...p, currentStock: newStock, status };
        }
        return p;
      })
    }));
    logAuditEvent('STOCK_ADJUSTED', `Adjusted stock for product ${productId} to ${newStock}`);
  };

  const addRetailSupplier = async (supplierData: Omit<RetailSupplier, 'id' | 'tenantId' | 'balanceOwed' | 'totalPurchased'>): Promise<RetailSupplier> => {
    if (!tenant) throw new Error("No active tenant");
    const newSupplier: RetailSupplier = {
      ...supplierData,
      id: `supp-${Date.now()}`,
      tenantId: tenant.id,
      balanceOwed: 0,
      totalPurchased: 0
    };
    setRetailSuppliersMap(prev => ({
      ...prev,
      [tenant.id]: [newSupplier, ...(prev[tenant.id] || [])]
    }));
    return newSupplier;
  };

  const addRetailCustomer = async (customerData: Omit<RetailCustomer, 'id' | 'tenantId' | 'currentCredit' | 'totalSpend' | 'lastPurchaseDate'>): Promise<RetailCustomer> => {
    if (!tenant) throw new Error("No active tenant");
    const newCustomer: RetailCustomer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      tenantId: tenant.id,
      currentCredit: 0,
      totalSpend: 0,
      lastPurchaseDate: new Date().toISOString().split('T')[0]
    };
    setRetailCustomersMap(prev => ({
      ...prev,
      [tenant.id]: [newCustomer, ...(prev[tenant.id] || [])]
    }));
    return newCustomer;
  };

  const createRetailCustomerInvoice = async (invoiceData: Omit<RetailCustomerInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'issueDate'>): Promise<RetailCustomerInvoice> => {
    if (!tenant) throw new Error("No active tenant");
    const invoiceNo = `R-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paidAmount = invoiceData.paidAmount || invoiceData.amountPaid || 0;
    const balance = Math.max(0, invoiceData.totalAmount - paidAmount);
    const newInvoice: RetailCustomerInvoice = {
      ...invoiceData,
      id: `rinv-${Date.now()}`,
      tenantId: tenant.id,
      invoiceNo,
      issueDate: new Date().toISOString().split('T')[0],
      amountPaid: paidAmount,
      paidAmount,
      balanceDue: balance,
      balance,
      status: paidAmount >= invoiceData.totalAmount ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID'
    };

    setRetailInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: [newInvoice, ...(prev[tenant.id] || [])]
    }));

    setRetailCustomersMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(c => {
        if (c.id === invoiceData.customerId) {
          return {
            ...c,
            currentCredit: c.currentCredit + balance,
            totalSpend: c.totalSpend + invoiceData.totalAmount,
            lastPurchaseDate: newInvoice.issueDate
          };
        }
        return c;
      })
    }));

    logAuditEvent('RETAIL_INVOICE_CREATED', `Created customer invoice ${invoiceNo} for ${invoiceData.customerName} (KES ${invoiceData.totalAmount.toLocaleString()})`, 'FINANCE');
    return newInvoice;
  };

  const recordRetailCustomerPayment = async (paymentData: Omit<RetailCustomerPayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>): Promise<RetailCustomerPayment> => {
    if (!tenant) throw new Error("No active tenant");
    const receiptNo = `R-REC-${Date.now().toString().slice(-6)}`;
    const newPayment: RetailCustomerPayment = {
      ...paymentData,
      id: `rpay-${Date.now()}`,
      tenantId: tenant.id,
      receiptNo,
      status: 'COMPLETED'
    };

    setRetailCustomerPaymentsMap(prev => ({
      ...prev,
      [tenant.id]: [newPayment, ...(prev[tenant.id] || [])]
    }));

    if (paymentData.invoiceId) {
      setRetailInvoicesMap(prev => ({
        ...prev,
        [tenant.id]: (prev[tenant.id] || []).map(inv => {
          if (inv.id === paymentData.invoiceId) {
            const newPaid = inv.paidAmount + paymentData.amount;
            const newBalance = Math.max(0, inv.totalAmount - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              balance: newBalance,
              status: newBalance === 0 ? 'PAID' : 'PARTIAL'
            };
          }
          return inv;
        })
      }));
    }

    setRetailCustomersMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(c => {
        if (c.id === paymentData.customerId) {
          return {
            ...c,
            currentCredit: Math.max(0, c.currentCredit - paymentData.amount)
          };
        }
        return c;
      })
    }));

    logAuditEvent('RETAIL_DEBTOR_PAYMENT_RECORDED', `Recorded debtor settlement ${receiptNo} of KES ${paymentData.amount.toLocaleString()} from ${paymentData.customerName}`, 'FINANCE');
    return newPayment;
  };

  // HOSPITAL ACTIONS
  const admitHospitalPatient = async (patientData: Omit<HospitalPatient, 'id' | 'tenantId' | 'lastVisitDate' | 'status'>): Promise<HospitalPatient> => {
    if (!tenant) throw new Error("No active tenant");
    const newPatient: HospitalPatient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      tenantId: tenant.id,
      lastVisitDate: new Date().toISOString().split('T')[0],
      status: 'TRIAGE'
    };
    setHospitalPatientsMap(prev => ({
      ...prev,
      [tenant.id]: [newPatient, ...(prev[tenant.id] || [])]
    }));
    logAuditEvent('PATIENT_REGISTERED', `Registered patient ${newPatient.fullName} (${newPatient.patientNo})`);
    return newPatient;
  };

  const recordMedicalConsultation = async (consultationData: Omit<MedicalConsultation, 'id' | 'tenantId' | 'date' | 'status'>): Promise<MedicalConsultation> => {
    if (!tenant) throw new Error("No active tenant");
    const newConsultation: MedicalConsultation = {
      ...consultationData,
      id: `cons-${Date.now()}`,
      tenantId: tenant.id,
      date: new Date().toISOString(),
      status: 'COMPLETED'
    };
    setMedicalConsultationsMap(prev => ({
      ...prev,
      [tenant.id]: [newConsultation, ...(prev[tenant.id] || [])]
    }));
    return newConsultation;
  };

  const createHospitalInvoice = async (invoiceData: Omit<HospitalBillingInvoice, 'id' | 'tenantId' | 'invoiceNo' | 'invoiceDate'>): Promise<HospitalBillingInvoice> => {
    if (!tenant) throw new Error("No active tenant");
    const invoiceNo = `H-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = invoiceData.patientPayableAmount || invoiceData.subtotal || invoiceData.totalAmount || 0;
    const paidAmount = invoiceData.paidAmount || 0;
    const balance = Math.max(0, total - paidAmount);
    const newInvoice: HospitalBillingInvoice = {
      ...invoiceData,
      id: `hinv-${Date.now()}`,
      tenantId: tenant.id,
      invoiceNo,
      totalAmount: total,
      paidAmount,
      balance,
      invoiceDate: new Date().toISOString().split('T')[0],
      status: paidAmount >= total ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID'
    };

    setHospitalInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: [newInvoice, ...(prev[tenant.id] || [])]
    }));

    setHospitalPatientsMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(p => {
        if (p.id === invoiceData.patientId) {
          return { ...p, status: 'DISCHARGED' };
        }
        return p;
      })
    }));

    logAuditEvent('HOSPITAL_INVOICE_CREATED', `Generated hospital billing invoice ${invoiceNo} for patient ${invoiceData.patientName} (KES ${total.toLocaleString()})`, 'FINANCE');
    return newInvoice;
  };

  const recordHospitalPayment = async (paymentData: Omit<HospitalBillingPayment, 'id' | 'tenantId' | 'receiptNo' | 'status'>): Promise<HospitalBillingPayment> => {
    if (!tenant) throw new Error("No active tenant");
    const receiptNo = `H-REC-${Date.now().toString().slice(-6)}`;
    const newPayment: HospitalBillingPayment = {
      ...paymentData,
      id: `hpay-${Date.now()}`,
      tenantId: tenant.id,
      receiptNo,
      status: 'COMPLETED'
    };

    setHospitalPaymentsMap(prev => ({
      ...prev,
      [tenant.id]: [newPayment, ...(prev[tenant.id] || [])]
    }));

    setHospitalInvoicesMap(prev => ({
      ...prev,
      [tenant.id]: (prev[tenant.id] || []).map(inv => {
        if (inv.id === paymentData.invoiceId) {
          const newPaid = inv.paidAmount + paymentData.amount;
          const invoiceTotal = inv.patientPayableAmount || inv.totalAmount || inv.subtotal;
          const newBalance = Math.max(0, invoiceTotal - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            balance: newBalance,
            status: newBalance === 0 ? 'PAID' : 'PARTIAL'
          };
        }
        return inv;
      })
    }));

    logAuditEvent('HOSPITAL_PAYMENT_RECORDED', `Received medical payment ${receiptNo} of KES ${paymentData.amount.toLocaleString()} for patient ${paymentData.patientName} (${paymentData.paymentMethod})`, 'FINANCE');
    return newPayment;
  };

  const addHospitalTariff = async (tariffData: Omit<HospitalServiceTariff, 'id' | 'tenantId'>): Promise<HospitalServiceTariff> => {
    if (!tenant) throw new Error("No active tenant");
    const newTariff: HospitalServiceTariff = {
      ...tariffData,
      id: `htrf-${Date.now()}`,
      tenantId: tenant.id
    };
    setHospitalTariffsMap(prev => ({
      ...prev,
      [tenant.id]: [...(prev[tenant.id] || []), newTariff]
    }));
    logAuditEvent('HOSPITAL_TARIFF_ADDED', `Added clinical tariff ${newTariff.name} (${newTariff.category}) - KES ${(newTariff.cashPrice || newTariff.standardPrice).toLocaleString()}`);
    return newTariff;
  };

  // PERMISSION HELPERS
  const canAccessModule = (moduleName: string): boolean => {
    if (user?.role === 'SUPER_ADMIN') return true;
    if (!tenant) return false;
    return tenant.modules.includes(moduleName);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return roles.includes(user.role);
  };

  const hasPermission = (action: PermissionAction, resource?: PermissionResource): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.role === 'TENANT_ADMIN') return true;

    if (user.role === 'MANAGER') {
      if (action === 'delete' && (resource === 'users' || resource === 'settings')) return false;
      return true;
    }

    if (user.role === 'ACCOUNTANT') {
      if (['fees', 'finance', 'billing', 'pos'].includes(resource || '')) {
        return ['view', 'create', 'edit', 'approve', 'export', 'print'].includes(action);
      }
      return action === 'view' || action === 'print';
    }

    if (user.role === 'CASHIER') {
      if (['fees', 'pos', 'payments'].includes(resource || '')) {
        return ['view', 'create', 'print'].includes(action);
      }
      return action === 'view';
    }

    if (user.role === 'TEACHER') {
      if (['academics', 'attendance', 'reports', 'students', 'timetable', 'assignments'].includes(resource || '')) {
        return ['view', 'create', 'edit', 'print'].includes(action);
      }
      return action === 'view';
    }

    if (user.role === 'STAFF') {
      return ['view', 'create'].includes(action);
    }

    if (user.role === 'VIEWER') {
      return action === 'view' || action === 'print';
    }

    return false;
  };

  const syncAllDataToFirestore = useCallback(async (): Promise<{ success: boolean; count: number; error?: string }> => {
    setIsSyncingFirestore(true);
    try {
      let count = 0;

      // 1. Sync all tenants to Cloud Firestore
      for (const t of allTenants) {
        await setDoc(doc(db, 'tenants', t.id), t, { merge: true });
        count++;

        // Students subcollection
        const tStudents = studentsMap[t.id] || [];
        for (const s of tStudents) {
          await setDoc(doc(db, 'tenants', t.id, 'students', s.id), s, { merge: true });
          count++;
        }

        // Staff subcollection
        const tStaff = staffMap[t.id] || [];
        for (const st of tStaff) {
          await setDoc(doc(db, 'tenants', t.id, 'staff', st.id), st, { merge: true });
          count++;
        }

        // Classes subcollection
        const tClasses = classesMap[t.id] || [];
        for (const c of tClasses) {
          await setDoc(doc(db, 'tenants', t.id, 'classes', c.id), c, { merge: true });
          count++;
        }

        // Fee structure subcollection
        const tFees = feeStructureMap[t.id] || [];
        for (const f of tFees) {
          await setDoc(doc(db, 'tenants', t.id, 'fee_structures', f.id), f, { merge: true });
          count++;
        }

        // Payments subcollection
        const tPayments = paymentsMap[t.id] || [];
        for (const p of tPayments) {
          await setDoc(doc(db, 'tenants', t.id, 'payments', p.id), p, { merge: true });
          count++;
        }

        // Invoices subcollection
        const tInvoices = invoicesMap[t.id] || [];
        for (const inv of tInvoices) {
          await setDoc(doc(db, 'tenants', t.id, 'invoices', inv.id), inv, { merge: true });
          count++;
        }

        // Attendance subcollection
        const tAttendance = attendanceMap[t.id] || [];
        for (const att of tAttendance) {
          await setDoc(doc(db, 'tenants', t.id, 'attendance', att.id), att, { merge: true });
          count++;
        }

        // Retail products
        const tProducts = retailProductsMap[t.id] || [];
        for (const prod of tProducts) {
          await setDoc(doc(db, 'tenants', t.id, 'retail_products', prod.id), prod, { merge: true });
          count++;
        }

        // Hospital patients
        const tPatients = hospitalPatientsMap[t.id] || [];
        for (const pat of tPatients) {
          await setDoc(doc(db, 'tenants', t.id, 'hospital_patients', pat.id), pat, { merge: true });
          count++;
        }

        // Theology programs
        const tTheologyProgs = theologyProgramsMap[t.id] || [];
        for (const prog of tTheologyProgs) {
          await setDoc(doc(db, 'tenants', t.id, 'theology_programs', prog.id), prog, { merge: true });
          count++;
        }

        // Theology students
        const tTheologyStudents = theologyStudentsMap[t.id] || [];
        for (const tStud of tTheologyStudents) {
          await setDoc(doc(db, 'tenants', t.id, 'theology_students', tStud.id), tStud, { merge: true });
          count++;
        }

        // Theology practicum logs
        const tTheologyPracticum = theologyPracticumLogsMap[t.id] || [];
        for (const tPrac of tTheologyPracticum) {
          await setDoc(doc(db, 'tenants', t.id, 'theology_practicum_logs', tPrac.id), tPrac, { merge: true });
          count++;
        }

        // Theology library resources
        const tTheologyLib = theologyLibraryMap[t.id] || [];
        for (const tLib of tTheologyLib) {
          await setDoc(doc(db, 'tenants', t.id, 'theology_library', tLib.id), tLib, { merge: true });
          count++;
        }
      }

      // 2. Sync all platform users
      for (const u of allUsers) {
        await setDoc(doc(db, 'platform_users', u.uid), u, { merge: true });
        count++;
      }

      const syncTime = new Date().toLocaleTimeString();
      setLastFirestoreSyncTime(syncTime);
      logAuditEvent('FIRESTORE_SYNCED', `Pushed ${count} multi-tenant records to Cloud Firestore project (${firebaseProjectId})`);
      return { success: true, count };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown Firestore sync error';
      console.error('Firestore Push Error:', err);
      return { success: false, count: 0, error: errorMsg };
    } finally {
      setIsSyncingFirestore(false);
    }
  }, [
    allTenants,
    allUsers,
    studentsMap,
    staffMap,
    classesMap,
    feeStructureMap,
    paymentsMap,
    invoicesMap,
    attendanceMap,
    retailProductsMap,
    hospitalPatientsMap,
    theologyProgramsMap,
    theologyStudentsMap,
    theologyPracticumLogsMap,
    theologyLibraryMap,
    logAuditEvent
  ]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    setTenant(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        isPlatformMode,
        loading,
        error,
        clearError,
        logout: handleLogout,
        loginWithGoogle,
        switchUserPersona,
        switchTenantAsSuperAdmin,
        switchToPlatformMaster,
        allTenants,
        allPlatformUsers: allUsers,
        allUsers,
        createTenant,
        updateTenant,
        updateTenantSettings: updateTenant,
        deleteTenant,
        updateTenantStatus,
        updateTenantPlan,
        toggleTenantModule,
        subscriptionTiers,
        updateSubscriptionTier,
        resetSubscriptionTiers,
        createPlatformUser,
        updatePlatformUserRole,
        toggleUserActiveStatus,
        students,
        staff,
        classes,
        subjects,
        assessments,
        feeStructure,
        payments,
        invoices,
        attendance,
        timetable,
        assignments,
        discipline,
        events,
        notifications,
        auditLogs,
        collegeDepartments,
        collegeCourses,
        collegeStudents,
        libraryBooks,
        hostelRooms,
        collegeFeeStructures,
        collegeInvoices,
        collegePayments,
        retailProducts,
        retailSales,
        retailSuppliers,
        retailCustomers,
        retailInvoices,
        retailCustomerPayments,
        hospitalPatients,
        medicalConsultations,
        pharmacyItems,
        hospitalTariffs,
        hospitalInvoices,
        hospitalPayments,
        theologyPrograms,
        theologyStudents,
        theologyPracticumLogs,
        theologyLibraryResources,
        theologyInvoices,
        theologyPayments,
        needsAttentionItems,
        searchCurrentTenant,
        admitStudent,
        updateStudent,
        deleteStudent,
        promoteStudents,
        addStaff,
        updateStaff,
        addClassStream,
        updateClassStream,
        recordAssessment,
        markAttendanceBatch,
        addFeeStructureItem,
        recordPayment,
        reversePayment,
        generateInvoicesForGrade,
        saveTimetableSlot,
        deleteTimetableSlot,
        createAssignment,
        reportDisciplineIncident,
        resolveDisciplineIncident,
        createEvent,
        sendNotificationBroadcast,
        addCollegeCourse,
        addCollegeDepartment,
        admitCollegeStudent,
        addLibraryBook,
        addCollegeFeeStructureItem,
        generateCollegeInvoice,
        recordCollegePayment,
        addTheologyProgram,
        updateTheologyProgram,
        admitTheologyStudent,
        updateTheologyStudent,
        recordMinistryPracticumLog,
        verifyMinistryPracticumLog,
        addTheologyLibraryResource,
        generateTheologyInvoice,
        recordTheologyPayment,
        recordRetailSale,
        addRetailProduct,
        updateProductStock,
        addRetailSupplier,
        addRetailCustomer,
        createRetailCustomerInvoice,
        recordRetailCustomerPayment,
        admitHospitalPatient,
        recordMedicalConsultation,
        createHospitalInvoice,
        recordHospitalPayment,
        addHospitalTariff,
        canAccessModule,
        hasRole,
        hasPermission,
        isSyncingFirestore,
        lastFirestoreSyncTime,
        firebaseProjectId,
        firestoreDatabaseName,
        syncAllDataToFirestore
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
