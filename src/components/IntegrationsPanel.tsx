import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Database, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Users,
  Activity,
  BarChart3,
  Webhook,
  Key,
  Link,
  RefreshCcw,
  Play,
  Pause,
  X
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  config?: any;
}

interface IntegrationsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'github' | 'supabase' | 'zapier'>('overview');
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect repositories for automated security scanning and CI/CD integration',
      icon: <Github className="w-6 h-6" />,
      status: 'connected',
      lastSync: new Date(Date.now() - 300000),
      config: {
        repositories: ['rustyclint/main', 'company/security-tools', 'team/web-app'],
        webhooks: true,
        autoScan: true,
        prChecks: true
      }
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Real-time database for storing scan results, user data, and analytics',
      icon: <Database className="w-6 h-6" />,
      status: 'connected',
      lastSync: new Date(Date.now() - 60000),
      config: {
        tables: ['scan_results', 'vulnerabilities', 'user_projects', 'analytics'],
        realtime: true,
        backups: true,
        rls: true
      }
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows and connect with 5000+ apps for notifications and actions',
      icon: <Zap className="w-6 h-6" />,
      status: 'connected',
      lastSync: new Date(Date.now() - 120000),
      config: {
        zaps: 8,
        triggers: ['vulnerability_found', 'scan_complete', 'compliance_check'],
        actions: ['slack_notify', 'jira_ticket', 'email_alert', 'teams_message']
      }
    }
  ]);

  const [githubStats, setGithubStats] = useState({
    repositories: 12,
    commits: 247,
    pullRequests: 18,
    issues: 5,
    vulnerabilities: 23,
    fixed: 19
  });

  const [supabaseStats, setSupabaseStats] = useState({
    tables: 8,
    rows: 15420,
    storage: '2.3 GB',
    queries: 1247,
    realtime: true,
    backups: 7
  });

  const [zapierStats, setZapierStats] = useState({
    zaps: 8,
    runs: 342,
    success: 98.5,
    errors: 5,
    integrations: 12,
    automations: 24
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-900/20';
      case 'disconnected': return 'text-gray-400 bg-gray-900/20';
      case 'error': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Link className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Integrations</h2>
              <p className="text-gray-400">Connect rustyclint with your development workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'github', label: 'GitHub', icon: Github },
            { id: 'supabase', label: 'Supabase', icon: Database },
            { id: 'zapier', label: 'Zapier', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-colors ${
                activeTab === id 
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Integration Status Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {integrations.map(integration => (
                  <div key={integration.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-600 rounded-lg">
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{integration.name}</h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(integration.status)}
                            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(integration.status)}`}>
                              {integration.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{integration.description}</p>
                    {integration.lastSync && (
                      <div className="text-xs text-gray-500">
                        Last sync: {formatTimeAgo(integration.lastSync)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex items-center space-x-2 p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                    <span>Sync All</span>
                  </button>
                  <button className="flex items-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Run Scan</span>
                  </button>
                  <button className="flex items-center space-x-2 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
                    <Webhook className="w-4 h-4" />
                    <span>Test Webhooks</span>
                  </button>
                  <button className="flex items-center space-x-2 p-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'GitHub webhook triggered', time: '2 minutes ago', status: 'success' },
                    { action: 'Supabase data synchronized', time: '5 minutes ago', status: 'success' },
                    { action: 'Zapier automation executed', time: '8 minutes ago', status: 'success' },
                    { action: 'Security scan completed', time: '12 minutes ago', status: 'success' },
                    { action: 'Vulnerability alert sent', time: '15 minutes ago', status: 'warning' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-400' : 
                          activity.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <span className="text-white">{activity.action}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-8">
              {/* GitHub Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <GitBranch className="w-6 h-6 text-blue-400" />
                    <h3 className="font-semibold text-white">Repositories</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{githubStats.repositories}</div>
                  <div className="text-sm text-gray-400">Connected repositories</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <GitCommit className="w-6 h-6 text-green-400" />
                    <h3 className="font-semibold text-white">Commits</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{githubStats.commits}</div>
                  <div className="text-sm text-gray-400">Scanned this month</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <GitPullRequest className="w-6 h-6 text-purple-400" />
                    <h3 className="font-semibold text-white">Pull Requests</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{githubStats.pullRequests}</div>
                  <div className="text-sm text-gray-400">Security checks enabled</div>
                </div>
              </div>

              {/* Repository List */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Connected Repositories</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Github className="w-4 h-4" />
                    <span>Add Repository</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'rustyclint/main', branch: 'main', lastScan: '2 hours ago', vulnerabilities: 0, status: 'clean' },
                    { name: 'company/security-tools', branch: 'develop', lastScan: '4 hours ago', vulnerabilities: 2, status: 'warning' },
                    { name: 'team/web-app', branch: 'main', lastScan: '1 day ago', vulnerabilities: 5, status: 'critical' }
                  ].map((repo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Github className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-white">{repo.name}</div>
                          <div className="text-sm text-gray-400">Branch: {repo.branch}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            repo.status === 'clean' ? 'text-green-400' :
                            repo.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {repo.vulnerabilities} vulnerabilities
                          </div>
                          <div className="text-xs text-gray-400">Last scan: {repo.lastScan}</div>
                        </div>
                        <button className="p-2 hover:bg-gray-500 rounded transition-colors">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook Configuration */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Webhook Configuration</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Enabled Events</h4>
                    <div className="space-y-2">
                      {['Push', 'Pull Request', 'Release', 'Issues'].map(event => (
                        <label key={event} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-gray-300">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-3">Security Settings</h4>
                    <div className="space-y-2">
                      {['Auto-scan on push', 'Block vulnerable PRs', 'Send notifications'].map(setting => (
                        <label key={setting} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-gray-300">{setting}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-8">
              {/* Supabase Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Database className="w-6 h-6 text-green-400" />
                    <h3 className="font-semibold text-white">Tables</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{supabaseStats.tables}</div>
                  <div className="text-sm text-gray-400">Active tables</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    <h3 className="font-semibold text-white">Data</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{supabaseStats.rows.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total rows</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-6 h-6 text-purple-400" />
                    <h3 className="font-semibold text-white">Queries</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{supabaseStats.queries}</div>
                  <div className="text-sm text-gray-400">This month</div>
                </div>
              </div>

              {/* Database Tables */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Database Tables</h3>
                <div className="space-y-3">
                  {[
                    { name: 'scan_results', rows: 8420, size: '1.2 GB', realtime: true },
                    { name: 'vulnerabilities', rows: 3240, size: '456 MB', realtime: true },
                    { name: 'user_projects', rows: 1890, size: '89 MB', realtime: false },
                    { name: 'analytics', rows: 12340, size: '2.1 GB', realtime: true },
                    { name: 'compliance_reports', rows: 567, size: '234 MB', realtime: false }
                  ].map((table, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Database className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="font-medium text-white">{table.name}</div>
                          <div className="text-sm text-gray-400">{table.rows.toLocaleString()} rows • {table.size}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {table.realtime && (
                          <span className="flex items-center space-x-1 text-green-400 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Real-time</span>
                          </span>
                        )}
                        <button className="p-2 hover:bg-gray-500 rounded transition-colors">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Features */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Real-time Features</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Active Subscriptions</h4>
                    <div className="space-y-2">
                      {['Vulnerability alerts', 'Scan progress', 'User activity', 'System status'].map(sub => (
                        <div key={sub} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-gray-300">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-3">Security Features</h4>
                    <div className="space-y-2">
                      {['Row Level Security', 'API Authentication', 'SSL Encryption', 'Audit Logging'].map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'zapier' && (
            <div className="space-y-8">
              {/* Zapier Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-6 h-6 text-orange-400" />
                    <h3 className="font-semibold text-white">Active Zaps</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{zapierStats.zaps}</div>
                  <div className="text-sm text-gray-400">Automation workflows</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-6 h-6 text-green-400" />
                    <h3 className="font-semibold text-white">Runs</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{zapierStats.runs}</div>
                  <div className="text-sm text-gray-400">This month</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                    <h3 className="font-semibold text-white">Success Rate</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{zapierStats.success}%</div>
                  <div className="text-sm text-gray-400">Successful executions</div>
                </div>
              </div>

              {/* Active Zaps */}
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Active Automations</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                    <Zap className="w-4 h-4" />
                    <span>Create Zap</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { 
                      name: 'Vulnerability Alert → Slack', 
                      trigger: 'Critical vulnerability found', 
                      action: 'Send Slack message',
                      status: 'active',
                      runs: 23
                    },
                    { 
                      name: 'Scan Complete → Jira', 
                      trigger: 'Security scan finished', 
                      action: 'Create Jira ticket',
                      status: 'active',
                      runs: 45
                    },
                    { 
                      name: 'Compliance Check → Email', 
                      trigger: 'Compliance violation', 
                      action: 'Send email alert',
                      status: 'paused',
                      runs: 12
                    },
                    { 
                      name: 'New Repository → Teams', 
                      trigger: 'Repository connected', 
                      action: 'Notify Microsoft Teams',
                      status: 'active',
                      runs: 8
                    }
                  ].map((zap, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          zap.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-white">{zap.name}</div>
                          <div className="text-sm text-gray-400">{zap.trigger} → {zap.action}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-white">{zap.runs} runs</div>
                          <div className="text-xs text-gray-400">{zap.status}</div>
                        </div>
                        <button className={`p-2 rounded transition-colors ${
                          zap.status === 'active' 
                            ? 'hover:bg-gray-500 text-green-400' 
                            : 'hover:bg-gray-500 text-gray-400'
                        }`}>
                          {zap.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Integrations */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Available Integrations</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Slack', icon: '💬', connected: true },
                    { name: 'Microsoft Teams', icon: '👥', connected: true },
                    { name: 'Jira', icon: '🎯', connected: true },
                    { name: 'Trello', icon: '📋', connected: false },
                    { name: 'Discord', icon: '🎮', connected: true },
                    { name: 'Email', icon: '📧', connected: true },
                    { name: 'PagerDuty', icon: '🚨', connected: false },
                    { name: 'Webhook', icon: '🔗', connected: true }
                  ].map((integration, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 transition-colors ${
                      integration.connected 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-gray-600 bg-gray-600 hover:border-gray-500'
                    }`}>
                      <div className="text-center">
                        <div className="text-2xl mb-2">{integration.icon}</div>
                        <div className="font-medium text-white">{integration.name}</div>
                        <div className={`text-xs mt-1 ${
                          integration.connected ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {integration.connected ? 'Connected' : 'Available'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPanel;