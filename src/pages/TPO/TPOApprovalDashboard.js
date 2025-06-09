import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, MapPin, Building, Users, Clock, AlertCircle, Filter, Search, ChevronDown } from 'lucide-react';

const TPOApprovalDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [statistics, setStatistics] = useState({});
  
  // Mock TPO ID - in real app, get from auth context
  const TPO_ID = 1;

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api/notices';

  // Status options for dropdown
  const statusOptions = [
    { value: 'all', label: 'All Notices', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch notices based on status
  const fetchNoticesByStatus = async (status) => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}`;
      
      switch (status) {
        case 'pending':
          url += '/pending-approval';
          break;
        case 'approved':
          url += '/status/approved';
          break;
        case 'rejected':
          url += '/status/rejected';
          break;
        case 'all':
        default:
          url += ''; // Get all notices
          break;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        const noticesData = data.notices || [];
        setNotices(noticesData);
        setFilteredNotices(noticesData);
      } else {
        console.error('Error fetching notices:', data.error);
        setNotices([]);
        setFilteredNotices([]);
      }
    } catch (error) {
      console.error('Network error:', error);
      setNotices([]);
      setFilteredNotices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      const data = await response.json();
      if (response.ok) {
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Approve notice
  const approveNotice = async (noticeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${noticeId}/approve/${TPO_ID}`, {
        method: 'PUT',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Notice approved successfully!');
        // Refresh current view
        fetchNoticesByStatus(filterStatus);
        fetchStatistics();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error approving notice:', error);
      alert('Network error occurred');
    }
  };

  // Reject notice
  const rejectNotice = async (noticeId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${noticeId}/reject/${TPO_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim()
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedNotice(null);
        alert('Notice rejected successfully!');
        // Refresh current view
        fetchNoticesByStatus(filterStatus);
        fetchStatistics();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error rejecting notice:', error);
      alert('Network error occurred');
    }
  };

  // Handle status filter change
  const handleStatusChange = (newStatus) => {
    setFilterStatus(newStatus);
    fetchNoticesByStatus(newStatus);
  };

  // Filter notices based on search term
  useEffect(() => {
    let filtered = notices;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notice => 
        notice.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.jobLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotices(filtered);
  }, [searchTerm, notices]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { label: 'PENDING REVIEW', color: 'bg-yellow-100 text-yellow-800' },
      'APPROVED': { label: 'APPROVED', color: 'bg-green-100 text-green-800' },
      'REJECTED': { label: 'REJECTED', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig['PENDING'];
    return (
      <span className={`${config.color} px-2 py-1 rounded-full text-xs font-medium`}>
        {config.label}
      </span>
    );
  };

  // Initialize data
  useEffect(() => {
    fetchNoticesByStatus(filterStatus);
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TPO Approval Dashboard</h1>
              <p className="text-gray-600">Review and manage placement notices</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                TPO Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.pending || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.approved || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.rejected || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter and Status Dropdown */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by company, role, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-48"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          </div>
          
          <button
            onClick={() => fetchNoticesByStatus(filterStatus)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Current Filter Display */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusOptions.find(opt => opt.value === filterStatus)?.color || 'bg-gray-100 text-gray-800'
            }`}>
              {statusOptions.find(opt => opt.value === filterStatus)?.label}
            </span>
            <span className="text-sm text-gray-600">({filteredNotices.length} notices)</span>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-6">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No notices found</p>
              <p className="text-gray-500">
                {filterStatus === 'all' ? 'No notices available' : 
                 filterStatus === 'pending' ? 'No pending notices' :
                 filterStatus === 'approved' ? 'No approved notices' :
                 'No rejected notices'}
              </p>
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div key={notice.noticeId} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{notice.companyName}</h3>
                      <p className="text-lg text-blue-600 font-medium">{notice.jobRole}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(notice.status)}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{notice.jobLocation}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="text-sm">{notice.jobType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">{notice.modeOfWork}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">Apply by: {formatDate(notice.lastDateToApply)}</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="text-sm font-medium">₹ {notice.packageDetails}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Created: {formatDate(notice.createdAt)}</span>
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Created by:</span> {notice.creatorName} ({notice.creatorEmail})
                    </p>
                  </div>

                  {/* Approval/Rejection Info */}
                  {notice.status === 'APPROVED' && notice.approvedBy && (
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Approved by:</span> {notice.approvedBy} on {formatDate(notice.approvedAt)}
                      </p>
                    </div>
                  )}

                  {notice.status === 'REJECTED' && notice.rejectedBy && (
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">Rejected by:</span> {notice.rejectedBy} on {formatDate(notice.rejectedAt)}
                      </p>
                      {notice.rejectionReason && (
                        <p className="text-sm text-red-700 mt-1">
                          <span className="font-medium">Reason:</span> {notice.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Campus & Streams */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Eligible Campus & Streams:</h4>
                    <div className="flex flex-wrap gap-2">
                      {notice.campusStreams?.map((cs, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          {cs.campusName} - {cs.streamName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      onClick={() => setSelectedNotice(notice)}
                      className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    
                    {notice.status === 'PENDING' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedNotice(notice);
                            setShowRejectModal(true);
                          }}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                        <button
                          onClick={() => approveNotice(notice.noticeId)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notice Details Modal */}
      {selectedNotice && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Notice Details</h2>
                  {getStatusBadge(selectedNotice.status)}
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Job Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Company:</span> {selectedNotice.companyName}</p>
                      <p><span className="font-medium">Role:</span> {selectedNotice.jobRole}</p>
                      <p><span className="font-medium">Type:</span> {selectedNotice.jobType}</p>
                      <p><span className="font-medium">Location:</span> {selectedNotice.jobLocation}</p>
                      <p><span className="font-medium">Package:</span> {selectedNotice.packageDetails}</p>
                      <p><span className="font-medium">Mode:</span> {selectedNotice.modeOfWork}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Performance Based:</span> {selectedNotice.performanceBased ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Joining:</span> {selectedNotice.joiningDetails}</p>
                      <p><span className="font-medium">Responsibilities:</span> {selectedNotice.jobResponsibilities}</p>
                    </div>
                  </div>
                </div>

                {selectedNotice.customJoiningText && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Joining Details</h3>
                    <p className="text-gray-700">{selectedNotice.customJoiningText}</p>
                  </div>
                )}

                {selectedNotice.customResponsibilities && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Job Responsibilities</h3>
                    <p className="text-gray-700">{selectedNotice.customResponsibilities}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedNotice.googleFormLink && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Application Form</h3>
                      <a href={selectedNotice.googleFormLink} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline break-all">
                        {selectedNotice.googleFormLink}
                      </a>
                    </div>
                  )}

                  {selectedNotice.whatsappGroupLink && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Group</h3>
                      <a href={selectedNotice.whatsappGroupLink} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline break-all">
                        {selectedNotice.whatsappGroupLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {selectedNotice.status === 'PENDING' && (
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Notice
                  </button>
                  <button
                    onClick={() => {
                      approveNotice(selectedNotice.noticeId);
                      setSelectedNotice(null);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Notice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Notice</h2>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting the notice from <strong>{selectedNotice.companyName}</strong>:
              </p>
              
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedNotice(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => rejectNotice(selectedNotice.noticeId)}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
                >
                  Reject Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TPOApprovalDashboard;