import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./Layout/AdminLayout";
import Spinner from "../common/Spinner";

interface PendingInvitation {
  email: string;
  classId: string;
  className: string;
  armId: string;
  armName: string;
  campusId: string;
  campusName: string;
  schoolName: string;
  tenantId: string;
  adminName: string;
  createdAt: string;
  expiryDate: string;
  invitationId: string;
}

const PendingInvites: React.FC = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingInvitations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/signin');
          return;
        }
        
        const response = await axios.get('http://159.65.31.191/api/TeacherInvitation/pending', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '/'
          }
        });
        
        if (response.data.statusCode === 200) {
          setInvitations(response.data.data.pendingInvitations || []);
        } else {
          setError(response.data.message || "Failed to fetch pending invitations");
        }
      } catch (err: any) {
        console.error("Error fetching pending invitations:", err);
        setError(err.message || "An error occurred while fetching pending invitations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingInvitations();
  }, [navigate]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const handleResendInvitation = async (invitationId: string) => {
    try {
      setResendLoading(invitationId);
      
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://159.65.31.191/api/TeacherInvitation/resend/${invitationId}`, 
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '/'
          }
        }
      );
      
      if (response.data.statusCode === 200) {
        // Show success message
        alert("Invitation resent successfully");
      } else {
        alert(response.data.message || "Failed to resend invitation");
      }
    } catch (err: any) {
      console.error("Error resending invitation:", err);
      alert(err.message || "An error occurred while resending the invitation");
    } finally {
      setResendLoading(null);
    }
  };
  
  const handleDeleteInvitation = async (invitationId: string) => {
    if (!window.confirm("Are you sure you want to delete this invitation?")) {
      return;
    }
    
    try {
      setDeleteLoading(invitationId);
      
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(
        `http://159.65.31.191/api/TeacherInvitation/${invitationId}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '/'
          }
        }
      );
      
      if (response.data.statusCode === 200) {
        // Remove from state
        setInvitations(prev => prev.filter(inv => inv.invitationId !== invitationId));
        alert("Invitation deleted successfully");
      } else {
        alert(response.data.message || "Failed to delete invitation");
      }
    } catch (err: any) {
      console.error("Error deleting invitation:", err);
      alert(err.message || "An error occurred while deleting the invitation");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <AdminLayout title="Pending Teacher Invitations">
      <div className="w-full space-y-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Pending Teacher Invitations</h2>
            </div>
            <button 
              onClick={() => navigate('/admin/invite-teacher')}
              className="bg-yellow-500 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Send New Invitation
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" text="Loading pending invitations..." />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          ) : invitations.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No Pending Invitations</h3>
              <p className="text-gray-400 mb-6">You haven't sent any teacher invitations yet or all invitations have been accepted.</p>
              <button 
                onClick={() => navigate('/admin/invite-teacher')}
                className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-all duration-200 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Invite a Teacher
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class / Arm</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Campus</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Sent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expires</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {invitations.map((invitation) => {
                    const daysRemaining = getDaysRemaining(invitation.expiryDate);
                    
                    return (
                      <tr 
                        key={invitation.invitationId} 
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium text-white">{invitation.email}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-white">
                            {invitation.className} / <span className="text-yellow-500">{invitation.armName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-white">{invitation.campusName}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-white">{formatDate(invitation.createdAt)}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${daysRemaining > 3 ? 'bg-green-100 text-green-800' : 
                              daysRemaining > 0 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {daysRemaining > 0 
                              ? `${daysRemaining} days left` 
                              : daysRemaining === 0 
                                ? "Expires today" 
                                : "Expired"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleResendInvitation(invitation.invitationId)}
                              disabled={resendLoading === invitation.invitationId}
                              className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded"
                              title="Resend Invitation"
                            >
                              {resendLoading === invitation.invitationId ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteInvitation(invitation.invitationId)}
                              disabled={deleteLoading === invitation.invitationId}
                              className="text-red-400 hover:text-red-300 transition-colors p-1 rounded"
                              title="Delete Invitation"
                            >
                              {deleteLoading === invitation.invitationId ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PendingInvites; 