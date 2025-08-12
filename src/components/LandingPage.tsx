import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Star, Zap, Shield, Globe, Mail, Lock } from 'lucide-react';

const LoginForm: React.FC<{ onLogin: (email: string, password: string) => void; loading: boolean; error: string | null }> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full border border-orange-200 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-6 text-center tracking-tight drop-shadow">Log in to <span className="text-green-900">RustyClint</span></h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm animate-shake">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-orange-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 w-full py-2 px-3 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-orange-50 text-orange-900 placeholder-orange-300"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-orange-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pl-10 w-full py-2 px-3 border border-orange-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-orange-50 text-orange-900 placeholder-orange-300"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 font-bold text-lg tracking-wide"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          Sign In
        </button>
      </form>
      <div className="mt-4 text-center">
        <a href="#" className="text-sm text-orange-600 hover:text-orange-800 underline transition-colors">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

// Lazy-load deferred sections for performance
const DeferredSections = lazy(() => import('./LandingPageDeferred'));

const LandingPage = ({
  onLogin,
  loading,
  error,
  handleUpload,
}: {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  error: string | null;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDeferred, setShowDeferred] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Defer non-critical sections for fast first paint
  useEffect(() => {
    const timeout = setTimeout(() => setShowDeferred(true), 350); // Lowered to 350ms for snappier feel
    return () => clearTimeout(timeout);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-orange-500 drop-shadow" />,
      title: "Lightning Fast",
      description: "Built for speed with modern web technologies and optimized performance.",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600 drop-shadow" />,
      title: "Secure by Default",
      description: "Enterprise-grade security with end-to-end encryption and privacy protection.",
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-400 drop-shadow" />,
      title: "Global Scale",
      description: "Deploy worldwide with our global CDN and edge computing infrastructure.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechCorp",
      content: "This platform transformed how we build and deploy applications. The developer experience is unmatched.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Developer",
      content: "The performance improvements we've seen are incredible. Our deployment time went from hours to minutes.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      content: "Finally, a platform that developers love and business stakeholders understand. Perfect balance.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
  ];

  const stats = [
    { number: "10M+", label: "Developers" },
    { number: "99.9%", label: "Uptime" },
    { number: "50ms", label: "Response Time" },
    { number: "150+", label: "Countries" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-green-950 text-orange-400 font-sans relative overflow-x-hidden">
      {/* Animated RustyClint Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-transparent rounded-full blur-3xl pointer-events-none z-0 animate-pulse-slow" />
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-green-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white drop-shadow" />
              </div>
              <span className="text-2xl font-extrabold text-orange-400 tracking-widest drop-shadow">RustyClint</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-orange-300 hover:text-orange-500 transition-colors font-semibold">Features</a>
              <a href="#testimonials" className="text-orange-300 hover:text-orange-500 transition-colors font-semibold">Testimonials</a>
              <a href="#pricing" className="text-orange-300 hover:text-orange-500 transition-colors font-semibold">Pricing</a>
              <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-2 rounded-lg hover:from-orange-700 hover:to-orange-600 shadow-lg font-bold transition-all">Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6 shadow">
              <Star className="w-4 h-4 mr-1" />
              Trusted by leading development teams
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
            Rust-powered <span className="block">code analysis platform</span>
          </h1>
          <p className="text-xl text-orange-200 mb-8 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow">
            The most advanced code analysis platform for modern development teams.<br />
            Detect vulnerabilities, optimize performance, and ensure compliance with enterprise-grade security.
          </p>
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-12">
            <div className="w-full lg:w-1/2 flex justify-center">
              <LoginForm onLogin={onLogin} loading={loading} error={error} />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-left">
              <h2 className="text-2xl font-bold text-orange-300 mb-6 drop-shadow">Why businesses choose RustyClint</h2>
              <div className="space-y-6 mb-8 w-full">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg hover:scale-[1.025] transition-transform duration-200">
                    <div className="bg-orange-100 p-3 rounded-lg shadow">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-orange-200 mb-2">{feature.title}</h3>
                      <p className="text-orange-100">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-xl">
                Request Enterprise Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Standout Call-to-Action Section */}
      <div className="w-full flex justify-center items-center py-12 bg-gradient-to-r from-orange-700 via-orange-500 to-yellow-400 shadow-inner">
        <div className="max-w-3xl text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4 bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Ready to supercharge your code analysis?
          </h2>
          <p className="text-lg md:text-xl font-semibold text-orange-900 mb-6">
            Join millions of developers using <span className="font-bold text-orange-800">RustyClint</span> for blazing-fast, secure, and scalable code intelligence.
          </p>
          <button className="bg-white text-orange-700 font-bold px-8 py-4 rounded-lg text-lg shadow-xl hover:bg-orange-100 transition-all duration-200 transform hover:scale-105 border-2 border-orange-400">
            Get Started Free
          </button>
        </div>
      </div>

      {/* Defer features, testimonials, stats, etc. */}
      {showDeferred && (
        <Suspense fallback={<div className="text-center py-12">Loading…</div>}>
          <DeferredSections features={features} testimonials={testimonials} stats={stats} />
        </Suspense>
      )}

      <footer className="w-full bg-gradient-to-r from-orange-950 via-green-950 to-orange-950 text-orange-400 text-xs text-center py-4 mt-8 border-t border-orange-900" style={{ letterSpacing: 2 }}>
        🦀 <span className="font-bold text-orange-500">RustyClint</span> &mdash; Free for all. Built with <span className="animate-pulse text-red-400">❤️</span> and Rust. &copy; {new Date().getFullYear()}
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: none;}
        }
        .animate-shake {
          animation: shake 0.3s;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(.4,0,.6,1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;