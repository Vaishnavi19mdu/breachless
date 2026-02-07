import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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
}

export default function StaffDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.role !== 'staff') {
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  const markAsResponded = async (contactId: string) => {
    try {
      await updateDoc(doc(db, 'contacts', contactId), {
        responded: true,
        respondedBy: userData?.email,
        respondedAt: new Date().toISOString()
      });
      
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
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
            <h1 className='text-3xl font-bold text-[#BDE038]'>Staff Dashboard</h1>
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

      <div className='max-w-7xl mx-auto'>
        <div className='bg-[#121212] border border-white/20 rounded-xl overflow-hidden'>
          <div className='p-6 border-b border-white/10'>
            <h2 className='text-xl font-semibold'>Contact Queries</h2>
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
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Action</th>
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
                    <td className='px-6 py-4 text-sm text-gray-300'>
                      <div className='max-w-md'>{contact.message}</div>
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
                    <td className='px-6 py-4'>
                      {!contact.responded && (
                        <button
                          onClick={() => markAsResponded(contact.id)}
                          className='px-4 py-2 rounded-full bg-[#BDE038] text-black text-xs font-semibold hover:bg-[#a8c932] transition-colors'
                        >
                          Mark Responded
                        </button>
                      )}
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
