import React, { useState } from 'react';
import { 
  Code, 
  Search, 
  Star, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  X
} from 'lucide-react';
import { TEMPLATES, TEMPLATE_CATEGORIES, DIFFICULTY_LEVELS } from '../data/templates';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  icon: React.ComponentType;
  estimatedTime: string;
  files: Record<string, { content: string; language: string }>;
  features: string[];
  useCase: string;
  techStack: string[];
}

interface ProjectTemplatesProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const ProjectTemplates: React.FC<ProjectTemplatesProps> = ({ isVisible, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulty.includes(difficulty)) {
      setSelectedDifficulty(selectedDifficulty.filter(d => d !== difficulty));
    } else {
      setSelectedDifficulty([...selectedDifficulty, difficulty]);
    }
  };

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(template.difficulty);
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full p-6 border border-gray-700 my-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Project Templates</h2>
            <p className="text-gray-400">Start with a pre-configured template to accelerate your development</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
              <div className="space-y-2">
                {TEMPLATE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {React.createElement(category.icon, { className: "w-4 h-4" })}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Difficulty</h3>
              <div className="space-y-2">
                {DIFFICULTY_LEVELS.map((level) => (
                  <label key={level} className="flex items-center space-x-2 text-gray-300">
                    <input 
                      type="checkbox" 
                      checked={selectedDifficulty.includes(level)}
                      onChange={() => toggleDifficulty(level)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500" 
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedTemplate(template as Template)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      {React.createElement(template.icon, { className: "w-8 h-8 text-blue-400" })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{template.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{template.difficulty}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {template.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {template.tags && template.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                            +{template.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Details Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    {React.createElement(selectedTemplate.icon as React.ComponentType<any>, { className: "w-8 h-8 text-blue-400" })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedTemplate.name}</h3>
                    <p className="text-gray-400">{selectedTemplate.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close template details"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                  <ul className="space-y-2">
                    {selectedTemplate.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mt-6 mb-3">Use Case</h4>
                  <p className="text-gray-300">{selectedTemplate.useCase}</p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Included Files</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.keys(selectedTemplate.files).map((fileName) => (
                    <div key={fileName} className="flex items-center space-x-2 text-gray-300">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span>{fileName}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onSelectTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTemplates;