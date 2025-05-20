import toast from 'react-hot-toast';

// Success toast with custom styling
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    icon: '✅',
  });
};

// Error toast with custom styling
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000, // Errors stay longer
    icon: '❌',
  });
};

// Info toast with custom styling
export const showInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: 'white',
    },
  });
};

// Warning toast with custom styling
export const showWarning = (message: string) => {
  toast(message, {
    duration: 4000,
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: 'white',
    },
  });
};

// Loading toast that can be dismissed programmatically
export const showLoading = (message: string) => {
  return toast.loading(message, {
    style: {
      background: '#6B7280',
      color: 'white',
    },
  });
};

// Helper to dismiss a specific toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Helper to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
}; 