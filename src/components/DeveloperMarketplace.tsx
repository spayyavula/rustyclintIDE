import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Star, 
  DollarSign, 
  Clock, 
  User, 
  MessageSquare, 
  Video, 
  Code, 
  Award, 
  TrendingUp, 
  Filter,
  MapPin,
  Calendar, 
  CheckCircle,
  XCircle,
  CreditCard,
  Zap,
  Globe,
  Heart,
  BookOpen,
  Users,
  Target,
  Briefcase,
  Coffee
} from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  responseTime: string;
  skills: string[];
  languages: string[];
  country: string;
  timezone: string;
  isOnline: boolean;
  completedJobs: number;
  successRate: number;
  description: string;
  portfolio: string[];
  badges: string[];
  specialties: string[];
}

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  urgency: 'low' | 'medium' | 'high';
  skills: string[];
  postedBy: string;
  postedAt: Date;
  deadline: Date;
  proposals: number;
  status: 'open' | 'in-progress' | 'completed';
  category: string;
}

interface MarketplaceProps {
  isVisible: boolean;
  onToggle: () => void;
}

const DeveloperMarketplace: React.FC<MarketplaceProps> = ({ isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'requests' | 'my-jobs' | 'earnings'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [showHireModal, setShowHireModal] = useState(false);

  const categories = [
    'All', 'AI/ML Development', 'Deep Learning', 'Computer Vision', 'NLP', 
    'Reinforcement Learning', 'Mobile Development', 'Web Development', 'Backend', 
    'DevOps', 'UI/UX Design', 'Database', 'Testing', 'Code Review', 'Mentoring'
  ];

  const developers: Developer[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      avatar: '🧠',
      title: 'AI/ML Research Scientist',
      rating: 4.9,
      reviewCount: 156,
      hourlyRate: 150,
      responseTime: '< 30 min',
      skills: ['TensorFlow', 'PyTorch', 'Rust', 'CUDA', 'Computer Vision', 'NLP'],
      languages: ['English', 'Mandarin'],
      country: 'USA',
      timezone: 'GMT-8',
      isOnline: true,
      completedJobs: 89,
      successRate: 99,
      description: 'PhD in Machine Learning with 10+ years experience in deep learning, computer vision, and NLP. Specialized in production ML systems.',
      portfolio: ['Autonomous Vehicle Vision System', 'Medical Image Analysis', 'Language Translation Model'],
      badges: ['AI Expert', 'Research Verified', 'Top Performer'],
      specialties: ['Deep Learning', 'Computer Vision', 'Production ML']
    },
    {
      id: '2',
      name: 'Alex Petrov',
      avatar: '🤖',
      title: 'Reinforcement Learning Engineer',
      rating: 4.8,
      reviewCount: 134,
      hourlyRate: 130,
      responseTime: '< 1 hour',
      skills: ['Reinforcement Learning', 'Python', 'Rust', 'OpenAI Gym', 'Unity ML'],
      languages: ['English', 'Russian'],
      country: 'Germany',
      timezone: 'GMT+1',
      isOnline: true,
      completedJobs: 76,
      successRate: 97,
      description: 'Specialized in reinforcement learning for games, robotics, and autonomous systems. Expert in multi-agent systems.',
      portfolio: ['Game AI Agent', 'Trading Bot', 'Robotic Control System'],
      badges: ['RL Specialist', 'Game AI Expert', 'Fast Delivery'],
      specialties: ['Multi-agent RL', 'Game AI', 'Robotics']
    },
    {
      id: '3',
      name: 'Dr. Priya Sharma',
      avatar: '👩‍🔬',
      title: 'Computer Vision Specialist',
      rating: 4.9,
      reviewCount: 198,
      hourlyRate: 140,
      responseTime: '< 45 min',
      skills: ['OpenCV', 'YOLO', 'Rust', 'CUDA', 'Medical Imaging', 'Edge AI'],
      languages: ['English', 'Hindi'],
      country: 'India',
      timezone: 'GMT+5:30',
      isOnline: true,
      completedJobs: 112,
      successRate: 98,
      description: 'Computer vision expert with focus on medical imaging, autonomous vehicles, and real-time processing on edge devices.',
      portfolio: ['Medical Diagnosis System', 'Autonomous Drone Navigation', 'Real-time Object Tracking'],
      badges: ['Vision Expert', 'Medical AI', 'Edge Computing'],
      specialties: ['Medical Imaging', 'Real-time Processing', 'Edge Deployment']
    },
    {
      id: '4',
      name: 'Marcus Thompson',
      avatar: '🔬',
      title: 'NLP & Language Model Expert',
      rating: 4.8,
      reviewCount: 167,
      hourlyRate: 135,
      responseTime: '< 1 hour',
      skills: ['Transformers', 'BERT', 'GPT', 'Rust', 'HuggingFace', 'LangChain'],
      languages: ['English'],
      country: 'UK',
      timezone: 'GMT+0',
      isOnline: true,
      completedJobs: 94,
      successRate: 96,
      description: 'NLP specialist with expertise in large language models, chatbots, and text analysis. Experience with custom transformer architectures.',
      portfolio: ['Enterprise Chatbot', 'Document Analysis System', 'Multilingual Translation'],
      badges: ['NLP Expert', 'LLM Specialist', 'Enterprise Ready'],
      specialties: ['Large Language Models', 'Chatbots', 'Text Analysis']
    },
    {
      id: '5',
      name: 'Elena Vasquez',
      avatar: '👩‍💻',
      title: 'Senior Mobile Developer',
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 85,
      responseTime: '< 1 hour',
      skills: ['Rust', 'Flutter', 'React Native', 'iOS', 'Android'],
      languages: ['English', 'Spanish'],
      country: 'Spain',
      timezone: 'GMT+1',
      isOnline: true,
      completedJobs: 89,
      successRate: 98,
      description: 'Specialized in cross-platform mobile development with 8+ years experience. Expert in Rust-based mobile solutions.',
      portfolio: ['Mobile Banking App', 'IoT Dashboard', 'Gaming Platform'],
      badges: ['Top Rated', 'Mobile Expert', 'Fast Delivery'],
      specialties: ['Performance Optimization', 'Cross-platform', 'Real-time Apps']
    },
    {
      id: '6',
      name: 'Hiroshi Tanaka',
      avatar: '👨‍🔬',
      title: 'Rust Systems Engineer',
      rating: 4.8,
      reviewCount: 203,
      hourlyRate: 95,
      responseTime: '< 30 min',
      skills: ['Rust', 'WebAssembly', 'Systems Programming', 'Performance'],
      languages: ['English', 'Japanese'],
      country: 'Japan',
      timezone: 'GMT+9',
      isOnline: true,
      completedJobs: 156,
      successRate: 99,
      description: 'Systems programming expert with deep knowledge of Rust internals and performance optimization.',
      portfolio: ['High-Performance Trading System', 'Blockchain Infrastructure', 'Real-time Analytics'],
      badges: ['Expert Verified', 'Performance Guru', 'Enterprise Ready'],
      specialties: ['Low-level Programming', 'Memory Safety', 'Concurrency']
    },
    {
      id: '7',
      name: 'Priya Sharma',
      avatar: '👩‍🚀',
      title: 'Full-Stack Developer',
      rating: 4.7,
      reviewCount: 94,
      hourlyRate: 65,
      responseTime: '< 2 hours',
      skills: ['React', 'Node.js', 'Rust', 'PostgreSQL', 'AWS'],
      languages: ['English', 'Hindi'],
      country: 'India',
      timezone: 'GMT+5:30',
      isOnline: false,
      completedJobs: 67,
      successRate: 96,
      description: 'Full-stack developer with expertise in modern web technologies and cloud deployment.',
      portfolio: ['E-commerce Platform', 'SaaS Dashboard', 'API Gateway'],
      badges: ['Rising Talent', 'Cloud Expert'],
      specialties: ['API Development', 'Database Design', 'Cloud Architecture']
    },
    {
      id: '8',
      name: 'Marcus Johnson',
      avatar: '👨‍💼',
      title: 'DevOps Consultant',
      rating: 4.9,
      reviewCount: 178,
      hourlyRate: 110,
      responseTime: '< 1 hour',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
      languages: ['English'],
      country: 'USA',
      timezone: 'GMT-5',
      isOnline: true,
      completedJobs: 134,
      successRate: 97,
      description: 'DevOps expert helping teams scale their infrastructure and improve deployment processes.',
      portfolio: ['Microservices Migration', 'CI/CD Pipeline', 'Infrastructure Automation'],
      badges: ['DevOps Master', 'Scaling Expert', 'Reliable'],
      specialties: ['Container Orchestration', 'Infrastructure as Code', 'Monitoring']
    }
  ];

  const helpRequests: HelpRequest[] = [
    {
      id: '1',
      title: 'Build custom neural network for image classification',
      description: 'Need an expert to help build and train a custom CNN for medical image classification. Dataset provided, need 95%+ accuracy.',
      budget: 2500,
      urgency: 'high',
      skills: ['Deep Learning', 'Computer Vision', 'TensorFlow', 'Medical AI'],
      postedBy: 'MedTech Solutions',
      postedAt: new Date(Date.now() - 1800000),
      deadline: new Date(Date.now() + 86400000 * 7),
      proposals: 18,
      status: 'open',
      category: 'AI/ML Development'
    },
    {
      id: '2',
      title: 'Implement reinforcement learning for trading bot',
      description: 'Looking for RL expert to develop and optimize trading algorithms using deep Q-learning and policy gradients.',
      budget: 3000,
      urgency: 'medium',
      skills: ['Reinforcement Learning', 'Trading', 'Python', 'Quantitative Finance'],
      postedBy: 'FinTech Innovations',
      postedAt: new Date(Date.now() - 3600000),
      deadline: new Date(Date.now() + 86400000 * 14),
      proposals: 22,
      status: 'open',
      category: 'AI/ML Development'
    },
    {
      id: '3',
      title: 'Optimize transformer model for edge deployment',
      description: 'Need help optimizing a BERT-based model for deployment on mobile devices. Target: <100MB model size, <200ms inference.',
      budget: 1800,
      urgency: 'medium',
      skills: ['Model Optimization', 'Edge AI', 'ONNX', 'Mobile Deployment'],
      postedBy: 'EdgeAI Startup',
      postedAt: new Date(Date.now() - 5400000),
      deadline: new Date(Date.now() + 86400000 * 10),
      proposals: 14,
      status: 'open',
      category: 'AI/ML Development'
    },
    {
      id: '4',
      title: 'Need help optimizing Rust mobile app performance',
      description: 'Looking for an expert to help optimize memory usage and improve frame rates in our Flutter-Rust mobile application.',
      budget: 500,
      urgency: 'high',
      skills: ['Rust', 'Flutter', 'Performance Optimization'],
      postedBy: 'TechStartup Inc.',
      postedAt: new Date(Date.now() - 3600000),
      deadline: new Date(Date.now() + 86400000 * 3),
      proposals: 12,
      status: 'open',
      category: 'Mobile Development'
    },
    {
      id: '5',
      title: 'Code review for WebAssembly module',
      description: 'Need experienced Rust developer to review our WebAssembly module for security and performance issues.',
      budget: 200,
      urgency: 'medium',
      skills: ['Rust', 'WebAssembly', 'Security'],
      postedBy: 'WebTech Solutions',
      postedAt: new Date(Date.now() - 7200000),
      deadline: new Date(Date.now() + 86400000 * 5),
      proposals: 8,
      status: 'open',
      category: 'Code Review'
    },
    {
      id: '6',
      title: 'Implement real-time collaboration features',
      description: 'Looking for developer to implement real-time collaborative editing similar to Google Docs but for code.',
      budget: 1200,
      urgency: 'medium',
      skills: ['WebSockets', 'Real-time', 'React', 'Node.js'],
      postedBy: 'CodeCollab',
      postedAt: new Date(Date.now() - 10800000),
      deadline: new Date(Date.now() + 86400000 * 7),
      proposals: 15,
      status: 'open',
      category: 'Web Development'
    },
    {
      id: '7',
      title: 'Computer vision for quality control system',
      description: 'Develop computer vision system for manufacturing quality control. Need real-time defect detection with 99%+ accuracy.',
      budget: 4000,
      urgency: 'high',
      skills: ['Computer Vision', 'OpenCV', 'Real-time Processing', 'Manufacturing'],
      postedBy: 'Manufacturing Corp',
      postedAt: new Date(Date.now() - 7200000),
      deadline: new Date(Date.now() + 86400000 * 21),
      proposals: 16,
      status: 'open',
      category: 'Computer Vision'
    },
    {
      id: '8',
      title: 'NLP chatbot for customer service',
      description: 'Build intelligent chatbot using latest NLP techniques. Must handle complex queries and integrate with existing CRM.',
      budget: 2200,
      urgency: 'medium',
      skills: ['NLP', 'Chatbots', 'LangChain', 'Customer Service'],
      postedBy: 'E-commerce Platform',
      postedAt: new Date(Date.now() - 9000000),
      deadline: new Date(Date.now() + 86400000 * 18),
      proposals: 25,
      status: 'open',
      category: 'NLP'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleHireDeveloper = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setShowHireModal(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Global Developer Marketplace</h2>
                <p className="text-gray-400">Connect with 50,000+ expert developers across 180+ countries</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
            {[
              { id: 'browse', label: 'Browse Experts', icon: Search },
              { id: 'requests', label: 'Global Requests', icon: MessageSquare },
              { id: 'my-jobs', label: 'My Jobs', icon: Briefcase },
              { id: 'earnings', label: 'Global Earnings', icon: DollarSign }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm transition-colors ${
                  activeTab === id 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'browse' && (
            <div className="flex h-full">
              {/* Filters Sidebar */}
              <div className="w-80 bg-gray-900 p-6 border-r border-gray-700 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                
                {/* Global Stats */}
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-300 mb-2">🌍 Global Network</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">50K+</div>
                      <div className="text-gray-400">Developers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">180+</div>
                      <div className="text-gray-400">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">24/7</div>
                      <div className="text-gray-400">Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">15+</div>
                      <div className="text-gray-400">Timezones</div>
                    </div>
                  </div>
                </div>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search skills, name..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Quick Filters</h4>
                  {[
                    { label: 'Online Now (Global)', count: 2847 },
                    { label: 'Top Rated Worldwide', count: 1203 },
                    { label: 'Fast Response (<1h)', count: 1876 },
                    { label: 'Enterprise Ready', count: 892 }
                  ].map(filter => (
                    <label key={filter.label} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
                      <span className="text-sm text-gray-300">{filter.label}</span>
                      <span className="text-xs text-gray-500">({filter.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Developers List */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Global Developer Network</h3>
                    <p className="text-sm text-gray-400">Showing {developers.length} of 50,000+ developers worldwide</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm">
                      <option>Best Match</option>
                      <option>Highest Rated</option>
                      <option>Lowest Price</option>
                      <option>Fastest Response</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6">
                  {developers.map(developer => (
                    <div key={developer.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-green-500 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                            {developer.avatar}
                          </div>
                          {developer.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-700" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-white">{developer.name}</h4>
                              <p className="text-gray-300">{developer.title}</p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{developer.country}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{developer.timezone}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-400">${developer.hourlyRate}/hr</div>
                              <div className="text-sm text-gray-400">Response: {developer.responseTime}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white font-medium">{developer.rating}</span>
                              <span className="text-gray-400">({developer.reviewCount} reviews)</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {developer.completedJobs} jobs • {developer.successRate}% success
                            </div>
                          </div>

                          <p className="text-gray-300 mb-4 line-clamp-2">{developer.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {developer.skills.slice(0, 5).map(skill => (
                              <span key={skill} className="px-2 py-1 bg-gray-600 text-gray-200 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                            {developer.skills.length > 5 && (
                              <span className="px-2 py-1 bg-gray-600 text-gray-400 rounded text-xs">
                                +{developer.skills.length - 5} more
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {developer.badges.map(badge => (
                              <span key={badge} className="flex items-center space-x-1 px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                                <Award className="w-3 h-3" />
                                <span>{badge}</span>
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleHireDeveloper(developer)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              <DollarSign className="w-4 h-4" />
                              <span>Hire Now</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              <span>Message</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                              <Video className="w-4 h-4" />
                              <span>Video Call</span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Global Help Requests</h3>
                  <p className="text-sm text-gray-400">Active requests from developers worldwide ({helpRequests.length})</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Post Global Request</span>
                </button>
              </div>
              
              {/* Global Request Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">2,847</div>
                  <div className="text-xs text-gray-400">Active Requests</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">156</div>
                  <div className="text-xs text-gray-400">Countries</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">89%</div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">4.2h</div>
                  <div className="text-xs text-gray-400">Avg Response</div>
                </div>
              </div>

              <div className="grid gap-6">
                {helpRequests.map(request => (
                  <div key={request.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{request.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{request.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{request.postedBy}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(request.postedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {request.deadline.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">${request.budget}</div>
                        <div className="text-sm text-gray-400">{request.proposals} proposals</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {request.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        <Target className="w-4 h-4" />
                        <span>Submit Proposal</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>Ask Question</span>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'my-jobs' && (
            <div className="p-6 overflow-y-auto">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Join the Global Marketplace</h3>
                <p className="text-gray-400 mb-6">Connect with developers worldwide or post requests to our global community</p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => setActiveTab('browse')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Browse Global Experts
                  </button>
                  <button 
                    onClick={() => setActiveTab('requests')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Post Global Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="p-6 overflow-y-auto">
              {/* Global Marketplace Stats */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">🌍 Global Marketplace Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">$2.4M+</div>
                    <div className="text-xs text-gray-400">Total Paid Globally</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">180+</div>
                    <div className="text-xs text-gray-400">Countries Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">50K+</div>
                    <div className="text-xs text-gray-400">Global Developers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">24/7</div>
                    <div className="text-xs text-gray-400">Global Coverage</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-2">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">$0</div>
                      <div className="text-sm text-gray-400">Total Earnings</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-sm text-gray-400">Completed Jobs</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-2">
                    <Star className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">-</div>
                      <div className="text-sm text-gray-400">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Join the Global Developer Economy</h3>
                <p className="text-gray-400 mb-6">Complete your profile and start earning from developers worldwide. Work across timezones, cultures, and technologies.</p>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Join Global Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hire Modal */}
      {showHireModal && selectedDeveloper && (
        <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Hire {selectedDeveloper.name} - Global Collaboration</h3>
              <button
                onClick={() => setShowHireModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                  {selectedDeveloper.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{selectedDeveloper.name}</h4>
                  <p className="text-gray-300">{selectedDeveloper.title}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white">{selectedDeveloper.rating}</span>
                    <span className="text-gray-400">({selectedDeveloper.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Describe your project..."
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget</label>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="$500"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide detailed description of what you need help with..."
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timeline</label>
                  <select className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none">
                    <option>1-3 days</option>
                    <option>1 week</option>
                    <option>2-4 weeks</option>
                    <option>1-3 months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Communication</label>
                  <select className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none">
                    <option>Global Chat + Video calls</option>
                    <option>Chat only</option>
                    <option>Video calls only</option>
                    <option>Async collaboration</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Hourly Rate</span>
                  <span className="text-white font-semibold">${selectedDeveloper.hourlyRate}/hr (Global Rate)</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Global Platform Fee (10%)</span>
                  <span className="text-white">$5.00/hr</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Cross-border Protection</span>
                  <span className="text-green-400">✓ Included</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Total Cost</span>
                    <span className="text-green-400 font-bold">${selectedDeveloper.hourlyRate + 5}/hr</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowHireModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <CreditCard className="w-4 h-4" />
                  <span>Hire Globally & Pay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperMarketplace;