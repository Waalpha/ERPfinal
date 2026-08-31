import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Building,
  BookA,
  Library,
  BedDouble,
  Receipt,
  PlusCircle,
  Search,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Filter,
  DollarSign
} from 'lucide-react';
import { CollegeDepartment, CollegeCourse, CollegeStudent, LibraryBook, HostelRoom } from '../../types';

interface CollegeManagementProps {
  currentTab: string;
}

export const CollegeManagement: React.FC<CollegeManagementProps> = ({ currentTab }) => {
  const {
    tenant,
    collegeDepartments,
    collegeCourses,
    collegeStudents,
    libraryBooks,
    hostelRooms,
    addCollegeDepartment,
    addCollegeCourse,
    admitCollegeStudent,
    addLibraryBook
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  // Modals
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Form states
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');

  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDeptId, setCourseDeptId] = useState(collegeDepartments[0]?.id || '');
  const [courseLevel, setCourseLevel] = useState<'CERTIFICATE' | 'DIPLOMA' | 'DEGREE' | 'MASTERS'>('DEGREE');
  const [courseDuration, setCourseDuration] = useState('4 Years');
  const [courseCredits, setCourseCredits] = useState(120);
  const [courseTuition, setCourseTuition] = useState(75000);

  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCourseId, setStudentCourseId] = useState(collegeCourses[0]?.id || '');
  const [studentYear, setStudentYear] = useState(1);
  const [studentSemester, setStudentSemester] = useState(1);

  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookCategory, setBookCategory] = useState('Computer Science');
  const [bookCopies, setBookCopies] = useState(5);

  // KPIs
  const totalStudents = collegeStudents.length;
  const totalCourses = collegeCourses.length;
  const totalTuitionOwed = collegeStudents.reduce((sum, s) => sum + s.feeBalance, 0);
  const totalBooks = libraryBooks.reduce((sum, b) => sum + b.totalCopies, 0);
  const hostelOccupancy = hostelRooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
  const hostelCapacity = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;
    await addCollegeDepartment({
      name: deptName,
      code: deptCode.toUpperCase(),
      headOfDepartment: deptHead || 'Prof. Administrator'
    });
    setDeptName('');
    setDeptCode('');
    setDeptHead('');
    setShowDeptModal(false);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseCode || !courseDeptId) return;
    const targetDept = collegeDepartments.find(d => d.id === courseDeptId);
    await addCollegeCourse({
      code: courseCode.toUpperCase(),
      title: courseTitle,
      departmentId: courseDeptId,
      departmentName: targetDept?.name || 'Academic Dept',
      duration: courseDuration,
      level: courseLevel,
      tuitionPerSemester: courseTuition,
      creditsRequired: courseCredits
    });
    setCourseTitle('');
    setCourseCode('');
    setShowCourseModal(false);
  };

  const handleAdmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentRegNo || !studentCourseId) return;
    const targetCourse = collegeCourses.find(c => c.id === studentCourseId);
    await admitCollegeStudent({
      regNo: studentRegNo.toUpperCase(),
      fullName: studentName,
      email: studentEmail,
      phone: studentPhone,
      courseId: studentCourseId,
      courseName: targetCourse?.title || 'Academic Program',
      departmentId: targetCourse?.departmentId || 'dept-1',
      yearOfStudy: studentYear,
      semester: studentSemester,
      status: 'ACTIVE',
      hostelRoomId: 'room-101'
    });
    setStudentName('');
    setStudentRegNo('');
    setStudentEmail('');
    setStudentPhone('');
    setShowStudentModal(false);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookAuthor) return;
    await addLibraryBook({
      title: bookTitle,
      author: bookAuthor,
      isbn: bookIsbn || `ISBN-${Math.floor(100000 + Math.random() * 900000)}`,
      category: bookCategory,
      totalCopies: bookCopies,
      availableCopies: bookCopies,
      shelfLocation: 'Section B-3'
    });
    setBookTitle('');
    setBookAuthor('');
    setShowBookModal(false);
  };

  return (
    <div className="space-y-6">
      {/* College Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {tenant?.type.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic Session 2024/2025</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{tenant?.name}</h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Higher education management: faculties, degree programs, student admissions, library resources and campus housing.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowStudentModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Admit Student</span>
            </button>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <BookA className="h-4 w-4 text-cyan-400" />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {/* Higher Ed KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Enrolled Students</span>
              <GraduationCap className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalStudents}</div>
            <div className="text-[11px] text-emerald-400 mt-1">Active Undergraduate & Diplomas</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Academic Programs</span>
              <BookA className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalCourses}</div>
            <div className="text-[11px] text-slate-400 mt-1">{collegeDepartments.length} Faculties</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Tuition Dues (KES)</span>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">
              KES {totalTuitionOwed.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Outstanding semester tuition</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Hostel Occupancy</span>
              <BedDouble className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {hostelOccupancy} / {hostelCapacity}
            </div>
            <div className="text-[11px] text-purple-300 mt-1">
              {Math.round((hostelOccupancy / (hostelCapacity || 1)) * 100)}% Capacity
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher or Dynamic Section Rendering */}
      {currentTab === 'college-departments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculties & Academic Departments</h2>
              <p className="text-xs text-slate-500">Deans, department heads and curriculum divisions</p>
            </div>
            <button
              onClick={() => setShowDeptModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Faculty</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collegeDepartments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold font-mono">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-500">{dept.facultyCount} Faculty</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Head: <span className="font-medium text-slate-700">{dept.headOfDepartment}</span></p>
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span>Courses: <strong className="text-slate-900">{collegeCourses.filter(c => c.departmentId === dept.id).length}</strong></span>
                  <span className="text-indigo-600 font-semibold text-[11px]">Manage Curricula →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {currentTab === 'college-courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic Programs & Degree Courses</h2>
              <p className="text-xs text-slate-500">Degree, diploma and certificate accreditation</p>
            </div>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Program</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Course Title & Code</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Duration & Credits</th>
                  <th className="py-3 px-4">Tuition / Semester</th>
                  <th className="py-3 px-4">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collegeCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-indigo-600 font-mono">{c.code}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{c.departmentName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {c.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{c.duration} • {c.creditsRequired} Credits</td>
                    <td className="py-3 px-4 font-bold text-slate-900">KES {c.tuitionPerSemester.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800">
                        {collegeStudents.filter(s => s.courseId === c.id).length} Students
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enrolled Students Tab */}
      {(currentTab === 'college-students' || currentTab === 'college-overview' || currentTab === 'college-fees') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Student Directory & Tuition Status</h2>
              <p className="text-xs text-slate-500">Student enrollment, semester progression and tuition balances</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative max-w-xs">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or Reg No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowStudentModal(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Admit Student</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Student & Reg No</th>
                  <th className="py-3 px-4">Academic Program</th>
                  <th className="py-3 px-4">Year / Semester</th>
                  <th className="py-3 px-4">Tuition Balance</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collegeStudents
                  .filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.regNo.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{s.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.regNo} • {s.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{s.courseName}</td>
                      <td className="py-3 px-4 text-slate-700">Year {s.yearOfStudy}, Sem {s.semester}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${s.feeBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          KES {s.feeBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Library Catalog Tab */}
      {currentTab === 'college-library' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Library Book Catalog</h2>
              <p className="text-xs text-slate-500">Track books, circulation copies, authors and shelf locations</p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {libraryBooks.map((book) => (
              <div key={book.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold font-mono">
                    {book.category}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    {book.availableCopies} / {book.totalCopies} Available
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{book.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Author: {book.author}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{book.isbn}</span>
                  <span>{book.shelfLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hostel Housing Tab */}
      {currentTab === 'college-hostel' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Hostel & Accommodation Management</h2>
            <p className="text-xs text-slate-500">Halls of residence, bed capacity and semester rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostelRooms.map((room) => (
              <div key={room.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-sm">{room.blockName} - Room {room.roomNumber}</h3>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                      {room.gender}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Rate: <strong className="text-slate-900">KES {room.feePerSemester.toLocaleString()}</strong> per semester
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">{room.occupiedBeds} / {room.capacity} Beds</div>
                  <span className="text-[10px] text-slate-400 font-semibold">Allocated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Academic Faculty</h3>
            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Engineering"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENG"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dean / Head</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. John Omondi"
                  value={deptHead}
                  onChange={(e) => setDeptHead(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Academic Program</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Science in Data Science"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSDS"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="CERTIFICATE">Certificate</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="DEGREE">Degree</option>
                    <option value="MASTERS">Masters</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty</label>
                <select
                  value={courseDeptId}
                  onChange={(e) => setCourseDeptId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {collegeDepartments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tuition / Semester (KES)</label>
                  <input
                    type="number"
                    value={courseTuition}
                    onChange={(e) => setCourseTuition(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Admit College Student</h3>
            <form onSubmit={handleAdmitStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kevin Kiprop"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reg Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KCA/2025/104"
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0712345678"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program</label>
                <select
                  value={studentCourseId}
                  onChange={(e) => setStudentCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {collegeCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Library Book</h3>
            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence: A Modern Approach"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stuart Russell and Peter Norvig"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Copies</label>
                  <input
                    type="number"
                    value={bookCopies}
                    onChange={(e) => setBookCopies(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
