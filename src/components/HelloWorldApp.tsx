import React from 'react';
import { Smartphone, Download, CheckCircle, ArrowRight } from 'lucide-react';

const HelloWorldApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold text-white">Hello World App</h1>
          </div>
          <div className="text-sm text-gray-400">
            v1.0.0 (1)
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">👋</div>
          <h2 className="text-2xl font-bold text-white mb-4">Hello, World!</h2>
          <p className="text-gray-300 mb-6">
            This is a simple Hello World app ready to be deployed to the Google Play Store.
          </p>
          <div className="flex justify-center">
            <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              <CheckCircle className="w-5 h-5" />
              <span>Ready for Deployment</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelloWorldApp;