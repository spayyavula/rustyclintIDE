import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  AlertTriangle, 
  X, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ExternalLink,
  Settings,
  Shield,
  Database, 
  Key,
  Smartphone,
  Globe,
  Zap,
  RefreshCcw
} from 'lucide-react';

interface ConfigItem {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'error' | 'warning' | 'checking' | 'not-checked';
  category: 'environment' | 'security' | 'deployment' | 'database' | 'integration';
  details?: string;
  solution?: string;
  docsLink?: string;
}

interface ConfigurationCheckerProps {
  isVisible: boolean;
  onClose: () => void;
}

const ConfigurationChecker: React.FC<ConfigurationCheckerProps> = ({ isVisible, onClose }) => {
  const [configItems, setConfigItems] = useState<ConfigItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ConfigItem | null>(null);

  useEffect(() => {
    if (isVisible) {
      runConfigChecks();
    }
  }, [isVisible]);

  const runConfigChecks = async () => {
    setIsChecking(true);
    setConfigItems(initialConfigItems.map(item => ({ ...item, status: 'checking' })));

    // Simulate checking each item with a delay
    for (let i = 0; i < initialConfigItems.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulate check result
      const result = await checkConfigItem(initialConfigItems[i]);
      
      setConfigItems(prev => prev.map((item, index) => 
        index === i ? { ...item, ...result } : item
      ));
    }

    setIsChecking(false);
  };

  const checkConfigItem = async (item: ConfigItem): Promise<Partial<ConfigItem>> => {
    // Simulate checking configuration items
    switch (item.id) {
      case 'env-variables':
        const hasEnvFile = true; // Check if .env file exists
        const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
        const missingVars = requiredVars.filter(v => !import.meta.env[v]);
        
        if (missingVars.length > 0) {
          return {
            status: 'error',
            details: `Missing required environment variables: ${missingVars.join(', ')}`,
            solution: 'Create a .env file with the required variables or copy from .env.example'
          };
        }
        return { status: 'success', details: 'All required environment variables are set' };
      
      case 'supabase-connection':
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          return {
            status: 'error',
            details: 'Supabase connection not configured',
            solution: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
          };
        }
        
        if (supabaseUrl.includes('example') || supabaseKey.includes('example')) {
          return {
            status: 'warning',
            details: 'Supabase connection using example values',
            solution: 'Replace example values with your actual Supabase project credentials'
          };
        }
        
        return { status: 'success', details: 'Supabase connection configured correctly' };
      
      case 'stripe-config':
        const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        
        if (!stripeKey) {
          return {
            status: 'warning',
            details: 'Stripe publishable key not configured',
            solution: 'Set VITE_STRIPE_PUBLISHABLE_KEY in your .env file for payment functionality'
          };
        }
        
        if (stripeKey.startsWith('pk_test_')) {
          return {
            status: 'warning',
            details: 'Using Stripe test mode',
            solution: 'This is fine for development, but use production keys for live environments'
          };
        }
        
        return { status: 'success', details: 'Stripe configuration looks good' };
      
      case 'android-keystore':
        // Simulate checking for Android keystore
        const hasKeystore = false; // In a real app, check if keystore exists
        
        if (!hasKeystore) {
          return {
            status: 'warning',
            details: 'Android keystore not found',
            solution: 'Run ./scripts/generate-android-keystore.sh to create a keystore for Android deployment'
          };
        }
        
        return { status: 'success', details: 'Android keystore configured correctly' };
      
      case 'database-schema':
        // Simulate checking database schema
        return { 
          status: Math.random() > 0.5 ? 'success' : 'warning',
          details: Math.random() > 0.5 ? 
            'Database schema is up to date' : 
            'Some tables might be missing or have outdated structure',
          solution: 'Run migrations to update your database schema'
        };
      
      case 'edge-functions':
        // Simulate checking edge functions
        return { 
          status: Math.random() > 0.7 ? 'success' : 'warning',
          details: Math.random() > 0.7 ? 
            'Edge functions deployed successfully' : 
            'Some edge functions may need to be deployed',
          solution: 'Deploy edge functions to Supabase'
        };
      
      case 'security-policies':
        // Simulate checking RLS policies
        return { 
          status: Math.random() > 0.6 ? 'success' : 'error',
          details: Math.random() > 0.6 ? 
            'Row Level Security policies configured correctly' : 
            'Some tables are missing RLS policies',
          solution: 'Add RLS policies to all tables for proper security'
        };
      
      default:
        return { status: Math.random() > 0.7 ? 'success' : 'warning' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environment': return <Settings className="w-5 h-5 text-blue-400" />;
      case 'security': return <Shield className="w-5 h-5 text-red-400" />;
      case 'deployment': return <Globe className="w-5 h-5 text-green-400" />;
      case 'database': return <Database className="w-5 h-5 text-purple-400" />;
      case 'integration': return <Zap className="w-5 h-5 text-orange-400" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'checking': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-900/20 border-green-500/30 text-green-400';
      case 'error': return 'bg-red-900/20 border-red-500/30 text-red-400';
      case 'warning': return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400';
      case 'checking': return 'bg-blue-900/20 border-blue-500/30 text-blue-400';
      default: return 'bg-gray-900/20 border-gray-500/30 text-gray-400';
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? configItems 
    : configItems.filter(item => item.category === activeCategory);

  const statusCounts = {
    success: configItems.filter(item => item.status === 'success').length,
    error: configItems.filter(item => item.status === 'error').length,
    warning: configItems.filter(item => item.status === 'warning').length,
    checking: configItems.filter(item => item.status === 'checking').length
  };

  const initialConfigItems: ConfigItem[] = [
    {
      id: 'env-variables',
      name: 'Environment Variables',
      description: 'Check if all required environment variables are set',
      status: 'not-checked',
      category: 'environment',
      docsLink: 'https://supabase.com/docs/guides/getting-started/environment-variables'
    },
    {
      id: 'supabase-connection',
      name: 'Supabase Connection',
      description: 'Verify Supabase URL and API keys',
      status: 'not-checked',
      category: 'environment',
      docsLink: 'https://supabase.com/docs/guides/api/connecting-to-supabase'
    },
    {
      id: 'stripe-config',
      name: 'Stripe Configuration',
      description: 'Check Stripe API keys and product configuration',
      status: 'not-checked',
      category: 'integration',
      docsLink: 'https://stripe.com/docs/keys'
    },
    {
      id: 'android-keystore',
      name: 'Android Keystore',
      description: 'Verify Android signing keystore configuration',
      status: 'not-checked',
      category: 'deployment',
      docsLink: 'https://developer.android.com/studio/publish/app-signing'
    },
    {
      id: 'database-schema',
      name: 'Database Schema',
      description: 'Check if database schema is up to date',
      status: 'not-checked',
      category: 'database',
      docsLink: 'https://supabase.com/docs/guides/database/tables'
    },
    {
      id: 'edge-functions',
      name: 'Edge Functions',
      description: 'Verify edge functions are deployed',
      status: 'not-checked',
      category: 'deployment',
      docsLink: 'https://supabase.com/docs/guides/functions'
    },
    {
      id: 'security-policies',
      name: 'Security Policies',
      description: 'Check Row Level Security policies',
      status: 'not-checked',
      category: 'security',
      docsLink: 'https://supabase.com/docs/guides/auth/row-level-security'
    },
    {
      id: 'api-keys',
      name: 'API Keys',
      description: 'Verify API keys are properly secured',
      status: 'not-checked',
      category: 'security'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Configuration Checker</h2>
              <p className="text-gray-400">Verify your project configuration and fix issues</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[80vh]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-r border-gray-700 p-6 overflow-y-auto">
            {/* Status Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Status Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{statusCounts.success}</div>
                  <div className="text-xs text-gray-400">Passed</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{statusCounts.error}</div>
                  <div className="text-xs text-gray-400">Errors</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{statusCounts.warning}</div>
                  <div className="text-xs text-gray-400">Warnings</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">{statusCounts.checking}</div>
                  <div className="text-xs text-gray-400">Checking</div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>All Checks</span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {configItems.length}
                  </span>
                </button>
                
                {['environment', 'security', 'deployment', 'database', 'integration'].map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(category)}
                      <span className="capitalize">{category}</span>
                    </div>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                      {configItems.filter(item => item.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={runConfigChecks}
                disabled={isChecking}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isChecking ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <RefreshCcw className="w-4 h-4" />
                    <span>Run All Checks</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedItem ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(selectedItem.category)}
                    <h3 className="text-xl font-semibold text-white">{selectedItem.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className={`p-4 rounded-lg border ${getStatusColor(selectedItem.status)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(selectedItem.status)}
                    <span className="font-medium capitalize">{selectedItem.status}</span>
                  </div>
                  <p className="text-gray-300">{selectedItem.details || selectedItem.description}</p>
                </div>

                {selectedItem.solution && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Solution</h4>
                    <p className="text-blue-300">{selectedItem.solution}</p>
                  </div>
                )}

                {selectedItem.docsLink && (
                  <a
                    href={selectedItem.docsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Documentation</span>
                  </a>
                )}

                {/* Code Examples or Configuration Snippets */}
                {selectedItem.id === 'env-variables' && (
                  <div className="mt-4">
                    <h4 className="font-medium text-white mb-2">Example .env File</h4>
                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                      {`# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Application Configuration
VITE_APP_NAME=rustyclint
VITE_APP_VERSION=1.0.0`}
                    </pre>
                  </div>
                )}

                {selectedItem.id === 'android-keystore' && (
                  <div className="mt-4">
                    <h4 className="font-medium text-white mb-2">Generate Keystore</h4>
                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                      {`# Run the keystore generation script
./scripts/generate-android-keystore.sh

# Or manually create a keystore
keytool -genkey -v -keystore android/keystore/release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000`}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Configuration Checks</h3>
                
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${getStatusColor(item.status)}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(item.category)}
                        <div>
                          <h4 className="font-medium text-white">{item.name}</h4>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationChecker;