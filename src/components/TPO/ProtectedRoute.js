import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectPath = '/',
  requireApproval = true
}) => {
  // Check for different user storage keys
  const tpoUserStr = localStorage.getItem('tpoUser');
  const adminUserStr = localStorage.getItem('adminUser');
  const pcUserStr = localStorage.getItem('pcUser'); // Added PC user storage
  const userStr = localStorage.getItem('user');
  
  let user = null;
  let userSource = null;

  // Try to get user from different storage locations
  if (tpoUserStr) {
    try {
      user = JSON.parse(tpoUserStr);
      user.role = user.role || 'tpo'; // Ensure role is set
      userSource = 'tpoUser';
    } catch (error) {
      console.error('Error parsing tpoUser:', error);
      localStorage.removeItem('tpoUser');
    }
  } else if (adminUserStr) {
    try {
      user = JSON.parse(adminUserStr);
      user.role = user.role || 'admin'; // Ensure role is set
      userSource = 'adminUser';
    } catch (error) {
      console.error('Error parsing adminUser:', error);
      localStorage.removeItem('adminUser');
    }
  } else if (pcUserStr) {
    try {
      user = JSON.parse(pcUserStr);
      user.role = user.role || 'pc'; // Ensure role is set
      userSource = 'pcUser';
    } catch (error) {
      console.error('Error parsing pcUser:', error);
      localStorage.removeItem('pcUser');
    }
  } else if (userStr) {
    try {
      user = JSON.parse(userStr);
      userSource = 'user';
    } catch (error) {
      console.error('Error parsing user:', error);
      localStorage.removeItem('user');
    }
  }

  console.log('ProtectedRoute - Current User:', user);
  console.log('ProtectedRoute - User Source:', userSource);
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);
  console.log('ProtectedRoute - Redirect Path:', redirectPath);

  // If no user found, redirect to specified path
  if (!user || !user.token) {
    console.log('ProtectedRoute - No user or token found, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user needs approval (for TPO and PC users)
  if (requireApproval && (user.role === 'tpo' || user.role === 'pc') && user.status !== 'approved') {
    console.log(`ProtectedRoute - ${user.role.toUpperCase()} user not approved, redirecting to login`);
    // Clear the unapproved user data
    if (user.role === 'tpo') {
      localStorage.removeItem('tpoUser');
      return <Navigate to="/tpo/login" replace />;
    } else if (user.role === 'pc') {
      localStorage.removeItem('pcUser');
      return <Navigate to="/pc/login" replace />;
    }
  }

  // Check role permissions if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`ProtectedRoute - User role '${user.role}' not in allowed roles:`, allowedRoles);
    
    // Redirect based on user role to their appropriate dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'tpo') {
      return <Navigate to="/tpo/dashboard" replace />;
    } else if (user.role === 'pc') {
      return <Navigate to="/pc/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

// Specific wrapper for TPO routes
export const TPOProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['tpo']}
      redirectPath="/tpo/login"
      requireApproval={true}
    >
      {children}
    </ProtectedRoute>
  );
};

// Specific wrapper for Admin routes
export const AdminProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['admin']}
      redirectPath="/admin/login"
      requireApproval={false}
    >
      {children}
    </ProtectedRoute>
  );
};

// Specific wrapper for PC routes
export const PCProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['pc']}
      redirectPath="/pc/login"
      requireApproval={true}
    >
      {children}
    </ProtectedRoute>
  );
};

// Wrapper for routes accessible by both TPO and Admin
export const SharedProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['tpo', 'admin']}
      redirectPath="/"
      requireApproval={true}
    >
      {children}
    </ProtectedRoute>
  );
};

// Wrapper for routes accessible by TPO, Admin, and PC
export const AllRolesProtectedRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={['tpo', 'admin', 'pc']}
      redirectPath="/"
      requireApproval={true}
    >
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;