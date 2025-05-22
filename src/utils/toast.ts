import toast, { Toaster } from 'react-hot-toast';

// Success toast with custom styling
export const showSuccess = (message: string) => {
  console.log("Success toast:", message);
  return toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#10B981',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  });
};

// Error toast with custom styling
export const showError = (message: string) => {
  console.log("Showing error toast:", message);
  
  // Clear any existing toasts to make sure error is seen
  toast.dismiss();
  
  // Also update the error message element if it exists in the DOM
  const errorMessageElement = document.getElementById('login-error-message');
  if (errorMessageElement) {
    errorMessageElement.textContent = message;
    
    // Clear the message after 8 seconds to match toast duration
    setTimeout(() => {
      errorMessageElement.textContent = '';
    }, 8000);
  }
  
  // Make sure the message is displayed prominently
  return toast.error(message, {
    duration: 8000, // Longer duration for errors
    position: 'top-center',
    style: {
      background: '#EF4444',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
    },
  });
};

// Info toast with custom styling
export const showInfo = (message: string) => {
  return toast(message, {
    duration: 3000,
    position: 'top-center',
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '16px',
    },
  });
};

// Warning toast with custom styling
export const showWarning = (message: string) => {
  return toast(message, {
    duration: 6000,
    position: 'top-center',
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  });
};

// Loading toast that can be dismissed programmatically
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#6B7280',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '16px',
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

// Export ToastContainer for App.tsx
export { Toaster }; 