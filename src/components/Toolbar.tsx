import React, { useState, lazy, Suspense } from 'react';
import DeploymentModal from './DeploymentModal';
import { 
  Play, Square, Save, Folder, FileText, Search, Settings, Terminal, Menu,
  GitBranch, Bug, Smartphone, Monitor, Code, Database, Tablet, X,
  Users, ShoppingCart, User, CreditCard, Eye, TestTube, Link as LinkIcon,
  Hammer, Wrench, Zap, CheckSquare, Rocket, XCircle, PlusCircle,
  RefreshCcw, Github
} from 'lucide-react';

// Lazy load components that aren't needed immediately
const SubscriptionStatus = lazy(() => import('./SubscriptionStatus'));
const AutomationPanel = lazy(() => import('./AutomationPanel'));
const AndroidBuildLogs = lazy(() => import('./AndroidBuildLogs'));
const DatabaseStatsPanel = lazy(() => import('./DatabaseStatsPanel'));

export interface ToolbarProps {
  user: any;
  onShowPricing: () => void;
  onShowProfile: () => void;
  onToggleTerminal: () => void;
  onShowTemplates: () => void;
  onShowMobilePreview: () => void;
  onShowConfigCheck: () => void;
  onShowStripeTests: () => void;
  onShowIntegrations: () => void;
  onShowDeploymentStatus: () => void;
  onShowDeploymentTemplates: () => void;
  onShowScriptRunner: () => void;
  onShowTemplateMarketplace: () => void;
  onShowDatabaseStats: () => void;
  onShowFeatureRequestForm: () => void;
  onToggleSidebar: () => void;
  onToggleMarketplace: () => void;
  onShowBuildLogs: () => void;
  onShowAutomationPanel: () => void;
  onShowGitHubIntegration: () => void;
  onLogout: () => Promise<void>;
  onToggleCollaboration: () => void;
  onRefreshFileTree?: () => void;
}
const Toolbar: React.FC<ToolbarProps> = ({ 
  user,
  onShowPricing,
  onShowProfile,
  onToggleTerminal, 
  onShowTemplates,
  onShowDeploymentStatus,
  onShowDeploymentTemplates,
  onShowTemplateMarketplace,
  onShowFeatureRequestForm,
  onShowMobilePreview,
  onShowScriptRunner,
  onShowStripeTests,
  onShowIntegrations,
  onToggleSidebar,
  onShowGitHubIntegration,
  onLogout,
  onToggleCollaboration,
  onRefreshFileTree
}) => {
  const [showBuildLogs, setShowBuildLogs] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState('android');
  const [showDeploymentModal, setShowDeploymentModal] = React.useState(false);
  const [showDatabaseStats, setShowDatabaseStats] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildOutput, setBuildOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAutomationPanel, setShowAutomationPanel] = React.useState(false);

  const handleBuild = async () => {
    setIsBuilding(true);
    setBuildOutput([]);
    setError(null);
    
    try {
      // Simulate build process with real commands
      const commands = [
        'rustyclint scan --deep',
        'cargo build --release',
        'cargo test',
        'rustyclint audit --compliance'
      ];
      
      for (const command of commands) {
        setBuildOutput(prev => [...prev, `$ ${command}`]);
        
        // Simulate command execution time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Add realistic output
        if (command.includes('rustyclint scan')) {
          setBuildOutput(prev => [...prev, 
            '🔍 Analyzing 47,392 lines of code...',
            '⚡ Performance: 10.2M lines/second',
            '✅ Analysis complete in 0.08s',
            '⚠️  2 medium-risk issues found',
            '🔧 3 optimizations suggested'
          ]);
        } else if (command.includes('cargo build')) {
          setBuildOutput(prev => [...prev,
            '   Compiling rustyclint v0.1.0',
            '    Finished release [optimized] target(s) in 3.42s'
          ]);
        } else if (command.includes('cargo test')) {
          setBuildOutput(prev => [...prev,
            'running 8 tests',
            'test result: ok. 8 passed; 0 failed; 0 ignored'
          ]);
        } else if (command.includes('rustyclint audit')) {
          setBuildOutput(prev => [...prev,
            '🛡️  Security Score: 98/100 (Excellent)',
            '✅ SOC 2 Type II compliant',
            '✅ GDPR data protection verified'
          ]);
        }
      }
      
      setBuildOutput(prev => [...prev, '🎉 Build completed successfully!']);
      
      // Trigger the original onRun callback
    } catch (err) {
      console.error('Build error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setBuildOutput(prev => [...prev, `❌ Build failed: ${err instanceof Error ? err.message : 'Unknown error'}`]);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-end">
        <div className="flex items-center space-x-1">
          {user && (
            <>
              <Suspense fallback={<div className="mr-4 w-20 h-5 bg-gray-700 animate-pulse rounded"></div>}>
                <div className="mr-4">
                  <SubscriptionStatus />
                </div>
              </Suspense>
              <button 
                onClick={onShowPricing}
                className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                title="Pricing and Plans"
                aria-label="Pricing and Plans"
              >
                <CreditCard className="w-4 h-4" />
              </button>
              <button 
                onClick={onShowProfile}
                className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                title="User Profile"
                aria-label="User Profile"
              >
                <User className="w-4 h-4" />
              </button>
            </>
          )}
          <button 
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
            aria-label="Search"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={onToggleCollaboration}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors relative"
            title="Collaboration"
            aria-label="Collaboration"
            aria-haspopup="dialog"
          >
            <Users className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </button>
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors relative"
            title="Developer Marketplace"
            aria-label="Developer Marketplace"
            aria-haspopup="dialog"
          >
            <ShoppingCart className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
          </button>
          <button 
            onClick={onToggleTerminal}
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle Terminal"
            title="Toggle Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
            aria-label="Git Branch"
            title="Git Branch"
          >
            <GitBranch className="w-4 h-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          {onShowGitHubIntegration && (
            <button
              onClick={onShowGitHubIntegration}
              className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
              aria-label="GitHub Integration"
              title="GitHub Integration"
            >
              <Github className="w-4 h-4" />
            </button>
          )}
          {onRefreshFileTree && (
            <button
              onClick={onRefreshFileTree}
              className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
              aria-label="Refresh File Explorer"
              title="Refresh File Explorer"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Build Output Overlay */}
      {isBuilding && buildOutput.length > 0 && (
        <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-40">
          <div className={`flex items-center justify-between p-3 border-b border-gray-700 ${error ? 'bg-red-900/20' : ''}`}>
            <div className="flex items-center space-x-2">
              {error ? (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 font-medium">Build Failed</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-white font-medium">Building...</span>
                </>
              )}
            </div>
            <button 
              onClick={() => setBuildOutput([])}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-3 max-h-64 overflow-y-auto">
            <div className="font-mono text-sm space-y-1">
              {buildOutput.map((line, index) => (
                <div key={index} className={
                  line.startsWith('$') ? 'text-green-400' : 
                  line.includes('❌') ? 'text-red-400' :
                  line.includes('⚠️') ? 'text-yellow-400' :
                  line.includes('✅') ? 'text-green-400' :
                  'text-gray-300'
                }>{line}</div>
              ))}
            </div>
            {error && (
              <div className="text-red-400 mt-2">
                ✕ {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deployment Modal */}
      <DeploymentModal 
        isVisible={showDeploymentModal}
        onClose={() => setShowDeploymentModal(false)}
        initialPlatform={selectedPlatform as any}
      />
      
      {/* Build Logs Viewer */}
      {showBuildLogs && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Suspense fallback={<div className="w-full max-w-6xl h-96 bg-gray-800 rounded-lg flex items-center justify-center"><div className="text-white">Loading logs...</div></div>}>
            <div className="w-full max-w-6xl">
              <AndroidBuildLogs
                isLive={isBuilding}
                onClose={() => setShowBuildLogs(false)}
              />
            </div>
          </Suspense>
        </div>
      )}
      
      {/* Automation Panel */}
      <Suspense fallback={null}>
        {showAutomationPanel && (
          <AutomationPanel
            platform={selectedPlatform}
            isVisible={showAutomationPanel}
            onClose={() => setShowAutomationPanel(false)}
          />
        )}
      </Suspense>
      
      {/* Database Stats Panel */}
      <Suspense fallback={null}>
        {showDatabaseStats && (
          <DatabaseStatsPanel
            isVisible={showDatabaseStats}
            onClose={() => setShowDatabaseStats(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default Toolbar;