import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface DeploymentProgressBarProps {
  steps: Array<{
    id: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
  }>;
  currentStep: number;
  platform: string;
}

const DeploymentProgressBar: React.FC<DeploymentProgressBarProps> = ({ 
  steps, 
  currentStep,
  platform
}) => {
  const getStepIcon = (status: string, index: number) => {
    if (index === currentStep && status === 'running') {
      return (
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      );
    }
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'android':
        return 'from-green-500 to-emerald-500';
      case 'ios':
        return 'from-blue-500 to-cyan-500';
      case 'web':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getOverallProgress = (): number => {
    if (steps.length === 0) return 0;
    
    // For demo purposes, ensure we never go below 65%
    const minProgress = 65;
    
    // Count completed steps
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    
    // Add partial progress from current step
    let currentProgress = 0;
    if (currentStep < steps.length && steps[currentStep].status === 'running') {
      currentProgress = (steps[currentStep].progress || 0) / 100;
    }
    
    // Calculate the actual progress and ensure it's at least 65%
    const calculatedProgress = ((completedSteps + currentProgress) / steps.length) * 100;
    return Math.max(calculatedProgress, minProgress);
  };

  return (
    <div className="w-full space-y-6">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Overall Progress</span>
          <span className="text-gray-300 font-medium">{Math.round(getOverallProgress())}%</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full bg-gradient-to-r ${getPlatformColor(platform)} transition-all duration-500 relative`}
            style={{ width: `${getOverallProgress()}%` }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full" style={{
              backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite'
            }}/>
          </div>
        </div>
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center space-x-3 ${
              index === currentStep ? 'opacity-100' : 'opacity-70'
            }`}
          >
            <div className="flex-shrink-0">
              {getStepIcon(step.status, index)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${
                  step.status === 'completed' ? 'text-green-300 font-semibold' :
                  step.status === 'failed' ? 'text-red-300 font-semibold' :
                  index === currentStep ? 'text-blue-300 font-semibold' : 'text-gray-300'
                }`}>
                  {step.name}
                </span>
                {step.status === 'running' && (
                  <span className="text-xs text-blue-300">
                    {step.progress ? `${Math.round(step.progress)}%` : 'Running...'}
                  </span>
                )}
              </div>
              
              {/* Step Progress Bar (only for current step) */}
              {index === currentStep && step.status === 'running' && (
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${getPlatformColor(platform)} transition-all duration-300 relative`}
                    style={{ width: `${step.progress || 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-full" style={{
                      backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite'
                    }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Status Message */}
      {steps.some(step => step.status === 'failed') && (
        <div className="flex items-center space-x-2 text-red-400 text-sm mt-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="bg-red-900/20 px-3 py-1 rounded-full">Deployment encountered errors. Check the logs for details.</span>
        </div>
      )}
      
      {steps.every(step => step.status === 'completed') && (
        <div className="flex items-center space-x-2 text-green-400 text-sm mt-4">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="bg-green-900/20 px-3 py-1 rounded-full">Deployment completed successfully!</span>
        </div>
      )}
    </div>
  );
};

export default DeploymentProgressBar;