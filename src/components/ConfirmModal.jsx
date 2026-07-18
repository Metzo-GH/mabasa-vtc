import { AlertTriangle } from 'lucide-react';

/**
 * Premium modal dialog for deletion/actions confirmation.
 * Accessible (role="dialog", aria-modal="true") and glassmorphic.
 */
export default function ConfirmModal({
  isOpen,
  title = 'Confirmation',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  isDanger = true
}) {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2rem',
          width: '90%',
          maxWidth: '440px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          color: '#F3F4F6',
          fontFamily: 'Inter, system-ui, sans-serif',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            background: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: isDanger ? '#EF4444' : '#F59E0B',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={20} />
          </div>
          <h3 
            id="confirm-modal-title"
            style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: 600,
              letterSpacing: '-0.025em'
            }}
          >
            {title}
          </h3>
        </div>

        <p style={{ 
          margin: '0 0 2rem 0', 
          fontSize: '0.95rem', 
          lineHeight: 1.6,
          color: 'rgba(243, 244, 246, 0.8)'
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'transparent',
              color: 'rgba(243, 244, 246, 0.9)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            autoFocus
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: isDanger ? '#EF4444' : '#3B82F6',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isDanger ? '0 4px 12px rgba(239, 68, 68, 0.2)' : '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
