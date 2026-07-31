import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

// Card
export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Badge
export interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'zinc' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/50',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/50',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700/50',
    zinc: 'bg-zinc-900 text-zinc-100 border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/70 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800/50',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

// Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-xs font-semibold hover:shadow-blue-500/20',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100',
    outline: 'border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-200',
    ghost: 'hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-600 dark:text-zinc-300',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs font-semibold',
  };

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

// Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-slate-400 dark:text-zinc-500 pointer-events-none">{icon}</div>}
        <input
          className={`w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all ${
            icon ? 'pl-9' : ''
          } ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

// Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all ${
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

// Table Components
export const Table: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
  </div>
);

export const TableHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <thead>{children}</thead>
);

export const TableBody: React.FC<{ children: ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">{children}</tbody>
);

export const TableRow: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <tr className={`border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors ${className}`}>
    {children}
  </tr>
);

export const TableHead: React.FC<{ children?: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`py-3.5 px-4 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40 ${className}`}>
    {children}
  </th>
);

export const TableCell: React.FC<{ children?: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`py-3 px-4 text-xs ${className}`}>{children}</td>
);

// Switch Toggle
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, description }) => {
  return (
    <label className="inline-flex items-start justify-between gap-4 cursor-pointer select-none">
      {(label || description) && (
        <div className="space-y-0.5">
          {label && <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{label}</p>}
          {description && <p className="text-xs text-slate-500 dark:text-zinc-400">{description}</p>}
        </div>
      )}
      <div
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-800'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};

// Modal Wrapper
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'xl',
}) => {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full ${widthClasses[maxWidth]} bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// Slide-Over Drawer
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
