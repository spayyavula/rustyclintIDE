import React from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { StripeProduct } from '../stripe-config';
import { usePayments } from '../hooks/usePayments';

interface PaymentButtonProps {
  product: StripeProduct;
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  product,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const { createCheckoutSession, loading, error } = usePayments();

  const handleClick = () => {
    createCheckoutSession(product);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'secondary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'outline':
        return 'border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white bg-transparent hover:bg-orange-600/10';
      default:
        return 'bg-orange-600 hover:bg-orange-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-base';
      case 'lg':
        return 'px-6 py-4 text-lg';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center justify-center space-x-2 
          ${getVariantClasses()} 
          ${getSizeClasses()}
          disabled:opacity-50 disabled:cursor-not-allowed
          rounded-lg font-medium transition-colors
          ${className}
        `}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        <span>
          {children || (product.mode === 'subscription' ? 'Subscribe' : 'Purchase')}
        </span>
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default PaymentButton;