import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  title = 'Delete Book',
  message = 'Are you sure you want to delete this book? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when opened
    confirmButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        className="bg-surface rounded-card p-6 sm:p-7 max-w-md w-full shadow-2xl border border-border transition-all transform scale-100"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0 border border-red-200">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 id="confirm-dialog-title" className="font-serif text-xl font-semibold text-ink">
                {title}
              </h3>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Close dialog"
                className="text-muted hover:text-ink p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <p id="confirm-dialog-desc" className="text-muted text-sm mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-sm font-medium text-ink bg-white border border-border hover:bg-cream rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-border"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full shadow transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
