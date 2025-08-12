import React, { useState } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle,
  Clock, 
  Terminal,
  Download,
  Settings,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
import { useDeploymentAutomation } from '../hooks/useDeploymentAutomation';

interface AutomationPanelProps {
  platform: string;
  isVisible: boolean;
  onClose: () => void;
}

const AutomationPanel: React.FC<AutomationPanelProps> = ({ platform, isVisible, onClose }) => {
  const { runAutomation, automationSteps, isRunning, progress } = useDeploymentAutomation();
  const [selectedAutomation, setSelectedAutomation] = useState<string>('');

  const automationOptions = [
    {
      id: 'full-deployment',
      name: 'Full Deployment Pipeline',
      description: 'Complete automated deployment from build to store upload',
      estimatedTime: '15-20 minutes',
      steps: ['Build Rust', 'Build App', 'Sign & Package', 'Upload to Store'],
      icon: <Zap className="w-5 h-5 text-orange-400" />
    },
    {
      id: 'build-only',
      name: 'Build & Package Only',
      description: 'Build and package app without uploading to store',
      estimatedTime: '8-12 minutes',
      steps: ['Build Rust', 'Build App', 'Sign & Package'],
      icon: <Settings className="w-5 h-5 text-blue-400" />
    },
    {
      id: 'rust-build',
      name: 'Rust Build Only',
      description: 'Build Rust code for target platform',
      estimatedTime: '3-5 minutes',
      steps: ['Setup Environment', 'Add Targets', 'Build Libraries'],
      icon: <Terminal className="w-5 h-5 text-green-400" />
    }
  ];

  const handleRunAutomation = async (automationId: string) => {
    setSelectedAutomation(automationId);
    await runAutomation(automationId, platform);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />; 
      case 'running':
        return <RefreshCcw className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-orange-400" />
          <h3 className="font-semibold text-white">Automation Center</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Platform Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-sm text-gray-400 mb-1">Target Platform</div>
        <div className="text-lg font-semibold text-white capitalize">{platform}</div>
      </div>

      {/* Automation Options */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-white">Available Automations</h4>
          
          {automationOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedAutomation === option.id
                  ? 'border-orange-500 bg-orange-900/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
              onClick={() => setSelectedAutomation(option.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-white mb-1">{option.name}</h5>
                  <p className="text-gray-300 text-sm mb-2">{option.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Est. time: {option.estimatedTime}</span>
                    <span>{option.steps.length} steps</span>
                  </div>
                </div>
              </div>
              
              {selectedAutomation === option.id && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="space-y-1">
                    {option.steps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                        <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white">
                          {index + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleRunAutomation(option.id)}
                    disabled={isRunning}
                    className="w-full mt-3 flex items-center justify-center space-x-2 py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Run Automation</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Section */}
        {isRunning && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-white">Automation Progress</h5>
              <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {automationSteps.map((step) => (
                <div key={step.id} className="flex items-center space-x-2 text-sm">
                  {getStatusIcon(step.status)}
                  <span className={`${
                    step.status === 'completed' ? 'text-green-300' :
                    step.status === 'failed' ? 'text-red-300' :
                    step.status === 'running' ? 'text-blue-300' :
                    'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                  {step.duration && (
                    <span className="text-xs text-gray-500">
                      ({(step.duration / 1000).toFixed(1)}s)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6">
          <h5 className="font-medium text-white mb-3">Quick Actions</h5>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
              <Download className="w-3 h-3" />
              <span>Download Build Scripts</span>
            </button>
            <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
              <Settings className="w-3 h-3" />
              <span>Configure Environment</span>
            </button>
            <button className="w-full flex items-center space-x-2 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
              <Terminal className="w-3 h-3" />
              <span>Open Terminal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationPanel;