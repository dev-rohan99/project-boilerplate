import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    toast.success('Reset link sent to your email!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-8">Enter your email to receive a reset link</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}