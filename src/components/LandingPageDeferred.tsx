import { ArrowRight, Star, Github } from 'lucide-react';
import React, { Suspense } from 'react';

// Lazy load the GitHub component
const GitHubSearchDownload = React.lazy(() => import('./GitHubSearchDownload'));

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

interface Stat {
  number: string;
  label: string;
}

interface LandingPageDeferredProps {
  features: Feature[];
  testimonials: Testimonial[];
  stats: Stat[];
}

const LandingPageDeferred: React.FC<LandingPageDeferredProps> = ({ features, testimonials, stats }) => (
  <>
    {/* Features Section */}
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Advanced security features for modern teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive security analysis designed to protect your code, detect vulnerabilities, and ensure compliance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials Section */}
    <section id="testimonials" className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by security-conscious teams
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            See what security professionals and development teams are saying about our platform.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                  loading="lazy"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* GitHub Integration Section */}
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Github className="w-12 h-12 text-white mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Import from GitHub
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Search millions of repositories and import them directly into your workspace. 
            Perfect for exploring open source projects or starting new development.
          </p>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="ml-3 text-white">Loading GitHub integration...</span>
          </div>
        }>
          <GitHubSearchDownload />
        </Suspense>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default LandingPageDeferred;
