import React, { useState } from 'react';
import { 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  Mail, 
  FileText, 
  CheckCircle,
  X,
  CreditCard
} from 'lucide-react';
import PaymentButton from './PaymentButton';
import { stripeProducts } from '../stripe-config';

interface FeatureRequestFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const FeatureRequestForm: React.FC<FeatureRequestFormProps> = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    contactEmail: '',
    priority: 'normal',
    attachments: [] as File[]
  });
  
  const [step, setStep] = useState(1);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ 
        ...prev, 
        attachments: [...prev.attachments, ...Array.from(e.target.files || [])]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    console.log('Feature request submitted:', formData);
    setSubmissionSuccess(true);
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      budget: '',
      deadline: '',
      contactEmail: '',
      priority: 'normal',
      attachments: []
    });
    setStep(1);
    setSubmissionSuccess(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Request Custom Feature</h2>
              <p className="text-gray-400">Get paid developers to enhance templates or build custom ones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-10rem)]">
          {submissionSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Request Submitted Successfully!</h3>
              <p className="text-gray-300 mb-6">
                Thank you for your feature request. Our team will review it and get back to you within 24 hours.
              </p>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <>
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      1
                    </div>
                    <div className={`w-16 h-1 ${
                      step >= 2 ? 'bg-green-600' : 'bg-gray-600'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      2
                    </div>
                    <div className={`w-16 h-1 ${
                      step >= 3 ? 'bg-green-600' : 'bg-gray-600'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      3
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Step {step} of 3
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Feature Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Feature/Template Title*
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="E.g., Android ML Kit Integration Template"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Detailed Description*
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Describe the feature or template you need in detail..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="low">Low - No rush (1-2 weeks)</option>
                        <option value="normal">Normal - Standard timeline (3-5 days)</option>
                        <option value="high">High - Expedited (1-2 days)</option>
                        <option value="urgent">Urgent - ASAP (24 hours)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Attachments (optional)
                      </label>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 cursor-pointer transition-colors">
                          <FileText className="w-4 h-4" />
                          <span>Add Files</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-sm text-gray-400">
                          {formData.attachments.length} file(s) selected
                        </span>
                      </div>
                      
                      {formData.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-300 truncate max-w-xs">{file.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-gray-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Budget & Timeline</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget (USD)*
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          required
                          min="1"
                          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Your budget for this request"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        Typical budgets: $50-200 for small features, $200-500 for medium, $500+ for complex templates
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Deadline*
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Pricing Guidelines</h4>
                      <ul className="space-y-2 text-sm text-blue-300">
                        <li className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>Small features (UI components, simple integrations): $50-200</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>Medium features (complex integrations, screens): $200-500</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>Complex templates (full applications, HFT systems): $500+</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Contact & Payment</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Contact Email*
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Your email address"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-medium text-white mb-3">Request Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Title:</span>
                          <span className="text-white font-medium">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Budget:</span>
                          <span className="text-white font-medium">${formData.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deadline:</span>
                          <span className="text-white font-medium">{formData.deadline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Priority:</span>
                          <span className="text-white font-medium capitalize">{formData.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Attachments:</span>
                          <span className="text-white font-medium">{formData.attachments.length} files</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">How It Works</h4>
                      <ol className="space-y-2 text-sm text-green-300 list-decimal list-inside">
                        <li>Submit your feature request with a 10% deposit</li>
                        <li>Our team reviews and provides a detailed quote within 24 hours</li>
                        <li>Once approved, we'll start development immediately</li>
                        <li>You'll receive regular updates on progress</li>
                        <li>Remaining payment is only processed when you're satisfied</li>
                      </ol>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-white">Initial Deposit (10%)</h4>
                        <div className="text-lg font-bold text-white">${(parseFloat(formData.budget || '0') * 0.1).toFixed(2)}</div>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        This deposit secures your request in our development queue. The remaining amount will only be charged upon your approval of the completed work.
                      </p>
                      <PaymentButton
                        product={{
                          priceId: 'price_feature_request_deposit',
                          name: 'Feature Request Deposit',
                          description: `10% deposit for: ${formData.title}`,
                          mode: 'payment',
                          price: parseFloat(formData.budget || '0') * 0.1,
                          currency: 'usd'
                        }}
                        className="w-full"
                      >
                        Pay Deposit & Submit Request
                      </PaymentButton>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureRequestForm;