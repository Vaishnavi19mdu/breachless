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

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, responded: 0, pending: 0 });
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchContacts();
  }, [userData, navigate]);

  const fetchContacts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'contacts'));
      const contactsData: Contact[] = [];
      
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() } as Contact);
      });

      contactsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setContacts(contactsData);
      
      setStats({
        total: contactsData.length,
        responded: contactsData.filter(c => c.responded).length,
        pending: contactsData.filter(c => !c.responded).length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
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

      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-[#121212] border border-white/20 rounded-xl p-6'>
          <div className='text-4xl font-bold text-[#BDE038] mb-2'>{stats.total}</div>
          <div className='text-gray-400'>Total Sign-ups</div>
        </div>
        
        <div className='bg-[#121212] border border-green-500/20 rounded-xl p-6'>
          <div className='text-4xl font-bold text-green-400 mb-2'>{stats.responded}</div>
          <div className='text-gray-400'>Responded</div>
        </div>
        
        <div className='bg-[#121212] border border-yellow-500/20 rounded-xl p-6'>
          <div className='text-4xl font-bold text-yellow-400 mb-2'>{stats.pending}</div>
          <div className='text-gray-400'>Pending</div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto'>
        <div className='bg-[#121212] border border-white/20 rounded-xl overflow-hidden'>
          <div className='p-6 border-b border-white/10'>
            <h2 className='text-xl font-semibold'>All Contacts</h2>
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
