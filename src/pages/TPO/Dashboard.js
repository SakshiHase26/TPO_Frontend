import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { 
  Bell, 
  Users, 
  Calendar, 
  FileText, 
  Search, 
  Menu, 
  ChevronDown, 
  LogOut, 
  MessageSquare, 
  Settings,
  Home,
  Lock,
  Briefcase,
  BookOpen,
  PenTool,
  UserCheck,
  FileCheck,
  Award,
  User,
  Mail
} from 'lucide-react';

// Import your other TPO components
import PCApprovals from '../TPO/PCApprovals';
import TPOApprovalDashboard from '../TPO/TPOApprovalDashboard';
import AdminApprovalPage from '../TPO/AdminApprovalPage';
import Success from '../TPO/Success';

const API_BASE_URL = 'http://localhost:5000/api/tpo/pc-approvals';

// Dashboard Content Component
const DashboardContent = () => {
  const [recentPCRegistrations, setRecentPCRegistrations] = useState([]);
  const [pcStatistics, setPcStatistics] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recent PC registrations
  const fetchRecentPCRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?page=0&size=5&status=pending&sortBy=registrationDate&sortDir=desc`);
      if (response.ok) {
        const data = await response.json();
        setRecentPCRegistrations(data.content || []);
      }
    } catch (err) {
      console.error('Error fetching recent PC registrations:', err);
    }
  };

  // Fetch PC statistics
  const fetchPCStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (response.ok) {
        const stats = await response.json();
        setPcStatistics(stats);
      }
    } catch (err) {
      console.error('Error fetching PC statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle quick approve/reject actions
  const handleQuickApprove = async (pcId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${pcId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: 'Quick approval from dashboard',
          approvedBy: 'TPO Admin'
        })
      });

      if (response.ok) {
        // Refresh the data
        fetchRecentPCRegistrations();
        fetchPCStatistics();
      }
    } catch (err) {
      console.error('Error approving PC:', err);
    }
  };

  const handleQuickReject = async (pcId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${pcId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Quick rejection from dashboard - please resubmit with complete information',
          rejectedBy: 'TPO Admin'
        })
      });

      if (response.ok) {
        // Refresh the data
        fetchRecentPCRegistrations();
        fetchPCStatistics();
      }
    } catch (err) {
      console.error('Error rejecting PC:', err);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchRecentPCRegistrations();
    fetchPCStatistics();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards - Updated with real data */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <UserCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Pending PC Approvals</h3>
            <p className="text-2xl font-semibold text-gray-800">{loading ? '...' : pcStatistics.pending}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <FileCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Approved PCs</h3>
            <p className="text-2xl font-semibold text-gray-800">{loading ? '...' : pcStatistics.approved}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <PenTool size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rejected PCs</h3>
            <p className="text-2xl font-semibold text-gray-800">{loading ? '...' : pcStatistics.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Upcoming Placements</h3>
            <p className="text-2xl font-semibold text-gray-800">3</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Placed Students</h3>
            <p className="text-2xl font-semibold text-gray-800">247</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total PC Registrations</h3>
            <p className="text-2xl font-semibold text-gray-800">{loading ? '...' : pcStatistics.total}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent PC Registrations - Updated with real data */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Recent PC Registrations</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : recentPCRegistrations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No recent PC registrations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPCRegistrations.map((pc) => (
                  <div key={pc.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{pc.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Mail size={12} className="mr-1" />
                          {pc.collegeEmail}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered: {formatDate(pc.registrationDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleQuickApprove(pc.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors"
                        title="Quick Approve"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleQuickReject(pc.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200 transition-colors"
                        title="Quick Reject"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => navigate('/tpo/pc-approvals')}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Registrations
            </button>
          </div>
        </div>

        {/* Recent Notices - Keep as placeholder for now */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Recent Notices</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-l-4 border-indigo-500 bg-indigo-50 p-3 rounded-r-lg">
                  <p className="text-sm font-medium text-gray-800">Notice Title {i}</p>
                  <p className="text-xs text-gray-500 mt-1">Posted by Company {i} • May {10 + i}, 2025</p>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-white text-green-700 border border-green-300 text-xs rounded-full">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-white text-red-700 border border-red-300 text-xs rounded-full">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All Notices
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Placeholder Content Component
const PlaceholderContent = ({ title, icon }) => (
  <div className="bg-white rounded-lg shadow p-8 text-center">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
      {title} Content
    </h2>
    <p className="text-gray-500 mb-6">
      This is a placeholder for the {title.toLowerCase()} content.
    </p>
    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
      {icon || <FileText size={32} className="text-gray-400" />}
    </div>
  </div>
);

export default function TPODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // FIXED: Get current page from URL - handle relative paths properly
  const getCurrentPage = () => {
    const path = location.pathname;
    // Remove the '/tpo' prefix to get the relative path
    const relativePath = path.replace('/tpo', '') || '/';
    
    if (relativePath === '/' || relativePath === '/dashboard') return 'dashboard';
    if (relativePath === '/pc-approvals') return 'pcApprovals';
    if (relativePath === '/notice-approvals') return 'noticeApprovals';
    if (relativePath === '/academic-requests') return 'academicEdits';
    if (relativePath === '/student-overview') return 'studentOverview';
    if (relativePath === '/announcements') return 'announcements';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/tpo/dashboard' },
    { id: 'pcApprovals', label: 'PC Approvals', icon: <UserCheck size={20} />, path: '/tpo/pc-approvals' },
    { id: 'noticeApprovals', label: 'Notice Approvals', icon: <FileCheck size={20} />, path: '/tpo/notice-approvals' },
    { id: 'academicEdits', label: 'Academic Edit Requests', icon: <PenTool size={20} />, path: '/tpo/academic-requests' },
    { id: 'studentOverview', label: 'Student Overview', icon: <Users size={20} />, path: '/tpo/student-overview' },
    { id: 'announcements', label: 'Send Announcements', icon: <MessageSquare size={20} />, path: '/tpo/announcements' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('tpoUser');
    localStorage.removeItem('user');
    navigate('/tpo/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <Briefcase className="h-8 w-8 text-indigo-300" />
            {sidebarOpen && <span className="ml-3 text-xl font-bold">TPO Portal</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`p-1 rounded-md hover:bg-indigo-700 ${!sidebarOpen && 'hidden'}`}
          >
            <Menu size={20} />
          </button>
        </div>
        <div className="mt-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-4 ${
                currentPage === item.id 
                  ? 'bg-indigo-900 border-l-4 border-white' 
                  : 'hover:bg-indigo-700'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <div className={`${currentPage === item.id ? 'text-white' : 'text-indigo-300'}`}>
                {item.icon}
              </div>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>
        <div className="absolute bottom-0 w-full p-4">
          <button 
            onClick={handleLogout}
            className={`flex items-center ${!sidebarOpen && 'justify-center w-full'} text-indigo-300 hover:text-white`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="p-1 mr-4 rounded-md hover:bg-gray-200">
                  <Menu size={20} />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-800">
                {navItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-200 relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
                </button>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    TP
                  </div>
                  <div className="hidden md:block">
                    <h2 className="text-sm font-medium">TPO Admin</h2>
                    <p className="text-xs text-gray-500">admin@university.edu</p>
                  </div>
                  <ChevronDown size={16} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content with Internal Routing - FIXED: Use relative paths */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="pc-approvals" element={<PCApprovals />} />
            <Route path="notice-approvals" element={<PlaceholderContent title="Notice Approvals" icon={<FileCheck size={32} className="text-gray-400" />} />} />
            <Route path="academic-requests" element={<PlaceholderContent title="Academic Edit Requests" icon={<PenTool size={32} className="text-gray-400" />} />} />
            <Route path="student-overview" element={<PlaceholderContent title="Student Overview" icon={<Users size={32} className="text-gray-400" />} />} />
            <Route path="announcements" element={<PlaceholderContent title="Send Announcements" icon={<MessageSquare size={32} className="text-gray-400" />} />} />
            <Route path="admin-approval" element={<AdminApprovalPage />} />
            <Route path="success" element={<Success />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-white p-4 border-t text-center text-sm text-gray-600">
          Training and Placement Office Portal © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}