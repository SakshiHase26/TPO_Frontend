import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

// Admin Components
import Sidebar from './components/ADMIN/sidebar';
import Header from './components/ADMIN/header';

// TPO Components
import TpoHeader from './components/TPO/Header';
import TpoNavbar from './components/TPO/Navbar';
import TpoSidebar from './components/TPO/Sidebar';
import TpoLayout from './components/TPO/TpoLayout';
import ProtectedRoute from './components/TPO/ProtectedRoute';

// Admin Pages
import Dashboard from './pages/Admin/dashboard';
import StudentTable from './pages/Admin/student';
import VerifyTpos from './pages/Admin/verify_tpo';
import ManageTpos from './pages/Admin/manage_tpos';
import ApprovedTPOList from './pages/Admin/approvedtpo';
import ControlPanel from './pages/Admin/controlpanel';
import CampusManager from './pages/Admin/campusmanage';
import StreamManager from './pages/Admin/StreamManager';
import AdminLogin from './pages/Admin/adminlogin';

// TPO Pages
import TPORegisterForm from './pages/TPO/RegisterPage';
import TPOLogin from './pages/TPO/LoginPage';
import TpoDashboard from './pages/TPO/Dashboard';
import PCApprovals from './pages/TPO/PCApprovals';
import TPOApprovalDashboard from './pages/TPO/TPOApprovalDashboard';
import AdminApprovalPage from './pages/TPO/AdminApprovalPage';
import Success from './pages/TPO/Success';

// PC Pages
import PCDashboard from './pages/PC/Dashboard';
import PCLogin from './pages/PC/Login';
import PCRegister from './pages/PC/Register';

// Landing Page
import LandingPage from './pages/LandingPage';

// ✅ Helper function to get current user from any storage location
const getCurrentUser = () => {
  const tpoUserStr = localStorage.getItem('tpoUser');
  const adminUserStr = localStorage.getItem('adminUser');
  const userStr = localStorage.getItem('user');
  const pcUserStr = localStorage.getItem('pcUser');
  
  let user = null;

  // Try to get user from different storage locations
  if (tpoUserStr) {
    try {
      user = JSON.parse(tpoUserStr);
      user.role = 'tpo';
    } catch (e) {
      localStorage.removeItem('tpoUser');
    }
  } else if (adminUserStr) {
    try {
      user = JSON.parse(adminUserStr);
      user.role = 'admin';
    } catch (e) {
      localStorage.removeItem('adminUser');
    }
  } else if (pcUserStr) {
    try {
      user = JSON.parse(pcUserStr);
      user.role = 'pc';
    } catch (e) {
      localStorage.removeItem('pcUser');
    }
  } else if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      localStorage.removeItem('user');
    }
  }

  return user;
};

// ✅ Enhanced Role-based Protected Route
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const user = getCurrentUser();

  // If no user found, redirect to landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user is approved (for TPO and PC users)
  if ((user.role === 'tpo' || user.role === 'pc') && user.status !== 'approved') {
    if (user.role === 'tpo') {
      localStorage.removeItem('tpoUser');
    } else if (user.role === 'pc') {
      localStorage.removeItem('pcUser');
    }
    return <Navigate to="/" replace />;
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    return user.role === 'admin' ? (
      <Navigate to="/admin/dashboard" replace />
    ) : user.role === 'tpo' ? (
      <Navigate to="/tpo/dashboard" replace />
    ) : user.role === 'pc' ? (
      <Navigate to="/pc/dashboard" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return children;
};

// ✅ Admin Layout Component
const AdminLayout = ({ themeMode, toggleTheme, sidebarOpen, toggleSidebar, children }) => {
  const bgColor = themeMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = themeMode === 'dark' ? 'text-white' : 'text-gray-800';

  return (
    <div className={`${themeMode} ${bgColor} ${textColor} min-h-screen flex flex-col`}>
      <Header themeMode={themeMode} toggleTheme={toggleTheme} />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar
          themeMode={themeMode}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// ✅ PC Layout Component - Create a separate PC layout
const PCLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* PC specific header/navbar can go here */}
      <div className="flex">
        {/* PC specific sidebar can go here */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

// ✅ Main Layout Router
const MainLayout = ({ themeMode, toggleTheme, sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = getCurrentUser();
  const userRole = user?.role;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/register', '/login', '/admin/login', '/tpo/login', '/pc/login', '/pc/register'];
  const isPublic = publicRoutes.includes(location.pathname);

  // ✅ Redirect to appropriate login if user is not present and not on public route
  if (!user && !isPublic) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<TPORegisterForm />} />
      <Route path="/tpo/login" element={<TPOLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/pc/login" element={<PCLogin />} />
      <Route path="/pc/register" element={<PCRegister />} />
      {/* Legacy route redirects */}
      <Route path="/login" element={<Navigate to="/tpo/login" replace />} />

      {/* ========== ADMIN ROUTES ========== */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <Dashboard />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/student"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <StudentTable />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/verify-tpo"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <VerifyTpos />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/manage"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <ManageTpos />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/approved-tpo"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <ApprovedTPOList />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/control-panel"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <ControlPanel />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/campus"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <CampusManager />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/stream"
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminLayout 
              themeMode={themeMode} 
              toggleTheme={toggleTheme} 
              sidebarOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar}
            >
              <StreamManager />
            </AdminLayout>
          </RoleProtectedRoute>
        }
      />

      {/* ========== TPO ROUTES ========== */}
      <Route
        path="/tpo/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['tpo']}>
            
              <TpoDashboard />
           
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/tpo/pc-approvals"
        element={
          <RoleProtectedRoute allowedRoles={['tpo']}>
            
              <PCApprovals />
            
          </RoleProtectedRoute>
        }
      />
        <Route
        path="/tpo/notice-approvals"
        element={
          <RoleProtectedRoute allowedRoles={['tpo']}>
            <TpoLayout>
              <TPOApprovalDashboard />
            </TpoLayout>
          </RoleProtectedRoute>
        }
      />

      {/* ========== PC ROUTES ========== */}
      <Route
        path="/pc/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['pc']}>
            <PCLayout>
              <PCDashboard />
            </PCLayout>
          </RoleProtectedRoute>
        }
      />

      {/* ========== SHARED ROUTES (Admin, TPO & PC) ========== */}
      <Route
        path="/campus"
        element={
          <RoleProtectedRoute allowedRoles={['tpo', 'admin', 'pc']}>
            {userRole === 'admin' ? (
              <AdminLayout 
                themeMode={themeMode} 
                toggleTheme={toggleTheme} 
                sidebarOpen={sidebarOpen} 
                toggleSidebar={toggleSidebar}
              >
                <CampusManager />
              </AdminLayout>
            ) : userRole === 'pc' ? (
              <PCLayout>
                <CampusManager />
              </PCLayout>
            ) : (
              <TpoLayout>
                <CampusManager />
              </TpoLayout>
            )}
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/stream"
        element={
          <RoleProtectedRoute allowedRoles={['tpo', 'admin', 'pc']}>
            {userRole === 'admin' ? (
              <AdminLayout 
                themeMode={themeMode} 
                toggleTheme={toggleTheme} 
                sidebarOpen={sidebarOpen} 
                toggleSidebar={toggleSidebar}
              >
                <StreamManager />
              </AdminLayout>
            ) : userRole === 'pc' ? (
              <PCLayout>
                <StreamManager />
              </PCLayout>
            ) : (
              <TpoLayout>
                <StreamManager />
              </TpoLayout>
            )}
          </RoleProtectedRoute>
        }
      />

      {/* ========== FALLBACK ROUTES ========== */}
      {/* Redirect based on user role */}
      <Route 
        path="/dashboard" 
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/dashboard" />
          ) : user?.role === 'tpo' ? (
            <Navigate to="/tpo/dashboard" />
          ) : user?.role === 'pc' ? (
            <Navigate to="/pc/dashboard" />
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// ✅ Main App Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem('themeMode') || 'dark'
  );

  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    localStorage.setItem('themeMode', newTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <MainLayout
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </Router>
  );
};

export default App;