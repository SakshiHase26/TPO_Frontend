import { useState, useEffect } from 'react';
import TpoLayout from '../../components/TPO/TpoLayout';
// import { useNavigate } from "react-router-dom";

import { Check, X, Eye, Search, Filter, AlertCircle, Calendar, User, Mail, Phone, Building } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/tpo/pc-approvals';

export default function PCApprovals() {
  
  // State management
  const [pcRegistrations, setPcRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  // const navigate = useNavigate();
  // Filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortDir, setSortDir] = useState('desc');
  
  // Modal states
  const [selectedPC, setSelectedPC] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view', 'approve', 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalComments, setApprovalComments] = useState('');
  
  // Toast notification
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch PC registrations
  const fetchPCRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        status: statusFilter,
        sortBy: sortBy,
        sortDir: sortDir
      });
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_BASE_URL}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch PC registrations');
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setPcRegistrations(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load PC registrations. Please try again.');
      console.error('Error fetching PC registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (response.ok) {
        const stats = await response.json();
        console.log('Statistics:', stats); // Debug log
        setStatistics(stats);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Effects
  useEffect(() => {
    fetchPCRegistrations();
  }, [currentPage, statusFilter, searchTerm, sortBy, sortDir]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Handle approve PC
  const handleApprove = async (pcId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${pcId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: approvalComments,
          approvedBy: 'TPO Admin' // You might want to get this from user context
        })
      });

      if (!response.ok) throw new Error('Failed to approve PC registration');

      const updatedPC = await response.json();
      
      // Update local state
      setPcRegistrations(prev => 
        prev.map(pc => pc.id === pcId ? updatedPC : pc)
      );
      
      showNotification('PC registration approved successfully!', 'success');
      closeModal();
      fetchStatistics(); // Refresh stats
    } catch (err) {
      showNotification('Failed to approve PC registration', 'error');
      console.error('Error approving PC:', err);
    }
  };

  // Handle reject PC
  const handleReject = async (pcId) => {
    if (!rejectionReason.trim()) {
      showNotification('Please provide a rejection reason', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${pcId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: rejectionReason,
          rejectedBy: 'TPO Admin' // You might want to get this from user context
        })
      });

      if (!response.ok) throw new Error('Failed to reject PC registration');

      const updatedPC = await response.json();
      
      // Update local state
      setPcRegistrations(prev => 
        prev.map(pc => pc.id === pcId ? updatedPC : pc)
      );
      
      showNotification('PC registration rejected', 'success');
      closeModal();
      fetchStatistics(); // Refresh stats
    } catch (err) {
      showNotification('Failed to reject PC registration', 'error');
      console.error('Error rejecting PC:', err);
    }
  };

  // Modal handlers
  const openModal = (pc, type) => {
    setSelectedPC(pc);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedPC(null);
    setModalType('');
    setRejectionReason('');
    setApprovalComments('');
  };

  // Notification handler
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  // Helper function to normalize status
  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    return status.toString().toLowerCase();
  };

  // Helper function to check if status is pending
  const isPendingStatus = (status) => {
    const normalized = normalizeStatus(status);
    return normalized === 'pending' || normalized === 'null' || !status;
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const normalizedStatus = normalizeStatus(status);
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'approved': return 'Approved';
        case 'rejected': return 'Rejected';
        case 'pending': return 'Pending';
        default: return 'Pending';
      }
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(normalizedStatus)}`}>
        {getStatusText(normalizedStatus)}
      </span>
    );
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TpoLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PC Registration Approvals</h1>
              <p className="text-gray-600 mt-1">Review and manage Placement Cell registration requests</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{statistics.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{statistics.approved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{statistics.rejected}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-blue-600">{statistics.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDir(direction);
                }}
              >
                <option value="registrationDate-desc">Newest First</option>
                <option value="registrationDate-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center max-w-md ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading PC registrations...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchPCRegistrations}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : pcRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No PC registrations found</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PC Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Information
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pcRegistrations.map((pc) => {
                      console.log('PC Status:', pc.approvalStatus, 'Is Pending:', isPendingStatus(pc.approvalStatus)); // Debug log
                      return (
                        <tr key={pc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{pc.name}</div>
                                <div className="text-sm text-gray-500">ID: {pc.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 flex items-center mb-1">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {pc.collegeEmail}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {pc.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(pc.registrationDate)}</div>
                            {pc.approvedDate && (
                              <div className="text-sm text-gray-500">
                                Approved: {formatDate(pc.approvedDate)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={pc.approvalStatus} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal(pc, 'view')}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {isPendingStatus(pc.approvalStatus) && (
                                <>
                                  <button
                                    onClick={() => openModal(pc, 'approve')}
                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                    title="Approve"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => openModal(pc, 'reject')}
                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min((currentPage + 1) * pageSize, totalElements)}
                      </span>{' '}
                      of <span className="font-medium">{totalElements}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + Math.max(0, currentPage - 2);
                        if (page >= totalPages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page + 1}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {selectedPC && modalType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalType === 'view' && 'PC Registration Details'}
                  {modalType === 'approve' && 'Approve PC Registration'}
                  {modalType === 'reject' && 'Reject PC Registration'}
                </h3>
              </div>
              
              <div className="px-6 py-4">
                {/* PC Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-sm text-gray-900">{selectedPC.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-sm text-gray-900">{selectedPC.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
                    <p className="text-sm text-gray-900">{selectedPC.collegeEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedPC.registrationDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <StatusBadge status={selectedPC.approvalStatus} />
                  </div>
                </div>

                {/* Action-specific fields */}
                {modalType === 'approve' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approval Comments (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add any comments for this approval..."
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                    />
                  </div>
                )}

                {modalType === 'reject' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Please provide a reason for rejecting this registration..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Show rejection reason if already rejected */}
                {selectedPC.rejectionReason && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                    <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200">
                      {selectedPC.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {modalType === 'view' ? 'Close' : 'Cancel'}
                </button>
                
                {modalType === 'approve' && (
                  <button
                    onClick={() => handleApprove(selectedPC.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700"
                  >
                    Approve Registration
                  </button>
                )}
                
                {modalType === 'reject' && (
                  <button
                    onClick={() => handleReject(selectedPC.id)}
                    disabled={!rejectionReason.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject Registration
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TpoLayout>
  );
}