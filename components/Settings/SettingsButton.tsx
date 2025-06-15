import React, { ReactNode } from 'react';
import { themeColors } from '@/lib/Theme/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

interface SettingsButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  // Базовые классы для всех кнопок
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';

  // Дополнительные классы в зависимости от варианта
  let variantClasses = '';
  let style = {};

  switch (variant) {
    case 'primary':
      variantClasses = 'text-white hover:bg-opacity-90';
      style = { backgroundColor: themeColors.teal };
      break;
    case 'secondary':
      variantClasses = 'text-white hover:bg-opacity-90';
      style = { backgroundColor: themeColors.bluishGray };
      break;
    case 'danger':
      variantClasses = 'text-red-600 bg-red-50 hover:bg-red-100';
      break;
    case 'outline':
      variantClasses = 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50';
      break;
    default:
      variantClasses = 'text-white hover:bg-opacity-90';
      style = { backgroundColor: themeColors.teal };
  }

  // Объединяем все классы
  const buttonClasses = `${baseClasses} ${variantClasses} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default SettingsButton;