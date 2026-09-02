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
  | 'THEOLOGICAL'
  | 'HOSPITAL' 
  | 'BUSINESS' 
  | 'RETAIL';

export type TenantPlan = 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL';

export interface SubscriptionTierConfig {
  id: TenantPlan;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: string;
  isPopular?: boolean;
  maxLearnersOrRecords: string;
  maxStaffAccounts: string;
  maxStorageGB: number;
  colorScheme: 'slate' | 'indigo' | 'purple' | 'emerald';
  features: string[];
  includedModules: string[];
  supportSLA: string;
}

export interface PlatformSettings {
  name: string;
  tagline: string;
  logoUrl?: string;
  supportEmail: string;
  supportPhone: string;
  mainDomain: string;
  mpesaSandboxEnabled?: boolean;
  strictIsolationEnforced?: boolean;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  name: 'DAVETECH',
  tagline: 'Enterprise Cloud & Multi-Tenant Engine',
  logoUrl: '',
  supportEmail: 'support@davetech.co.ke',
  supportPhone: '+254 700 000 000',
  mainDomain: 'davetech.co.ke',
  mpesaSandboxEnabled: true,
  strictIsolationEnforced: true
};

export const DEFAULT_SUBSCRIPTION_TIERS: SubscriptionTierConfig[] = [
  {
    id: 'BASIC',
    name: 'Basic Starter Tier',
    tagline: 'Essential school, retail & single-branch starter package',
    priceMonthly: 25000,
    priceAnnual: 270000,
    currency: 'KES',
    isPopular: false,
    maxLearnersOrRecords: 'Up to 300 Learners / Records',
    maxStaffAccounts: '5 Staff / Teacher Accounts',
    maxStorageGB: 10,
    colorScheme: 'slate',
    supportSLA: 'Standard Email & Ticket Support (24h)',
    features: [
      'Up to 300 students / 500 catalog items',
      'CBC & Standard Academic Term Reporting',
      'Fee Structure & Direct Receipt Invoicing',
      '5 Staff & Teacher Role Accounts',
      'Daily Attendance Roll Call',
      'Basic SMS Gate Notifications'
    ],
    includedModules: ['STUDENTS', 'STAFF', 'CLASSES', 'CBC_ACADEMICS', 'ASSESSMENTS', 'FEES_FINANCE', 'ATTENDANCE', 'REPORTS']
  },
  {
    id: 'PREMIUM',
    name: 'Premium Growth Tier',
    tagline: 'For mid-size institutions, colleges & growing business chains',
    priceMonthly: 55000,
    priceAnnual: 594000,
    currency: 'KES',
    isPopular: true,
    maxLearnersOrRecords: 'Up to 1,500 Learners / Unlimited Records',
    maxStaffAccounts: '25 Staff & Faculty Accounts',
    maxStorageGB: 50,
    colorScheme: 'indigo',
    supportSLA: 'Priority WhatsApp & Dedicated Phone Support (2h SLA)',
    features: [
      'Up to 1,500 students / unlimited products',
      'Automated Bulk SMS Gateway & Gate Alerts',
      'M-Pesa Express & Bank Instant Reconciliation',
      '25 Staff Accounts + Granular Role Matrix',
      'Timetable Scheduler & Assignment Submissions',
      'Discipline Incident & Behavior Tracking',
      'Point of Sale (POS) & Multi-Store Inventory'
    ],
    includedModules: ['STUDENTS', 'STAFF', 'CLASSES', 'CBC_ACADEMICS', 'ASSESSMENTS', 'FEES_FINANCE', 'ATTENDANCE', 'TIMETABLE', 'ASSIGNMENTS', 'DISCIPLINE', 'CALENDAR', 'SMS_NOTIFICATIONS', 'REPORTS', 'RETAIL_POS', 'INVENTORY']
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise Campus Tier',
    tagline: 'Universities, Hospitals, Seminaries & Multi-Branch Conglomerates',
    priceMonthly: 120000,
    priceAnnual: 1296000,
    currency: 'KES',
    isPopular: false,
    maxLearnersOrRecords: 'Unlimited Learners, Patients & Products',
    maxStaffAccounts: 'Unlimited Staff & Multi-Campus Admins',
    maxStorageGB: 500,
    colorScheme: 'purple',
    supportSLA: '24/7 Dedicated Account Manager & Guaranteed 15-min SLA',
    features: [
      'Unlimited Students, Patients & Inventory SKU scale',
      'Clinical EMR Triage, Pharmacy & Medical Billing',
      'Theology Divinity Seminary, Practicums & Patristics Library',
      'Higher-Ed Degree Programs, Faculty & Hostel Allocation',
      'Custom Subdomain + Dedicated Custom CNAME Ingress',
      'Unlimited Staff Accounts & Multi-Campus Sync',
      'Direct Cloud Firestore Partition & Automated Backups'
    ],
    includedModules: ['STUDENTS', 'STAFF', 'CLASSES', 'CBC_ACADEMICS', 'ASSESSMENTS', 'FEES_FINANCE', 'ATTENDANCE', 'TIMETABLE', 'ASSIGNMENTS', 'DISCIPLINE', 'CALENDAR', 'SMS_NOTIFICATIONS', 'REPORTS', 'RETAIL_POS', 'INVENTORY', 'HOSPITAL_CLINIC', 'PHARMACY', 'LIBRARY', 'HOSTEL']
  }
];

export const MAIN_DOMAIN = 'Davetech.co.ke';
export const MAIN_DOMAIN_LOWER = 'davetech.co.ke';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  subdomain: string; // e.g. "staustins" -> https://staustins.davetech.co.ke
  customDomain?: string; // e.g. "portal.staustins.ac.ke"
  publicWebsite?: string; // e.g. "https://www.staustins.ac.ke"
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
  currentTerm: 'TERM_1' | 'TERM_2' | 'TERM_3' | 'SEMESTER_1' | 'SEMESTER_2' | 'SEMESTER_3';
  currentAcademicYear: string;
  primaryColor?: string;
  secondaryColor?: string;
  favicon?: string;
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

// ==========================================
// COLLEGE FEES & TUITION BILLING TYPES
// ==========================================
export interface CollegeFeeStructureItem {
  id: string;
  tenantId: string;
  courseId: string;
  courseName: string;
  level: 'CERTIFICATE' | 'DIPLOMA' | 'DEGREE' | 'MASTERS';
  yearOfStudy: number;
  semester: 1 | 2 | 3;
  academicYear: string;
  tuitionFee: number;
  labAndPracticalFee: number;
  libraryFee: number;
  studentActivityFee: number;
  examRegistrationFee: number;
  medicalCoverFee: number;
  hostelFee?: number;
  totalSemesterFee: number;
}

export interface CollegeInvoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  courseName: string;
  yearOfStudy: number;
  semester: number;
  academicYear: string;
  items: { description: string; amount: number }[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
  createdAt: string;
}

export interface CollegePayment {
  id: string;
  tenantId: string;
  receiptNo: string;
  invoiceId?: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  courseName: string;
  amount: number;
  paymentMethod: 'MPESA' | 'BANK_TRANSFER' | 'HELB_LOAN' | 'CDF_SPONSOR' | 'CASH' | 'CHEQUE';
  transactionCode: string;
  bankName?: string;
  sponsorName?: string;
  paymentDate: string;
  academicYear: string;
  semester: number;
  recordedBy: string;
  notes?: string;
  status: 'COMPLETED' | 'REVERSED';
}

// ==========================================
// THEOLOGY & DIVINITY FACULTY TYPES
// (Spectrum: Certificate, Diploma, Higher Diploma, Bachelor of Theology)
// ==========================================
export type TheologyDegreeLevel = 
  | 'CERTIFICATE' 
  | 'DIPLOMA' 
  | 'HIGHER_DIPLOMA' 
  | 'BACHELORS';

export type TheologyProgramLevel = TheologyDegreeLevel;

export type TheologyMinistryTrack = 
  | 'PASTORAL_MINISTRY' 
  | 'BIBLICAL_STUDIES' 
  | 'CHRISTIAN_EDUCATION' 
  | 'MISSIOLOGY_EVANGELISM' 
  | 'CHAPLAINCY' 
  | 'BIBLICAL_COUNSELING'
  | 'ORDINATION_PASTORAL'
  | 'BIBLICAL_LANGUAGES_EXEGESIS'
  | 'CHRISTIAN_EDUCATION_YOUTH'
  | 'CHAPLAINCY_COUNSELING';

export interface TheologyUnit {
  id: string;
  unitCode?: string; // e.g. "BIB101", "GRK201", "SYS301", "PAS401"
  code?: string;
  unitTitle?: string;
  title?: string;
  creditHours: number; // 2, 3, or 4 credit hours
  level?: TheologyDegreeLevel;
  semester: number; // 1, 2, 3, 4, 5, 6, 7, 8
  category?: 'Biblical Languages' | 'Old Testament' | 'New Testament' | 'Systematic Theology' | 'Church History' | 'Practical Ministry' | 'Missiology & Apologetics' | 'BIBLICAL_STUDIES' | 'SYSTEMATIC_THEOLOGY' | 'PASTORAL_STUDIES';
  description?: string;
  prerequisites?: string[];
  coreRequired?: boolean;
  isCore?: boolean;
}

export interface TheologyProgram {
  id: string;
  tenantId: string;
  code: string; // e.g. "CERT-BIB", "DIP-THEO", "HDIP-MIN", "BTH-401"
  title: string;
  level: TheologyDegreeLevel;
  departmentId?: string;
  departmentName?: string;
  durationSemesters?: number; // Cert: 2 sems, Dip: 4 sems, Higher Dip: 6 sems, Bachelors: 8 sems
  durationYears?: string; // e.g. "1 Year", "2 Years", "3 Years", "4 Years"
  duration?: string;
  tuitionPerSemester: number;
  enrolledStudentsCount?: number;
  ministryTrack?: TheologyMinistryTrack;
  totalCreditHours?: number;
  creditsRequired?: number;
  requiredPracticumHours: number;
  description: string;
  targetCallings?: string[];
  awardTitle?: string;
  curriculumUnits?: TheologyUnit[];
  units?: TheologyUnit[];
}

export interface TheologyStudent {
  id: string;
  tenantId: string;
  regNo: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: 'Male' | 'Female' | 'Other';
  programId: string;
  programCode?: string;
  programTitle: string;
  level?: TheologyDegreeLevel;
  ministryTrack: TheologyMinistryTrack;
  yearOfStudy: number;
  semester: number;
  homeChurchDenomination?: string; // e.g. "AIC", "PCEA", "Anglican (ACK)", "CITAM / Pentecostal", "Baptist", "Methodist"
  churchAffiliation?: string;
  homeParish?: string;
  presbyteryOrDiocese?: string;
  mentorPastorName?: string;
  mentorPastorPhone?: string;
  ordainingBishopOrSupervisor?: string;
  isOrdinationCandidate?: boolean;
  fieldWorkPlacement?: string; // Church/Parish/Chaplaincy where student is attached
  practicumHoursCompleted: number;
  requiredPracticumHours: number;
  sermonsEvaluatedCount?: number;
  status: 'ACTIVE' | 'GRADUATED' | 'DEFERRED' | 'PRACTICUM_FIELD' | 'DISCONTINUED';
  academicGPA?: number; // On 4.0 scale
  feeBalance: number;
  totalBilled: number;
  totalPaid: number;
  scholarshipOrSponsor?: string; // e.g. "Denominational Bursary (AIC Mission Fund)"
  hostelRoomNumber?: string;
  admissionDate: string;
  notes?: string;
}

export interface MinistryPracticumLog {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  programTitle?: string;
  churchOrInstitution?: string;
  churchOrLocation?: string;
  supervisingPastorName?: string;
  supervisorPastor?: string;
  ministryType?: 'SUNDAY_SERMON' | 'PASTORAL_VISITATION' | 'YOUTH_BIBLE_STUDY' | 'HOSPITAL_CHAPLAINCY' | 'EVANGELISM_OUTREACH' | 'COMMUNITY_COUNSELING';
  activityType?: 'SUNDAY_EXPOSITORY_PREACHING' | 'HOSPITAL_PASTORAL_CARE' | 'YOUTH_DISCIPLESHIP_MENTORING' | 'COMMUNITY_MISSION_EVANGELISM' | 'LITURGICAL_SERVICE_LEADING' | 'PRISON_MINISTRY_VISITATION' | string;
  hoursLogged: number;
  date: string;
  scriptureTextOrTopic?: string;
  reflectionNotes?: string;
  supervisorFeedback?: string;
  feedbackSupervisor?: string;
  ratingScore?: number; // 1 to 5 stars / marks (out of 100)
  status: 'VERIFIED' | 'PENDING' | 'LOGGED' | 'NEEDS_REVISION';
}

export interface TheologyLibraryResource {
  id: string;
  tenantId: string;
  isbn?: string;
  title: string;
  author: string;
  category: 'COMMENTARY' | 'SYSTEMATIC_THEOLOGY' | 'BIBLICAL_LANGUAGES' | 'CHURCH_HISTORY' | 'HOMILETICS_PREACHING' | 'CHRISTIAN_ETHICS' | 'PASTORAL_COUNSELING' | 'CHURCH_HISTORY_PATRISTICS' | 'HERMENEUTICS_EXEGESIS' | 'PASTORAL_HOMILETICS' | 'MISSIOLOGY_ETHICS';
  levelFocus?: TheologyDegreeLevel | 'ALL_LEVELS';
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  description?: string;
  publicationYear?: number;
  digitalPdfAvailable?: boolean;
  isDigitalAvailable?: boolean;
  status?: 'AVAILABLE' | 'LOW_STOCK' | 'CHECKED_OUT';
}

export interface TheologyFeePayment {
  id: string;
  tenantId: string;
  receiptNo: string;
  receiptNumber?: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  programTitle?: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: 'MPESA' | 'BANK_DEPOSIT' | 'DIOCESE_SUBSIDY' | 'PARISH_SPONSORSHIP' | 'BISHOP_BURSARY' | 'CASH' | 'BANK' | 'CHEQUE' | 'BURSARY' | 'DIOCESE_SPONSORSHIP';
  transactionCode?: string;
  reference?: string;
  sponsorName?: string;
  sponsorOrDiocese?: string;
  sponsorshipType?: string;
  paymentCategory?: 'TUITION' | 'PRACTICUM_FEE' | 'ORDINATION_ROBES_VESTMENT' | 'LIBRARY_RESOURCE_FEE' | 'GRADUATION_FEE' | string;
  paymentDate: string;
  recordedBy?: string;
  remarks?: string;
  notes?: string;
  status: 'COMPLETED' | 'REVERSED';
}

export type TheologyPayment = TheologyFeePayment;

export interface TheologyInvoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  invoiceNumber?: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  programId?: string;
  programTitle: string;
  yearOfStudy?: number;
  semester: number;
  academicYear: string;
  items?: { id?: string; name?: string; description?: string; amount: number }[];
  tuitionAmount?: number;
  practicumFee?: number;
  ordinationLevy?: number;
  sponsorDiscountOrBursary?: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  totalBilled?: number;
  totalPaid?: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  createdAt: string;
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

export interface RetailCustomerInvoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerType: 'WHOLESALE' | 'CREDIT_ACCOUNT' | 'DISTRIBUTOR';
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    lineTotal: number;
  }[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  paidAmount?: number;
  balanceDue: number;
  balance?: number;
  paymentTerms: 'NET_15' | 'NET_30' | 'NET_60' | 'DUE_ON_RECEIPT';
  dueDate: string;
  issueDate: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
}

export interface RetailCustomerPayment {
  id: string;
  tenantId: string;
  receiptNo: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: 'MPESA' | 'BANK_TRANSFER' | 'CHEQUE' | 'CASH';
  transactionCode: string;
  paymentDate: string;
  receivedBy: string;
  notes?: string;
  status: 'COMPLETED' | 'REVERSED';
}

// HOSPITAL & CLINICAL TYPES
export interface PatientVitals {
  bloodPressure?: string;
  temperature?: number;
  pulseRate?: number;
  weightKg?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface HospitalPatient {
  id: string;
  tenantId: string;
  patientNo: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other' | 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  phone: string;
  emergencyContact?: string;
  bloodGroup: string;
  allergies?: string;
  vitals?: PatientVitals;
  lastVisitDate: string;
  status: 'TRIAGE' | 'DOCTOR_QUEUE' | 'PHARMACY' | 'DISCHARGED' | 'ADMITTED' | 'WAITING';
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

export interface HospitalBillingInvoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  patientId: string;
  patientName: string;
  patientNo: string;
  patientPhone?: string;
  billingType: 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY';
  items: {
    id: string;
    description: string;
    category: 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'RADIOLOGY' | 'PROCEDURE' | 'BED_WARD' | 'NURSING';
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  totalAmount?: number;
  nhifOrInsuranceCovered: number;
  insuranceProvider?: string;
  insurancePolicyOrClaimNo?: string;
  patientPayableAmount: number;
  paidAmount: number;
  balance: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'INSURANCE_CLAIM_PENDING' | 'DISCHARGED_CLEARED';
  invoiceDate: string;
  doctorName?: string;
}

export interface HospitalBillingPayment {
  id: string;
  tenantId: string;
  receiptNo: string;
  invoiceId?: string;
  patientId: string;
  patientName: string;
  patientNo: string;
  amount: number;
  paymentMethod: 'CASH' | 'MPESA' | 'CARD' | 'NHIF_SHA' | 'PRIVATE_INSURANCE';
  transactionCode: string;
  insuranceClaimNo?: string;
  paymentDate: string;
  cashierName: string;
  notes?: string;
  status: 'COMPLETED' | 'REVERSED';
}

export interface HospitalServiceTariff {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'RADIOLOGY' | 'PROCEDURE' | 'WARD_BED';
  standardPrice: number;
  cashPrice?: number;
  insurancePrice: number;
  department: string;
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
  category: 'FINANCE' | 'ATTENDANCE' | 'INVENTORY' | 'DISCIPLINE' | 'SYSTEM' | 'ACADEMICS';
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
