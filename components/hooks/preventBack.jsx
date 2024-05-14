'use client'
import { useEffect } from 'react';

export default function usePreventBackWithoutConfirmation(onConfirm) {
  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = ''; // For Chrome
      return ''; // For Firefox
    };

    const handleConfirm = () => {
      if (confirm('Are you sure you want to leave this page?')) {
        onConfirm(); // Call the provided function
      }
    };

    const popStateHandler = () => {
      if (confirm('Are you sure you want to leave this room?')) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.removeEventListener('popstate', popStateHandler);
        onConfirm(); // Call the provided function
      } else {
        console.log('ok you can stay')
      }
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    window.addEventListener('popstate', popStateHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      window.removeEventListener('popstate', popStateHandler);
    };
  }, [onConfirm]);
}
