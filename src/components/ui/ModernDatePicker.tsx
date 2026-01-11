import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

interface ModernDatePickerProps {
  value: string; // ISO format: YYYY-MM-DD or YYYY-MM
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const ModernDatePicker: React.FC<ModernDatePickerProps> = ({ value, onChange, className = '', placeholder = 'Select Date' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'full' | 'month'>(value.length > 7 ? 'full' : 'month');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const dateObj = value ? new Date(value.includes('-') ? value : `${value}-01`) : new Date();
  const [viewDate, setViewDate] = useState(dateObj);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateDisplay = (val: string) => {
    if (!val) return '';
    const d = new Date(val.includes('-') ? val : `${val}-01`);
    if (isNaN(d.getTime())) return val;
    
    if (val.length <= 7) {
      // MM/YYYY
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    // MM/DD/YYYY
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
    
    if (mode === 'month') {
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      onChange(`${year}-${month}`);
      setIsOpen(false);
    }
  };

  const handleDaySelect = (day: number) => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-[10px] font-bold text-zinc-300 py-2">{d}</div>
        ))}
        {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(d => {
            const isSelected = value.endsWith(`-${String(d).padStart(2, '0')}`) && 
                              new Date(value).getMonth() === month &&
                              new Date(value).getFullYear() === year;
            return (
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDaySelect(d)}
                    className={`text-[11px] py-2 rounded-lg transition-colors font-medium
                        ${isSelected ? 'bg-black text-white' : 'hover:bg-zinc-100 text-zinc-600'}
                    `}
                >
                    {d}
                </button>
            );
        })}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 transition-all focus:outline-none focus:ring-2 focus:ring-black/5"
      >
        <span className={value ? 'text-black' : 'text-zinc-300 italic'}>
          {formatDateDisplay(value) || placeholder}
        </span>
        <CalendarIcon size={14} className="text-zinc-300" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 z-[100] animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1">
                <button 
                    type="button"
                    onClick={() => setViewDate(new Date(viewDate.setFullYear(viewDate.getFullYear() - 1)))}
                    className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="font-serif text-lg italic px-2">{viewDate.getFullYear()}</span>
                <button 
                     type="button"
                     onClick={() => setViewDate(new Date(viewDate.setFullYear(viewDate.getFullYear() + 1)))}
                     className="p-1 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
            
            <div className="flex bg-zinc-50 p-1 rounded-full border border-zinc-100">
                <button 
                    type="button"
                    onClick={() => setMode('month')}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${mode === 'month' ? 'bg-white text-black shadow-sm' : 'text-zinc-400'}`}
                >
                    Month
                </button>
                <button 
                    type="button"
                    onClick={() => setMode('full')}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${mode === 'full' ? 'bg-white text-black shadow-sm' : 'text-zinc-400'}`}
                >
                    Exact
                </button>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {months.map((m, i) => {
                const isSelectedMonth = viewDate.getMonth() === i;
                return (
                    <button
                        key={m}
                        type="button"
                        onClick={() => handleMonthSelect(i)}
                        className={`text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl transition-all
                            ${isSelectedMonth ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100 text-zinc-400 hover:text-black'}
                        `}
                    >
                        {m}
                    </button>
                );
            })}
          </div>

          {/* Calendar Grid (Only in full mode) */}
          {mode === 'full' && (
            <div className="pt-4 border-t border-zinc-50">
              {renderCalendar()}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-zinc-50">
             <button 
                type="button"
                onClick={() => { onChange(''); setIsOpen(false); }}
                className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
             >
                Clear
             </button>
             <button 
                 type="button"
                 onClick={() => setIsOpen(false)}
                 className="text-[9px] font-bold uppercase tracking-widest text-black hover:opacity-70 transition-colors"
             >
                Done
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
