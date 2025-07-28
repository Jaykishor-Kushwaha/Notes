import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User } from '../types';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      
      // Decode the token to get user info (basic implementation)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          _id: payload.userId,
          name: payload.name || 'User',
          email: payload.email || '',
          dob: payload.dob || new Date().toISOString(),
        };
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      // Redirect to welcome page
      navigate('/welcome');
    } else {
      // No token found, redirect to sign in
      navigate('/signin');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess; 