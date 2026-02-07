import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          name: name,
          age: parseInt(age),
          gender: gender,
          role: 'user',
          uid: userCredential.user.uid,
          createdAt: new Date().toISOString()
        });
        
        // After signup, go to home page
        navigate('/');
      } else {
        // Login - everyone goes to homepage first
        await login(email, password);
        
        // Small delay to let AuthContext load user data
        setTimeout(() => {
          navigate('/');
        }, 500);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
        console.error('Auth error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center px-4 py-8'>
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Breachless</h1>
          <p className='text-gray-400'>
            {isSignUp ? 'Create your account' : 'Login to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='bg-[#121212] border border-white/20 rounded-xl p-8 space-y-4'>
          {isSignUp && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>Name</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='w-full p-3 rounded-lg bg-black border border-white/30 text-white focus:border-[#BDE038] focus:outline-none'
                  placeholder='John Doe'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>Age</label>
                  <input
                    type='number'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min='13'
                    max='120'
                    className='w-full p-3 rounded-lg bg-black border border-white/30 text-white focus:border-[#BDE038] focus:outline-none'
                    placeholder='25'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className='w-full p-3 rounded-lg bg-black border border-white/30 text-white focus:border-[#BDE038] focus:outline-none cursor-pointer'
                  >
                    <option value=''>Select</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                    <option value='Prefer not to say'>Prefer not to say</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full p-3 rounded-lg bg-black border border-white/30 text-white focus:border-[#BDE038] focus:outline-none'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className='w-full p-3 rounded-lg bg-black border border-white/30 text-white focus:border-[#BDE038] focus:outline-none'
              placeholder='••••••••'
            />
          </div>

          {isSignUp && (
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Confirm Password</label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className='w-full p-3 rounded-lg bg-black border border-white/30 text-white focus:border-[#BDE038] focus:outline-none'
                placeholder='••••••••'
              />
            </div>
          )}

          {error && (
            <div className='p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm'>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 rounded-full bg-gradient-to-r from-[#10454F] to-[#BDE038] text-black font-semibold hover:shadow-lg disabled:opacity-50 mt-6'
          >
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>

          <div className='text-center pt-2'>
            <button
              type='button'
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className='text-[#BDE038] text-sm hover:underline'
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        {isSignUp && (
          <p className='text-center text-gray-500 text-xs mt-4'>
            By signing up, you agree to our terms and conditions
          </p>
        )}
      </div>
    </div>
  );
}
