import { toast as toastify } from 'react-toastify';

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toast = {
  success: (message, options = {}) =>
    toastify.success(message, { ...defaultOptions, ...options }),

  error: (message, options = {}) =>
    toastify.error(message, { autoClose: 4000, ...defaultOptions, ...options }),

  warning: (message, options = {}) =>
    toastify.warning(message, { ...defaultOptions, ...options }),

  info: (message, options = {}) =>
    toastify.info(message, { ...defaultOptions, ...options }),
};

export default toast;
