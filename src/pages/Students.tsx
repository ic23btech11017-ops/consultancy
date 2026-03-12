import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Plus, Search, Eye, X, AlertCircle } from 'lucide-react';
import { Student, StudentStatus, Qualification, TargetLevel, addStudent } from '../data/students';
import { students as INITIAL_STUDENTS } from '../data/mockData';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [studentsList, setStudentsList] = useState<Student[]>(INITIAL_STUDENTS as Student[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    country: 'Canada',
    assignedCounsellor: 'Ravi Mehta',
    highestQualification: '12th' as Qualification,
    targetLevel: 'Bachelors' as TargetLevel,
  });

  const [validationError, setValidationError] = useState('');

  const validateLevels = (qual: Qualification, target: TargetLevel) => {
    if (qual === '12th' && (target === 'Masters' || target === 'PhD')) {
      return 'Target level must be higher than completed qualification.';
    }
    if (qual === 'Bachelors' && (target === 'Bachelors' || target === 'Diploma')) {
      // Technically you can do another bachelors, but the prompt says:
      // 12th -> Bachelors or Diploma
      // Bachelors -> Masters
      // Masters -> PhD
      // So I will strictly follow the prompt's mapping.
      return 'Target level must be higher than completed qualification.';
    }
    if (qual === 'Bachelors' && target === 'PhD') {
      // Prompt says Bachelors -> Masters. So Bachelors -> PhD is invalid based on strict mapping.
      return 'Target level must be higher than completed qualification.';
    }
    if (qual === 'Masters' && target !== 'PhD') {
      return 'Target level must be higher than completed qualification.';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (name === 'highestQualification' || name === 'targetLevel') {
      const error = validateLevels(
        name === 'highestQualification' ? (value as Qualification) : formData.highestQualification,
        name === 'targetLevel' ? (value as TargetLevel) : formData.targetLevel
      );
      setValidationError(error);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateLevels(formData.highestQualification, formData.targetLevel);
    if (error) {
      setValidationError(error);
      return;
    }

    const newStudent: Student = {
      id: `ST${(studentsList.length + 1).toString().padStart(3, '0')}`,
      ...formData,
      status: 'Active',
    };

    addStudent(newStudent);
    setStudentsList([newStudent, ...studentsList]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      country: 'Canada',
      assignedCounsellor: 'Ravi Mehta',
      highestQualification: '12th',
      targetLevel: 'Bachelors',
    });
    setValidationError('');
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'Active': return <Badge variant="info">Active</Badge>;
      case 'Application In Progress': return <Badge variant="warning">Application In Progress</Badge>;
      case 'Visa In Process': return <Badge variant="indigo">Visa In Process</Badge>;
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      default: return <Badge variant="info">{status}</Badge>;
    }
  };

  const filteredStudents = studentsList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Students" 
          subtitle="Manage enrolled students and track their academic journey." 
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      <div className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Highest Qualification</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Counsellor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.highestQualification}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.targetLevel}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.assignedCounsellor}</td>
                  <td className="px-6 py-4">{getStatusBadge(student.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/students/${student.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <Card className="relative w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Student</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-6">
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Section 1: Basic Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input 
                      required
                      name="name"
                      type="text" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <input 
                      required
                      name="phone"
                      type="tel" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input 
                      required
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Country</label>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                    >
                      <option value="Canada">Canada</option>
                      <option value="UK">UK</option>
                      <option value="USA">USA</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Assigned Counsellor</label>
                  <select 
                    name="assignedCounsellor"
                    value={formData.assignedCounsellor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    <option value="Ravi Mehta">Ravi Mehta</option>
                    <option value="Anjali Rao">Anjali Rao</option>
                  </select>
                </div>
              </div>

              {/* Section 2: Academic Background */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Section 2: Academic Background</h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Highest Qualification</label>
                  <select 
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white"
                  >
                    <option value="12th">12th</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                  </select>
                </div>
              </div>

              {/* Section 3: Target Study Level */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Section 3: Target Study Level</h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Level</label>
                  <select 
                    name="targetLevel"
                    value={formData.targetLevel}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 dark:text-white ${
                      validationError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                  {validationError && (
                    <div className="flex items-center text-red-500 text-xs mt-1">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationError}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!!validationError}
                  className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm ${
                    validationError ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Save Student
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Students;
