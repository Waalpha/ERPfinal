import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Users,
  CreditCard,
  History,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Trash2,
  Check,
  Globe,
  Copy,
  Edit2,
  Cloud,
  Database,
  RefreshCw
} from 'lucide-react';
import { Tenant, TenantPlan, TenantStatus, MAIN_DOMAIN } from '../../types';
import { LogoUploader } from '../../components/LogoUploader';

interface SuperAdminDashboardProps {
  currentTab: string;
  onOpenCreateTenant: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  currentTab,
  onOpenCreateTenant
}) => {
  const {
    allTenants,
    allPlatformUsers,
    updateTenant,
    updateTenantStatus,
    updateTenantPlan,
    toggleTenantModule,
    deleteTenant,
    switchTenantAsSuperAdmin,
    auditLogs,
    createPlatformUser,
    toggleUserActiveStatus,
    updatePlatformUserRole,
    isSyncingFirestore,
    lastFirestoreSyncTime,
    firebaseProjectId,
    firestoreDatabaseName,
    syncAllDataToFirestore
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTenantForModules, setSelectedTenantForModules] = useState<Tenant | null>(null);
  const [editingSubdomainTenant, setEditingSubdomainTenant] = useState<Tenant | null>(null);
  const [editSubdomainVal, setEditSubdomainVal] = useState('');
  const [editCustomDomainVal, setEditCustomDomainVal] = useState('');
  const [editLogoUrlVal, setEditLogoUrlVal] = useState('');
  const [copiedTenantId, setCopiedTenantId] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handlePushAllToCloud = async () => {
    setSyncStatusMsg('Pushing all tenant entities and user collections to Cloud Firestore...');
    const result = await syncAllDataToFirestore();
    if (result.success) {
      setSyncStatusMsg(`Successfully synchronized ${result.count} records with Cloud Firestore project (${firebaseProjectId})`);
    } else {
      setSyncStatusMsg(`Sync error: ${result.error}`);
    }
    setTimeout(() => setSyncStatusMsg(null), 6000);
  };

  const handleCopySubdomain = (t: Tenant) => {
    const slug = t.subdomain || t.code.toLowerCase();
    const url = `https://${slug}.${MAIN_DOMAIN.toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setCopiedTenantId(t.id);
    setTimeout(() => setCopiedTenantId(null), 2000);
  };

  const openEditSubdomain = (t: Tenant) => {
    setEditingSubdomainTenant(t);
    setEditSubdomainVal(t.subdomain || t.code.toLowerCase());
    setEditCustomDomainVal(t.customDomain || '');
    setEditLogoUrlVal(t.logoUrl || '');
  };

  const handleSaveSubdomainEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubdomainTenant) return;
    const cleanSub = editSubdomainVal.toLowerCase().replace(/[^a-z0-9-]/g, '') || editingSubdomainTenant.code.toLowerCase();
    await updateTenant(editingSubdomainTenant.id, {
      subdomain: cleanSub,
      customDomain: editCustomDomainVal.trim().toLowerCase() || undefined,
      logoUrl: editLogoUrlVal.trim() || undefined,
      dnsStatus: 'CONFIGURED'
    });
    setEditingSubdomainTenant(null);
  };

  // Quick user creation state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'TENANT_ADMIN' | 'ACCOUNTANT' | 'TEACHER' | 'MANAGER' | 'CASHIER'>('TENANT_ADMIN');
  const [newUserTenantId, setNewUserTenantId] = useState(allTenants[0]?.id || '');

  // Calculate platform KPIs
  const totalTenants = allTenants.length;
  const activeTenants = allTenants.filter(t => t.status === 'ACTIVE').length;
  const totalUsers = allPlatformUsers.length;
  const estimatedStudents = allTenants.reduce((sum, t) => sum + (t.stats?.studentCount || 0), 0);

  const planPricing = {
    BASIC: 25000,
    PREMIUM: 55000,
    ENTERPRISE: 120000
  };

  const estimatedMonthlyMRR = allTenants.reduce((sum, t) => sum + (planPricing[t.plan] || 25000), 0);

  const filteredTenants = allTenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const allAvailableModules = [
    { id: 'STUDENTS', name: 'Learner & Student Admissions' },
    { id: 'STAFF', name: 'Faculty & HR Management' },
    { id: 'CLASSES', name: 'Classes, Streams & Departments' },
    { id: 'CBC_ACADEMICS', name: 'CBC Learning Areas & Curricula' },
    { id: 'ASSESSMENTS', name: 'Exams & Assessment Matrix' },
    { id: 'FEES_FINANCE', name: 'Fees, Billing & M-Pesa Integration' },
    { id: 'ATTENDANCE', name: 'Daily Attendance & Biometrics' },
    { id: 'TIMETABLE', name: 'Timetable Scheduling Engine' },
    { id: 'ASSIGNMENTS', name: 'Homework, Coursework & Tasks' },
    { id: 'DISCIPLINE', name: 'Discipline & Behavior Tracker' },
    { id: 'PROMOTIONS', name: 'Annual Promotion Engine' },
    { id: 'CALENDAR', name: 'Academic & Corporate Calendar' },
    { id: 'SMS_NOTIFICATIONS', name: 'Automated SMS & Gate Alerts' },
    { id: 'REPORTS', name: 'CBC Performance & Analytics' },
    { id: 'RETAIL_POS', name: 'Point of Sale & Barcode POS' },
    { id: 'INVENTORY', name: 'Inventory & Multi-Store Stock' },
    { id: 'HOSPITAL_CLINIC', name: 'Clinical Records & Triage' },
    { id: 'PHARMACY', name: 'Pharmacy Dispensary & Rx' },
    { id: 'LIBRARY', name: 'Library Catalog & Barcode Loans' },
    { id: 'HOSTEL', name: 'Hostel & Housing Allocation' }
  ];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName || !newUserTenantId) return;
    const targetTenant = allTenants.find(t => t.id === newUserTenantId);
    await createPlatformUser({
      email: newUserEmail,
      displayName: newUserName,
      role: newUserRole,
      tenantId: newUserTenantId,
      tenantName: targetTenant?.name,
      isActive: true
    });
    setNewUserEmail('');
    setNewUserName('');
    setShowCreateUserModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-400 font-mono">Platform v2.5</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">DAVETECH ERP Master Governance</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Global multi-tenant governance, organization provisioning, subscription lifecycle, and security rule enforcement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Users className="h-4 w-4 text-indigo-400" />
              <span>Create User</span>
            </button>
            <button
              onClick={onOpenCreateTenant}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Provision New Tenant</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Organizations</span>
              <Building2 className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalTenants}</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{activeTenants} Active Workspaces</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Platform Users</span>
              <Users className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalUsers}</div>
            <div className="text-[11px] text-slate-400 mt-1">Multi-role RBAC Active</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Platform MRR (KES)</span>
              <CreditCard className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">
              KES {estimatedMonthlyMRR.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across 3 Subscription Tiers</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Tenant Security</span>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 mt-2">100% Isolated</div>
            <div className="text-[11px] text-slate-400 mt-1">Strict tenantId validation</div>
          </div>
        </div>

        {/* Cloud Firestore Integration & Sync Hub */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Database className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Google Cloud Firestore Connected</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE PROVISIONED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Project ID: <span className="font-mono text-indigo-300 font-semibold">{firebaseProjectId}</span> • Database: <span className="font-mono text-slate-300">{firestoreDatabaseName}</span>
                {lastFirestoreSyncTime && <span> • Last synced at {lastFirestoreSyncTime}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePushAllToCloud}
              disabled={isSyncingFirestore}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-2 ${
                isSyncingFirestore
                  ? 'bg-indigo-800 text-indigo-200 cursor-not-allowed animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              <Cloud className={`h-4 w-4 ${isSyncingFirestore ? 'animate-spin' : ''}`} />
              <span>{isSyncingFirestore ? 'Pushing to Cloud...' : 'Push All to Firestore'}</span>
            </button>
          </div>
        </div>

        {syncStatusMsg && (
          <div className="mt-3 p-3 rounded-xl bg-indigo-900/60 border border-indigo-700 text-xs text-indigo-200 flex items-center space-x-2 animate-in fade-in">
            <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Main Content Areas based on selected Super Admin Tab */}
      {currentTab === 'super-admin-overview' || currentTab === 'super-admin-tenants' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Main Domain Ingress & Wildcard Subdomain Banner */}
          <div className="p-4 bg-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-800/80 border border-indigo-700 flex items-center justify-center flex-shrink-0 text-white font-bold">
                <Globe className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">Root Domain: {MAIN_DOMAIN}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Wildcard *.davetech.co.ke Active
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  Multi-tenant ingress router dynamically maps subdomains to isolated database partitions.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-indigo-950/60 rounded-lg border border-indigo-700/60 text-indigo-300">
                SSL: Let's Encrypt Wildcard
              </span>
              <span className="px-2.5 py-1 bg-indigo-950/60 rounded-lg border border-indigo-700/60 text-emerald-400 font-bold">
                CNAME Ingress: Ready
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1 flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tenants by name, code or subdomain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Tenant Types</option>
                <option value="PRIMARY_SCHOOL">Primary School</option>
                <option value="SECONDARY_SCHOOL">Secondary School</option>
                <option value="COLLEGE">College / University</option>
                <option value="RETAIL">Retail / Shop</option>
                <option value="BUSINESS">Wholesale / Business</option>
                <option value="HOSPITAL">Hospital / Clinic</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="TRIAL">Trial</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredTenants.length}</span> of {totalTenants} tenants
            </div>
          </div>

          {/* Tenants Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Organization & Code</th>
                  <th className="py-3 px-4">Assigned Subdomain</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Plan & Billing</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Active Modules</th>
                  <th className="py-3 px-4">Workspace Scale</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((t) => {
                  const slug = t.subdomain || t.code.toLowerCase();
                  const fullUrl = `https://${slug}.${MAIN_DOMAIN.toLowerCase()}`;
                  const isCopied = copiedTenantId === t.id;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 flex-shrink-0 overflow-hidden">
                            {t.logoUrl ? (
                              <img src={t.logoUrl} alt={t.name} className="h-full w-full object-contain p-0.5" />
                            ) : t.type === 'PRIMARY_SCHOOL' || t.type === 'SECONDARY_SCHOOL' ? (
                              '🏫'
                            ) : t.type === 'COLLEGE' || t.type === 'UNIVERSITY' ? (
                              '🎓'
                            ) : t.type === 'HOSPITAL' ? (
                              '🏥'
                            ) : (
                              '🛒'
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{t.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                              <span>Code: {t.code}</span>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{t.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                              {slug}.{MAIN_DOMAIN.toLowerCase()}
                            </span>
                            <button
                              onClick={() => handleCopySubdomain(t)}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Copy URL"
                            >
                              {isCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                            <button
                              onClick={() => openEditSubdomain(t)}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Edit Subdomain Prefix"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                          {t.customDomain && (
                            <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                              <span>CNAME:</span>
                              <span className="text-slate-700 font-semibold">{t.customDomain}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {t.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={t.plan}
                          onChange={(e) => updateTenantPlan(t.id, e.target.value as TenantPlan)}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-700 cursor-pointer focus:outline-none"
                        >
                          <option value="BASIC">BASIC (KES 25k/mo)</option>
                          <option value="PREMIUM">PREMIUM (KES 55k/mo)</option>
                          <option value="ENTERPRISE">ENTERPRISE (KES 120k/mo)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => updateTenantStatus(t.id, t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            t.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : t.status === 'TRIAL'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{t.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedTenantForModules(t)}
                          className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>{t.modules.length} Modules</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-700 font-medium">
                          {t.type.includes('SCHOOL') ? `${t.stats?.studentCount || 0} Students` : t.type === 'COLLEGE' ? 'Higher Ed Campus' : t.type === 'RETAIL' ? 'POS Store' : 'Clinical Clinic'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.stats?.staffCount ? `${t.stats.staffCount} Staff Accounts` : 'Active Workspace'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => switchTenantAsSuperAdmin(t.id)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                            title="Switch active session into this organization"
                          >
                            <span>Open</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete tenant ${t.name}? This will remove workspace access.`)) {
                                deleteTenant(t.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Organization"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Super Admin Users Matrix Tab */}
      {currentTab === 'super-admin-users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform User RBAC Directory</h2>
              <p className="text-xs text-slate-500">Every user is strictly bound to their authorized tenant workspace with role validation</p>
            </div>
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 transition-colors flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Platform User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Tenant Workspace</th>
                  <th className="py-3 px-4">Role Assignment</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPlatformUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.displayName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {u.tenantName || u.tenantId}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => updatePlatformUserRole(u.uid, e.target.value as any)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-indigo-700 cursor-pointer focus:outline-none"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="TENANT_ADMIN">TENANT_ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ACCOUNTANT">ACCOUNTANT</option>
                        <option value="TEACHER">TEACHER</option>
                        <option value="CASHIER">CASHIER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleUserActiveStatus(u.uid)}
                        className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.isActive ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />}
                        <span>{u.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 text-right">
                      {u.uid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscriptions & Plans Tab */}
      {currentTab === 'super-admin-plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Basic Tier</div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                KES 25,000<span className="text-xs font-normal text-slate-500">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Essential school/retail starter package</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-600" /><span>Up to 300 students / 500 products</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-600" /><span>CBC & Academic Reporting</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-600" /><span>Fee & Receipt Invoicing</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-emerald-600" /><span>5 Staff Accounts</span></div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Tenants:</span>
                <span className="font-bold text-slate-900">{allTenants.filter(t => t.plan === 'BASIC').length}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-indigo-600 p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                Popular
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Premium Tier</div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                KES 55,000<span className="text-xs font-normal text-slate-500">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">For mid-size institutions & busy retail chains</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-indigo-600" /><span>Up to 1,500 students / unlimited products</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-indigo-600" /><span>Bulk SMS Gateway & Automated Alerts</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-indigo-600" /><span>M-Pesa Express Instant Reconciliation</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-indigo-600" /><span>25 Staff Accounts + Role Matrix</span></div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Tenants:</span>
                <span className="font-bold text-indigo-600">{allTenants.filter(t => t.plan === 'PREMIUM').length}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-600">Enterprise Tier</div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                KES 120,000<span className="text-xs font-normal text-slate-500">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Universities, Hospitals & Multi-Branch Groups</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-600" /><span>Unlimited Students, Patients & Inventory</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-600" /><span>Clinical EMR / Higher-Ed Hostel & Library</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-600" /><span>Custom Domain & Dedicated SLA</span></div>
                <div className="flex items-center space-x-2"><Check className="h-4 w-4 text-purple-600" /><span>Unlimited Staff & Multi-Campus Sync</span></div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Tenants:</span>
                <span className="font-bold text-purple-600">{allTenants.filter(t => t.plan === 'ENTERPRISE').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Audit Logs Tab */}
      {currentTab === 'super-admin-audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Operational Audit Stream</h2>
              <p className="text-xs text-slate-500">Immutable chronological record of administrative and data events</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono">
              {auditLogs.length} Events Recorded
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-600 font-mono">{log.action}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{log.details}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    By: <span className="text-slate-600 font-medium">{log.userEmail}</span> • Tenant: <span className="font-mono">{log.tenantId}</span>
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module Configuration Modal */}
      {selectedTenantForModules && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Module Access Switchboard</h3>
                <p className="text-xs text-slate-500">{selectedTenantForModules.name}</p>
              </div>
              <button
                onClick={() => setSelectedTenantForModules(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5 max-h-96 overflow-y-auto">
              {allAvailableModules.map((mod) => {
                const isEnabled = selectedTenantForModules.modules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{mod.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{mod.id}</div>
                    </div>
                    <button
                      onClick={() => {
                        toggleTenantModule(selectedTenantForModules.id, mod.id);
                        setSelectedTenantForModules(prev => prev ? {
                          ...prev,
                          modules: isEnabled ? prev.modules.filter(m => m !== mod.id) : [...prev.modules, mod.id]
                        } : null);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isEnabled
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {isEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTenantForModules(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Create Platform User</h3>
            <p className="text-xs text-slate-500 mb-4">Provision a new user account with role-based permissions</p>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mary Wanjiku"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mary@staustins.ac.ke"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="TENANT_ADMIN">TENANT_ADMIN (Principal / Director / GM)</option>
                  <option value="MANAGER">MANAGER (Operations / Store Manager)</option>
                  <option value="ACCOUNTANT">ACCOUNTANT (Bursar / Finance Officer)</option>
                  <option value="TEACHER">TEACHER (Class Teacher / CBC)</option>
                  <option value="CASHIER">CASHIER (POS Cashier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Tenant Workspace</label>
                <select
                  value={newUserTenantId}
                  onChange={(e) => setNewUserTenantId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {allTenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tenant Subdomain Modal */}
      {editingSubdomainTenant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <Globe className="h-5 w-5" />
              <h3 className="font-bold text-slate-900 text-base">Edit Tenant Branding & Subdomain</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Configure assigned subdomain and official logo emblem for <strong>{editingSubdomainTenant.name}</strong>
            </p>

            <form onSubmit={handleSaveSubdomainEdit} className="space-y-4 text-xs">
              {/* Logo / Crest Uploader */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <LogoUploader
                  currentLogoUrl={editLogoUrlVal}
                  onLogoChange={setEditLogoUrlVal}
                  entityName={editingSubdomainTenant.name}
                  label="Tenant Logo / Crest"
                  compact={true}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subdomain Slug *</label>
                <div className="flex items-center rounded-xl bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    type="text"
                    required
                    value={editSubdomainVal}
                    onChange={(e) => setEditSubdomainVal(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none lowercase"
                    placeholder="e.g. staustins"
                  />
                  <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-600">
                    .{MAIN_DOMAIN.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <div className="text-[11px] text-indigo-700 font-semibold mb-1">Generated Portal URL:</div>
                <div className="font-mono text-xs font-bold text-indigo-950 break-all">
                  https://{editSubdomainVal || 'prefix'}.{MAIN_DOMAIN.toLowerCase()}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom Domain (Optional CNAME)</label>
                <input
                  type="text"
                  value={editCustomDomainVal}
                  onChange={(e) => setEditCustomDomainVal(e.target.value)}
                  placeholder="e.g. portal.staustins.ac.ke"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSubdomainTenant(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Save Routing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
