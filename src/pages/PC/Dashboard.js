import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { X, Copy, Download, Share2, ThumbsUp, FileCog } from 'lucide-react';
import { Filter, Trash2, RefreshCw } from 'lucide-react';
import { ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Mail, MessageCircle, Check } from 'lucide-react';
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
    Plus,
    Eye,
    Edit3,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';



// Declare at the top or appropriate scope
// ######################################################################################################
// let mockNotices = [];
// #######################################################################################################
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    // ##########################################################################################################################################33333

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [streamFilter, setStreamFilter] = useState('All');
    const [selectedNotices, setSelectedNotices] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    // #############################################################################################33

    const [mockNotices, setNotices] = useState([]);

    const fetchNotices = async (token) => {
    setLoading(true);
    setError(false);
    try {
        const response = await axios.get('http://localhost:5000/api/notices', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Debug: Log the actual response structure (remove after fixing)
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Type of response.data:', typeof response.data);
        console.log('Is array?', Array.isArray(response.data));

        // Handle different possible response structures
        let noticesArray;
        
        if (Array.isArray(response.data)) {
            // Case 1: Direct array response
            noticesArray = response.data;
        } else if (response.data && Array.isArray(response.data.notices)) {
            // Case 2: { notices: [...] }
            noticesArray = response.data.notices;
        } else if (response.data && Array.isArray(response.data.data)) {
            // Case 3: { data: [...] }
            noticesArray = response.data.data;
        } else if (response.data && Array.isArray(response.data.results)) {
            // Case 4: { results: [...] }
            noticesArray = response.data.results;
        } else {
            // Unexpected structure
            console.error('Unexpected response structure:', response.data);
            console.error('Expected an array or object with array property');
            setError(true);
            setNotices([]);
            return [];
        }

        // Validate we have an array
        if (!Array.isArray(noticesArray)) {
            console.error('Expected array but got:', typeof noticesArray, noticesArray);
            setError(true);
            setNotices([]);
            return [];
        }

        // Handle empty array
        if (noticesArray.length === 0) {
            console.log('No notices found');
            setNotices([]);
            return [];
        }

        // Transform backend response
        const transformedNotices = noticesArray.map(n => {
            // Add null checks for safety
            if (!n) {
                console.warn('Null or undefined notice item found');
                return null;
            }

            return {
                id: n.noticeId,
                title: `${n.jobRole || 'Unknown Role'} - ${n.companyName || 'Unknown Company'}`,
                description: n.customResponsibilities || 'No description provided.',
                stream: n.campusStreams?.[0]?.streamName || 'General',
                status: capitalizeFirst(n.status || 'unknown'),
                deadline: n.lastDateToApply,
                createdDate: formatDate(n.createdAt),
                submittedDate: formatDate(n.createdAt),
                approvedDate: formatDate(n.approvedAt),
                rejectedDate: n.status === 'REJECTED' ? formatDate(n.updatedAt) : null,
                rejectionReason: n.rejectionReason || null,
                company: n.companyName,
                salary: n.packageDetails,
                location: n.jobLocation,
                attachments: [], // You can handle this when your backend supports it
                jobType: n.jobType,
                modeOfWork: n.modeOfWork,
                joiningDetails: n.customJoiningText,
                googleFormLink: n.googleFormLink,
                creatorName: n.creatorName,
                approverName: n.approverName
            };
        }).filter(notice => notice !== null); // Remove any null entries

        console.log('Transformed notices:', transformedNotices);
        setNotices(transformedNotices);
        return transformedNotices; // Fixed: was returning mockNotices

    } catch (error) {
        console.error("Error fetching notices:", error);
        
        // More detailed error logging
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        
        setError(true);
        setNotices([]);
        throw error;
    } finally {
        setLoading(false);
    }
};

    // Utility functions
    const formatDate = (isoString) => {
        return isoString ? isoString.split('T')[0] : null;
    };

    const capitalizeFirst = (text) => {
        return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
    };

    // Authentication check on component mount
    useEffect(() => {

        const token = localStorage.getItem("token");

        let db = fetchNotices();

        // Redirect to login if no token found

        if (!token) {
            navigate("/pc/login");
        }
    }, [navigate]);

    // Navigation items for PC Dashboard
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/pc/dashboard' },
        { id: 'createNotice', label: 'Create Job Notice', icon: <Plus size={20} />, path: '/create-notice' },
        { id: 'manageNotices', label: 'Manage Notices', icon: <FileText size={20} />, path: '/manage-notices' },
        { id: 'studentOverview', label: 'Student Overview', icon: <Users size={20} />, path: '/student-overview' },
        { id: 'notifications', label: 'Send Notifications', icon: <MessageSquare size={20} />, path: '/notifications' },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' }
    ];

    // Mock data for demonstration










    // const mockNotices = [
    //     {
    //         id: 1,
    //         title: 'Software Engineer - TCS',
    //         description: 'Full-time software development role requiring strong programming skills in Java and Python.',
    //         stream: 'Computer Science',
    //         status: 'Approved',
    //         deadline: '2024-06-15',
    //         createdDate: '2024-05-15',
    //         submittedDate: '2024-05-16',
    //         approvedDate: '2024-05-18',
    //         company: 'Tata Consultancy Services',
    //         salary: '₹6-8 LPA',
    //         location: 'Mumbai',
    //         attachments: ['TCS_JD.pdf', 'Requirements.pdf']
    //     },
    //     {
    //         id: 2,
    //         title: 'Data Analyst - Infosys',
    //         description: 'Analyzing business data and creating reports using SQL and Excel.',
    //         stream: 'Information Technology',
    //         status: 'Pending',
    //         deadline: '2024-06-20',
    //         createdDate: '2024-05-20',
    //         submittedDate: '2024-05-21',
    //         company: 'Infosys Limited',
    //         salary: '₹5-7 LPA',
    //         location: 'Bangalore',
    //         attachments: ['Infosys_JD.pdf']
    //     },
    //     {
    //         id: 3,
    //         title: 'Marketing Executive - Wipro',
    //         description: 'Digital marketing and brand management role.',
    //         stream: 'Business Administration',
    //         status: 'Rejected',
    //         deadline: '2024-06-10',
    //         createdDate: '2024-05-10',
    //         submittedDate: '2024-05-12',
    //         rejectedDate: '2024-05-14',
    //         rejectionReason: 'Incomplete job description. Please provide more details about required qualifications.',
    //         company: 'Wipro Technologies',
    //         salary: '₹4-6 LPA',
    //         location: 'Pune',
    //         attachments: ['Wipro_JD.pdf']
    //     },
    //     {
    //         id: 4,
    //         title: 'Mechanical Engineer - Mahindra',
    //         description: 'Design and development of automotive components.',
    //         stream: 'Mechanical Engineering',
    //         status: 'Approved',
    //         deadline: '2024-07-01',
    //         createdDate: '2024-05-25',
    //         submittedDate: '2024-05-26',
    //         approvedDate: '2024-05-28',
    //         company: 'Mahindra & Mahindra',
    //         salary: '₹7-9 LPA',
    //         location: 'Chennai',
    //         attachments: ['Mahindra_JD.pdf', 'Technical_Requirements.pdf']
    //     }
    // ];

    const streams = ['All', 'Computer Science', 'Information Technology', 'Business Administration', 'Mechanical Engineering', 'Electrical Engineering'];
    const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'Pending':
                return <Clock size={16} className="text-yellow-600" />;
            case 'Rejected':
                return <XCircle size={16} className="text-red-600" />;
            default:
                return null;
        }
    };

    const filteredNotices = mockNotices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notice.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || notice.status === statusFilter;
        const matchesStream = streamFilter === 'All' || notice.stream === streamFilter;

        return matchesSearch && matchesStatus && matchesStream;
    });

    const handleSelectNotice = (noticeId) => {
        setSelectedNotices(prev =>
            prev.includes(noticeId)
                ? prev.filter(id => id !== noticeId)
                : [...prev, noticeId]
        );
    };

    const handleSelectAll = () => {
        if (selectedNotices.length === filteredNotices.length) {
            setSelectedNotices([]);
        } else {
            setSelectedNotices(filteredNotices.map(notice => notice.id));
        }
    };

    const handleViewNotice = (notice) => {
        setSelectedNotice(notice);
        setShowViewModal(true);
    };

    const handleEditNotice = (notice) => {
        setSelectedNotice(notice);
        setShowEditModal(true);
    };

    const handleDeleteNotice = (noticeId) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            console.log('Delete notice:', noticeId);
            // Implement delete logic
        }
    };

    const handleResubmit = (notice) => {
        console.log('Resubmit notice:', notice.id);
        // Implement resubmit logic
    };

    const ViewModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-semibold text-gray-800">Job Notice Details</h3>
                        <button
                            onClick={() => setShowViewModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {selectedNotice && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Job Title</label>
                                        <p className="text-gray-800">{selectedNotice.title}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Company</label>
                                        <p className="text-gray-800">{selectedNotice.company}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Stream</label>
                                        <p className="text-gray-800">{selectedNotice.stream}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Location</label>
                                        <p className="text-gray-800">{selectedNotice.location}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Salary</label>
                                        <p className="text-gray-800">{selectedNotice.salary}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Status & Timeline</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Current Status</label>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(selectedNotice.status)}
                                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(selectedNotice.status)}`}>
                                                {selectedNotice.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Application Deadline</label>
                                        <p className="text-gray-800">{selectedNotice.deadline}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Created Date</label>
                                        <p className="text-gray-800">{selectedNotice.createdDate}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Submitted Date</label>
                                        <p className="text-gray-800">{selectedNotice.submittedDate}</p>
                                    </div>
                                    {selectedNotice.approvedDate && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Approved Date</label>
                                            <p className="text-gray-800">{selectedNotice.approvedDate}</p>
                                        </div>
                                    )}
                                    {selectedNotice.rejectedDate && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Rejected Date</label>
                                            <p className="text-gray-800">{selectedNotice.rejectedDate}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h4>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedNotice.description}</p>
                        </div>

                        {selectedNotice.rejectionReason && (
                            <div>
                                <h4 className="text-lg font-semibold text-red-600 mb-3">Rejection Reason</h4>
                                <p className="text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">{selectedNotice.rejectionReason}</p>
                            </div>
                        )}

                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Attachments</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedNotice.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                        <Download size={16} className="text-blue-600" />
                                        <span className="text-blue-800 text-sm">{file}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    //   ##################################################################################################################################################################


    // Mock student data
    const mockStudents = [
        { id: 1, name: "Rahul Sharma", rollNo: "CSE2021001", email: "rahul.sharma@college.edu", phone: "+91 9876543210", year: 4, cgpa: 8.5, stream: "Computer Science" },
        { id: 2, name: "Priya Patel", rollNo: "CSE2021002", email: "priya.patel@college.edu", phone: "+91 9876543211", year: 4, cgpa: 9.2, stream: "Computer Science" },
        { id: 3, name: "Amit Kumar", rollNo: "CSE2021003", email: "amit.kumar@college.edu", phone: "+91 9876543212", year: 3, cgpa: 7.8, stream: "Computer Science" },
        { id: 4, name: "Sneha Singh", rollNo: "CSE2021004", email: "sneha.singh@college.edu", phone: "+91 9876543213", year: 3, cgpa: 8.9, stream: "Computer Science" },
        { id: 5, name: "Vikash Gupta", rollNo: "CSE2021005", email: "vikash.gupta@college.edu", phone: "+91 9876543214", year: 2, cgpa: 8.1, stream: "Computer Science" },
        { id: 6, name: "Anjali Reddy", rollNo: "ECE2021006", email: "anjali.reddy@college.edu", phone: "+91 9876543215", year: 2, cgpa: 9.0, stream: "Electronics" },
        { id: 7, name: "Rohit Jain", rollNo: "MECH2021007", email: "rohit.jain@college.edu", phone: "+91 9876543216", year: 1, cgpa: 7.5, stream: "Mechanical" },
        { id: 8, name: "Kavya Nair", rollNo: "CSE2021008", email: "kavya.nair@college.edu", phone: "+91 9876543217", year: 1, cgpa: 8.7, stream: "Computer Science" },
        { id: 9, name: "Arjun Menon", rollNo: "ECE2021009", email: "arjun.menon@college.edu", phone: "+91 9876543218", year: 3, cgpa: 8.3, stream: "Electronics" },
        { id: 10, name: "Deepika Agarwal", rollNo: "MECH2021010", email: "deepika.agarwal@college.edu", phone: "+91 9876543219", year: 2, cgpa: 8.8, stream: "Mechanical" },
    ];

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sort students based on current sort config
    const sortedStudents = useMemo(() => {
        if (!sortConfig.key) return mockStudents;

        return [...mockStudents].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (sortConfig.key === 'cgpa') {
                // Numeric sorting for CGPA
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            } else {
                // String sorting for other fields
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }
        });
    }, [sortConfig]);

    // Get sort icon for a column
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="w-4 h-4 text-blue-600" />
            : <ChevronDown className="w-4 h-4 text-blue-600" />;
    };

    //   ##############################################################################################################

    // Logout handler from your original dashboard
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };





    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted');
    };

    const [activeNTab, setActiveNTab] = useState('job-details');
    const [formData, setFormData] = useState({
        jobType: '',
        companyName: '',
        selectedCampuses: [], // Changed from single to multiple
        eligibleStream: [], // Changed to array for multiple streams  
        jobLocation: '',
        jobRole: '',
        packageDetails: '',
        performanceBased: false,
        modeOfWork: 'Office',
        lastDateToApply: '',
        joiningDetails: 'immediate',
        customJoiningText: '',
        jobResponsibilities: 'refer',
        customResponsibilities: '',
        googleFormLink: '',
        whatsappGroupLink: '',
        eligibleBatches: [],
        coordinators: []
    });
    const campusData = {
        'Main Campus': ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'],
        'North Campus': ['Computer Science', 'Mechanical', 'Electrical', 'Chemical'],
        'South Campus': ['Information Technology', 'Electronics', 'Biotech', 'Environmental'],
        'East Campus': ['Computer Science', 'Data Science', 'AI/ML', 'Cybersecurity']
    };

    const availableCampuses = Object.keys(campusData);


    const getAvailableStreams = () => {
        if (formData.selectedCampuses.length === 0) return [];

        const allStreams = formData.selectedCampuses.reduce((streams, campus) => {
            const campusStreams = campusData[campus] || [];
            return [...streams, ...campusStreams];
        }, []);

        // Remove duplicates
        return [...new Set(allStreams)];
    };

    const handleCampusSelection = (campus) => {
        const updatedCampuses = formData.selectedCampuses.includes(campus)
            ? formData.selectedCampuses.filter(c => c !== campus)
            : [...formData.selectedCampuses, campus];

        updateFormData('selectedCampuses', updatedCampuses);

        // Reset streams when campus selection changes
        if (updatedCampuses.length === 0) {
            updateFormData('eligibleStream', []);
        } else {
            // Remove streams that are no longer available
            const availableStreams = updatedCampuses.reduce((streams, campusName) => {
                const campusStreams = campusData[campusName] || [];
                return [...streams, ...campusStreams];
            }, []);
            const uniqueAvailableStreams = [...new Set(availableStreams)];

            const validStreams = formData.eligibleStream.filter(stream =>
                uniqueAvailableStreams.includes(stream)
            );
            updateFormData('eligibleStream', validStreams);
        }
    };

    const handleStreamSelection = (stream) => {
        const updatedStreams = formData.eligibleStream.includes(stream)
            ? formData.eligibleStream.filter(s => s !== stream)
            : [...formData.eligibleStream, stream];

        updateFormData('eligibleStream', updatedStreams);
    };

    const removeCampus = (campus) => {
        handleCampusSelection(campus);
    };

    const removeStream = (stream) => {
        handleStreamSelection(stream);
    };


    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addCoordinator = () => {
        setFormData(prev => ({
            ...prev,
            coordinators: [...prev.coordinators, { name: '', phone: '' }]
        }));
    };

    const updateCoordinator = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            coordinators: prev.coordinators.map((coord, i) =>
                i === index ? { ...coord, [field]: value } : coord
            )
        }));
    };

    const removeCoordinator = (index) => {
        setFormData(prev => ({
            ...prev,
            coordinators: prev.coordinators.filter((_, i) => i !== index)
        }));
    };

    const toggleBatch = (year) => {
        setFormData(prev => ({
            ...prev,
            eligibleBatches: prev.eligibleBatches.includes(year)
                ? prev.eligibleBatches.filter(b => b !== year)
                : [...prev.eligibleBatches, year]
        }));
    };

    const generateNotice = () => {
        let notice = "*FINAL PLACEMENT NOTICE*\n";
        notice += `For ${formData.eligibleBatches.sort().join(', ')} Batch\n\n`;

        if (formData.companyName) notice += `*Company:* ${formData.companyName}\n\n`;
        if (formData.selectedCampuses) notice += `*Campus: * ${formData.selectedCampuses} \n\n`
        if (formData.eligibleStream) notice += `*Eligible Stream:* ${formData.eligibleStream}\n\n`;
        if (formData.jobLocation) notice += `*Job Location:* ${formData.jobLocation}\n\n`;
        if (formData.jobRole) notice += `*Job Role:* ${formData.jobRole}\n\n`;
        if (formData.packageDetails) notice += `*Package:* ${formData.packageDetails}${formData.performanceBased ? ' (Performance Based)' : ''}\n\n`;

        notice += `*Joining:* ${formData.joiningDetails === 'immediate' ? 'Immediate Joiner' : formData.customJoiningText}\n\n`;
        notice += `*Mode of Work:* ${formData.modeOfWork}\n\n`;

        if (formData.jobResponsibilities === 'refer') {
            notice += "*Job Responsibilities:* Refer JD\n\n";
        } else if (formData.customResponsibilities) {
            notice += `*Job Responsibilities:* ${formData.customResponsibilities}\n\n`;
        }

        if (formData.lastDateToApply) notice += `*Last Date to Apply:* ${formData.lastDateToApply}\n\n`;
        if (formData.googleFormLink) notice += `*Google Form Link:* ${formData.googleFormLink}\n\n`;
        if (formData.whatsappGroupLink) notice += `*WhatsApp Group Link:* ${formData.whatsappGroupLink}\n\n`;

        if (formData.coordinators.length > 0) {
            notice += "*Placement Coordinators:*\n";
            formData.coordinators.forEach(coord => {
                if (coord.name && coord.phone) {
                    notice += `${coord.name}: ${coord.phone}\n`;
                }
            });
        }

        return notice;
    };

    // Enhanced PDF with better styling
    const generateEnhancedPDF = (formData) => {
        try {
            // Check if jsPDF is available
            if (!window.jspdf) {
                throw new Error('jsPDF library is not loaded. Please add the CDN script to your HTML.');
            }

            const doc = new window.jspdf.jsPDF();

            // Page setup
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = 25;

            // Header with college/institute branding
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('INDIRA GROUP OF INSTITUTES', pageWidth / 2, yPosition, { align: 'center' });

            yPosition += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Placement Cell', pageWidth / 2, yPosition, { align: 'center' });

            yPosition += 15;

            // Main title
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('FINAL PLACEMENT NOTICE', pageWidth / 2, yPosition, { align: 'center' });

            // Decorative line
            yPosition += 8;
            doc.setLineWidth(1);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 15;

            // Batch information
            if (formData.eligibleBatches.length > 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                const batchText = `For ${formData.eligibleBatches.sort().join(', ')} Batch`;
                doc.text(batchText, pageWidth / 2, yPosition, { align: 'center' });
                yPosition += 15;
            }

            // Content sections
            const sections = [
                { label: 'Company', value: formData.companyName },
                { label: 'Job Role', value: formData.jobRole },
                { label: 'Eligible Stream', value: formData.eligibleStream },
                { label: 'Job Location', value: formData.jobLocation },
                {
                    label: 'Package',
                    value: formData.packageDetails ?
                        `${formData.packageDetails}${formData.performanceBased ? ' (Performance Based)' : ''}` : ''
                },
                {
                    label: 'Joining',
                    value: formData.joiningDetails === 'immediate' ? 'Immediate Joiner' : formData.customJoiningText
                },
                { label: 'Mode of Work', value: formData.modeOfWork },
                {
                    label: 'Job Responsibilities',
                    value: formData.jobResponsibilities === 'refer' ? 'Refer JD' : formData.customResponsibilities
                },
                { label: 'Last Date to Apply', value: formData.lastDateToApply },
                { label: 'Google Form Link', value: formData.googleFormLink },
                { label: 'WhatsApp Group Link', value: formData.whatsappGroupLink }
            ];

            sections.forEach(section => {
                if (section.value) {
                    // Check for page break
                    if (yPosition > pageHeight - 40) {
                        doc.addPage();
                        yPosition = 30;
                    }

                    // Label
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(11);
                    doc.text(`${section.label}:`, margin, yPosition);

                    // Value
                    doc.setFont('helvetica', 'normal');
                    const labelWidth = doc.getTextWidth(`${section.label}: `);
                    const maxWidth = pageWidth - margin * 2 - labelWidth;
                    const wrappedValue = doc.splitTextToSize(section.value, maxWidth);
                    doc.text(wrappedValue, margin + labelWidth, yPosition);

                    yPosition += Math.max(wrappedValue.length * 6, 10);
                }
            });

            // Coordinators section
            if (formData.coordinators.length > 0) {
                if (yPosition > pageHeight - 60) {
                    doc.addPage();
                    yPosition = 30;
                }

                yPosition += 5;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text('Placement Coordinators:', margin, yPosition);
                yPosition += 8;

                formData.coordinators.forEach(coord => {
                    if (coord.name && coord.phone) {
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(10);
                        doc.text(`• ${coord.name}: ${coord.phone}`, margin + 10, yPosition);
                        yPosition += 6;
                    }
                });
            }

            // Footer
            const currentDate = new Date().toLocaleDateString('en-IN');
            const currentTime = new Date().toLocaleTimeString('en-IN');

            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.text(`Generated on: ${currentDate} at ${currentTime}`, margin, pageHeight - 20);
            doc.text('Indira Group of Institutes - Placement Cell', pageWidth - margin, pageHeight - 20, { align: 'right' });

            // Save with better filename
            const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const companyName = formData.companyName ?
                formData.companyName.replace(/[^a-zA-Z0-9]/g, '_') : 'Company';
            const filename = `${companyName}_Placement_Notice_${timestamp}.pdf`;

            doc.save(filename);
            return true;

        } catch (error) {
            console.error('Error generating enhanced PDF:', error);
            alert(`Error generating PDF: ${error.message}`);
            return false;
        }
    };

    // Button click handler function
    const handleDownloadPDF = (formData) => {
        // Validate required fields
        if (!formData.companyName || formData.eligibleBatches.length === 0) {
            alert('Please fill in at least Company Name and select Eligible Batches before generating PDF.');
            return;
        }

        // Use the enhanced PDF generator
        const success = generateEnhancedPDF(formData);

        if (success) {
            // Optional: Show success message
            console.log('PDF downloaded successfully!');
        }
    };

    const copyNotice = () => {
        navigator.clipboard.writeText(generateNotice());
        alert('Notice copied to clipboard!');
    };

    const shareViaWhatsApp = () => {
        const notice = encodeURIComponent(generateNotice());
        window.open(`https://wa.me/?text=${notice}`, '_blank');
    };

    // ####################################################################################################################



    const [formNData, setFormNData] = useState({
        subject: '',
        message: '',
        priority: 'normal'
    });

    const [filters, setFilters] = useState({
        year: '',
        cgpaMin: '',
        cgpaMax: '',
        stream: '',
        searchTerm: ''
    });

    const [selectedStudents, setSelectedStudents] = useState([]);
    const [deliveryMethods, setDeliveryMethods] = useState({
        inApp: true,
        email: false,
        whatsapp: false
    });
    const [showFilters, setShowFilters] = useState(false);
    const [recipientMode, setRecipientMode] = useState('all'); // 'all', 'filtered', 'selected'

    // Get unique streams for filter dropdown
    const availableStreams = [...new Set(mockStudents.map(student => student.stream))].sort();

    // Filter students based on criteria
    const filteredStudents = useMemo(() => {
        return mockStudents.filter(student => {
            const yearMatch = !filters.year || student.year.toString() === filters.year;
            const cgpaMinMatch = !filters.cgpaMin || student.cgpa >= parseFloat(filters.cgpaMin);
            const cgpaMaxMatch = !filters.cgpaMax || student.cgpa <= parseFloat(filters.cgpaMax);
            const streamMatch = !filters.stream || student.stream === filters.stream;
            const searchMatch = !filters.searchTerm ||
                student.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                student.rollNo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

            return yearMatch && cgpaMinMatch && cgpaMaxMatch && streamMatch && searchMatch;
        });
    }, [filters]);

    // Get final recipient list based on mode
    const finalRecipients = useMemo(() => {
        switch (recipientMode) {
            case 'all':
                return mockStudents;
            case 'filtered':
                return filteredStudents;
            case 'selected':
                return selectedStudents;
            default:
                return [];
        }
    }, [recipientMode, filteredStudents, selectedStudents]);

    const handleInputChange = (e) => {
        setFormNData({ ...formNData, [e.target.name]: e.target.value });
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDeliveryMethodChange = (method) => {
        setDeliveryMethods({ ...deliveryMethods, [method]: !deliveryMethods[method] });
    };

    const handleStudentSelect = (student) => {
        const isSelected = selectedStudents.find(s => s.id === student.id);
        if (isSelected) {
            setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
        } else {
            setSelectedStudents([...selectedStudents, student]);
        }
    };

    const handleSelectAllN = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents([...filteredStudents]);
        }
    };

    const clearFilters = () => {
        setFilters({
            year: '',
            cgpaMin: '',
            cgpaMax: '',
            stream: '',
            searchTerm: ''
        });
    };

    const handleSendNotification = () => {
        const activeDeliveryMethods = Object.keys(deliveryMethods).filter(method => deliveryMethods[method]);

        console.log('Sending notification:', {
            subject: formNData.subject,
            message: formNData.message,
            priority: formNData.priority,
            recipients: finalRecipients.length,
            deliveryMethods: activeDeliveryMethods,
            recipientDetails: finalRecipients
        });

        // Here you would integrate with your API
        alert(`Notification sent to ${finalRecipients.length} students via ${activeDeliveryMethods.join(', ')}`);
    };




    // ###############################################################################################################

    // HERE ALL API CONSTRUCTION START:
    // Add these state variables to your component
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Validation function for form data
    const validateFormData = () => {
        // Required fields validation
        if (!formData.jobType) return "Job Type is required";
        if (!formData.companyName) return "Company Name is required";
        if (!formData.jobRole) return "Job Role is required";
        if (!formData.jobLocation) return "Job Location is required";
        if (!formData.packageDetails) return "Package Details is required";
        if (!formData.lastDateToApply) return "Last Date to Apply is required";
        if (formData.selectedCampuses.length === 0) return "At least one campus must be selected";
        if (formData.eligibleStream.length === 0) return "At least one stream must be selected";
        if (formData.eligibleBatches.length === 0) return "At least one batch must be selected";

        // Google Form Link validation
        if (!formData.googleFormLink) return "Google Form Link is required";
        if (!formData.googleFormLink.includes('https://forms.gle')) {
            return "Please provide a valid Google Form link";
        }

        // WhatsApp Group Link validation (if provided)
        if (formData.whatsappGroupLink && !formData.whatsappGroupLink.includes('chat.whatsapp.com')) {
            return "Please provide a valid WhatsApp group link";
        }

        // Coordinators validation
        if (formData.coordinators.length === 0) return "At least one coordinator is required";
        for (let i = 0; i < formData.coordinators.length; i++) {
            const coord = formData.coordinators[i];
            if (!coord.name || !coord.phone) {
                return `Coordinator ${i + 1}: Both name and phone are required`;
            }
            // Basic phone validation
            if (!/^[+]?[\d\s-()]{10,}$/.test(coord.phone)) {
                return `Coordinator ${i + 1}: Please provide a valid phone number`;
            }
        }

        // // Date validation
        // const today = new Date();
        // const applyDate = new Date(formData.lastDateToApply);
        // if (applyDate <= today) {
        //     return "Last Date to Apply should be a future date";
        // }

        return null; // No errors
    };

    // Main form submission handler
    const handleCreateNoticeSubmit = async (e) => {

        setError("");
        setSuccess("");

        // Validate form data
        const errorMsg = validateFormData();
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        setLoading(true);

        try {
            // Get token for authentication
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token not found. Please login again.");
                navigate("/login");
                return;
            }

            // Prepare data for API (matching your Postman structure)
            const apiData = {
                jobType: formData.jobType,
                companyName: formData.companyName,
                jobRole: formData.jobRole,
                jobLocation: formData.jobLocation,
                packageDetails: formData.packageDetails,
                performanceBased: formData.performanceBased,
                modeOfWork: formData.modeOfWork,
                lastDateToApply: formData.lastDateToApply,
                joiningDetails: formData.joiningDetails === 'immediate' ? 'immediate' : 'CUSTOM',
                customJoiningText: formData.joiningDetails === 'immediate' ? '' : formData.customJoiningText,
                jobResponsibilities: formData.jobResponsibilities === 'refer' ? 'refer' : 'CUSTOM',
                customResponsibilities: formData.jobResponsibilities === 'refer' ? '' : formData.customResponsibilities,
                googleFormLink: formData.googleFormLink,
                whatsappGroupLink: formData.whatsappGroupLink || null,
                createdBy: 1, // This should come from logged-in user context
                selectedCampusIds: formData.selectedCampuses.map(campus => {
                    // Map campus names to IDs (you might need to adjust this based on your backend)
                    const campusMap = {
                        'Main Campus': 1,
                        'North Campus': 2,
                        'South Campus': 3,
                        'East Campus': 4
                    };
                    return campusMap[campus] || 1;
                }),
                selectedStreamIds: formData.eligibleStream.map(stream => {
                    // Map stream names to IDs (you might need to adjust this based on your backend)
                    const streamMap = {
                        'Computer Science': 1,
                        'Information Technology': 2,
                        'Electronics': 3,
                        'Mechanical': 4,
                        'Civil': 5,
                        'Electrical': 6,
                        'Chemical': 7,
                        'Biotech': 8,
                        'Environmental': 9,
                        'Data Science': 10,
                        'AI/ML': 11,
                        'Cybersecurity': 12
                    };
                    return streamMap[stream] || 1;
                }),
                approvedBy: 1 // This should be set by admin/approver
            };

            // Make API call
            const response = await axios.post(
                "http://localhost:5000/api/notices/create",
                apiData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Handle success
            setSuccess("Job notice created successfully!");

            // Reset form data
            setFormData({
                jobType: '',
                companyName: '',
                selectedCampuses: [],
                eligibleStream: [],
                jobLocation: '',
                jobRole: '',
                packageDetails: '',
                performanceBased: false,
                modeOfWork: 'Office',
                lastDateToApply: '',
                joiningDetails: 'immediate',
                customJoiningText: '',
                jobResponsibilities: 'refer',
                customResponsibilities: '',
                googleFormLink: '',
                whatsappGroupLink: '',
                eligibleBatches: [],
                coordinators: []
            });

            // Optional: Navigate to manage notices or show success message
            setTimeout(() => {
                setActiveTab('manageNotices'); // Switch to manage notices tab
            }, 2000);

        } catch (err) {
            console.error('Error creating notice:', err);

            // Handle different types of errors
            if (err.response?.status === 401) {
                setError("Session expired. Please login again.");
                localStorage.removeItem("token");
                navigate("/login");
            } else if (err.response?.status === 403) {
                setError("You don't have permission to create notices.");
            } else {
                const backendError = err.response?.data;
                const message = typeof backendError === "string"
                    ? backendError
                    : backendError?.error || backendError?.message || "Failed to create notice. Please try again.";
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper function to clear messages
    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    // You can also add this helper function to handle draft saving
    const handleSaveDraft = async () => {
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token not found. Please login again.");
                return;
            }

            // Save as draft (you might need a different endpoint)
            const draftData = {
                ...formData,
                status: 'DRAFT'
            };

            const response = await axios.post(
                "http://localhost:5000/api/notices/draft",
                draftData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess("Draft saved successfully!");

        } catch (err) {
            console.error('Error saving draft:', err);
            setError("Failed to save draft. Please try again.");
        }
    };






    // #################################################################################################################
    return (

        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out`}>
                <div className="p-4 flex items-center justify-between">
                    <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
                        <UserCheck className="h-8 w-8 text-blue-300" />
                        {sidebarOpen && <span className="ml-3 text-xl font-bold">PC Portal</span>}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-1 rounded-md hover:bg-blue-700 ${!sidebarOpen && 'hidden'}`}
                    >
                        <Menu size={20} />
                    </button>
                </div>
                <div className="mt-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                            }}
                            className={`flex items-center w-full p-4 ${activeTab === item.id
                                ? 'bg-blue-900 border-l-4 border-white'
                                : 'hover:bg-blue-700'
                                } ${!sidebarOpen && 'justify-center'}`}
                        >
                            <div className={`${activeTab === item.id ? 'text-white' : 'text-blue-300'}`}>
                                {item.icon}
                            </div>
                            {sidebarOpen && <span className="ml-3">{item.label}</span>}
                        </button>
                    ))}
                </div>
                <div className="absolute bottom-0 w-full p-4">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${!sidebarOpen && 'justify-center w-full'} text-blue-300 hover:text-white`}
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
                                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
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
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                        PC
                                    </div>
                                    <div className="hidden md:block">
                                        <h2 className="text-sm font-medium">PC Coordinator</h2>
                                        <p className="text-xs text-gray-500">pc.cse@university.edu</p>
                                    </div>
                                    <ChevronDown size={16} />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</button>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {activeTab === 'dashboard' && (
                        <>
                            {/* Welcome Section - keeping your original welcome message */}
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                                <h1 className="text-3xl font-bold mb-2">Welcome to PC Dashboard</h1>
                                <p className="text-lg opacity-90">
                                    You are successfully logged in. Use this dashboard to manage placement cell activities.
                                </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Total Job Notices</h3>
                                        <p className="text-2xl font-semibold text-gray-800">{mockNotices.length}</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
                                        <p className="text-2xl font-semibold text-gray-800">3</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Approved Notices</h3>
                                        <p className="text-2xl font-semibold text-gray-800">10</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">CSE Students</h3>
                                        <p className="text-2xl font-semibold text-gray-800">142</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Job Notices */}
                                <div className="bg-white rounded-lg shadow">
                                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                        <h2 className="font-semibold text-gray-800">Recent Job Notices</h2>
                                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                            View All
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <div className="space-y-4">
                                            {mockNotices.slice(0, 3).map(notice => (
                                                <div key={notice.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                        {getStatusIcon(notice.status)}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">{notice.title}</p>
                                                            <p className="text-xs text-gray-500">Deadline: {notice.deadline}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(notice.status)}`}>
                                                        {notice.status}
                                                    </span>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow">
                                    <div className="p-4 border-b border-gray-200">
                                        <h2 className="font-semibold text-gray-800">Quick Actions</h2>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setActiveTab('createNotice')}
                                                className="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                            >
                                                <Plus className="h-8 w-8 text-blue-600 mb-2" />
                                                <span className="text-sm font-medium text-blue-600">Create Job Notice</span>
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('manageNotices')}
                                                className="flex flex-col items-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                                            >
                                                <FileText className="h-8 w-8 text-green-600 mb-2" />
                                                <span className="text-sm font-medium text-green-600">Manage Notices</span>
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('studentOverview')}
                                                className="flex flex-col items-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                                            >
                                                <Users className="h-8 w-8 text-purple-600 mb-2" />
                                                <span className="text-sm font-medium text-purple-600">View Students</span>
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('notifications')}
                                                className="flex flex-col items-center p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                                            >
                                                <MessageSquare className="h-8 w-8 text-orange-600 mb-2" />
                                                <span className="text-sm font-medium text-orange-600">Send Notifications</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Create Job Notice Content */}
                    {activeTab === 'createNotice' && (



                        <div className="min-h-screen bg-gray-50 p-4">
                            <div className="max-w-7xl mx-auto">
                                <h1 className="text-3xl font-bold text-gray-800 mb-8">Placement Notice Generator</h1>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Form Section */}

                                    <div className="bg-white rounded-lg shadow-sm border">
                                        {/* Tabs */}
                                        <div className="border-b border-gray-200">
                                            <nav className="flex space-x-8 px-6">
                                                {[
                                                    { id: 'job-details', label: 'Job Details' },
                                                    { id: 'links', label: 'Links' },
                                                    { id: 'coordinators', label: 'Coordinators' }
                                                ].map(tab => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveNTab(tab.id)}
                                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeNTab === tab.id
                                                            ? 'border-blue-500 text-blue-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                                            }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>

                                        <div className="p-6">
                                            {/* Job Details Tab */}
                                            {activeNTab === 'job-details' && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                                        <select
                                                            value={formData.jobType}
                                                            onChange={(e) => updateFormData('jobType', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select Job Type</option>
                                                            <option value="Full Time">Full Time</option>
                                                            <option value="Internship">Internship</option>
                                                            <option value="Part Time">Part Time</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                                        <input
                                                            type="text"
                                                            value={formData.companyName}
                                                            onChange={(e) => updateFormData('companyName', e.target.value)}
                                                            placeholder="Enter Company Name"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>



                                                    {/* Campus Selection */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Campus Selection <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="border border-gray-300 rounded-md p-3 min-h-[100px]">
                                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                                {availableCampuses.map((campus) => (
                                                                    <label key={campus} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={formData.selectedCampuses.includes(campus)}
                                                                            onChange={() => handleCampusSelection(campus)}
                                                                            className="mr-2 h-4 w-4 text-blue-600"
                                                                        />
                                                                        <span className="text-sm">{campus}</span>
                                                                    </label>
                                                                ))}
                                                            </div>

                                                            {/* Selected Campuses Tags */}
                                                            {formData.selectedCampuses.length > 0 && (
                                                                <div className="border-t pt-3">
                                                                    <p className="text-xs text-gray-600 mb-2">Selected Campuses:</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {formData.selectedCampuses.map((campus) => (
                                                                            <span
                                                                                key={campus}
                                                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                                                                            >
                                                                                {campus}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeCampus(campus)}
                                                                                    className="ml-1 hover:text-blue-600"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Stream Selection - Only show if campuses are selected */}
                                                    {formData.selectedCampuses.length > 0 && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Eligible Streams <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="border border-gray-300 rounded-md p-3 min-h-[100px]">
                                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                                    {getAvailableStreams().map((stream) => (
                                                                        <label key={stream} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={formData.eligibleStream.includes(stream)}
                                                                                onChange={() => handleStreamSelection(stream)}
                                                                                className="mr-2 h-4 w-4 text-green-600"
                                                                            />
                                                                            <span className="text-sm">{stream}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>

                                                                {/* Selected Streams Tags */}
                                                                {formData.eligibleStream.length > 0 && (
                                                                    <div className="border-t pt-3">
                                                                        <p className="text-xs text-gray-600 mb-2">Selected Streams:</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {formData.eligibleStream.map((stream) => (
                                                                                <span
                                                                                    key={stream}
                                                                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                                                                                >
                                                                                    {stream}
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => removeStream(stream)}
                                                                                        className="ml-1 hover:text-green-600"
                                                                                    >
                                                                                        <X size={12} />
                                                                                    </button>
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}



                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Stream</label>
                                                            <input
                                                                type="text"
                                                                value={formData.eligibleStream}
                                                                onChange={(e) => updateFormData('eligibleStream', e.target.value)}
                                                                placeholder="e.g. Computer Science, Mechanical"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>


                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Location</label>
                                                            <input
                                                                type="text"
                                                                value={formData.jobLocation}
                                                                onChange={(e) => updateFormData('jobLocation', e.target.value)}
                                                                placeholder="e.g. Pune, Remote"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
                                                        <input
                                                            type="text"
                                                            value={formData.jobRole}
                                                            onChange={(e) => updateFormData('jobRole', e.target.value)}
                                                            placeholder="e.g. Software Developer, Data Analyst"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Package Details</label>
                                                        <div className="flex items-center space-x-4">
                                                            <input
                                                                type="text"
                                                                value={formData.packageDetails}
                                                                onChange={(e) => updateFormData('packageDetails', e.target.value)}
                                                                placeholder="e.g. 5-8 LPA"
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.performanceBased}
                                                                    onChange={(e) => updateFormData('performanceBased', e.target.checked)}
                                                                    className="mr-2"
                                                                />
                                                                Performance Based
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Work</label>
                                                            <select
                                                                value={formData.modeOfWork}
                                                                onChange={(e) => updateFormData('modeOfWork', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="Office">Office</option>
                                                                <option value="Remote">Remote</option>
                                                                <option value="Hybrid">Hybrid</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Date to Apply</label>
                                                            <input
                                                                type="text"
                                                                value={formData.lastDateToApply}
                                                                onChange={(e) => updateFormData('lastDateToApply', e.target.value)}
                                                                placeholder="e.g. 15th August 2023"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Joining Details</label>
                                                        <div className="space-y-2">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="joining"
                                                                    value="immediate"
                                                                    checked={formData.joiningDetails === 'immediate'}
                                                                    onChange={(e) => updateFormData('joiningDetails', e.target.value)}
                                                                    className="mr-2"
                                                                />
                                                                Immediate Joiner
                                                            </label>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="joining"
                                                                    value="custom"
                                                                    checked={formData.joiningDetails === 'custom'}
                                                                    onChange={(e) => updateFormData('joiningDetails', e.target.value)}
                                                                    className="mr-2"
                                                                />
                                                                Custom Text
                                                            </label>
                                                        </div>
                                                        {formData.joiningDetails === 'custom' && (
                                                            <input
                                                                type="text"
                                                                value={formData.customJoiningText}
                                                                onChange={(e) => updateFormData('customJoiningText', e.target.value)}
                                                                placeholder="Enter custom joining text"
                                                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Responsibilities</label>
                                                        <div className="space-y-2">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="responsibilities"
                                                                    value="refer"
                                                                    checked={formData.jobResponsibilities === 'refer'}
                                                                    onChange={(e) => updateFormData('jobResponsibilities', e.target.value)}
                                                                    className="mr-2"
                                                                />
                                                                Refer JD
                                                            </label>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="responsibilities"
                                                                    value="custom"
                                                                    checked={formData.jobResponsibilities === 'custom'}
                                                                    onChange={(e) => updateFormData('jobResponsibilities', e.target.value)}
                                                                    className="mr-2"
                                                                />
                                                                Custom Text
                                                            </label>
                                                        </div>
                                                        {formData.jobResponsibilities === 'custom' && (
                                                            <textarea
                                                                value={formData.customResponsibilities}
                                                                onChange={(e) => updateFormData('customResponsibilities', e.target.value)}
                                                                placeholder="Enter custom responsibility details"
                                                                rows="4"
                                                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        )}
                                                        <div className="flex space-x-4 pt-4">

                                                            <button
                                                                type="button" // Changed from submit to button
                                                                disabled={loading}
                                                                onClick={handleCreateNoticeSubmit} // This should handle the submission
                                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center disabled:opacity-50"
                                                            >
                                                                <FileCog className="w-4 h-4 mr-2" />
                                                                {loading ? 'Creating...' : 'Generate Notice'}
                                                            </button>

                                                            <button
                                                                // onClick={UPDATE-TPO}
                                                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                                            >
                                                                <ThumbsUp className="w-4 h-4 mr-2" />TPO

                                                            </button>
                                                            <button
                                                                onClick={shareViaWhatsApp}
                                                                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                                                            >
                                                                <Share2 className="w-4 h-4 mr-2" />
                                                                WhatsApp
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Links Tab */}
                                            {activeNTab === 'links' && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Form Link</label>
                                                        <input
                                                            type="url"
                                                            value={formData.googleFormLink}
                                                            onChange={(e) => updateFormData('googleFormLink', e.target.value)}
                                                            placeholder="https://forms.google.com/..."
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Group Link</label>
                                                        <input
                                                            type="url"
                                                            value={formData.whatsappGroupLink}
                                                            onChange={(e) => updateFormData('whatsappGroupLink', e.target.value)}
                                                            placeholder="https://chat.whatsapp.com/..."
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-4">Select Eligible Batches</label>
                                                        <div className="grid grid-cols-4 gap-3">
                                                            {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027].map(year => (
                                                                <label key={year} className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.eligibleBatches.includes(year)}
                                                                        onChange={() => toggleBatch(year)}
                                                                        className="mr-2"
                                                                    />
                                                                    {year}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-4 pt-4">
                                                        <button
                                                            onClick={generateNotice}
                                                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                                        >   <FileCog className="w-4 h-4 mr-2" />
                                                            Generate Notice
                                                        </button>
                                                        <button
                                                            onClick={shareViaWhatsApp}
                                                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                                                        >
                                                            <Share2 className="w-4 h-4 mr-2" />
                                                            Share via WhatsApp
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Coordinators Tab */}
                                            {activeNTab === 'coordinators' && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-4">Placement Coordinators</label>

                                                        {formData.coordinators.map((coordinator, index) => (
                                                            <div key={index} className="flex items-center space-x-3 mb-3">
                                                                <input
                                                                    type="text"
                                                                    value={coordinator.name}
                                                                    onChange={(e) => updateCoordinator(index, 'name', e.target.value)}
                                                                    placeholder="Name"
                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={coordinator.phone}
                                                                    onChange={(e) => updateCoordinator(index, 'phone', e.target.value)}
                                                                    placeholder="Phone"
                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                                <button
                                                                    onClick={() => removeCoordinator(index)}
                                                                    className="px-2 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        ))}

                                                        <button
                                                            onClick={addCoordinator}
                                                            className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add Coordinator
                                                        </button>
                                                    </div>

                                                    <div className="flex space-x-4 pt-4">
                                                        <button
                                                            onClick={generateNotice}
                                                            className="px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                                        ><FileCog className="w-4 h-4 mr-2" />
                                                            Generate Notice
                                                        </button>
                                                        <button
                                                            onClick={copyNotice}
                                                            className="px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                                                        >
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Copy
                                                        </button>

                                                        <button
                                                            onClick={() => handleDownloadPDF(formData)}
                                                            className="px-2 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                                                            disabled={!formData.companyName || formData.eligibleBatches.length === 0}
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                            PDF
                                                        </button>
                                                        <button
                                                            onClick={shareViaWhatsApp}
                                                            className="px-2 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                                                        >
                                                            <Share2 className="w-4 h-4 mr-2" />
                                                            WhatsApp
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview Section */}
                                    <div className="bg-white rounded-lg shadow-sm border">
                                        <div className="p-6 border-b border-gray-200">
                                            <h2 className="text-xl font-semibold text-gray-800">Notice Preview</h2>
                                        </div>

                                        <div className="p-6">
                                            {/* Institute Header */}
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                                    <span className="text-sm">INDIRA</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">Indira Group of Institutes</h3>
                                                    <p className="text-sm text-gray-600">Address: 123, XYZ Road, Pune, Maharashtra, India</p>
                                                    <p className="text-sm text-gray-600">Phone: +91 123 456 7890 | Email: info@indira.edu | Website: indirauniversity.edu.in</p>
                                                </div>
                                            </div>

                                            {/* Generated Notice */}
                                            <div className="bg-gray-50 p-4 rounded-lg min-h-96">
                                                {formData.companyName || formData.eligibleBatches.length > 0 ? (
                                                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                                                        {generateNotice()}
                                                    </pre>
                                                ) : (
                                                    <p className="text-gray-500 text-center py-8">Your generated notice will appear here...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <X className="h-5 w-5 text-red-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-red-700">{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <Check className="h-5 w-5 text-green-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-green-700">{success}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                            </div>
                        </div>
                    )}

                    {/* Manage Notices Content */}
                    {activeTab === 'manageNotices' && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800">Manage Job Notices</h2>
                                    <div className="flex space-x-3">
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            onClick={fetchNotices}
                                        >
                                            <RefreshCw size={16} />
                                            <span>Refresh</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Filters and Search */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search notices..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {statuses.map(status => (
                                            <option key={status} value={status}>{status} Status</option>
                                        ))}
                                    </select>

                                    <select
                                        value={streamFilter}
                                        onChange={(e) => setStreamFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {streams.map(stream => (
                                            <option key={stream} value={stream}>{stream} {stream !== 'All' ? 'Stream' : 'Streams'}</option>
                                        ))}
                                    </select>

                                    <div className="flex items-center space-x-2">
                                        <Filter size={16} className="text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            {filteredNotices.length} of {mockNotices.length} notices
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Notices Table */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedNotices.length === filteredNotices.length && filteredNotices.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredNotices.map(notice => (
                                                <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedNotices.includes(notice.id)}
                                                            onChange={() => handleSelectNotice(notice.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                                                            <div className="text-sm text-gray-500">{notice.location} • {notice.salary}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notice.company}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.stream}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {getStatusIcon(notice.status)}
                                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(notice.status)}`}>
                                                                {notice.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                            <Calendar size={14} />
                                                            <span>{notice.deadline}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleViewNotice(notice)}
                                                                className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />
                                                            </button>

                                                            {notice.status === 'Rejected' && (
                                                                <button
                                                                    onClick={() => handleEditNotice(notice)}
                                                                    className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                                                    title="Edit & Resubmit"
                                                                >
                                                                    <Edit3 size={16} />
                                                                </button>
                                                            )}

                                                            {notice.status === 'Rejected' && (
                                                                <button
                                                                    onClick={() => handleResubmit(notice)}
                                                                    className="text-orange-600 hover:text-orange-800 p-1 rounded transition-colors"
                                                                    title="Resubmit"
                                                                >
                                                                    <RefreshCw size={16} />
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => handleDeleteNotice(notice.id)}
                                                                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredNotices.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 mb-4">
                                            <Search size={48} className="mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                                    </div>
                                )}
                            </div>

                            {/* Bulk Actions */}
                            {selectedNotices.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-800 font-medium">
                                            {selectedNotices.length} notice{selectedNotices.length > 1 ? 's' : ''} selected
                                        </span>
                                        <div className="flex space-x-2">
                                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                Delete Selected
                                            </button>
                                            <button
                                                onClick={() => setSelectedNotices([])}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Clear Selection
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modals */}
                            {showViewModal && <ViewModal />}
                        </div>
                    )}

                    {/* Student Overview Content */}
                    {activeTab === 'studentOverview' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-800">Student Overview - CSE Stream</h2>
                                <p className="text-sm text-gray-500 mt-1">View basic information of students in your stream</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>Name</span>
                                                    {getSortIcon('name')}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => handleSort('rollNo')}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>Roll Number</span>
                                                    {getSortIcon('rollNo')}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>Email</span>
                                                    {getSortIcon('email')}
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => handleSort('cgpa')}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>CGPA</span>
                                                    {getSortIcon('cgpa')}
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedStudents.map(student => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {student.rollNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {student.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.cgpa >= 9 ? 'bg-green-100 text-green-800' :
                                                        student.cgpa >= 8 ? 'bg-blue-100 text-blue-800' :
                                                            student.cgpa >= 7 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {student.cgpa}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Sort status indicator */}
                            {sortConfig.key && (
                                <div className="px-6 py-3 bg-blue-50 border-t border-gray-200">
                                    <p className="text-sm text-blue-700">
                                        Sorted by <span className="font-semibold capitalize">{sortConfig.key}</span> in{' '}
                                        <span className="font-semibold">
                                            {sortConfig.direction === 'asc' ? 'ascending' : 'descending'}
                                        </span> order
                                        <button
                                            onClick={() => setSortConfig({ key: null, direction: null })}
                                            className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Clear sorting
                                        </button>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notifications Content */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-800">Send Notifications</h2>
                                <p className="text-sm text-gray-600 mt-1">Send non-job related updates to students in your stream</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Notification Content */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formNData.subject}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter notification subject"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                        <textarea
                                            rows="4"
                                            name="message"
                                            value={formNData.message}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your message"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                        <select
                                            name="priority"
                                            value={formNData.priority}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="low">Low Priority</option>
                                            <option value="normal">Normal Priority</option>
                                            <option value="high">High Priority</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Delivery Methods */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Delivery Methods *</label>
                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={deliveryMethods.inApp}
                                                onChange={() => handleDeliveryMethodChange('inApp')}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <Bell className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">In-App Notification</span>
                                        </label>

                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={deliveryMethods.email}
                                                onChange={() => handleDeliveryMethodChange('email')}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <Mail className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">Email</span>
                                        </label>

                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={deliveryMethods.whatsapp}
                                                onChange={() => handleDeliveryMethodChange('whatsapp')}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <MessageCircle className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">WhatsApp</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Recipient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Recipients</label>
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="recipientMode"
                                                    value="all"
                                                    checked={recipientMode === 'all'}
                                                    onChange={(e) => setRecipientMode(e.target.value)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">All Students ({mockStudents.length})</span>
                                            </label>

                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="recipientMode"
                                                    value="filtered"
                                                    checked={recipientMode === 'filtered'}
                                                    onChange={(e) => setRecipientMode(e.target.value)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">Filtered Students ({filteredStudents.length})</span>
                                            </label>

                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="recipientMode"
                                                    value="selected"
                                                    checked={recipientMode === 'selected'}
                                                    onChange={(e) => setRecipientMode(e.target.value)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">Selected Students ({selectedStudents.length})</span>
                                            </label>
                                        </div>

                                        {/* Filter Toggle */}
                                        {(recipientMode === 'filtered' || recipientMode === 'selected') && (
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50"
                                            >
                                                <Filter className="w-4 h-4" />
                                                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Filters Panel */}
                                {showFilters && (recipientMode === 'filtered' || recipientMode === 'selected') && (
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-700">Filter Students</h3>
                                            <button
                                                onClick={clearFilters}
                                                className="text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                Clear All
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="searchTerm"
                                                        value={filters.searchTerm}
                                                        onChange={handleFilterChange}
                                                        placeholder="Name, Roll No, Email"
                                                        className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Stream</label>
                                                <select
                                                    name="stream"
                                                    value={filters.stream}
                                                    onChange={handleFilterChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                                                >
                                                    <option value="">All Streams</option>
                                                    {availableStreams.map(stream => (
                                                        <option key={stream} value={stream}>{stream}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                                                <select
                                                    name="year"
                                                    value={filters.year}
                                                    onChange={handleFilterChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                                                >
                                                    <option value="">All Years</option>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                    <option value="4">4th Year</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Min CGPA</label>
                                                <input
                                                    type="number"
                                                    name="cgpaMin"
                                                    value={filters.cgpaMin}
                                                    onChange={handleFilterChange}
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Max CGPA</label>
                                                <input
                                                    type="number"
                                                    name="cgpaMax"
                                                    value={filters.cgpaMax}
                                                    onChange={handleFilterChange}
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    placeholder="10.0"
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Student Selection Table */}
                                {recipientMode === 'selected' && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-700">Select Students</h3>
                                            <button
                                                onClick={handleSelectAllN}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-white sticky top-0">
                                                    <tr>
                                                        <th className="p-2 text-left">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                                                onChange={handleSelectAllN}
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                        </th>
                                                        <th className="p-2 text-left font-medium text-gray-600">Name</th>
                                                        <th className="p-2 text-left font-medium text-gray-600">Roll No</th>
                                                        <th className="p-2 text-left font-medium text-gray-600">Stream</th>
                                                        <th className="p-2 text-left font-medium text-gray-600">Year</th>
                                                        <th className="p-2 text-left font-medium text-gray-600">CGPA</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredStudents.map(student => (
                                                        <tr key={student.id} className="hover:bg-white">
                                                            <td className="p-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedStudents.find(s => s.id === student.id) !== undefined}
                                                                    onChange={() => handleStudentSelect(student)}
                                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                />
                                                            </td>
                                                            <td className="p-2 text-gray-900">{student.name}</td>
                                                            <td className="p-2 text-gray-600">{student.rollNo}</td>
                                                            <td className="p-2 text-gray-600">{student.stream}</td>
                                                            <td className="p-2 text-gray-600">{student.year}</td>
                                                            <td className="p-2 text-gray-600">{student.cgpa}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Recipient Summary */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Recipients Summary</span>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        This notification will be sent to <strong>{finalRecipients.length}</strong> students via{' '}
                                        <strong>
                                            {Object.keys(deliveryMethods).filter(method => deliveryMethods[method]).join(', ')}
                                        </strong>
                                    </p>
                                    {deliveryMethods.email && (
                                        <p className="text-xs text-blue-600 mt-1">
                                            Email notifications will be sent to all selected students simultaneously
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSendNotification}
                                        disabled={!formNData.subject || !formNData.message || finalRecipients.length === 0 || !Object.values(deliveryMethods).some(method => method)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Send Notification
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        Save as Draft
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium"
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for Settings */}
                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Settings</h2>
                            <p className="text-gray-500 mb-6">Manage your account settings and preferences</p>
                            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                                <Settings size={32} className="text-gray-400" />
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-white p-4 border-t text-center text-sm text-gray-600">
                    Placement Coordinator Portal © {new Date().getFullYear()}
                </footer>
            </div >
        </div >
    );
};

export default Dashboard;