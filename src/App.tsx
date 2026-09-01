import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SuperAdminDashboard } from './pages/SuperAdmin/SuperAdminDashboard';
import { SchoolDashboard } from './pages/PrimarySchool/SchoolDashboard';
import { StudentManagement } from './pages/PrimarySchool/StudentManagement';
import { FeeManagement } from './pages/PrimarySchool/FeeManagement';
import { CBCAcademics } from './pages/PrimarySchool/CBCAcademics';
import { AttendanceTracker } from './pages/PrimarySchool/AttendanceTracker';
import { StaffManagement } from './pages/PrimarySchool/StaffManagement';
import { ClassesStreams } from './pages/PrimarySchool/ClassesStreams';
import { TimetableAssignments } from './pages/PrimarySchool/TimetableAssignments';
import { DisciplineCalendar } from './pages/PrimarySchool/DisciplineCalendar';
import { SMSBroadcasts } from './pages/PrimarySchool/SMSBroadcasts';
import { ReportCardGenerator } from './pages/PrimarySchool/ReportCardGenerator';
import { SchoolSettings } from './pages/PrimarySchool/SchoolSettings';
import { CollegeManagement } from './pages/College/CollegeManagement';
import { TheologyManagement } from './pages/College/TheologyManagement';
import { RetailPOSInventory } from './pages/Retail/RetailPOSInventory';
import { HospitalManagement } from './pages/Hospital/HospitalManagement';
import { LogoUploader } from './components/LogoUploader';
import { Student, TenantType, TenantPlan } from './types';

const MainLayout: React.FC = () => {
  const { user, tenant, isPlatformMode, createTenant, subscriptionTiers } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (isPlatformMode || user?.role === 'SUPER_ADMIN') return 'super-admin-overview';
    if (tenant?.type === 'COLLEGE' || tenant?.type === 'UNIVERSITY') return 'college-overview';
    if (tenant?.type === 'RETAIL' || tenant?.type === 'BUSINESS' || tenant?.type === 'WHOLESALE') return 'retail-pos';
    if (tenant?.type === 'HOSPITAL') return 'hospital-overview';
    return 'school-overview';
  });

  // Automatically update tab when tenant type or platform mode changes
  useEffect(() => {
    if (isPlatformMode) {
      if (!currentTab.startsWith('super-admin-')) {
        setCurrentTab('super-admin-overview');
      }
      return;
    }
    if (tenant?.type === 'COLLEGE' || tenant?.type === 'UNIVERSITY') {
      if (!currentTab.startsWith('college-')) setCurrentTab('college-overview');
    } else if (tenant?.type === 'RETAIL' || tenant?.type === 'BUSINESS' || tenant?.type === 'WHOLESALE') {
      if (!currentTab.startsWith('retail-')) setCurrentTab('retail-pos');
    } else if (tenant?.type === 'HOSPITAL') {
      if (!currentTab.startsWith('hospital-')) setCurrentTab('hospital-overview');
    } else if (tenant?.type === 'PRIMARY_SCHOOL' || tenant?.type === 'SECONDARY_SCHOOL') {
      if (!currentTab.startsWith('school-')) setCurrentTab('school-overview');
    }
  }, [isPlatformMode, tenant?.type, tenant?.id]);

  // Cross-page parameters
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [selectedStudentForSMS, setSelectedStudentForSMS] = useState<Student | null>(null);

  // New Tenant Modal State
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCode, setNewTenantCode] = useState('');
  const [newTenantLogoUrl, setNewTenantLogoUrl] = useState('');
  const [newTenantSubdomain, setNewTenantSubdomain] = useState('');
  const [isSubdomainManual, setIsSubdomainManual] = useState(false);
  const [newTenantType, setNewTenantType] = useState<TenantType>('PRIMARY_SCHOOL');
  const [newTenantPlan, setNewTenantPlan] = useState<TenantPlan>('PREMIUM');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('+254 700 000 000');
  const [newTenantAddress, setNewTenantAddress] = useState('Nairobi, Kenya');

  const handleTenantNameChange = (val: string) => {
    setNewTenantName(val);
    if (!isSubdomainManual) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
      setNewTenantSubdomain(slug);
    }
  };

  const handleSubdomainChange = (val: string) => {
    setIsSubdomainManual(true);
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setNewTenantSubdomain(clean);
  };

  const handleOpenPaymentForStudent = (student: Student) => {
    setSelectedStudentForPayment(student);
    setCurrentTab('school-fees');
  };

  const handleOpenReportForStudent = (student: Student) => {
    setSelectedStudentForReport(student);
    setCurrentTab('school-reports');
  };

  const handleOpenSMSForDebtor = (student: Student) => {
    setSelectedStudentForSMS(student);
    setCurrentTab('school-sms');
  };

  const handleCreateTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantCode) return;

    let defaultModules = [
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
      'CALENDAR',
      'SMS_NOTIFICATIONS',
      'REPORTS'
    ];

    if (newTenantType === 'RETAIL' || newTenantType === 'BUSINESS') {
      defaultModules = ['RETAIL_POS', 'INVENTORY', 'STAFF', 'REPORTS', 'FEES_FINANCE', 'SMS_NOTIFICATIONS'];
    } else if (newTenantType === 'HOSPITAL') {
      defaultModules = ['HOSPITAL_CLINIC', 'PHARMACY', 'STAFF', 'FEES_FINANCE', 'REPORTS', 'SMS_NOTIFICATIONS'];
    } else if (newTenantType === 'COLLEGE' || newTenantType === 'UNIVERSITY') {
      defaultModules = ['STUDENTS', 'STAFF', 'FEES_FINANCE', 'LIBRARY', 'HOSTEL', 'REPORTS', 'SMS_NOTIFICATIONS'];
    }

    const finalSubdomain = newTenantSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || newTenantName.toLowerCase().replace(/[^a-z0-9]/g, '');

    await createTenant({
      name: newTenantName,
      code: newTenantCode.toUpperCase(),
      subdomain: finalSubdomain,
      logoUrl: newTenantLogoUrl.trim() || undefined,
      dnsStatus: 'CONFIGURED',
      type: newTenantType,
      plan: newTenantPlan,
      status: 'ACTIVE',
      contactEmail: newTenantEmail || `admin@${newTenantCode.toLowerCase()}.ac.ke`,
      phone: newTenantPhone,
      address: newTenantAddress,
      currency: 'KES',
      currentAcademicYear: '2025',
      currentTerm: 'TERM_1',
      motto: 'Excellence and Integrity',
      modules: defaultModules
    });

    setShowCreateTenantModal(false);
    setNewTenantName('');
    setNewTenantCode('');
    setNewTenantLogoUrl('');
    setNewTenantSubdomain('');
    setIsSubdomainManual(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Header with Multi-Tenant Persona & Org Switcher */}
      <Header
        onOpenCreateTenant={() => setShowCreateTenantModal(true)}
        onNavigateTab={setCurrentTab}
        onOpenNewAdmission={() => setCurrentTab('school-students')}
        onOpenRecordPayment={() => setCurrentTab('school-fees')}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Super Admin Console Views */}
            {user?.role === 'SUPER_ADMIN' && currentTab.startsWith('super-admin') && (
              <SuperAdminDashboard
                currentTab={currentTab}
                onOpenCreateTenant={() => setShowCreateTenantModal(true)}
              />
            )}

            {/* College / University Views */}
            {currentTab.startsWith('college-') && (
              <CollegeManagement currentTab={currentTab} />
            )}

            {/* Theology & Divinity Seminary Views */}
            {currentTab.startsWith('theology-') && (
              <TheologyManagement currentTab={currentTab} />
            )}

            {/* Retail / Wholesale Views */}
            {currentTab.startsWith('retail-') && (
              <RetailPOSInventory currentTab={currentTab} />
            )}

            {/* Hospital / Clinic Views */}
            {currentTab.startsWith('hospital-') && (
              <HospitalManagement currentTab={currentTab} />
            )}

            {/* Primary & Secondary School ERP Views */}
            {currentTab === 'school-overview' && (
              <SchoolDashboard
                onNavigate={setCurrentTab}
                onOpenAdmission={() => setCurrentTab('school-students')}
                onOpenRecordPayment={() => setCurrentTab('school-fees')}
              />
            )}

            {currentTab === 'school-students' && (
              <StudentManagement
                onOpenRecordPaymentForStudent={handleOpenPaymentForStudent}
                onGenerateReportForStudent={handleOpenReportForStudent}
              />
            )}

            {currentTab === 'school-fees' && (
              <FeeManagement
                initialStudentForPayment={selectedStudentForPayment}
                onClearInitialStudent={() => setSelectedStudentForPayment(null)}
                onSendSmsToDebtor={handleOpenSMSForDebtor}
              />
            )}

            {currentTab === 'school-cbc' && (
              <CBCAcademics />
            )}

            {currentTab === 'school-assessments' && (
              <CBCAcademics />
            )}

            {currentTab === 'school-attendance' && (
              <AttendanceTracker />
            )}

            {currentTab === 'school-staff' && (
              <StaffManagement />
            )}

            {currentTab === 'school-classes' && (
              <ClassesStreams />
            )}

            {currentTab === 'school-timetable' && (
              <TimetableAssignments />
            )}

            {currentTab === 'school-assignments' && (
              <TimetableAssignments />
            )}

            {currentTab === 'school-discipline' && (
              <DisciplineCalendar />
            )}

            {currentTab === 'school-calendar' && (
              <DisciplineCalendar />
            )}

            {currentTab === 'school-sms' && (
              <SMSBroadcasts initialDebtorStudent={selectedStudentForSMS} />
            )}

            {currentTab === 'school-reports' && (
              <ReportCardGenerator selectedStudentFromNav={selectedStudentForReport} />
            )}

            {currentTab === 'school-settings' && (
              <SchoolSettings />
            )}
          </div>
        </main>
      </div>

      {/* Super Admin Provision Tenant Modal */}
      {showCreateTenantModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Provision New Tenant</h3>
                <p className="text-xs text-slate-500">Configure dedicated database scope and modules</p>
              </div>
              <button
                onClick={() => setShowCreateTenantModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenantSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Riara Primary School"
                  value={newTenantName}
                  onChange={(e) => handleTenantNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Logo / Crest Uploader */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <LogoUploader
                  currentLogoUrl={newTenantLogoUrl}
                  onLogoChange={setNewTenantLogoUrl}
                  entityName={newTenantName || 'New Organization'}
                  label="Organization Logo / Crest"
                  compact={true}
                />
              </div>

              {/* Assigned Subdomain on Davetech.co.ke */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-indigo-950 text-[11px]">
                    Assigned Subdomain (Davetech.co.ke) *
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    SSL Wildcard Ready
                  </span>
                </div>
                <div className="flex items-center rounded-xl bg-white border border-indigo-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    type="text"
                    required
                    placeholder="e.g. riara"
                    value={newTenantSubdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono font-semibold text-slate-800 focus:outline-none lowercase"
                  />
                  <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-600">
                    .davetech.co.ke
                  </span>
                </div>
                <p className="text-[10px] text-indigo-700 flex items-center space-x-1">
                  <span>Portal URL:</span>
                  <span className="font-mono font-bold underline">
                    https://{newTenantSubdomain || 'your-org'}.davetech.co.ke
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenant Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RIARA"
                    value={newTenantCode}
                    onChange={(e) => setNewTenantCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization Type</label>
                  <select
                    value={newTenantType}
                    onChange={(e) => setNewTenantType(e.target.value as TenantType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="PRIMARY_SCHOOL">Primary School</option>
                    <option value="SECONDARY_SCHOOL">Secondary School</option>
                    <option value="COLLEGE">College / University</option>
                    <option value="RETAIL">Retail / Shop</option>
                    <option value="BUSINESS">Wholesale / Business</option>
                    <option value="HOSPITAL">Hospital / Clinic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subscription Plan</label>
                  <select
                    value={newTenantPlan}
                    onChange={(e) => setNewTenantPlan(e.target.value as TenantPlan)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-bold text-indigo-700"
                  >
                    {(subscriptionTiers && subscriptionTiers.length > 0 ? subscriptionTiers : [
                      { id: 'BASIC', name: 'Basic Starter', priceMonthly: 25000, currency: 'KES' },
                      { id: 'PREMIUM', name: 'Premium Growth', priceMonthly: 55000, currency: 'KES' },
                      { id: 'ENTERPRISE', name: 'Enterprise Campus', priceMonthly: 120000, currency: 'KES' }
                    ]).map((tier: any) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.id} — {tier.currency || 'KES'} {tier.priceMonthly.toLocaleString()}/mo ({tier.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={newTenantPhone}
                    onChange={(e) => setNewTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  placeholder="admin@school.ac.ke"
                  value={newTenantEmail}
                  onChange={(e) => setNewTenantEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Campus Address</label>
                <input
                  type="text"
                  value={newTenantAddress}
                  onChange={(e) => setNewTenantAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTenantModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile & Tablet Fixed Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onOpenSearch={() => {
          const btn = document.getElementById('global-search-trigger');
          btn?.click();
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
