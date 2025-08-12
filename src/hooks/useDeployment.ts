import { useState, useCallback } from 'react';

interface DeploymentStep {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'verify';
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
  output?: string;
}

export interface DeploymentConfig {
  platform: string;
  buildType: string;
  webTarget?: string;
  desktopTarget?: string;
  androidTarget?: string;
  outputPath?: string;
  target?: string;
}

export const useDeployment = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<DeploymentStep[]>([]);
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig | null>(null);

  const startDeployment = useCallback((config: DeploymentConfig) => {
    setIsDeploying(true);
    setCurrentStep(0);
    setDeploymentConfig(config);
    
    // Initialize deployment steps
    const initialSteps: DeploymentStep[] = [
      { id: '1', name: 'Preparing build', type: 'build', progress: 0, status: 'pending' },
      { id: '2', name: 'Building application', type: 'build', progress: 0, status: 'pending' },
      { id: '3', name: 'Running tests', type: 'test', progress: 0, status: 'pending' },
      { id: '4', name: 'Deploying', type: 'deploy', progress: 0, status: 'pending' },
      { id: '5', name: 'Verifying deployment', type: 'verify', progress: 0, status: 'pending' }
    ];
    
    setSteps(initialSteps);
  }, []);

  const stopDeployment = useCallback(() => {
    setIsDeploying(false);
    setCurrentStep(0);
    setSteps([]);
    setDeploymentConfig(null);
  }, []);

  const executeCommand = useCallback((command: string) => {
    // Mock command execution
    console.log(`Executing: ${command}`);
  }, []);

  // Calculate progress based on completed steps
  const getStepProgress = useCallback((stepIndex: number): number => {
    if (stepIndex >= steps.length) return 0;
    
    const completedSteps = steps.filter((_, index) => index < stepIndex && steps[index].status === 'completed').length;
    const currentStepProgress = steps[stepIndex]?.progress || 0;
    
    // Calculate progress as completed steps + partial progress on current step
    const stepValue = 100 / steps.length;
    let progress = completedSteps * stepValue;
    
    // Add partial progress from current step
    if (currentStep < steps.length && currentStep >= completedSteps) {
      progress += currentStepProgress * stepValue;
    }
    
    // Ensure minimum 65% for demo purposes
    return Math.max(progress, 65);
  }, [steps, currentStep]);

  // Calculate overall progress with weighted steps
  const getOverallProgress = useCallback((): number => {
    if (steps.length === 0) return 0;
    
    // For demo purposes, ensure we never go below 65%
    const minProgress = 65;

    // Weight steps by their complexity/duration
    const weights = steps.map(step => {
      switch (step.type) {
        case 'build': return 3;
        case 'test': return 2;
        case 'deploy': return 4;
        case 'verify': return 1;
        default: return 1;
      }
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let totalProgress = 0;

    // Add progress for completed steps
    for (let i = 0; i < currentStep && i < steps.length; i++) {
      totalProgress += weights[i];
    }

    // Add partial progress for current step
    const currentStepProgress = getStepProgress(currentStep);
    if (currentStep < steps.length && currentStepProgress > 0) {
      totalProgress += (currentStepProgress / 100) * weights[currentStep];
    }

    // Calculate the actual progress and ensure it's at least 65%
    const calculatedProgress = (totalProgress / totalWeight) * 100;
    return Math.max(calculatedProgress, minProgress);
  }, [steps, currentStep, getStepProgress]);

  return {
    isDeploying,
    currentStep,
    steps,
    deploymentConfig,
    startDeployment,
    stopDeployment,
    getStepProgress,
    getOverallProgress,
    executeCommand
  };
};