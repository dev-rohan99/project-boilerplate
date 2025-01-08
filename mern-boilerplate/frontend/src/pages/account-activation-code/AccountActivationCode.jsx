import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AccountActivationCode() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('pending');
  const inputs = Array(6).fill(0);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=code-${index + 1}]`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=code-${index - 1}]`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activationCode = code.join('');
    if (activationCode.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    // Simulate verification
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      toast.success('Account activated successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Account Activation
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter the 6-digit code sent to your email
        </p>

        {status === 'pending' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {inputs.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  name={`code-${index}`}
                  maxLength={1}
                  value={code[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Verify Code
            </button>
          </form>
        )}

        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Account Activated!
            </h3>
            <p className="text-gray-600">
              Your account has been successfully activated. You can now log in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}