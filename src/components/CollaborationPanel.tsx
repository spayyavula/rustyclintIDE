import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Phone, 
  Share2, 
  Settings, 
  Crown,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  UserPlus,
  Globe,
  Wifi,
  WifiOff,
  Circle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'busy';
  cursor?: { line: number; column: number; file: string };
  country: string;
  timezone: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'file' | 'system';
  fileRef?: string;
  codeSnippet?: string;
}

interface CollaborationPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  currentFile: string;
  onUserCursorUpdate: (userId: string, cursor: { line: number; column: number; file: string }) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  isVisible, 
  onToggle, 
  currentFile,
  onUserCursorUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'users' | 'voice'>('chat');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '👨‍💻',
      role: 'owner',
      status: 'online',
      cursor: { line: 15, column: 8, file: 'main.rs' },
      country: 'Singapore',
      timezone: 'GMT+8'
    },
    {
      id: '2',
      name: 'Maria Rodriguez',
      avatar: '👩‍💻',
      role: 'editor',
      status: 'online',
      cursor: { line: 23, column: 12, file: 'lib.rs' },
      country: 'Spain',
      timezone: 'GMT+1'
    },
    {
      id: '3',
      name: 'Raj Patel',
      avatar: '👨‍🔬',
      role: 'editor',
      status: 'away',
      country: 'India',
      timezone: 'GMT+5:30'
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      avatar: '👩‍🚀',
      role: 'viewer',
      status: 'online',
      cursor: { line: 45, column: 3, file: 'ui.rs' },
      country: 'USA',
      timezone: 'GMT-5'
    },
    {
      id: '5',
      name: 'Yuki Tanaka',
      avatar: '👨‍🎨',
      role: 'editor',
      status: 'busy',
      country: 'Japan',
      timezone: 'GMT+9'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Maria Rodriguez',
      content: 'Hey team! I just pushed the mobile UI components. Can someone review the touch handling logic?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      userId: '1',
      userName: 'Alex Chen',
      content: 'Looking at it now! The gesture recognition looks solid.',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Sarah Johnson',
      content: 'Should we add haptic feedback for button presses?',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    },
    {
      id: '4',
      userId: '2',
      userName: 'Maria Rodriguez',
      content: 'pub fn handle_touch(x: f64, y: f64) -> bool {\n    // Validate touch bounds\n    if !validate_touch_bounds(x, y) {\n        return false;\n    }\n    process_touch_event(x, y)\n}',
      timestamp: new Date(Date.now() - 120000),
      type: 'code',
      codeSnippet: 'handle_touch function'
    },
    {
      id: '5',
      userId: '5',
      userName: 'Yuki Tanaka',
      content: 'Great work on the animations! The transitions feel very smooth.',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: message,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'editor': return <Circle className="w-3 h-3 text-blue-400" />;
      case 'viewer': return <Circle className="w-3 h-3 text-gray-400" />;
      default: return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const shareCode = () => {
    const codeSnippet = `// Current selection from ${currentFile}
fn example_function() {
    println!("Shared code snippet");
}`;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: codeSnippet,
      timestamp: new Date(),
      type: 'code',
      codeSnippet: `Code from ${currentFile}`
    };

    setMessages(prev => [...prev, newMessage]);
  };

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Collaboration</h3>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              isConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'chat' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'voice' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Voice</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-300">{msg.userName}</span>
                    <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                  </div>
                  {msg.type === 'code' ? (
                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                      <div className="text-xs text-gray-400 mb-2">{msg.codeSnippet}</div>
                      <pre className="text-sm text-gray-100 font-mono overflow-x-auto">
                        <code>{msg.content}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-200 leading-relaxed">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                    placeholder="Type a message..."
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={shareCode}
                    className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
                    title="Share Code"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    title="Send Message"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-200">Team Members ({users.length})</h4>
                <p className="text-xs text-gray-500 mb-2">Global team across multiple timezones</p>
              </div>
              <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                      {user.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-white truncate">{user.name}</span>
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Globe className="w-3 h-3" />
                      <span>{user.country} 🌍</span>
                      <span>•</span>
                      <span>{user.timezone}</span>
                    </div>
                    {user.cursor && (
                      <div className="text-xs text-blue-400">
                        Editing {user.cursor.file} at line {user.cursor.line}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors">
                <UserPlus className="w-4 h-4" />
                <span>Invite Global Collaborators</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="p-4 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-1">Global Voice & Video</h4>
              <p className="text-xs text-gray-400">Connect with developers worldwide in real-time</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isVoiceActive 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{isVoiceActive ? 'Leave' : 'Join'}</span>
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isCameraOn 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                <span>Camera</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isScreenSharing 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <ScreenShare className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {isVoiceActive && (
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-300 mb-2">Global participants online:</div>
                <div className="space-y-2">
                  {users.filter(u => u.status === 'online').slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                        {user.avatar}
                      </div>
                      <span className="text-xs text-gray-300">{user.name}</span>
                      <div className="flex-1" />
                      <span className="text-xs text-gray-500">{user.country}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Global Communication Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;