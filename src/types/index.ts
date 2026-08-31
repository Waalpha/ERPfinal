export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'TENANT_ADMIN' 
  | 'MANAGER' 
  | 'ACCOUNTANT' 
  | 'CASHIER' 
  | 'TEACHER' 
  | 'STAFF' 
  | 'VIEWER';

export type TenantType = 
  | 'PRIMARY_SCHOOL' 
  | 'SECONDARY_SCHOOL' 
  | 'COLLEGE' 
  | 'UNIVERSITY' 
  | 'HOSPITAL' 
  | 'BUSINESS' 
  | 'RETAIL';

export type TenantPlan = 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';

export const MAIN_DOMAIN = 'Davetech.co.ke';
export const MAIN_DOMAIN_LOWER = 'davetech.co.ke';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  subdomain: string; // e.g. "staustins" -> https://staustins.davetech.co.ke
  customDomain?: string; // e.g. "portal.staustins.ac.ke"
  dnsStatus?: 'CONFIGURED' | 'VERIFYING' | 'PENDING';
  type: TenantType;
  status: TenantStatus;
  createdAt: string;
  plan: TenantPlan;
  modules: string[]; // e.g. ['STUDENTS', 'FEES', 'CBC_ACADEMICS', 'ATTENDANCE', 'TIMETABLE', 'DISCIPLINE', 'REPORTS', 'NOTIFICATIONS']
  logoUrl?: string;
  motto?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  country?: string;
  currency: string;
  currentTerm: 'TERM_1' | 'TERM_2' | 'TERM_3';
  currentAcademicYear: string;
  ownerUid?: string;
  stats?: {
    studentCount?: number;
    staffCount?: number;
    totalFeeCollected?: number;
    totalFeeBalance?: number;
  };
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  tenantId: string;
  tenantName?: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  photoURL?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

// PRIMARY SCHOOL SPECIFIC TYPES (Grade Levels: Playgroup, PP1, PP2, Grade 1 to Grade 9)
export type PrimaryGradeLevel = 
  | 'Playgroup'
  | 'PP1'
  | 'PP2'
  | 'Grade 1'
  | 'Grade 2'
  | 'Grade 3'
  | 'Grade 4'
  | 'Grade 5'
  | 'Grade 6'
  | 'Grade 7'
  | 'Grade 8'
  | 'Grade 9';

export const PRIMARY_GRADES: PrimaryGradeLevel[] = [
  'Playgroup',
  'PP1',
  'PP2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9'
];

export interface Student {
  id: string;
  tenantId: string;
  admissionNo: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  grade: PrimaryGradeLevel;
  stream: string; // e.g. Alpha, Beta, Blue, Red, Stream 1
  admissionDate: string;
  birthCertNo?: string;
  photoUrl?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  specialNeeds?: string;
  previousSchool?: string;
  
  // Guardian / Parent
  parentName: string;
  parentRelationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  parentPhone: string;
  parentEmail?: string;
  parentOccupation?: string;
  residentialAddress: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Financial & Status
  status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'SUSPENDED';
  feeBalance: number;
  totalBilled: number;
  totalPaid: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Parent {
  id: string;
  tenantId: string;
  fullName: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  phone: string;
  email?: string;
  nationalId?: string;
  occupation?: string;
  address: string;
  studentIds: string[];
  createdAt: string;
}

export interface ClassStream {
  id: string;
  tenantId: string;
  grade: PrimaryGradeLevel;
  streamName: string;
  classTeacherId?: string;
  classTeacherName?: string;
  roomNumber?: string;
  capacity: number;
  enrolledCount: number;
  academicYear: string;
}

export interface StaffMember {
  id: string;
  tenantId: string;
  employeeNo: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string; // e.g., Headteacher, Deputy Head, Class Teacher, Subject Head, Bursar
  subjectsTaught: string[];
  assignedGrades: PrimaryGradeLevel[];
  employmentType: 'PERMANENT' | 'CONTRACT' | 'INTERN';
  idNumber: string;
  joinDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  date: string;
  grade: PrimaryGradeLevel;
  stream: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface CBCSubject {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: 'Core' | 'Optional' | 'Activity';
  applicableGrades: PrimaryGradeLevel[];
  strands: {
    strandName: string;
    subStrands: string[];
  }[];
  department?: string;
}

export type CBCPerformanceLevel = 
  | 'EE' // Exceeding Expectations (80-100%)
  | 'ME' // Meeting Expectations (65-79%)
  | 'AE' // Approaching Expectations (50-64%)
  | 'BE'; // Below Expectations (0-49%)

export interface AssessmentRecord {
  id: string;
  tenantId: string;
  academicYear: string;
  term: 'TERM_1' | 'TERM_2' | 'TERM_3';
  assessmentType: 'OPENER' | 'MID_TERM' | 'END_TERM' | 'FORMATIVE_TASK';
  grade: PrimaryGradeLevel;
  stream: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  subjectId: string;
  subjectName: string;
  strand?: string;
  subStrand?: string;
  rawScore: number;
  maxScore: number;
  percentage: number;
  performanceLevel: CBCPerformanceLevel;
  rubricComment?: string;
  teacherName: string;
  date: string;
}

export interface FeeStructureItem {
  id: string;
  tenantId: string;
  academicYear: string;
  term: 'TERM_1' | 'TERM_2' | 'TERM_3';
  grade: PrimaryGradeLevel | 'ALL';
  category: 
    | 'Tuition Fee' 
    | 'Boarding / Accommodation' 
    | 'Transport' 
    | 'Activity & Sports' 
    | 'Exams & Assessment' 
    | 'Uniform' 
    | 'Lunch & Meals' 
    | 'Admission Fee' 
    | 'Development Levy';
  amount: number;
  isMandatory: boolean;
  description?: string;
}

export interface FeePayment {
  id: string;
  tenantId: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: PrimaryGradeLevel;
  amount: number;
  paymentMethod: 'M-PESA' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
  transactionCode: string;
  paidAt: string;
  term: 'TERM_1' | 'TERM_2' | 'TERM_3';
  academicYear: string;
  receivedBy: string;
  status: 'CONFIRMED' | 'REVERSED';
  notes?: string;
}

export interface FeeInvoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: PrimaryGradeLevel;
  term: 'TERM_1' | 'TERM_2' | 'TERM_3';
  academicYear: string;
  items: {
    category: string;
    amount: number;
  }[];
  totalBilled: number;
  totalPaid: number;
  balance: number;
  dueDate: string;
  createdAt: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
}

export interface TimetableSlot {
  id: string;
  tenantId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "08:40"
  grade: PrimaryGradeLevel;
  stream: string;
  subjectName: string;
  teacherName: string;
  room?: string;
}

export interface Assignment {
  id: string;
  tenantId: string;
  title: string;
  grade: PrimaryGradeLevel;
  stream: string;
  subjectName: string;
  instructions: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  teacherName: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface DisciplineIncident {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: PrimaryGradeLevel;
  stream: string;
  incidentDate: string;
  title: string;
  category: 'Late Coming' | 'Insubordination' | 'Bullying' | 'Missing Class' | 'Damage to Property' | 'Other';
  severity: 'MINOR' | 'MODERATE' | 'MAJOR';
  description: string;
  actionTaken: string;
  reportedBy: string;
  parentContacted: boolean;
  status: 'OPEN' | 'RESOLVED';
}

export interface PromotionRecord {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  fromYear: string;
  toYear: string;
  fromGrade: PrimaryGradeLevel;
  toGrade: PrimaryGradeLevel | 'Graduated';
  status: 'PROMOTED' | 'RETAINED' | 'TRANSFERRED';
  date: string;
  promotedBy: string;
}

export interface SchoolCalendarEvent {
  id: string;
  tenantId: string;
  title: string;
  startDate: string;
  endDate: string;
  category: 'ACADEMICS' | 'EXAMS' | 'SPORTS' | 'HOLIDAY' | 'PARENTS_MEETING';
  description: string;
  targetAudience: 'ALL' | 'STUDENTS' | 'STAFF' | 'PARENTS';
  venue?: string;
}

export interface NotificationBroadcast {
  id: string;
  tenantId: string;
  title: string;
  message: string;
  channel: 'SMS' | 'EMAIL' | 'PORTAL';
  targetAudience: 'ALL_PARENTS' | 'GRADE_PARENTS' | 'ALL_STAFF' | 'FEE_DEBTORS';
  targetFilter?: string; // e.g. "Grade 4" or "Balance > 5000"
  recipientCount: number;
  sentAt: string;
  sentBy: string;
  status: 'SENT' | 'QUEUED' | 'FAILED';
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  category: 'AUTH' | 'ADMISSION' | 'FINANCE' | 'ACADEMICS' | 'SETTINGS' | 'SECURITY';
  timestamp: string;
  ipAddress?: string;
}

// PERMISSION & SECURITY ROLES
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'print';

export type PermissionResource = 
  | 'students' 
  | 'staff' 
  | 'fees' 
  | 'academics' 
  | 'reports' 
  | 'pos' 
  | 'inventory' 
  | 'courses' 
  | 'patients' 
  | 'settings' 
  | 'users' 
  | 'audit';

// COLLEGE & HIGHER ED SPECIFIC TYPES
export interface CollegeDepartment {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  headOfDepartment: string;
  facultyCount: number;
  courseCount: number;
  building: string;
}

export interface CollegeCourse {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName: string;
  level: 'CERTIFICATE' | 'DIPLOMA' | 'DEGREE' | 'MASTERS' | 'PHD';
  durationSemesters: number;
  tuitionPerSemester: number;
  enrolledStudentsCount: number;
  units: {
    unitCode: string;
    unitTitle: string;
    creditHours: number;
  }[];
}

export interface CollegeStudent {
  id: string;
  tenantId: string;
  regNo: string;
  fullName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  departmentName: string;
  yearOfStudy: number;
  semester: 1 | 2 | 3;
  status: 'ACTIVE' | 'GRADUATED' | 'DEFERRED' | 'DISCONTINUED';
  feeBalance: number;
  totalBilled: number;
  totalPaid: number;
  hostelRoom?: string;
  admissionDate: string;
}

export interface LibraryBook {
  id: string;
  tenantId: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface HostelRoom {
  id: string;
  tenantId: string;
  roomNumber: string;
  blockName: string;
  gender: 'Male' | 'Female';
  capacity: number;
  occupied: number;
  feePerSemester: number;
  status: 'AVAILABLE' | 'FULL' | 'MAINTENANCE';
}

// RETAIL & WHOLESALE BUSINESS SPECIFIC TYPES
export interface RetailProduct {
  id: string;
  tenantId: string;
  sku: string;
  barcode?: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  currentStock: number;
  minStockAlert: number;
  unit: 'PCS' | 'KG' | 'BOX' | 'PACK' | 'LTR' | 'BAG';
  supplierId?: string;
  supplierName?: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface RetailSaleItem {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export interface RetailSale {
  id: string;
  tenantId: string;
  receiptNumber: string;
  customerName?: string;
  customerPhone?: string;
  saleType: 'RETAIL' | 'WHOLESALE';
  items: RetailSaleItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  changeDue: number;
  paymentMethod: 'CASH' | 'M-PESA' | 'CARD' | 'BANK_TRANSFER' | 'CREDIT';
  mpesaRef?: string;
  cashierName: string;
  createdAt: string;
  status: 'COMPLETED' | 'REFUNDED' | 'HELD';
}

export interface RetailSupplier {
  id: string;
  tenantId: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  categoriesSupplied: string[];
  balanceOwed: number;
  totalPurchased: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface RetailCustomer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  type: 'REGULAR' | 'WHOLESALE' | 'CREDIT_ACCOUNT';
  creditLimit: number;
  currentCredit: number;
  totalSpend: number;
  lastPurchaseDate: string;
}

// HOSPITAL & CLINICAL TYPES
export interface HospitalPatient {
  id: string;
  tenantId: string;
  patientNo: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  phone: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies?: string;
  lastVisitDate: string;
  status: 'TRIAGE' | 'DOCTOR_QUEUE' | 'PHARMACY' | 'DISCHARGED' | 'ADMITTED';
}

export interface MedicalConsultation {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  feeAmount: number;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
}

export interface PharmacyItem {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: 'Antibiotic' | 'Analgesic' | 'Syrup' | 'Injectable' | 'Supplements' | 'Medical Consumables';
  dosage: string;
  stockQty: number;
  unitPrice: number;
  expiryDate: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'EXPIRED';
}

// SYSTEM ALERT & NEEDS ATTENTION ITEM
export interface SystemAttentionItem {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'FINANCE' | 'ATTENDANCE' | 'INVENTORY' | 'DISCIPLINE' | 'SYSTEM';
  actionLabel?: string;
  actionRoute?: string;
  timestamp: string;
}

// GLOBAL SEARCH RESULT
export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'STUDENT' | 'STAFF' | 'INVOICE' | 'PAYMENT' | 'COURSE' | 'PRODUCT' | 'PATIENT' | 'MODULE';
  route: string;
  metadata?: string;
}
