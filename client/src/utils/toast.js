/**
 * Simple helpers to show app-wide toasts without importing hooks.
 * Usage:
 *  showToast({ message: 'Saved!', type: 'success' })
 *  showError('Something went wrong')
 */
export function showToast({ message, title, type = "info", duration = 3500 }) {
  if (!message) return;
  const event = new CustomEvent("raahi:toast", {
    detail: { message, title, type, duration },
  });
  window.dispatchEvent(event);
}

export function showSuccess(message, title = "Success") {
  showToast({ message, title, type: "success" });
}

export function showError(message, title = "Error") {
  showToast({ message, title, type: "error" });
}

export function showWarning(message, title = "Notice") {
  showToast({ message, title, type: "warning" });
}
