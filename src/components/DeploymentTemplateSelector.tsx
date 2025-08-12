import React, { useState } from 'react';
import { 
  Smartphone, 
  Globe, 
  Monitor, 
  Rocket, 
  ArrowRight, 
  CheckCircle,
  Shield,
  Zap,
  Terminal
} from 'lucide-react';
import AndroidDeploymentTemplate from './AndroidDeploymentTemplate';

interface DeploymentTemplateSelectorProps {
  onClose?: () => void;
}

const DeploymentTemplateSelector: React.FC<DeploymentTemplateSelectorProps> = ({ onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  const platforms = [
    {
      id: 'android',
      name: 'Android',
      icon: <Smartphone className="w-8 h-8 text-green-400" />,
      description: 'Deploy to Google Play Store',
      features: [
        'AAB/APK generation',
        'Keystore management',
        'Play Store deployment',
        'CI/CD integration'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: <Smartphone className="w-8 h-8 text-blue-400" />,
      description: 'Deploy to Apple App Store',
      features: [
        'IPA generation',
        'Code signing',
        'TestFlight distribution',
        'App Store submission'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'web',
      name: 'Web',
      icon: <Globe className="w-8 h-8 text-purple-400" />,
      description: 'Deploy to web hosting platforms',
      features: [
        'Static site generation',
        'CDN configuration',
        'Multi-environment support',
        'Performance optimization'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'desktop',
      name: 'Desktop',
      icon: <Monitor className="w-8 h-8 text-orange-400" />,
      description: 'Deploy to desktop platforms',
      features: [
        'Windows/macOS/Linux builds',
        'Installer creation',
        'Auto-update system',
        'Code signing'
      ],
      color: 'from-orange-500 to-red-500'
    }
  ];

  if (selectedPlatform === 'android') {
    return <AndroidDeploymentTemplate onClose={() => setSelectedPlatform(null)} />;
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-h-[95vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Deployment Templates</h2>
            <p className="text-gray-400">Choose a platform to deploy your application</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        )}
      </div>

      {/* Platform Selection */}
      <div className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setSelectedPlatform(platform.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-4 bg-gradient-to-br ${platform.color} rounded-lg shadow-lg`}>
                  {platform.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{platform.name}</h3>
                  <p className="text-gray-300 mb-4">{platform.description}</p>
                  
                  <div className="space-y-2">
                    {platform.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <span>Select</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h4 className="font-medium text-white">Secure Deployment</h4>
            </div>
            <p className="text-gray-300 text-sm">
              All deployment templates include security best practices and secure credential management.
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h4 className="font-medium text-white">Automation</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Automate your deployment process with CI/CD integration and one-click deployments.
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <h4 className="font-medium text-white">Detailed Logs</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Get comprehensive logs and progress tracking for every step of the deployment process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentTemplateSelector;