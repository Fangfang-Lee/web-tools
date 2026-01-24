import React from 'react';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopy,
  size = 'medium',
  variant = 'primary',
  className = '',
}) => {
  const { copied, copy } = useClipboard();

  const handleClick = async () => {
    await copy(text);
    onCopy?.();
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button
      onClick={handleClick}
      className={`btn ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={!text}
    >
      {copied ? '已复制!' : '复制'}
    </button>
  );
};
