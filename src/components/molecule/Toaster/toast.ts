import { toast as sonner } from 'sonner';

export interface ToastOptions {
  description?: string;
  duration?: number;
  closeButton?: boolean;
}

// Options are copied by name, so sonner's styling and JSX options can't leak through a cast.
const show = (notify: typeof sonner.message) => (message: string, options?: ToastOptions) =>
  notify(message, {
    description: options?.description,
    duration: options?.duration,
    closeButton: options?.closeButton,
  });

/** Works anywhere, including outside React (axios interceptors); needs one mounted <Toaster />. */
export const toast = {
  message: show(sonner.message),
  success: show(sonner.success),
  error: show(sonner.error),
  info: show(sonner.info),
  warning: show(sonner.warning),
  dismiss: (id?: string | number) => {
    sonner.dismiss(id);
  },
};
