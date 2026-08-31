import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Users,
  Receipt,
  CalendarCheck,
  Award,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  Send,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen
} from 'lucide-react';

interface SchoolDashboardProps {
  onNavigate: (tabId: string) => void;
  onOpenAdmission: () => void;
  onOpenRecordPayment: () => void;
}

export const SchoolDashboard: React.FC<SchoolDashboardProps> = ({
  onNavigate,
  onOpenAdmission,
  onOpenRecordPayment
}) => {
  const {
    tenant,
    students,
    staff,
    classes,
    payments,
    invoices,
    attendance,
    events,
    user
  } = useAuth();

  // Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;

  const totalBilled = students.reduce((sum, s) => sum + (s.totalBilled || 0), 0);
  const totalPaid = students.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
  const totalBalance = students.reduce((sum, s) => sum + (s.feeBalance || 0), 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const recentPayments = payments.slice(0, 5);
  const upcomingEvents = events.slice(0, 3);

  // Grade Enrollment Summary
  const gradeDistribution = [
    { grade: 'Playgroup & PP', count: students.filter(s => ['Playgroup', 'PP1', 'PP2'].includes(s.grade)).length },
    { grade: 'Grade 1 - 3 (Lower Primary)', count: students.filter(s => ['Grade 1', 'Grade 2', 'Grade 3'].includes(s.grade)).length },
    { grade: 'Grade 4 - 6 (Upper Primary)', count: students.filter(s => ['Grade 4', 'Grade 5', 'Grade 6'].includes(s.grade)).length },
    { grade: 'Grade 7 - 9 (Junior School)', count: students.filter(s => ['Grade 7', 'Grade 8', 'Grade 9'].includes(s.grade)).length }
  ];

  return (
    <div className="space-y-6">
      {/* School Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
              🏫
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tenant?.status || 'ACTIVE'} WORKSPACE
                </span>
                <span className="text-xs text-slate-400 font-mono">Code: {tenant?.code}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                {tenant?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 italic mt-0.5">
                "{tenant?.motto || 'Excellence in Competence & Character'}"
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAdmission}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Admit Learner</span>
            </button>
            <button
              onClick={onOpenRecordPayment}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
            >
              <Receipt className="h-4 w-4" />
              <span>Receive Payment</span>
            </button>
          </div>
        </div>

        {/* Quick Ribbon */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Academic Year:</span>
            <div className="font-bold text-white text-sm">{tenant?.currentAcademicYear || '2025'}</div>
          </div>
          <div>
            <span className="text-slate-400">Current Term:</span>
            <div className="font-bold text-indigo-300 text-sm">
              {(tenant?.currentTerm || 'TERM_1').replace('_', ' ')}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Curriculum Framework:</span>
            <div className="font-bold text-emerald-300 text-sm">CBC (Competency Based)</div>
          </div>
          <div>
            <span className="text-slate-400">Base Currency:</span>
            <div className="font-bold text-cyan-300 text-sm">{tenant?.currency || 'KES'}</div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('school-students')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Learners</span>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalStudents}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{maleCount} Boys • {femaleCount} Girls</span>
            <span className="text-indigo-600 font-semibold flex items-center">
              View <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Total Staff */}
        <div
          onClick={() => onNavigate('school-staff')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Faculty & Staff</span>
            <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{staff.length}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{staff.filter(s => s.role === 'TEACHER').length} CBC Teachers</span>
            <span className="text-cyan-600 font-semibold flex items-center">
              Directory <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Fees Collected */}
        <div
          onClick={() => onNavigate('school-fees')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fees Collected (Term 1)</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            KES {totalPaid.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <div className="w-full mr-3 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${collectionRate}%` }} />
            </div>
            <span className="font-bold text-slate-800">{collectionRate}%</span>
          </div>
        </div>

        {/* Fee Balances */}
        <div
          onClick={() => onNavigate('school-fees')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Outstanding</span>
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            KES {totalBalance.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{students.filter(s => s.feeBalance > 0).length} Learners with balances</span>
            <span className="text-rose-600 font-semibold flex items-center">
              Clearance <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrollment Distribution & Recent Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Grade Enrollment & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Matrix */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Daily Administrative Workflows
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate('school-attendance')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Roll Call</div>
                <div className="text-[11px] text-slate-500">Mark daily attendance</div>
              </button>

              <button
                onClick={() => onNavigate('school-assessments')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Award className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">CBC Scores</div>
                <div className="text-[11px] text-slate-500">Formative & rubrics</div>
              </button>

              <button
                onClick={() => onNavigate('school-reports')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Report Cards</div>
                <div className="text-[11px] text-slate-500">Printable CBC slips</div>
              </button>

              <button
                onClick={() => onNavigate('school-sms')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Send className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">SMS Broadcast</div>
                <div className="text-[11px] text-slate-500">Fee reminders & alerts</div>
              </button>

              <button
                onClick={() => onNavigate('school-timetable')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Timetable</div>
                <div className="text-[11px] text-slate-500">Weekly class schedule</div>
              </button>

              <button
                onClick={() => onNavigate('school-classes')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
              >
                <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Class Streams</div>
                <div className="text-[11px] text-slate-500">{classes.length} Streams configured</div>
              </button>
            </div>
          </div>

          {/* Enrollment Breakdown by Tier */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Enrolment Across CBC Levels</h2>
              <button
                onClick={() => onNavigate('school-students')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View Learner Registry
              </button>
            </div>

            <div className="space-y-3">
              {gradeDistribution.map((item, idx) => {
                const pct = totalStudents > 0 ? Math.round((item.count / totalStudents) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.grade}</span>
                      <span className="text-slate-500 font-mono">
                        {item.count} learners ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-cyan-500' : idx === 2 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Payments & Upcoming Events */}
        <div className="space-y-6">
          {/* Recent Payments Stream */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Recent Fee Receipts</h2>
              <button
                onClick={() => onNavigate('school-fees')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                All Receipts
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentPayments.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                      {p.studentName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                      <span>{p.receiptNo}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">{p.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600">
                      +KES {p.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming School Events */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Upcoming Events</h2>
              <button
                onClick={() => onNavigate('school-calendar')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{evt.title}</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {evt.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{evt.description}</div>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1 font-mono">
                    <Calendar className="h-3 w-3" />
                    <span>{evt.startDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
