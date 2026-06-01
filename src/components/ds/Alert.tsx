import React, { useState } from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  className?: string;
}
export function Alert({
  variant = 'info',
  title,
  message,
  dismissible = false,
  className = ''
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  const config = {
    info: {
      icon: Info,
      wrapperClass: 'bg-[#F0F4F8] border-info',
      iconClass: 'text-info'
    },
    success: {
      icon: CheckCircle2,
      wrapperClass: 'bg-[#F2F7F4] border-success',
      iconClass: 'text-success'
    },
    warning: {
      icon: AlertTriangle,
      wrapperClass: 'bg-[#FDF8F3] border-warning',
      iconClass: 'text-warning'
    },
    error: {
      icon: XCircle,
      wrapperClass: 'bg-[#FDF4F3] border-error',
      iconClass: 'text-error'
    }
  };
  const { icon: Icon, wrapperClass, iconClass } = config[variant];
  return (
    <div
      className={`relative flex gap-3 p-4 border border-hairline border-l-4 rounded-sm ${wrapperClass} ${className}`}>
      
      <Icon
        className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`}
        strokeWidth={2} />
      

      <div className="flex flex-col gap-1 pr-6">
        {title &&
        <h4 className="font-sans text-sm font-semibold text-ink">{title}</h4>
        }
        <p className="font-sans text-sm text-ink-muted leading-relaxed">
          {message}
        </p>
      </div>

      {dismissible &&
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-ink-subtle hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        aria-label="Dismiss alert">
        
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      }
    </div>);

}