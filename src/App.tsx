import React, { Suspense, useState, useEffect, lazy, startTransition, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { isSupabaseConfigured } from './lib/supabase';
import { getCachedData, setCache, clearCache, CACHE_EXPIRATION, createCacheKey } from './utils/cacheUtils';
import { optimizeMemory } from './utils/memoryOptimizer';
import { Menu, Code, Link as LinkIcon, Database, TestTube, Zap, CheckSquare, Play, Rocket, PlusCircle, Users, Save, Eye, Square, X, RefreshCw, Terminal as TerminalIcon } from 'lucide-react';

// Core components loaded immediately
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import Terminal from './components/Terminal';
import Toolbar from './components/Toolbar';
import TabBar from './components/TabBar';
import StatusBar from './components/StatusBar';
import ChatWindow from './components/ChatWindow';


// Lazy-loaded components
const LandingPage = lazy(() => import('./components/LandingPage'));
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const SignupPage = lazy(() => import('./components/auth/SignupPage'));
const SuccessPage = lazy(() => import('./components/SuccessPage'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const CollaborationPanel = lazy(() => import('./components/CollaborationPanel'));
const DeveloperMarketplace = lazy(() => import('./components/DeveloperMarketplace'));
const ProjectTemplates = lazy(() => import('./components/ProjectTemplates'));
const MobilePreview = lazy(() => import('./components/MobilePreview'));
const DemoMode = lazy(() => import('./components/DemoMode'));

const IntegrationsPanel = lazy(() => import('./components/IntegrationsPanel'));
const ConfigurationChecker = lazy(() => import('./components/ConfigurationChecker'));
const DeploymentStatusPanel = lazy(() => import('./components/DeploymentStatusPanel'));
const DeploymentTemplateSelector = lazy(() => import('./components/DeploymentTemplateSelector'));
const TemplateMarketplace = lazy(() => import('./components/TemplateMarketplace'));
const FeatureRequestForm = lazy(() => import('./components/FeatureRequestForm'));
const DatabaseStatsPanel = lazy(() => import('./components/DatabaseStatsPanel'));
const ScriptRunner = lazy(() => import('./components/ScriptRunner'));
const GitHubSearchDownload = lazy(() => import('./components/GitHubSearchDownload'));
const IconTest = React.lazy(() => import('./components/IconTest'));


interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  icon: React.ComponentType<{}>;
  estimatedTime: string;
  files: Record<string, { content: string; language: string }>;
  features: string[];
  useCase: string;
  techStack: string[];
}

// Memory cleanup interval
function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showConfigCheck, setShowConfigCheck] = useState(false);
  const [showStripeTests, setShowStripeTests] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showDeploymentStatus, setShowDeploymentStatus] = useState(false);
  const [showDeploymentTemplates, setShowDeploymentTemplates] = useState(false);
  const [showScriptRunner, setShowScriptRunner] = useState(false);
  const [showTemplateMarketplace, setShowTemplateMarketplace] = useState(false);
  const [showDatabaseStats, setShowDatabaseStats] = useState(false);
  const [showFeatureRequestForm, setShowFeatureRequestForm] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isCollaborationVisible, setIsCollaborationVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMarketplaceVisible, setIsMarketplaceVisible] = useState(false);
  const [showBuildLogs, setShowBuildLogs] = useState(false);
  const [showAutomationPanel, setShowAutomationPanel] = useState(false);
  const [showGitHubIntegration, setShowGitHubIntegration] = useState(false);
  
  // State for deployment modal
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  
  // Set up memory optimization (only when user is logged in)
  useEffect(() => {
    if (!user) return; // Don't run memory optimization on landing page
    
    // Optimize memory on mount for logged-in users
    optimizeMemory();
    
    // Set up interval to optimize memory only for logged-in users
    const intervalId = setInterval(optimizeMemory, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [user]); // Add user dependency
  
  // Start with empty tabs
  const initialTabs: Tab[] = [];
  
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  
  const [activeTab, setActiveTab] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [fileTree, setFileTree] = useState<any[]>([]);

  // Load tabs from cache only for logged-in users
  useEffect(() => {
    if (!user) return; // Don't load tabs for landing page users
    
    const loadTabs = async () => {
      const cacheKey = createCacheKey('editor', 'tabs', 'v2');
      const cachedTabs = await getCachedData<Tab[]>(
        cacheKey,
        async () => initialTabs,
        CACHE_EXPIRATION.VERY_LONG
      );
      
      if (cachedTabs && cachedTabs.length > 0) {
        setTabs(cachedTabs);
        setActiveTab(String(cachedTabs[0].id));
      }
    };
    
    loadTabs();
  }, [user]); // Only run when user changes
  
  // Save tabs to cache when they change (only for logged-in users)
  useEffect(() => {
    if (!user) return; // Don't save tabs for landing page users
    
    const saveTabs = async () => {
      const cacheKey = createCacheKey('editor', 'tabs', 'v2');
      await setCache(cacheKey, tabs, CACHE_EXPIRATION.VERY_LONG);
    };
    
    if (tabs.length > 0) {
      saveTabs();
    }
  }, [tabs, user]); // Add user dependency

  // Clear cache and optimize memory when user logs out
  const handleMemoryCleanup = useCallback(async () => {
    try {
      await clearCache();
      optimizeMemory();
    } catch (error) {
    }
  }, []);

  // Logout handler
  const handleLogout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
      // Clear Supabase local storage for a guaranteed fresh state
      window.localStorage.removeItem('supabase.auth.token');
      window.localStorage.removeItem('sb-' + supabase.supabaseKey + '-auth-token');
    }
    setUser(null);
    await handleMemoryCleanup();
  }, [handleMemoryCleanup]);

  // Check for existing session before showing landing page (run only once on mount)
  useEffect(() => {
    // Check URL for success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const checkSession = async () => {
      setLoading(true);
      let sessionUser = null;
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        sessionUser = data?.session?.user || null;
      }
      setUser(sessionUser);
      setLoading(false);
    };
    checkSession();
  }, []);

  // Listen for auth changes (subscribe only once on mount)
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event: string, session: { user?: any } | null) => {
          startTransition(() => {
            if (isSupabaseConfigured && session?.user) {
              setUser(session.user);
            } else if (isSupabaseConfigured && !session?.user) {
              setUser(null);
            }
          });
        }
      );
      subscription = data?.subscription;
    } catch (error) {}
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        try {
          subscription.unsubscribe?.();
        } catch (e) {}
      }
    };
  }, []);

  // Clear user-specific cache when showing landing page (but avoid aggressive refreshing)
  useEffect(() => {
    if (!user) {
      // Only clear cache once when user logs out, not repeatedly
      const hasCleared = sessionStorage.getItem('cache-cleared-for-session');
      if (!hasCleared) {
        clearCache();
        optimizeMemory();
        sessionStorage.setItem('cache-cleared-for-session', 'true');
        
        // Force service worker update to bust cache (only in production, only once)
        if ('serviceWorker' in navigator && !import.meta.env.DEV) {
          navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
              registration.update();
            }
          });
        }
      }
    } else {
      // Clear the session flag when user logs in
      sessionStorage.removeItem('cache-cleared-for-session');
    }
  }, [user]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleLogin = useCallback(async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        startTransition(() => {
          setUser({ 
            id: 'demo-user', 
            email: email,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          });
        });
        setAuthLoading(false);
      }, 1000);
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        setAuthError(error.message);
      }
      // On success, the auth state listener will update the user state
    } catch (err: any) {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleSignup = useCallback(async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      setAuthLoading(false);
      return;
    }
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        startTransition(() => {
          setUser({ 
            id: 'demo-user', 
            email: email,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          });
        });
        setAuthLoading(false);
      }, 1000);
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
        },
      });
      if (error) {
        setAuthError(error.message);
      }
    } catch (err: any) {
      setAuthError('Signup failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ErrorBoundary for catching errors in LandingPage
  class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) {
      return { hasError: true, error };
    }
    componentDidCatch(error: any, info: any) {
      // You can log error here
    }
    render() {
      if (this.state.hasError) {
        return <div style={{color: 'red', padding: 24}}>LandingPage Error: {String(this.state.error)}</div>;
      }
      return this.props.children;
    }
  }

  // Find the active tab object
  const activeTabObj = tabs.find(tab => tab.id === activeTab);

  // Tab handlers
  const handleTabSelect = (id: string | number) => setActiveTab(String(id));
  const handleTabClose = (id: string | number) => {
    const idx = tabs.findIndex(tab => tab.id === id);
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(String(newTabs[Math.max(0, idx - 1)].id));
    }
  };

  // File open handler (expects filePath: string)
  const handleFileOpen = async (filePath: string) => {
    // Create a new tab for the selected file
    const fileName = filePath.split('/').pop() || filePath;
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Determine language based on file extension
    const getLanguage = (ext: string) => {
      switch (ext) {
        case 'rs': return 'rust';
        case 'kt': return 'kotlin';
        case 'java': return 'java';
        case 'dart': return 'dart';
        case 'swift': return 'swift';
        case 'js': case 'jsx': return 'javascript';
        case 'ts': case 'tsx': return 'typescript';
        case 'py': return 'python';
        case 'xml': return 'xml';
        case 'json': return 'json';
        case 'toml': return 'toml';
        case 'gradle': return 'gradle';
        case 'md': return 'markdown';
        default: return 'plaintext';
      }
    };
    
    // Generate sample content based on file type
    const getSampleContent = (fileName: string, language: string) => {
      if (fileName === 'MainActivity.kt') {
        return `package com.rustyclint.helloworld

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Find the TextView and set a dynamic message
        val messageTextView = findViewById<TextView>(R.id.messageTextView)
        messageTextView.text = "Hello World from rustyclint!"
    }
}`;
      } else if (fileName === 'main.rs') {
        return `use std::collections::HashMap;

fn main() {
    println!("Welcome to rustyclint!");
    
    let mut config = HashMap::new();
    config.insert("platform", "mobile");
    config.insert("target", "android");
    
    initialize_app(config);
}

fn initialize_app(config: HashMap<&str, &str>) {
    println!("Initializing app with config: {:?}", config);
    // App initialization logic here
}`;
      } else if (fileName === 'lib.rs') {
        return `//! rustyclint mobile library
//! 
//! This library provides core functionality for mobile app development
//! with Rust, including platform-specific optimizations and security features.

pub mod mobile_utils;
pub mod platform;
pub mod ui;

use std::ffi::{CStr, CString};
use std::os::raw::c_char;

/// Initialize the rustyclint mobile library
#[no_mangle]
pub extern "C" fn rustyclint_init() -> bool {
    println!("rustyclint mobile library initialized");
    true
}

/// Process data with high performance
#[no_mangle]
pub extern "C" fn process_data(input: *const c_char) -> *mut c_char {
    let c_str = unsafe { CStr::from_ptr(input) };
    let input_str = c_str.to_str().unwrap_or("");
    
    let result = format!("Processed: {}", input_str);
    let c_string = CString::new(result).unwrap();
    c_string.into_raw()
}`;
      } else if (language === 'dart') {
        return `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'rustyclint Mobile',
      theme: ThemeData(
        primarySwatch: Colors.orange,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: 'rustyclint Mobile App'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}`;
      } else if (language === 'xml') {
        return `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#1F2937"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/titleTextView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        android:textColor="#FFFFFF"
        android:textSize="32sp"
        android:textStyle="bold"
        app:layout_constraintBottom_toTopOf="@+id/messageTextView"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/messageTextView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome to your first Android app!"
        android:textColor="#E5E7EB"
        android:textSize="18sp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/titleTextView" />

</androidx.constraintlayout.widget.ConstraintLayout>`;
      } else if (language === 'toml') {
        return `[package]
name = "rustyclint"
version = "0.1.0"
edition = "2021"

[lib]
name = "rustyclint"
crate-type = ["staticlib", "cdylib"]

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }

[target.'cfg(target_os = "android")'.dependencies]
jni = "0.19.0"

[target.'cfg(target_os = "ios")'.dependencies]
objc = "0.2"

[profile.release]
opt-level = 3
lto = true
codegen-units = 1`;
      }
      return `// ${fileName}\n// Add your code here...`;
    };
    
    const newTab = {
      id: filePath,
      name: fileName,
      content: getSampleContent(fileName, getLanguage(fileExtension)),
      language: getLanguage(fileExtension),
      isDirty: false
    };
    
    if (!tabs.some(tab => tab.id === filePath)) {
      setTabs([...tabs, newTab]);
    }
    setActiveTab(filePath);
  };

  // Code change handler
  const handleCodeChange = (value: string) => {
    setTabs(tabs.map(tab =>
      tab.id === activeTab ? { ...tab, content: value, isDirty: true } : tab
    ));
  };

  // Refresh file tree
  const refreshFileTree = async () => {
    // Fetch latest file tree from backend
    const res = await fetch('/api/file-tree');
    const tree = await res.json();
    setFileTree(tree);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const formData = new FormData();
    for (const file of Array.from(files)) {
      // This preserves folder structure if uploading a directory
      formData.append('files', file, file.webkitRelativePath || file.name);
    }
  
    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  
    // Refresh the file tree after upload
    refreshFileTree();
  };

  // Initialize welcome tab only for logged-in users
  React.useEffect(() => {
    if (user && tabs.length === 0) {
      setTabs([{ id: 'welcome', name: 'Welcome', content: 'Welcome to RustyClint!', language: 'plaintext', isDirty: false }]);
      setActiveTab('welcome');
    }
  }, [user, tabs.length]); // Add dependencies to prevent unnecessary runs

  // Render and export the App component
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div style={{color: 'blue', fontSize: 24, padding: 32}}>Loading page...</div>}>
        {loading ? (
          <div style={{color: 'blue', fontSize: 24, padding: 32}}>Loading...</div>
        ) : !user ? (
          <LandingPage
            onLogin={handleLogin}
            loading={authLoading}
            error={authError}
            handleUpload={handleUpload}
          />
        ) : (
          <div className="flex h-screen bg-[#1e1e1e] text-[#d4d4d4]">
          {/* Sidebar: Project/File Explorer + Open Editors */}
          <div className="flex flex-col w-64 bg-[#23272e] border-r border-[#222]">
            {/* Open Editors */}
            <div className="border-b border-[#222] px-3 py-2">
              <div className="text-xs font-semibold text-[#bfbfbf] mb-2">OPEN EDITORS</div>
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`flex items-center px-2 py-1 rounded cursor-pointer mb-1 ${
                    tab.id === activeTab ? 'bg-[#1e1e1e] text-white' : 'hover:bg-[#252526]'
                  }`}
                  onClick={() => handleTabSelect(tab.id)}
                >
                  <span className="mr-2">📄</span>
                  <span className="truncate">{tab.name}</span>
                  <button
                    className="ml-auto text-xs text-[#bfbfbf] hover:text-red-400"
                    onClick={e => { e.stopPropagation(); handleTabClose(tab.id); }}
                    title="Close"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {/* Project/File Explorer */}
            <div className="flex-1 overflow-y-auto">
              <FileExplorer
                onFileSelect={handleFileOpen}
                selectedFile={activeTab}
                // ...other props as needed
              />
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar */}
            <Toolbar
              user={user}
              onShowPricing={() => setShowPricing(true)}
              onShowProfile={() => setShowProfile(true)}
              onToggleTerminal={() => setIsTerminalVisible(v => !v)}
              onShowTemplates={() => setShowTemplates(true)}
              onShowMobilePreview={() => setShowMobilePreview(true)}
              onShowConfigCheck={() => setShowConfigCheck(true)}
              onShowStripeTests={() => setShowStripeTests(true)}
              onShowIntegrations={() => setShowIntegrations(true)}
              onShowDeploymentStatus={() => setShowDeploymentStatus(true)}
              onShowDeploymentTemplates={() => setShowDeploymentTemplates(true)}
              onShowScriptRunner={() => setShowScriptRunner(true)}
              onShowTemplateMarketplace={() => setShowTemplateMarketplace(true)}
              onShowDatabaseStats={() => setShowDatabaseStats(true)}
              onShowFeatureRequestForm={() => setShowFeatureRequestForm(true)}
              onToggleSidebar={() => setIsSidebarOpen(v => !v)}
              onToggleMarketplace={() => setIsMarketplaceVisible(v => !v)}
              onShowBuildLogs={() => setShowBuildLogs(true)}
              onShowAutomationPanel={() => setShowAutomationPanel(true)}
              onShowGitHubIntegration={() => setShowGitHubIntegration(true)}
              onLogout={handleLogout}
              onToggleCollaboration={() => setIsCollaborationVisible(v => !v)}
            />
            {/* TabBar */}
            <TabBar
              tabs={tabs || []}
              activeTab={activeTab}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
            />
            {/* Editor */}
            <div className="flex-1 flex min-h-0">
              <div className="flex-1 flex flex-col">
                {tabs.length > 0 && activeTab ? (
                  <CodeEditor
                    content={tabs.find(tab => tab.id === activeTab)?.content || ''}
                    onChange={handleCodeChange}
                    language={tabs.find(tab => tab.id === activeTab)?.language || 'plaintext'}
                    fileName={tabs.find(tab => tab.id === activeTab)?.name || ''}
                    // ...other props
                  />
                ) : (
                  <div className="text-center text-gray-400 mt-8">Open a file to get started</div>
                )}
                {/* Terminal at the bottom */}
                <div className="border-t border-[#222] bg-[#18181a] h-40">
                  <Terminal
                    isVisible={isTerminalVisible}
                    onToggle={() => setIsTerminalVisible(v => !v)}
                  />
                </div>
              </div>
              {/* Chat Window on the right */}
              <div className="w-80 border-l border-[#222] bg-[#23272e] flex flex-col">
                <div className="border-b border-[#222] px-3 py-2 text-xs font-semibold text-[#bfbfbf]">
                  CHAT
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ChatWindow />
                </div>
              </div>
            </div>
            {/* Status Bar */}
            <StatusBar
              currentFile={tabs.find(tab => tab.id === activeTab)?.name || ''}
              language={tabs.find(tab => tab.id === activeTab)?.language || ''}
              lineCount={
                (tabs.find(tab => tab.id === activeTab)?.content.match(/\n/g)?.length ?? 0) + 1
              }
              currentLine={1} // You may want to track the actual cursor line in your CodeEditor and pass it here
              buildStatus={buildStatus}
            />
          </div>
        </div>
        )}
        
        {/* GitHub Integration Modal */}
        {showGitHubIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 w-full max-w-4xl h-[80vh] m-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">GitHub Integration</h2>
                <button
                  onClick={() => setShowGitHubIntegration(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close GitHub Integration"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 h-full overflow-y-auto">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="text-white">Loading GitHub integration...</div>
                  </div>
                }>
                  <GitHubSearchDownload />
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </React.Suspense>
    </ErrorBoundary>
  );
}

export default App;

