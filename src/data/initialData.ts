import {
  Tenant,
  AppUser,
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
  PharmacyItem
} from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-st-austins',
    name: "St. Austin's Academy & Junior School",
    code: 'STA-SCH',
    subdomain: 'staustins',
    customDomain: 'portal.staustins.ac.ke',
    dnsStatus: 'CONFIGURED',
    type: 'PRIMARY_SCHOOL',
    status: 'ACTIVE',
    createdAt: '2024-01-10T08:00:00.000Z',
    plan: 'ENTERPRISE',
    modules: [
      'STUDENTS',
      'STAFF',
      'CLASSES',
      'CBC_ACADEMICS',
      'ASSESSMENTS',
      'FEES_FINANCE',
      'ATTENDANCE',
      'TIMETABLE',
      'ASSIGNMENTS',
      'DISCIPLINE',
      'PROMOTIONS',
      'CALENDAR',
      'SMS_NOTIFICATIONS',
      'REPORTS'
    ],
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
    motto: 'Excellence in Character, Leadership & CBC Competence',
    contactEmail: 'info@staustins.ac.ke',
    phone: '+254 712 345 678',
    address: 'Rhapta Road, Westlands, Nairobi, Kenya',
    country: 'Kenya',
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    stats: {
      studentCount: 480,
      staffCount: 38,
      totalFeeCollected: 8450000,
      totalFeeBalance: 1240000
    }
  },
  {
    id: 'tenant-highlands-prep',
    name: 'Highlands Premier CBC School',
    code: 'HPS-SCH',
    subdomain: 'highlands',
    dnsStatus: 'CONFIGURED',
    type: 'PRIMARY_SCHOOL',
    status: 'ACTIVE',
    createdAt: '2024-03-15T09:30:00.000Z',
    plan: 'PREMIUM',
    modules: [
      'STUDENTS',
      'STAFF',
      'CLASSES',
      'CBC_ACADEMICS',
      'ASSESSMENTS',
      'FEES_FINANCE',
      'ATTENDANCE',
      'CALENDAR',
      'REPORTS'
    ],
    logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=160&auto=format&fit=crop&q=80',
    motto: 'Nurturing Future Innovators',
    contactEmail: 'admissions@highlands.ac.ke',
    phone: '+254 722 890 123',
    address: 'Kiganjo Road, Thika, Kenya',
    country: 'Kenya',
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    stats: {
      studentCount: 320,
      staffCount: 24,
      totalFeeCollected: 5120000,
      totalFeeBalance: 860000
    }
  },
  {
    id: 'tenant-kca-college',
    name: 'KCA Metropolitan College & Institute',
    code: 'KCA-COL',
    subdomain: 'kcacollege',
    customDomain: 'erp.kcacollege.ac.ke',
    dnsStatus: 'CONFIGURED',
    type: 'COLLEGE',
    status: 'ACTIVE',
    createdAt: '2024-04-10T09:00:00.000Z',
    plan: 'ENTERPRISE',
    modules: ['STUDENTS', 'COURSES', 'DEPARTMENTS', 'FEES', 'LIBRARY', 'HOSTEL', 'STAFF', 'REPORTS'],
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    motto: 'Advancing Technology, Innovation and Business Acumen',
    contactEmail: 'admissions@kcacollege.ac.ke',
    phone: '+254 700 888 999',
    address: 'Thika Superhighway, Ruaraka, Nairobi, Kenya',
    stats: {
      studentCount: 640,
      staffCount: 45,
      totalFeeCollected: 14200000,
      totalFeeBalance: 2400000
    }
  },
  {
    id: 'tenant-greenvale-hospital',
    name: 'Greenvale Medical & Maternity Hospital',
    code: 'GMH-MED',
    subdomain: 'greenvale',
    dnsStatus: 'CONFIGURED',
    type: 'HOSPITAL',
    status: 'ACTIVE',
    createdAt: '2024-05-01T10:00:00.000Z',
    plan: 'ENTERPRISE',
    modules: ['PATIENTS', 'APPOINTMENTS', 'PHARMACY', 'BILLING', 'STAFF', 'REPORTS'],
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    contactEmail: 'desk@greenvalehospital.org',
    phone: '+254 700 111 222',
    address: 'Milimani, Kisumu, Kenya',
    stats: {
      studentCount: 180,
      staffCount: 22,
      totalFeeCollected: 3800000,
      totalFeeBalance: 420000
    }
  },
  {
    id: 'tenant-apex-retail',
    name: 'Apex Wholesale & Distribution Hub',
    code: 'AWD-BIZ',
    subdomain: 'apex',
    dnsStatus: 'CONFIGURED',
    type: 'RETAIL',
    status: 'ACTIVE',
    createdAt: '2024-08-12T14:20:00.000Z',
    plan: 'PREMIUM',
    modules: ['INVENTORY', 'SALES', 'POS', 'SUPPLIERS', 'FINANCE', 'CUSTOMERS', 'REPORTS'],
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    contactEmail: 'sales@apexwholesale.co.ke',
    phone: '+254 733 444 555',
    address: 'Industrial Area, Mombasa, Kenya',
    stats: {
      studentCount: 85,
      staffCount: 14,
      totalFeeCollected: 6450000,
      totalFeeBalance: 580000
    }
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    uid: 'user-superadmin-01',
    email: 'superadmin@davetech.io',
    displayName: 'David K. Maina (Davetech Super Admin)',
    tenantId: 'davetech-main-platform',
    tenantName: 'DAVETECH Main Platform (HQ)',
    role: 'SUPER_ADMIN',
    isActive: true,
    phone: '+254 700 000 001',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-principal-02',
    email: 'sarah.wanjiru@staustins.ac.ke',
    displayName: 'Sarah Wanjiru (Principal)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 712 345 601',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-college-dean',
    email: 'dean.odhiambo@kcacollege.ac.ke',
    displayName: 'Prof. Dennis Odhiambo (Academic Dean)',
    tenantId: 'tenant-kca-college',
    tenantName: 'KCA Metropolitan College',
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 700 888 901',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-retail-manager',
    email: 'manager.hassan@apexwholesale.co.ke',
    displayName: 'Hassan Noor (Retail & POS Manager)',
    tenantId: 'tenant-apex-retail',
    tenantName: 'Apex Wholesale Hub',
    role: 'MANAGER',
    isActive: true,
    phone: '+254 733 444 501',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-hospital-admin',
    email: 'dr.wanjiku@greenvalehospital.org',
    displayName: 'Dr. Evelyn Wanjiku (Medical Director)',
    tenantId: 'tenant-greenvale-hospital',
    tenantName: 'Greenvale Medical Hospital',
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 700 111 201',
    photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-bursar-03',
    email: 'grace.mwangi@staustins.ac.ke',
    displayName: 'Grace Mwangi (Senior Bursar)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'ACCOUNTANT',
    isActive: true,
    phone: '+254 712 345 602',
    photoURL: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-head-teacher-04',
    email: 'james.otieno@staustins.ac.ke',
    displayName: 'James Otieno (Lead CBC Coordinator)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'TEACHER',
    isActive: true,
    phone: '+254 712 345 603',
    assignedClasses: ['Grade 4 Alpha', 'Grade 7 Alpha'],
    assignedSubjects: ['Science and Technology', 'Mathematical Activities'],
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-cashier-06',
    email: 'ann.kerubo@staustins.ac.ke',
    displayName: 'Ann Kerubo (Accounts Cashier)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'CASHIER',
    isActive: true,
    phone: '+254 712 345 605',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STUDENTS: Record<string, Student[]> = {
  'tenant-st-austins': [
    {
      id: 'stud-001',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-001',
      firstName: 'Ethan',
      middleName: 'Mwenda',
      lastName: 'Mutuma',
      gender: 'Male',
      dob: '2016-04-14',
      grade: 'Grade 4',
      stream: 'Alpha',
      admissionDate: '2024-01-08',
      birthCertNo: 'BC-8891024',
      photoUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=120&auto=format&fit=crop&q=80',
      bloodGroup: 'O+',
      medicalNotes: 'Mild asthma, carries inhaler for physical sports',
      parentName: 'David Mutuma Mwenda',
      parentRelationship: 'Father',
      parentPhone: '+254 721 998 877',
      parentEmail: 'd.mutuma@gmail.com',
      parentOccupation: 'Software Architect',
      residentialAddress: 'Lavington Green Estate, House 14B, Nairobi',
      emergencyContactName: 'Catherine Mutuma (Mother)',
      emergencyContactPhone: '+254 722 443 322',
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 75000,
      totalPaid: 75000,
      createdAt: '2024-01-08T08:00:00.000Z'
    },
    {
      id: 'stud-002',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-002',
      firstName: 'Zuri',
      middleName: 'Nyambura',
      lastName: 'Kariuki',
      gender: 'Female',
      dob: '2016-09-22',
      grade: 'Grade 4',
      stream: 'Alpha',
      admissionDate: '2024-01-08',
      birthCertNo: 'BC-7721908',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      bloodGroup: 'A+',
      parentName: 'Dr. Faith Kariuki',
      parentRelationship: 'Mother',
      parentPhone: '+254 733 112 233',
      parentEmail: 'faith.k@nairobihospital.org',
      parentOccupation: 'Cardiologist',
      residentialAddress: 'Riverside Drive, Court 3, Apt 8',
      emergencyContactName: 'Kenneth Kariuki',
      emergencyContactPhone: '+254 733 445 566',
      status: 'ACTIVE',
      feeBalance: 15000,
      totalBilled: 75000,
      totalPaid: 60000,
      createdAt: '2024-01-08T08:15:00.000Z'
    },
    {
      id: 'stud-003',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-003',
      firstName: 'Liam',
      middleName: 'Kiprono',
      lastName: 'Cheruiyot',
      gender: 'Male',
      dob: '2019-02-10',
      grade: 'Grade 1',
      stream: 'Alpha',
      admissionDate: '2024-01-09',
      birthCertNo: 'BC-9912831',
      photoUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=120&auto=format&fit=crop&q=80',
      bloodGroup: 'B+',
      parentName: 'Vincent Cheruiyot',
      parentRelationship: 'Father',
      parentPhone: '+254 720 554 433',
      parentEmail: 'vincent.cheruiyot@kengen.co.ke',
      parentOccupation: 'Power Engineer',
      residentialAddress: 'Kilimani, Ring Road Court 5',
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 68000,
      totalPaid: 68000,
      createdAt: '2024-01-09T09:00:00.000Z'
    },
    {
      id: 'stud-004',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-004',
      firstName: 'Amani',
      middleName: 'Wairimu',
      lastName: 'Njoroge',
      gender: 'Female',
      dob: '2021-06-18',
      grade: 'PP1',
      stream: 'Blue',
      admissionDate: '2024-01-10',
      birthCertNo: 'BC-1029384',
      parentName: 'Mercy Njoroge',
      parentRelationship: 'Mother',
      parentPhone: '+254 711 778 899',
      parentEmail: 'mercy.njoroge@safaricom.co.ke',
      parentOccupation: 'Marketing Executive',
      residentialAddress: 'Kileleshwa, Siaya Park #12',
      status: 'ACTIVE',
      feeBalance: 22000,
      totalBilled: 55000,
      totalPaid: 33000,
      createdAt: '2024-01-10T10:00:00.000Z'
    },
    {
      id: 'stud-005',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-005',
      firstName: 'Jayden',
      middleName: 'Omondi',
      lastName: 'Odhiambo',
      gender: 'Male',
      dob: '2013-11-05',
      grade: 'Grade 7',
      stream: 'Alpha (Junior School)',
      admissionDate: '2024-01-12',
      birthCertNo: 'BC-6638291',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      parentName: 'Prof. Lucas Odhiambo',
      parentRelationship: 'Father',
      parentPhone: '+254 722 990 011',
      parentEmail: 'lodhiambo@uonbi.ac.ke',
      parentOccupation: 'University Professor',
      residentialAddress: 'Westlands, Brookside Drive #4',
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 88000,
      totalPaid: 88000,
      createdAt: '2024-01-12T11:30:00.000Z'
    },
    {
      id: 'stud-006',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-006',
      firstName: 'Gabriella',
      middleName: 'Chebet',
      lastName: 'Koech',
      gender: 'Female',
      dob: '2015-08-30',
      grade: 'Grade 5',
      stream: 'Alpha',
      admissionDate: '2024-01-15',
      parentName: 'Gladys Koech',
      parentRelationship: 'Mother',
      parentPhone: '+254 723 445 566',
      parentEmail: 'gladys.koech@equity.co.ke',
      residentialAddress: 'Westlands, Church Road Court',
      status: 'ACTIVE',
      feeBalance: 35000,
      totalBilled: 78000,
      totalPaid: 43000,
      createdAt: '2024-01-15T09:20:00.000Z'
    }
  ],
  'tenant-highlands-prep': [
    {
      id: 'stud-h01',
      tenantId: 'tenant-highlands-prep',
      admissionNo: 'HPS-2024-001',
      firstName: 'Brian',
      lastName: 'Kamau',
      gender: 'Male',
      dob: '2016-05-12',
      grade: 'Grade 4',
      stream: 'Gold',
      admissionDate: '2024-01-10',
      parentName: 'Samuel Kamau',
      parentRelationship: 'Father',
      parentPhone: '+254 722 334 455',
      residentialAddress: 'Thika Greens Estate',
      status: 'ACTIVE',
      feeBalance: 12000,
      totalBilled: 50000,
      totalPaid: 38000,
      createdAt: '2024-01-10T10:00:00.000Z'
    }
  ]
};

export const INITIAL_STAFF: Record<string, StaffMember[]> = {
  'tenant-st-austins': [
    {
      id: 'staff-01',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-001',
      fullName: 'Sarah Wanjiru',
      email: 'sarah.wanjiru@staustins.ac.ke',
      phone: '+254 712 345 601',
      role: 'TENANT_ADMIN',
      designation: 'School Principal & Academic Director',
      subjectsTaught: ['English Language', 'Leadership Development'],
      assignedGrades: ['Grade 7', 'Grade 8'],
      employmentType: 'PERMANENT',
      idNumber: '24890123',
      joinDate: '2020-01-05',
      status: 'ACTIVE'
    },
    {
      id: 'staff-02',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-002',
      fullName: 'James Otieno',
      email: 'james.otieno@staustins.ac.ke',
      phone: '+254 712 345 603',
      role: 'TEACHER',
      designation: 'Head of CBC Curriculum & STEM',
      subjectsTaught: ['Science & Technology', 'Mathematical Activities', 'Agriculture'],
      assignedGrades: ['Grade 4', 'Grade 5', 'Grade 7'],
      employmentType: 'PERMANENT',
      idNumber: '27891234',
      joinDate: '2021-03-01',
      status: 'ACTIVE'
    },
    {
      id: 'staff-03',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-003',
      fullName: 'Grace Mwangi',
      email: 'grace.mwangi@staustins.ac.ke',
      phone: '+254 712 345 602',
      role: 'ACCOUNTANT',
      designation: 'Chief Bursar / Finance Officer',
      subjectsTaught: [],
      assignedGrades: [],
      employmentType: 'PERMANENT',
      idNumber: '29012345',
      joinDate: '2020-08-15',
      status: 'ACTIVE'
    },
    {
      id: 'staff-04',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-004',
      fullName: 'Michael Mutua',
      email: 'michael.mutua@staustins.ac.ke',
      phone: '+254 712 345 604',
      role: 'TEACHER',
      designation: 'Lower Primary Lead & Class Teacher Grade 1',
      subjectsTaught: ['Language Activities', 'Mathematical Activities', 'Creative Arts'],
      assignedGrades: ['Grade 1', 'Grade 2'],
      employmentType: 'PERMANENT',
      idNumber: '31289456',
      joinDate: '2022-01-10',
      status: 'ACTIVE'
    },
    {
      id: 'staff-05',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-005',
      fullName: 'Agnes Chepngetich',
      email: 'agnes.c@staustins.ac.ke',
      phone: '+254 712 345 606',
      role: 'TEACHER',
      designation: 'Head of Languages (Kiswahili & French)',
      subjectsTaught: ['Kiswahili Lugha', 'French Activities'],
      assignedGrades: ['Grade 3', 'Grade 4', 'Grade 6', 'Grade 7'],
      employmentType: 'PERMANENT',
      idNumber: '28471902',
      joinDate: '2021-09-01',
      status: 'ACTIVE'
    }
  ]
};

export const INITIAL_CLASSES: Record<string, ClassStream[]> = {
  'tenant-st-austins': [
    { id: 'cls-pg', tenantId: 'tenant-st-austins', grade: 'Playgroup', streamName: 'Alpha', roomNumber: 'Block A-01', capacity: 20, enrolledCount: 16, academicYear: '2025', classTeacherName: 'Teacher Hellen' },
    { id: 'cls-pp1', tenantId: 'tenant-st-austins', grade: 'PP1', streamName: 'Blue', roomNumber: 'Block A-02', capacity: 25, enrolledCount: 22, academicYear: '2025', classTeacherName: 'Teacher Brenda' },
    { id: 'cls-pp2', tenantId: 'tenant-st-austins', grade: 'PP2', streamName: 'Yellow', roomNumber: 'Block A-03', capacity: 25, enrolledCount: 24, academicYear: '2025', classTeacherName: 'Teacher Sharon' },
    { id: 'cls-g1a', tenantId: 'tenant-st-austins', grade: 'Grade 1', streamName: 'Alpha', roomNumber: 'Block B-101', capacity: 30, enrolledCount: 28, academicYear: '2025', classTeacherName: 'Michael Mutua' },
    { id: 'cls-g1b', tenantId: 'tenant-st-austins', grade: 'Grade 1', streamName: 'Beta', roomNumber: 'Block B-102', capacity: 30, enrolledCount: 26, academicYear: '2025', classTeacherName: 'Teacher Cynthia' },
    { id: 'cls-g2a', tenantId: 'tenant-st-austins', grade: 'Grade 2', streamName: 'Alpha', roomNumber: 'Block B-201', capacity: 30, enrolledCount: 27, academicYear: '2025', classTeacherName: 'Teacher Dan' },
    { id: 'cls-g3a', tenantId: 'tenant-st-austins', grade: 'Grade 3', streamName: 'Alpha', roomNumber: 'Block B-202', capacity: 30, enrolledCount: 29, academicYear: '2025', classTeacherName: 'Teacher Eunice' },
    { id: 'cls-g4a', tenantId: 'tenant-st-austins', grade: 'Grade 4', streamName: 'Alpha', roomNumber: 'Block C-101', capacity: 32, enrolledCount: 30, academicYear: '2025', classTeacherName: 'James Otieno' },
    { id: 'cls-g5a', tenantId: 'tenant-st-austins', grade: 'Grade 5', streamName: 'Alpha', roomNumber: 'Block C-102', capacity: 32, enrolledCount: 31, academicYear: '2025', classTeacherName: 'Agnes Chepngetich' },
    { id: 'cls-g6a', tenantId: 'tenant-st-austins', grade: 'Grade 6', streamName: 'Alpha', roomNumber: 'Block C-201', capacity: 32, enrolledCount: 28, academicYear: '2025', classTeacherName: 'Teacher Patrick' },
    { id: 'cls-g7a', tenantId: 'tenant-st-austins', grade: 'Grade 7', streamName: 'Alpha (Junior)', roomNumber: 'Junior Lab 01', capacity: 35, enrolledCount: 32, academicYear: '2025', classTeacherName: 'Sarah Wanjiru' },
    { id: 'cls-g8a', tenantId: 'tenant-st-austins', grade: 'Grade 8', streamName: 'Alpha (Junior)', roomNumber: 'Junior Lab 02', capacity: 35, enrolledCount: 30, academicYear: '2025', classTeacherName: 'Teacher Eric' },
    { id: 'cls-g9a', tenantId: 'tenant-st-austins', grade: 'Grade 9', streamName: 'Alpha (Junior)', roomNumber: 'Junior Lab 03', capacity: 35, enrolledCount: 25, academicYear: '2025', classTeacherName: 'Teacher Rebecca' }
  ]
};

export const INITIAL_CBC_SUBJECTS: CBCSubject[] = [
  {
    id: 'sub-eng',
    tenantId: 'tenant-st-austins',
    code: 'ENG-CBC',
    name: 'English Language Activities',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Listening and Speaking', subStrands: ['Attentive Listening', 'Pronunciation & Vocabulary', 'Conversations & Etiquette'] },
      { strandName: 'Reading', subStrands: ['Fluency & Comprehension', 'Independent Reading', 'Grammar in Context'] },
      { strandName: 'Writing', subStrands: ['Handwriting', 'Creative Composition', 'Punctuation & Spelling'] }
    ]
  },
  {
    id: 'sub-kisw',
    tenantId: 'tenant-st-austins',
    code: 'KIS-CBC',
    name: 'Kiswahili Lugha na Mawasiliano',
    category: 'Core',
    applicableGrades: ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Kusikiliza na Kuzungumza', subStrands: ['Maamkizi na Mazungumzo', 'Matamshi Bora'] },
      { strandName: 'Kusoma', subStrands: ['Ufahamu na Msamiati', 'Kusoma kwa Ufasaha'] },
      { strandName: 'Kuandika', subStrands: ['Insha za Ubunifu', 'Sarufi'] }
    ]
  },
  {
    id: 'sub-math',
    tenantId: 'tenant-st-austins',
    code: 'MAT-CBC',
    name: 'Mathematical Activities',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Numbers', subStrands: ['Whole Numbers', 'Fractions & Decimals', 'Operations (Add/Sub/Mult/Div)'] },
      { strandName: 'Measurement', subStrands: ['Length, Mass & Capacity', 'Time & Money', 'Area & Perimeter'] },
      { strandName: 'Geometry & Data', subStrands: ['2D & 3D Shapes', 'Simple Data Presentation'] }
    ]
  },
  {
    id: 'sub-scitech',
    tenantId: 'tenant-st-austins',
    code: 'SCI-CBC',
    name: 'Science and Technology',
    category: 'Core',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Living Things', subStrands: ['Plants & Animals', 'Human Body Systems', 'Health & Hygiene'] },
      { strandName: 'Environment & Matter', subStrands: ['States of Matter', 'Water, Soil and Air Conservation'] },
      { strandName: 'Digital Technology & Coding', subStrands: ['Computer Parts', 'Word Processing', 'Algorithmic Thinking'] }
    ]
  },
  {
    id: 'sub-agri',
    tenantId: 'tenant-st-austins',
    code: 'AGR-CBC',
    name: 'Agriculture and Nutrition',
    category: 'Core',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Conserving Agricultural Environment', subStrands: ['Soil Conservation', 'Water Harvesting for Farming'] },
      { strandName: 'Crop and Animal Production', subStrands: ['Vegetable Gardening', 'Poultry Care'] },
      { strandName: 'Food and Nutrition', subStrands: ['Balanced Diet & Meal Planning', 'Food Preservation'] }
    ]
  },
  {
    id: 'sub-creative',
    tenantId: 'tenant-st-austins',
    code: 'CRE-CBC',
    name: 'Creative Arts & Sports',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Visual Arts', subStrands: ['Drawing & Painting', 'Crafts & Sculptures'] },
      { strandName: 'Music & Performing Arts', subStrands: ['Melody, Rhythm & Kenyan Folk Songs', 'Musical Instruments'] },
      { strandName: 'Physical Health & Sports', subStrands: ['Athletics, Ball Games & Gymnastics', 'First Aid'] }
    ]
  },
  {
    id: 'sub-social',
    tenantId: 'tenant-st-austins',
    code: 'SOC-CBC',
    name: 'Social Studies & Citizenship',
    category: 'Core',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Community and Governance', subStrands: ['County and National Government', 'Citizenship & Rights'] },
      { strandName: 'History and Heritage', subStrands: ['Kenyan Communities & Cultural Heritage'] }
    ]
  },
  {
    id: 'sub-cre',
    tenantId: 'tenant-st-austins',
    code: 'REL-CBC',
    name: 'Religious Education (CRE / IRE)',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Creation and Moral Values', subStrands: ['Living in Harmony', 'Integrity and Compassion'] }
    ]
  }
];

export const INITIAL_ASSESSMENTS: Record<string, AssessmentRecord[]> = {
  'tenant-st-austins': [
    {
      id: 'ass-001',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      subjectId: 'sub-math',
      subjectName: 'Mathematical Activities',
      strand: 'Numbers - Multi-digit Operations & Fractions',
      rawScore: 92,
      maxScore: 100,
      percentage: 92,
      performanceLevel: 'EE',
      rubricComment: 'Demonstrates outstanding mastery in multi-step problem solving.',
      teacherName: 'James Otieno',
      date: '2025-02-18'
    },
    {
      id: 'ass-002',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      subjectId: 'sub-scitech',
      subjectName: 'Science and Technology',
      strand: 'Living Things & Digital Literacy',
      rawScore: 88,
      maxScore: 100,
      percentage: 88,
      performanceLevel: 'EE',
      rubricComment: 'Exceptional comprehension of plant structures and computer hardware.',
      teacherName: 'James Otieno',
      date: '2025-02-19'
    },
    {
      id: 'ass-003',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      subjectId: 'sub-eng',
      subjectName: 'English Language Activities',
      strand: 'Creative Writing & Reading Fluency',
      rawScore: 78,
      maxScore: 100,
      percentage: 78,
      performanceLevel: 'ME',
      rubricComment: 'Good expressive vocabulary and clean paragraphing.',
      teacherName: 'Sarah Wanjiru',
      date: '2025-02-20'
    },
    {
      id: 'ass-004',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      subjectId: 'sub-math',
      subjectName: 'Mathematical Activities',
      strand: 'Numbers & Measurement',
      rawScore: 86,
      maxScore: 100,
      percentage: 86,
      performanceLevel: 'EE',
      rubricComment: 'Shows very strong conceptual understanding and accuracy.',
      teacherName: 'James Otieno',
      date: '2025-02-18'
    },
    {
      id: 'ass-005',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      subjectId: 'sub-eng',
      subjectName: 'English Language Activities',
      strand: 'Grammar & Oral Presentation',
      rawScore: 94,
      maxScore: 100,
      percentage: 94,
      performanceLevel: 'EE',
      rubricComment: 'Outstanding public speaking and eloquent essay composition.',
      teacherName: 'Sarah Wanjiru',
      date: '2025-02-20'
    }
  ]
};

export const INITIAL_FEE_STRUCTURE: Record<string, FeeStructureItem[]> = {
  'tenant-st-austins': [
    { id: 'fee-str-01', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Tuition Fee', amount: 45000, isMandatory: true, description: 'Core CBC academic instruction & STEM lab' },
    { id: 'fee-str-02', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Lunch & Meals', amount: 15000, isMandatory: true, description: 'Nutritious hot lunch and mid-morning snack' },
    { id: 'fee-str-03', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Activity & Sports', amount: 8000, isMandatory: true, description: 'Swimming, clubs, music, and sports coaching' },
    { id: 'fee-str-04', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Exams & Assessment', amount: 7000, isMandatory: true, description: 'CBC standardized assessment sheets and materials' },
    { id: 'fee-str-05', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Tuition Fee', amount: 40000, isMandatory: true },
    { id: 'fee-str-06', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Lunch & Meals', amount: 15000, isMandatory: true },
    { id: 'fee-str-07', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Activity & Sports', amount: 7000, isMandatory: true },
    { id: 'fee-str-08', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Exams & Assessment', amount: 6000, isMandatory: true },
    { id: 'fee-str-09', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Tuition Fee', amount: 32000, isMandatory: true },
    { id: 'fee-str-10', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Lunch & Meals', amount: 14000, isMandatory: true },
    { id: 'fee-str-11', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Activity & Sports', amount: 5000, isMandatory: true },
    { id: 'fee-str-12', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Exams & Assessment', amount: 4000, isMandatory: true },
    { id: 'fee-str-13', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Tuition Fee', amount: 55000, isMandatory: true },
    { id: 'fee-str-14', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Lunch & Meals', amount: 16000, isMandatory: true },
    { id: 'fee-str-15', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Activity & Sports', amount: 9000, isMandatory: true },
    { id: 'fee-str-16', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Exams & Assessment', amount: 8000, isMandatory: true }
  ]
};

export const INITIAL_PAYMENTS: Record<string, FeePayment[]> = {
  'tenant-st-austins': [
    {
      id: 'pay-001',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0101',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      grade: 'Grade 4',
      amount: 75000,
      paymentMethod: 'M-PESA',
      transactionCode: 'SFE94821KQ',
      paidAt: '2025-01-08T10:24:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Grace Mwangi',
      status: 'CONFIRMED',
      notes: 'Full Term 1 fee settled via M-Pesa Paybill 400200'
    },
    {
      id: 'pay-002',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0102',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      grade: 'Grade 4',
      amount: 60000,
      paymentMethod: 'BANK_TRANSFER',
      transactionCode: 'FT2500891823',
      paidAt: '2025-01-10T14:15:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Grace Mwangi',
      status: 'CONFIRMED',
      notes: 'Standard Chartered Bank direct deposit. Balance: KES 15,000'
    },
    {
      id: 'pay-003',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0103',
      studentId: 'stud-003',
      studentName: 'Liam Kiprono Cheruiyot',
      admissionNo: 'STA-2024-003',
      grade: 'Grade 1',
      amount: 68000,
      paymentMethod: 'M-PESA',
      transactionCode: 'SFK11209AB',
      paidAt: '2025-01-09T11:00:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Ann Kerubo',
      status: 'CONFIRMED',
      notes: 'Complete Term 1 clearance'
    },
    {
      id: 'pay-004',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0104',
      studentId: 'stud-004',
      studentName: 'Amani Wairimu Njoroge',
      admissionNo: 'STA-2024-004',
      grade: 'PP1',
      amount: 33000,
      paymentMethod: 'M-PESA',
      transactionCode: 'SFM90881XY',
      paidAt: '2025-01-12T16:30:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Ann Kerubo',
      status: 'CONFIRMED',
      notes: 'First installment. Remaining balance: KES 22,000'
    },
    {
      id: 'pay-005',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0105',
      studentId: 'stud-005',
      studentName: 'Jayden Omondi Odhiambo',
      admissionNo: 'STA-2024-005',
      grade: 'Grade 7',
      amount: 88000,
      paymentMethod: 'BANK_TRANSFER',
      transactionCode: 'NCBA-2025-8812',
      paidAt: '2025-01-15T09:00:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Grace Mwangi',
      status: 'CONFIRMED',
      notes: 'Junior School Term 1 fee paid in full'
    }
  ]
};

export const INITIAL_INVOICES: Record<string, FeeInvoice[]> = {
  'tenant-st-austins': [
    {
      id: 'inv-001',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'INV-STA-2025-001',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      grade: 'Grade 4',
      term: 'TERM_1',
      academicYear: '2025',
      items: [
        { category: 'Tuition Fee', amount: 45000 },
        { category: 'Lunch & Meals', amount: 15000 },
        { category: 'Activity & Sports', amount: 8000 },
        { category: 'Exams & Assessment', amount: 7000 }
      ],
      totalBilled: 75000,
      totalPaid: 75000,
      balance: 0,
      dueDate: '2025-01-15',
      createdAt: '2025-01-02T08:00:00.000Z',
      status: 'PAID'
    },
    {
      id: 'inv-002',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'INV-STA-2025-002',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      grade: 'Grade 4',
      term: 'TERM_1',
      academicYear: '2025',
      items: [
        { category: 'Tuition Fee', amount: 45000 },
        { category: 'Lunch & Meals', amount: 15000 },
        { category: 'Activity & Sports', amount: 8000 },
        { category: 'Exams & Assessment', amount: 7000 }
      ],
      totalBilled: 75000,
      totalPaid: 60000,
      balance: 15000,
      dueDate: '2025-01-15',
      createdAt: '2025-01-02T08:00:00.000Z',
      status: 'PARTIAL'
    },
    {
      id: 'inv-003',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'INV-STA-2025-003',
      studentId: 'stud-004',
      studentName: 'Amani Wairimu Njoroge',
      admissionNo: 'STA-2024-004',
      grade: 'PP1',
      term: 'TERM_1',
      academicYear: '2025',
      items: [
        { category: 'Tuition Fee', amount: 32000 },
        { category: 'Lunch & Meals', amount: 14000 },
        { category: 'Activity & Sports', amount: 5000 },
        { category: 'Exams & Assessment', amount: 4000 }
      ],
      totalBilled: 55000,
      totalPaid: 33000,
      balance: 22000,
      dueDate: '2025-01-15',
      createdAt: '2025-01-02T08:00:00.000Z',
      status: 'PARTIAL'
    }
  ]
};

export const INITIAL_ATTENDANCE: Record<string, AttendanceRecord[]> = {
  'tenant-st-austins': [
    { id: 'att-01', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 4', stream: 'Alpha', studentId: 'stud-001', studentName: 'Ethan Mwenda Mutuma', admissionNo: 'STA-2024-001', status: 'PRESENT', recordedBy: 'James Otieno', recordedAt: '2025-02-28T08:05:00.000Z' },
    { id: 'att-02', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 4', stream: 'Alpha', studentId: 'stud-002', studentName: 'Zuri Nyambura Kariuki', admissionNo: 'STA-2024-002', status: 'PRESENT', recordedBy: 'James Otieno', recordedAt: '2025-02-28T08:05:00.000Z' },
    { id: 'att-03', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 1', stream: 'Alpha', studentId: 'stud-003', studentName: 'Liam Kiprono Cheruiyot', admissionNo: 'STA-2024-003', status: 'PRESENT', recordedBy: 'Michael Mutua', recordedAt: '2025-02-28T08:10:00.000Z' },
    { id: 'att-04', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'PP1', stream: 'Blue', studentId: 'stud-004', studentName: 'Amani Wairimu Njoroge', admissionNo: 'STA-2024-004', status: 'LATE', remarks: 'Arrived at 08:35 AM due to traffic', recordedBy: 'Teacher Brenda', recordedAt: '2025-02-28T08:40:00.000Z' },
    { id: 'att-05', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 7', stream: 'Alpha (Junior)', studentId: 'stud-005', studentName: 'Jayden Omondi Odhiambo', admissionNo: 'STA-2024-005', status: 'PRESENT', recordedBy: 'Sarah Wanjiru', recordedAt: '2025-02-28T08:00:00.000Z' }
  ]
};

export const INITIAL_TIMETABLE: Record<string, TimetableSlot[]> = {
  'tenant-st-austins': [
    { id: 'tt-1', tenantId: 'tenant-st-austins', dayOfWeek: 'Monday', startTime: '08:20', endTime: '09:00', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Mathematical Activities', teacherName: 'James Otieno', room: 'Room C-101' },
    { id: 'tt-2', tenantId: 'tenant-st-austins', dayOfWeek: 'Monday', startTime: '09:00', endTime: '09:40', grade: 'Grade 4', stream: 'Alpha', subjectName: 'English Language Activities', teacherName: 'Sarah Wanjiru', room: 'Room C-101' },
    { id: 'tt-3', tenantId: 'tenant-st-austins', dayOfWeek: 'Monday', startTime: '10:00', endTime: '10:40', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Science and Technology', teacherName: 'James Otieno', room: 'Science Lab' },
    { id: 'tt-4', tenantId: 'tenant-st-austins', dayOfWeek: 'Tuesday', startTime: '08:20', endTime: '09:00', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Kiswahili Lugha', teacherName: 'Agnes Chepngetich', room: 'Room C-101' },
    { id: 'tt-5', tenantId: 'tenant-st-austins', dayOfWeek: 'Wednesday', startTime: '11:00', endTime: '11:40', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Creative Arts & Sports', teacherName: 'Michael Mutua', room: 'Sports Ground' }
  ]
};

export const INITIAL_ASSIGNMENTS: Record<string, Assignment[]> = {
  'tenant-st-austins': [
    {
      id: 'asg-01',
      tenantId: 'tenant-st-austins',
      title: 'Water Filtration Model & Reflection',
      grade: 'Grade 4',
      stream: 'Alpha',
      subjectName: 'Science and Technology',
      instructions: 'Construct a simple sand/gravel water filter using a 2L plastic bottle. Write a 1-page reflection on your observations.',
      assignedDate: '2025-02-24',
      dueDate: '2025-03-03',
      maxMarks: 20,
      teacherName: 'James Otieno',
      status: 'ACTIVE'
    },
    {
      id: 'asg-02',
      tenantId: 'tenant-st-austins',
      title: 'Decimals & Money Problem Set (Exercise 4B)',
      grade: 'Grade 4',
      stream: 'Alpha',
      subjectName: 'Mathematical Activities',
      instructions: 'Complete questions 1 to 15 from Grade 4 CBC Mathematics Learner Book page 68.',
      assignedDate: '2025-02-26',
      dueDate: '2025-02-28',
      maxMarks: 15,
      teacherName: 'James Otieno',
      status: 'ACTIVE'
    },
    {
      id: 'asg-03',
      tenantId: 'tenant-st-austins',
      title: 'Insha ya Wasifu: Mtu Ninayemwiga Maishani',
      grade: 'Grade 4',
      stream: 'Alpha',
      subjectName: 'Kiswahili Lugha',
      instructions: 'Andika insha ya aya nne ukieleza sifa na maadili ya mtu unayempenda na kumwiga.',
      assignedDate: '2025-02-25',
      dueDate: '2025-03-02',
      maxMarks: 20,
      teacherName: 'Agnes Chepngetich',
      status: 'ACTIVE'
    }
  ]
};

export const INITIAL_DISCIPLINE: Record<string, DisciplineIncident[]> = {
  'tenant-st-austins': [
    {
      id: 'disc-01',
      tenantId: 'tenant-st-austins',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      grade: 'Grade 4',
      stream: 'Alpha',
      incidentDate: '2025-02-12',
      title: 'Minor Playground Collision',
      category: 'Other',
      severity: 'MINOR',
      description: 'Accidentally collided with a classmate during football break. Promptly helped peer to school nurse.',
      actionTaken: 'First aid rendered, sportsmanship commended.',
      reportedBy: 'Coach Daniel',
      parentContacted: true,
      status: 'RESOLVED'
    }
  ]
};

export const INITIAL_EVENTS: Record<string, SchoolCalendarEvent[]> = {
  'tenant-st-austins': [
    { id: 'evt-01', tenantId: 'tenant-st-austins', title: 'Mid-Term Break & Academic Progress Review', startDate: '2025-03-05', endDate: '2025-03-09', category: 'HOLIDAY', description: 'School closes for Mid-Term break. Progress reports published.', targetAudience: 'ALL' },
    { id: 'evt-02', tenantId: 'tenant-st-austins', title: 'Annual Inter-House Swimming Gala & Track Meet', startDate: '2025-03-14', endDate: '2025-03-14', category: 'SPORTS', description: 'Sports day for all grades from Playgroup to Grade 9.', targetAudience: 'ALL', venue: 'Aquatic Centre & Main Field' },
    { id: 'evt-03', tenantId: 'tenant-st-austins', title: 'Parent-Teacher Academic Clinic & CBC Portfolio Day', startDate: '2025-03-21', endDate: '2025-03-21', category: 'PARENTS_MEETING', description: 'One-on-one parent conferences to review learner portfolios.', targetAudience: 'PARENTS', venue: 'School Auditorium' }
  ]
};

export const INITIAL_NOTIFICATIONS: Record<string, NotificationBroadcast[]> = {
  'tenant-st-austins': [
    {
      id: 'notif-01',
      tenantId: 'tenant-st-austins',
      title: 'Reminder: Mid-Term Fee Clearance & Re-opening Dates',
      message: 'Dear Parent/Guardian, as we approach Mid-Term break on March 5th, kindly ensure any outstanding fee balances are settled via Paybill 400200. Thank you for your continued partnership.',
      channel: 'SMS',
      targetAudience: 'FEE_DEBTORS',
      targetFilter: 'Students with balance > KES 5,000',
      recipientCount: 42,
      sentAt: '2025-02-27T10:00:00.000Z',
      sentBy: 'Grace Mwangi (Senior Bursar)',
      status: 'SENT'
    },
    {
      id: 'notif-02',
      tenantId: 'tenant-st-austins',
      title: 'CBC Junior School STEM Project Exhibition Invitations',
      message: "Join us this Friday at 2:00 PM for the Grade 7 & 8 Robotic and Agricultural CBC Exhibition. All parents are warmly invited.",
      channel: 'SMS',
      targetAudience: 'ALL_PARENTS',
      recipientCount: 480,
      sentAt: '2025-02-24T14:30:00.000Z',
      sentBy: 'Sarah Wanjiru (Principal)',
      status: 'SENT'
    }
  ]
};

export const INITIAL_AUDIT_LOGS: Record<string, AuditLog[]> = {
  'tenant-st-austins': [
    {
      id: 'log-01',
      tenantId: 'tenant-st-austins',
      userId: 'user-superadmin-01',
      userEmail: 'superadmin@davetech.io',
      action: 'TENANT_PROVISIONED',
      details: "Provisioned enterprise workspace for St. Austin's Academy & Junior School (STA-SCH)",
      category: 'SETTINGS',
      timestamp: '2024-01-10T08:00:00.000Z'
    },
    {
      id: 'log-02',
      tenantId: 'tenant-st-austins',
      userId: 'user-bursar-03',
      userEmail: 'grace.mwangi@staustins.ac.ke',
      action: 'PAYMENT_RECEIPTED',
      details: 'Recorded payment of KES 75,000 for Ethan Mwenda Mutuma (STA-2024-001) via M-PESA',
      category: 'FINANCE',
      timestamp: '2025-01-08T10:24:00.000Z'
    },
    {
      id: 'log-03',
      tenantId: 'tenant-st-austins',
      userId: 'user-principal-02',
      userEmail: 'sarah.wanjiru@staustins.ac.ke',
      action: 'STUDENT_ADMITTED',
      details: 'Admitted new learner Zuri Nyambura Kariuki (STA-2024-002) to Grade 4 Alpha',
      category: 'ADMISSION',
      timestamp: '2024-01-08T08:15:00.000Z'
    },
    {
      id: 'log-04',
      tenantId: 'tenant-st-austins',
      userId: 'user-head-teacher-04',
      userEmail: 'james.otieno@staustins.ac.ke',
      action: 'CBC_ASSESSMENT_RECORDED',
      details: 'Entered Mid-Term Mathematics score (92% - EE) for Grade 4 Alpha learners',
      category: 'ACADEMICS',
      timestamp: '2025-02-18T15:30:00.000Z'
    }
  ]
};

// ==========================================
// COLLEGE / HIGHER EDUCATION DATA
// ==========================================
export const INITIAL_COLLEGE_DEPARTMENTS: Record<string, CollegeDepartment[]> = {
  'tenant-kca-college': [
    {
      id: 'dept-01',
      tenantId: 'tenant-kca-college',
      code: 'CS-IT',
      name: 'Department of Computing & Information Technology',
      headOfDepartment: 'Dr. Kennedy Kiprop',
      facultyCount: 14,
      courseCount: 6,
      building: 'Technology Block A'
    },
    {
      id: 'dept-02',
      tenantId: 'tenant-kca-college',
      code: 'BUS-ACC',
      name: 'School of Business, Finance & Economics',
      headOfDepartment: 'Prof. Florence Achieng',
      facultyCount: 18,
      courseCount: 8,
      building: 'Towers Wing B'
    },
    {
      id: 'dept-03',
      tenantId: 'tenant-kca-college',
      code: 'ENG-TECH',
      name: 'School of Electrical & Telecommunications Engineering',
      headOfDepartment: 'Eng. Samuel Githae',
      facultyCount: 12,
      courseCount: 4,
      building: 'Engineering Complex'
    }
  ]
};

export const INITIAL_COLLEGE_COURSES: Record<string, CollegeCourse[]> = {
  'tenant-kca-college': [
    {
      id: 'course-01',
      tenantId: 'tenant-kca-college',
      code: 'BCS-201',
      title: 'Bachelor of Science in Computer Science & AI',
      departmentId: 'dept-01',
      departmentName: 'Department of Computing & Information Technology',
      level: 'DEGREE',
      durationSemesters: 8,
      tuitionPerSemester: 85000,
      enrolledStudentsCount: 210,
      units: [
        { unitCode: 'CS101', unitTitle: 'Data Structures & Algorithms', creditHours: 3 },
        { unitCode: 'CS102', unitTitle: 'Database Systems & Cloud Architectures', creditHours: 3 },
        { unitCode: 'CS103', unitTitle: 'Full-Stack Software Engineering', creditHours: 4 }
      ]
    },
    {
      id: 'course-02',
      tenantId: 'tenant-kca-college',
      code: 'DBM-101',
      title: 'Diploma in Business Management & ERP Systems',
      departmentId: 'dept-02',
      departmentName: 'School of Business, Finance & Economics',
      level: 'DIPLOMA',
      durationSemesters: 4,
      tuitionPerSemester: 48000,
      enrolledStudentsCount: 165,
      units: [
        { unitCode: 'BM101', unitTitle: 'Principles of Modern Management', creditHours: 3 },
        { unitCode: 'BM102', unitTitle: 'Financial Accounting & Taxation', creditHours: 3 }
      ]
    },
    {
      id: 'course-03',
      tenantId: 'tenant-kca-college',
      code: 'CNA-001',
      title: 'Certificate in Cybersecurity & Network Administration',
      departmentId: 'dept-01',
      departmentName: 'Department of Computing & Information Technology',
      level: 'CERTIFICATE',
      durationSemesters: 2,
      tuitionPerSemester: 35000,
      enrolledStudentsCount: 95,
      units: [
        { unitCode: 'CY101', unitTitle: 'Network Security Fundamentals', creditHours: 3 },
        { unitCode: 'CY102', unitTitle: 'Ethical Hacking & Incident Response', creditHours: 3 }
      ]
    }
  ]
};

export const INITIAL_COLLEGE_STUDENTS: Record<string, CollegeStudent[]> = {
  'tenant-kca-college': [
    {
      id: 'cstud-01',
      tenantId: 'tenant-kca-college',
      regNo: 'KCA/BCS/2023/0482',
      fullName: 'Brian Kipkorir Chesire',
      email: 'brian.chesire@students.kcacollege.ac.ke',
      phone: '+254 711 223 344',
      courseId: 'course-01',
      courseName: 'Bachelor of Science in Computer Science & AI',
      departmentName: 'Computing & IT',
      yearOfStudy: 2,
      semester: 1,
      status: 'ACTIVE',
      feeBalance: 15000,
      totalBilled: 170000,
      totalPaid: 155000,
      hostelRoom: 'Block B - Room 204',
      admissionDate: '2023-09-04'
    },
    {
      id: 'cstud-02',
      tenantId: 'tenant-kca-college',
      regNo: 'KCA/DBM/2024/0119',
      fullName: 'Mercy Auma Omondi',
      email: 'mercy.auma@students.kcacollege.ac.ke',
      phone: '+254 722 334 455',
      courseId: 'course-02',
      courseName: 'Diploma in Business Management & ERP Systems',
      departmentName: 'Business & Finance',
      yearOfStudy: 1,
      semester: 2,
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 96000,
      totalPaid: 96000,
      hostelRoom: 'Hall A - Room 102',
      admissionDate: '2024-01-15'
    },
    {
      id: 'cstud-03',
      tenantId: 'tenant-kca-college',
      regNo: 'KCA/BCS/2022/0089',
      fullName: 'Kelvin Mwangi Nderitu',
      email: 'kelvin.nderitu@students.kcacollege.ac.ke',
      phone: '+254 733 998 877',
      courseId: 'course-01',
      courseName: 'Bachelor of Science in Computer Science & AI',
      departmentName: 'Computing & IT',
      yearOfStudy: 3,
      semester: 1,
      status: 'ACTIVE',
      feeBalance: 32000,
      totalBilled: 255000,
      totalPaid: 223000,
      admissionDate: '2022-09-05'
    }
  ]
};

export const INITIAL_LIBRARY_BOOKS: Record<string, LibraryBook[]> = {
  'tenant-kca-college': [
    {
      id: 'lib-01',
      tenantId: 'tenant-kca-college',
      isbn: '978-0131103627',
      title: 'The C Programming Language (2nd Edition)',
      author: 'Brian W. Kernighan, Dennis M. Ritchie',
      category: 'Computer Science',
      totalCopies: 12,
      availableCopies: 8,
      shelfLocation: 'Stack CS-04',
      status: 'AVAILABLE'
    },
    {
      id: 'lib-02',
      tenantId: 'tenant-kca-college',
      isbn: '978-0262033848',
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      category: 'Computer Science',
      totalCopies: 8,
      availableCopies: 2,
      shelfLocation: 'Stack CS-08',
      status: 'LOW_STOCK'
    },
    {
      id: 'lib-03',
      tenantId: 'tenant-kca-college',
      isbn: '978-0134444390',
      title: 'Financial Accounting & Reporting in Africa',
      author: 'David Mwangi, CFA',
      category: 'Business & Finance',
      totalCopies: 15,
      availableCopies: 11,
      shelfLocation: 'Stack BF-02',
      status: 'AVAILABLE'
    }
  ]
};

export const INITIAL_HOSTEL_ROOMS: Record<string, HostelRoom[]> = {
  'tenant-kca-college': [
    {
      id: 'hostel-01',
      tenantId: 'tenant-kca-college',
      roomNumber: 'B-204',
      blockName: 'Hall B (Kilimanjaro)',
      gender: 'Male',
      capacity: 4,
      occupied: 3,
      feePerSemester: 18000,
      status: 'AVAILABLE'
    },
    {
      id: 'hostel-02',
      tenantId: 'tenant-kca-college',
      roomNumber: 'A-102',
      blockName: 'Hall A (Mount Kenya)',
      gender: 'Female',
      capacity: 2,
      occupied: 2,
      feePerSemester: 24000,
      status: 'FULL'
    },
    {
      id: 'hostel-03',
      tenantId: 'tenant-kca-college',
      roomNumber: 'B-301',
      blockName: 'Hall B (Kilimanjaro)',
      gender: 'Male',
      capacity: 4,
      occupied: 1,
      feePerSemester: 18000,
      status: 'AVAILABLE'
    }
  ]
};

// ==========================================
// RETAIL & WHOLESALE BUSINESS DATA
// ==========================================
export const INITIAL_RETAIL_PRODUCTS: Record<string, RetailProduct[]> = {
  'tenant-apex-retail': [
    {
      id: 'prod-01',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-RICE-25KG',
      barcode: '616110012345',
      name: 'Pishori Pure Grain Rice (25kg Bag)',
      category: 'Grains & Cereals',
      costPrice: 4200,
      sellingPrice: 5200,
      wholesalePrice: 4700,
      currentStock: 48,
      minStockAlert: 15,
      unit: 'BAG',
      supplierName: 'Mwea Grain Millers Ltd',
      status: 'IN_STOCK'
    },
    {
      id: 'prod-02',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-OIL-20L',
      barcode: '616110054321',
      name: 'Golden Fry Cooking Oil (20 Litres Jerrycan)',
      category: 'Edible Oils',
      costPrice: 3850,
      sellingPrice: 4600,
      wholesalePrice: 4200,
      currentStock: 6,
      minStockAlert: 10,
      unit: 'LTR',
      supplierName: 'Bidco Africa Industries',
      status: 'LOW_STOCK'
    },
    {
      id: 'prod-03',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-SUGAR-50KG',
      barcode: '616110098765',
      name: 'Kabras Premium Refined White Sugar (50kg Bag)',
      category: 'Sugar & Sweeteners',
      costPrice: 6100,
      sellingPrice: 7200,
      wholesalePrice: 6700,
      currentStock: 32,
      minStockAlert: 10,
      unit: 'BAG',
      supplierName: 'West Kenya Sugar Co.',
      status: 'IN_STOCK'
    },
    {
      id: 'prod-04',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-FLOUR-12X2KG',
      barcode: '616110065432',
      name: 'Unga Pembe Premium Maize Flour (Bale 12x2kg)',
      category: 'Flour & Bakery',
      costPrice: 1950,
      sellingPrice: 2400,
      wholesalePrice: 2150,
      currentStock: 80,
      minStockAlert: 20,
      unit: 'BOX',
      supplierName: 'Mombasa Grain Millers',
      status: 'IN_STOCK'
    },
    {
      id: 'prod-05',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-SALT-40X500G',
      barcode: '616110033221',
      name: 'Kensalt Pure Iodated Sea Salt (Carton 40x500g)',
      category: 'Seasonings',
      costPrice: 850,
      sellingPrice: 1200,
      wholesalePrice: 1000,
      currentStock: 2,
      minStockAlert: 10,
      unit: 'BOX',
      supplierName: 'Krystalline Salt Ltd',
      status: 'LOW_STOCK'
    }
  ]
};

export const INITIAL_RETAIL_SALES: Record<string, RetailSale[]> = {
  'tenant-apex-retail': [
    {
      id: 'sale-01',
      tenantId: 'tenant-apex-retail',
      receiptNumber: 'REC-AWD-2025-0891',
      customerName: 'Mama Lucy Supermarket & Retail',
      customerPhone: '+254 722 555 888',
      saleType: 'WHOLESALE',
      items: [
        { productId: 'prod-01', sku: 'SKU-RICE-25KG', productName: 'Pishori Pure Grain Rice (25kg Bag)', quantity: 5, unitPrice: 4700, discount: 500, lineTotal: 23000 },
        { productId: 'prod-03', sku: 'SKU-SUGAR-50KG', productName: 'Kabras Premium Refined White Sugar (50kg Bag)', quantity: 3, unitPrice: 6700, discount: 0, lineTotal: 20100 }
      ],
      subtotal: 43600,
      taxAmount: 0,
      discountAmount: 500,
      totalAmount: 43100,
      amountPaid: 43100,
      changeDue: 0,
      paymentMethod: 'M-PESA',
      mpesaRef: 'TIK89201LK',
      cashierName: 'Hassan Noor',
      createdAt: '2025-02-28T11:42:00.000Z',
      status: 'COMPLETED'
    },
    {
      id: 'sale-02',
      tenantId: 'tenant-apex-retail',
      receiptNumber: 'REC-AWD-2025-0892',
      customerName: 'Quick Retail Walk-In',
      saleType: 'RETAIL',
      items: [
        { productId: 'prod-04', sku: 'SKU-FLOUR-12X2KG', productName: 'Unga Pembe Premium Maize Flour (Bale 12x2kg)', quantity: 2, unitPrice: 2400, discount: 0, lineTotal: 4800 },
        { productId: 'prod-02', sku: 'SKU-OIL-20L', productName: 'Golden Fry Cooking Oil (20 Litres)', quantity: 1, unitPrice: 4600, discount: 0, lineTotal: 4600 }
      ],
      subtotal: 9400,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 9400,
      amountPaid: 10000,
      changeDue: 600,
      paymentMethod: 'CASH',
      cashierName: 'Hassan Noor',
      createdAt: '2025-02-28T14:15:00.000Z',
      status: 'COMPLETED'
    }
  ]
};

export const INITIAL_RETAIL_SUPPLIERS: Record<string, RetailSupplier[]> = {
  'tenant-apex-retail': [
    {
      id: 'supp-01',
      tenantId: 'tenant-apex-retail',
      name: 'Mwea Grain Millers Ltd',
      company: 'Mwea Millers Distributorship',
      phone: '+254 700 321 654',
      email: 'orders@mweagrain.co.ke',
      address: 'Industrial Road, Embu, Kenya',
      categoriesSupplied: ['Grains & Cereals'],
      balanceOwed: 140000,
      totalPurchased: 1250000,
      status: 'ACTIVE'
    },
    {
      id: 'supp-02',
      tenantId: 'tenant-apex-retail',
      name: 'Bidco Africa Industries',
      company: 'Bidco Africa FMCG',
      phone: '+254 722 100 200',
      email: 'sales@bidco-africa.com',
      address: 'Garissa Road, Thika, Kenya',
      categoriesSupplied: ['Edible Oils', 'Soaps & Detergents'],
      balanceOwed: 0,
      totalPurchased: 2800000,
      status: 'ACTIVE'
    }
  ]
};

export const INITIAL_RETAIL_CUSTOMERS: Record<string, RetailCustomer[]> = {
  'tenant-apex-retail': [
    {
      id: 'cust-01',
      tenantId: 'tenant-apex-retail',
      name: 'Mama Lucy Supermarket & Retail',
      phone: '+254 722 555 888',
      email: 'lucy.retail@gmail.com',
      type: 'WHOLESALE',
      creditLimit: 150000,
      currentCredit: 25000,
      totalSpend: 890000,
      lastPurchaseDate: '2025-02-28'
    },
    {
      id: 'cust-02',
      tenantId: 'tenant-apex-retail',
      name: 'Changamwe General Stores',
      phone: '+254 733 667 788',
      email: 'changamwestores@yahoo.com',
      type: 'CREDIT_ACCOUNT',
      creditLimit: 200000,
      currentCredit: 68000,
      totalSpend: 1450000,
      lastPurchaseDate: '2025-02-26'
    }
  ]
};

// ==========================================
// HOSPITAL & HEALTHCARE DATA
// ==========================================
export const INITIAL_HOSPITAL_PATIENTS: Record<string, HospitalPatient[]> = {
  'tenant-greenvale-hospital': [
    {
      id: 'pat-01',
      tenantId: 'tenant-greenvale-hospital',
      patientNo: 'GMH-PAT-2025-0412',
      fullName: 'Geoffrey Ochieng Odoyo',
      gender: 'Male',
      age: 42,
      phone: '+254 714 567 890',
      emergencyContact: '+254 722 456 789 (Wife)',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      lastVisitDate: '2025-02-28',
      status: 'DOCTOR_QUEUE'
    },
    {
      id: 'pat-02',
      tenantId: 'tenant-greenvale-hospital',
      patientNo: 'GMH-PAT-2025-0413',
      fullName: 'Beatrice Akinyi Awuor',
      gender: 'Female',
      age: 29,
      phone: '+254 723 890 123',
      emergencyContact: '+254 700 890 123 (Mother)',
      bloodGroup: 'B+',
      allergies: 'None known',
      lastVisitDate: '2025-02-28',
      status: 'PHARMACY'
    }
  ]
};

export const INITIAL_MEDICAL_CONSULTATIONS: Record<string, MedicalConsultation[]> = {
  'tenant-greenvale-hospital': [
    {
      id: 'cons-01',
      tenantId: 'tenant-greenvale-hospital',
      patientId: 'pat-02',
      patientName: 'Beatrice Akinyi Awuor',
      doctorName: 'Dr. Evelyn Wanjiku (Consultant)',
      symptoms: 'High fever, body chills, headache, fatigue for 3 days',
      diagnosis: 'Plasmodium Falciparum (Malaria Positive - Rapid Kit)',
      prescription: 'Artemether-Lumefantrine (AL) 20/120mg tabs + Paracetamol 500mg TDS',
      notes: 'Advised rest, adequate hydration, return if symptoms persist after 3 days.',
      feeAmount: 2500,
      date: '2025-02-28T10:30:00.000Z',
      status: 'COMPLETED'
    }
  ]
};

export const INITIAL_PHARMACY_ITEMS: Record<string, PharmacyItem[]> = {
  'tenant-greenvale-hospital': [
    {
      id: 'pharm-01',
      tenantId: 'tenant-greenvale-hospital',
      code: 'MED-AL-24S',
      name: 'Coartem (Artemether/Lumefantrine 20/120mg) 24s',
      category: 'Antibiotic',
      dosage: '6 doses over 3 days',
      stockQty: 85,
      unitPrice: 650,
      expiryDate: '2026-11-30',
      status: 'IN_STOCK'
    },
    {
      id: 'pharm-02',
      tenantId: 'tenant-greenvale-hospital',
      code: 'MED-PARA-100S',
      name: 'Panadol Paracetamol 500mg Pack (100 Tabs)',
      category: 'Analgesic',
      dosage: '1-2 tablets 8 hourly',
      stockQty: 18,
      unitPrice: 350,
      expiryDate: '2027-04-15',
      status: 'IN_STOCK'
    },
    {
      id: 'pharm-03',
      tenantId: 'tenant-greenvale-hospital',
      code: 'MED-AMOX-500MG',
      name: 'Amoxicillin Capsules 500mg (Blister 20s)',
      category: 'Antibiotic',
      dosage: '500mg TDS for 5 days',
      stockQty: 4,
      unitPrice: 500,
      expiryDate: '2026-08-31',
      status: 'LOW_STOCK'
    }
  ]
};
