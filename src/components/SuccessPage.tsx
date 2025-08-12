import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

interface SuccessPageProps {
  onContinue: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
          
          <p className="text-gray-400 text-lg">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">What's Next?</h3>
          <ul className="space-y-2 text-gray-300 text-left">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Your account has been updated</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>New features are now available</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Start building amazing projects</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={onContinue}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Continue to IDE</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-gray-500 text-sm">
            Redirecting automatically in {countdown} seconds...
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@rustyclint.com" className="text-orange-400 hover:text-orange-300">
              support@rustyclint.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;