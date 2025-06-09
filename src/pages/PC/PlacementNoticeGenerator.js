import React, { useState } from 'react';
import { Plus, X, Copy, Download, Share2 } from 'lucide-react';

const PlacementNoticeGenerator = () => {
    const [activeTab, setActiveTab] = useState('job-details');
    const [formData, setFormData] = useState({
        jobType: '',
        companyName: '',
        eligibleStream: '',
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

    const copyNotice = () => {
        navigator.clipboard.writeText(generateNotice());
        alert('Notice copied to clipboard!');
    };

    const shareViaWhatsApp = () => {
        const notice = encodeURIComponent(generateNotice());
        window.open(`https://wa.me/?text=${notice}`, '_blank');
    };

    return (
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
                                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
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
                                                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    Remove
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
                                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Generate Notice
                                        </button>
                                        <button
                                            onClick={copyNotice}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Notice
                                        </button>
                                        <button
                                            onClick={() => {/* Download PDF functionality */ }}
                                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download PDF
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
                </div>
            </div>
        </div>
    );
};

export default PlacementNoticeGenerator;