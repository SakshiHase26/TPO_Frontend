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
// import TpoTable from './pages/Admin/tpo';
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
import AdminApprovalPage from './pages/TPO/AdminApprovalPage';
import Success from './pages/TPO/Success';

// Landing Page
import LandingPage from './pages/LandingPage';

// ✅ Helper function to get current user from any storage location
const getCurrentUser = () => {
  const tpoUserStr = localStorage.getItem('tpoUser');
  const adminUserStr = localStorage.getItem('adminUser');
  const userStr = localStorage.getItem('user');
  
  let user = null;

  // Try to get user from different storage locations
  if (tpoUserStr) {
    try {
      user = JSON.parse(tpoUserStr);
      user.role = 'tpo'; // Ensure role is set
    } catch (e) {
      localStorage.removeItem('tpoUser');
    }
  } else if (adminUserStr) {
    try {
      user = JSON.parse(adminUserStr);
      user.role = 'admin'; // Ensure role is set
    } catch (e) {
      localStorage.removeItem('adminUserStr');
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

  // Check if user is approved (for TPO users)
  if (user.role === 'tpo' && user.status !== 'approved') {
    localStorage.removeItem('tpoUser');
    return <Navigate to="/" replace />;
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    return user.role === 'admin' ? (
      <Navigate to="/admin/dashboard" replace />
    ) : user.role === 'tpo' ? (
      <Navigate to="/tpo/dashboard" replace />
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

// ✅ TPO Content Only Component (without layout)
const TPOContentOnly = ({ children }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {children}
    </div>
  );
};

// ✅ Main Layout Router
const MainLayout = ({ themeMode, toggleTheme, sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = getCurrentUser(); // ✅ FIXED: Now uses the helper function
  const userRole = user?.role;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/register', '/login', '/admin/login', '/tpo/login'];
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

      {/* ========== TPO ROUTES (TPODashboard handles its own routing) ========== */}
      {/* <Route
        path="/tpo/*"
        element={
          <RoleProtectedRoute allowedRoles={['tpo']}>
            <TpoDashboard />
          </RoleProtectedRoute>
        }
      /> */}
// In your App.js, replace the TPO ROUTES section with this:

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
{/* Add other specific TPO routes here */}
<Route
  path="/tpo/*"
  element={
    <RoleProtectedRoute allowedRoles={['tpo']}>
      <TpoDashboard />
    </RoleProtectedRoute>
  }
/>
      {/* ========== SHARED ROUTES (Both Admin & TPO) ========== */}
      <Route
        path="/campus"
        element={
          <RoleProtectedRoute allowedRoles={['tpo', 'admin']}>
            {userRole === 'admin' ? (
              <AdminLayout 
                themeMode={themeMode} 
                toggleTheme={toggleTheme} 
                sidebarOpen={sidebarOpen} 
                toggleSidebar={toggleSidebar}
              >
                <CampusManager />
              </AdminLayout>
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
          <RoleProtectedRoute allowedRoles={['tpo', 'admin']}>
            {userRole === 'admin' ? (
              <AdminLayout 
                themeMode={themeMode} 
                toggleTheme={toggleTheme} 
                sidebarOpen={sidebarOpen} 
                toggleSidebar={toggleSidebar}
              >
                <StreamManager />
              </AdminLayout>
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