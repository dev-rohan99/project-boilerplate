import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';

export default function AccountActivation() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Simulate activation verification
      setTimeout(() => {
        setStatus('success');
      }, 1500);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Account Activation</h2>
        
        {status === 'loading' && (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-500">
            <FiCheck className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl">Your account has been successfully activated!</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-500">
            <FiX className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl">Invalid or expired activation link.</p>
          </div>
        )}
      </div>
    </div>
  );
}