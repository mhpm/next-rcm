import React from 'react';
import { 
  RiCheckboxCircleLine, 
  RiErrorWarningLine, 
  RiInformationLine, 
  RiAlertLine,
  RiCloseLine 
} from 'react-icons/ri';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
  showIcon = true,
}) => {
  const getAlertClasses = () => {
    const baseClasses = 'alert';
    
    switch (type) {
      case 'success':
        return `${baseClasses} alert-success`;
      case 'error':
        return `${baseClasses} alert-error`;
      case 'warning':
        return `${baseClasses} alert-warning`;
      case 'info':
        return `${baseClasses} alert-info`;
      default:
        return baseClasses;
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    switch (type) {
      case 'success':
        return <RiCheckboxCircleLine className="w-6 h-6" />;
      case 'error':
        return <RiErrorWarningLine className="w-6 h-6" />;
      case 'warning':
        return <RiAlertLine className="w-6 h-6" />;
      case 'info':
        return <RiInformationLine className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${getAlertClasses()} ${className}`} role="alert">
      {showIcon && getIcon()}
      <div className="flex-1">
        {title && (
          <h3 className="font-bold text-sm mb-1">{title}</h3>
        )}
        <div className="text-sm">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-sm btn-ghost btn-square"
          aria-label="Cerrar alerta"
        >
          <RiCloseLine className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;