import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle size={18} className="text-emerald-400" style={{ color: '#34d399' }} />,
    danger: <AlertCircle size={18} className="text-rose-400" style={{ color: '#f87171' }} />,
    warning: <AlertCircle size={18} className="text-amber-400" style={{ color: '#fbbf24' }} />,
    info: <Info size={18} className="text-sky-400" style={{ color: '#38bdf8' }} />,
  };

  return (
    <div className="toast-container">
      <div className="toast">
        {icons[toast.type] || icons.info}
        <span style={{ fontWeight: 500 }}>{toast.message}</span>
      </div>
    </div>
  );
};
