import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  github?: string;
  flair: string;
  message: string;
  timestamp: string;
  responded: boolean;
  usageCount: number;
  secretsRevealed?: number;
}

interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  name?: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactStats, setContactStats] = useState({ total: 0, responded: 0, pending: 0 });
  const [userStats, setUserStats] = useState({ total: 0, admins: 0, staff: 0, regularUsers: 0 });
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [userData, navigate]);

  const fetchData = async () => {
    try {
      // Fetch contacts
      const contactsSnapshot = await getDocs(collection(db, 'contacts'));
      const contactsData: Contact[] = [];
      
      contactsSnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() } as Contact);
      });

      contactsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setContacts(contactsData);
      
      setContactStats({
        total: contactsData.length,
        responded: contactsData.filter(c => c.responded).length,
        pending: contactsData.filter(c => !c.responded).length
      });

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      
      usersSnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as User);
      });

      setUsers(usersData);
      
      setUserStats({
        total: usersData.length,
        admins: usersData.filter(u => u.role === 'admin').length,
        staff: usersData.filter(u => u.role === 'staff').length,
        regularUsers: usersData.filter(u => u.role === 'user').length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-[#BDE038] text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black text-white p-8'>
      <div className='max-w-7xl mx-auto mb-8'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-[#BDE038]'>Admin Dashboard</h1>
            <p className='text-gray-400'>Welcome, {userData?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className='px-6 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors'
          >
            Logout
          </button>
        </div>
      </div>

      {/* USER SIGN-UPS STATS */}
      <div className='max-w-7xl mx-auto mb-8'>
        <h2 className='text-xl font-semibold mb-4 text-[#BDE038]'>User Sign-ups</h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-[#121212] border border-[#BDE038]/30 rounded-xl p-6'>
            <div className='text-4xl font-bold text-[#BDE038] mb-2'>{userStats.total}</div>
            <div className='text-gray-400'>Total Users</div>
          </div>
          
          <div className='bg-[#121212] border border-purple-500/20 rounded-xl p-6'>
            <div className='text-4xl font-bold text-purple-400 mb-2'>{userStats.admins}</div>
            <div className='text-gray-400'>Admins</div>
          </div>
          
          <div className='bg-[#121212] border border-blue-500/20 rounded-xl p-6'>
            <div className='text-4xl font-bold text-blue-400 mb-2'>{userStats.staff}</div>
            <div className='text-gray-400'>Staff</div>
          </div>

          <div className='bg-[#121212] border border-cyan-500/20 rounded-xl p-6'>
            <div className='text-4xl font-bold text-cyan-400 mb-2'>{userStats.regularUsers}</div>
            <div className='text-gray-400'>Regular Users</div>
          </div>
        </div>
      </div>

      {/* CONTACT FORM STATS */}
      <div className='max-w-7xl mx-auto mb-8'>
        <h2 className='text-xl font-semibold mb-4 text-[#BDE038]'>People Who Reached Out</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-[#121212] border border-white/20 rounded-xl p-6'>
            <div className='text-4xl font-bold text-white mb-2'>{contactStats.total}</div>
            <div className='text-gray-400'>Total Contacts</div>
          </div>
          
          <div className='bg-[#121212] border border-green-500/20 rounded-xl p-6'>
            <div className='text-4xl font-bold text-green-400 mb-2'>{contactStats.responded}</div>
            <div className='text-gray-400'>Responded</div>
          </div>
          
          <div className='bg-[#121212] border border-yellow-500/20 rounded-xl p-6'>
            <div className='text-4xl font-bold text-yellow-400 mb-2'>{contactStats.pending}</div>
            <div className='text-gray-400'>Pending</div>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className='max-w-7xl mx-auto mb-8'>
        <div className='bg-[#121212] border border-white/20 rounded-xl overflow-hidden'>
          <div className='p-6 border-b border-white/10'>
            <h2 className='text-xl font-semibold'>Registered Users</h2>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-white/5'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Name</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Email</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Role</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>User ID</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/10'>
                {users.map((user) => (
                  <tr key={user.id} className='hover:bg-white/5'>
                    <td className='px-6 py-4 text-sm'>{user.name || 'N/A'}</td>
                    <td className='px-6 py-4 text-sm text-gray-400'>{user.email}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : user.role === 'staff'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-400 font-mono text-xs'>{user.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CONTACTS TABLE */}
      <div className='max-w-7xl mx-auto'>
        <div className='bg-[#121212] border border-white/20 rounded-xl overflow-hidden'>
          <div className='p-6 border-b border-white/10'>
            <h2 className='text-xl font-semibold'>Contact Form Submissions</h2>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-white/5'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Name</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Email</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Phone</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Flair</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Message</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Usage</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Secrets</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Date</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/10'>
                {contacts.map((contact) => (
                  <tr key={contact.id} className='hover:bg-white/5'>
                    <td className='px-6 py-4 text-sm'>{contact.name}</td>
                    <td className='px-6 py-4 text-sm text-gray-400'>{contact.email}</td>
                    <td className='px-6 py-4 text-sm text-gray-400'>{contact.phone}</td>
                    <td className='px-6 py-4'>
                      <span className='px-2 py-1 rounded-full bg-[#BDE038]/20 text-[#BDE038] text-xs'>
                        {contact.flair}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-400 max-w-xs truncate' title={contact.message}>
                      {contact.message}
                    </td>
                    <td className='px-6 py-4 text-sm text-center'>{contact.usageCount || 0}</td>
                    <td className='px-6 py-4 text-sm text-center text-red-400 font-semibold'>
                      {contact.secretsRevealed || 0}
                    </td>
                    <td className='px-6 py-4'>
                      {contact.responded ? (
                        <span className='px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs'>
                          Responded
                        </span>
                      ) : (
                        <span className='px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs'>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-400'>
                      {new Date(contact.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}