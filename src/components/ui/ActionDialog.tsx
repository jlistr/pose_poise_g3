import React from 'react';
import { X, AlertTriangle, Trash2, CheckCircle, Info } from 'lucide-react';

export interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: 'danger' | 'info' | 'success' | 'warning';
  confirmText?: string;
  cancelText?: string;
}

export const ActionDialog: React.FC<ActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-100">
        
        {/* Header / Icon */}
        <div className="flex flex-col items-center pt-8 px-6 text-center">
           <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm
              ${type === 'danger' ? 'bg-red-50 text-red-500' : ''}
              ${type === 'warning' ? 'bg-amber-50 text-amber-500' : ''}
              ${type === 'success' ? 'bg-green-50 text-green-500' : ''}
              ${type === 'info' ? 'bg-zinc-50 text-zinc-500' : ''}
           `}>
              {type === 'danger' && <Trash2 size={24} />}
              {type === 'warning' && <AlertTriangle size={24} />}
              {type === 'success' && <CheckCircle size={24} />}
              {type === 'info' && <Info size={24} />}
           </div>
           
           <h3 className="font-serif text-2xl mb-2 text-black">{title}</h3>
           <p className="text-sm text-zinc-500 leading-relaxed font-medium">
             {description}
           </p>
        </div>

        {/* Actions */}
        <div className="p-8 grid grid-cols-2 gap-4">
           <button 
             onClick={onClose}
             className="py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-400 hover:bg-zinc-50 hover:text-black transition-colors"
           >
             {cancelText}
           </button>
           <button 
             onClick={() => { onConfirm(); onClose(); }}
             className={`
                py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-white shadow-lg transform active:scale-95 transition-all
                ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-zinc-800'}
             `}
           >
             {confirmText}
           </button>
        </div>
      </div>
    </div>
  );
};
