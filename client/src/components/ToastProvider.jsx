/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const ToastContext = createContext({ show: () => {} });

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function ToastItem({ toast, onClose }) {
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    // enter animation
    const t = setTimeout(() => setVisible(true), 20);
    // auto close
    closeTimer.current = setTimeout(
      () => handleClose(),
      toast.duration || 3500
    );
    return () => {
      clearTimeout(t);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(toast.id), 180);
  };

  const typeStyles = {
    info: "border-slate-200 dark:border-slate-700",
    success: "border-green-200 dark:border-green-700/60",
    warning: "border-amber-200 dark:border-amber-700/60",
    error: "border-red-200 dark:border-red-700/60",
  };
  const dotStyles = {
    info: "bg-slate-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  const tClass = typeStyles[toast.type] || typeStyles.info;
  const dClass = dotStyles[toast.type] || dotStyles.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto max-w-[560px] w-[min(92vw,560px)] rounded-xl border ${tClass} bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur shadow-card px-4 py-3 flex items-start gap-3 transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className={`mt-1 h-2 w-2 rounded-full ${dClass}`} />
      <div className="flex-1">
        {toast.title && (
          <div className="text-sm font-semibold">{toast.title}</div>
        )}
        <div className="text-sm opacity-90">{toast.message}</div>
      </div>
      <button
        aria-label="Close notification"
        onClick={handleClose}
        className="ml-2 opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((t) => {
    const item = { id: genId(), type: "info", duration: 3500, ...t };
    setToasts((prev) => [item, ...prev].slice(0, 5));
  }, []);

  // Listen for global events to make toasts usable without hook
  useEffect(() => {
    const handler = (e) => {
      const { message, type, title, duration } = e.detail || {};
      if (!message) return;
      show({ message, type, title, duration });
    };
    window.addEventListener("raahi:toast", handler);
    return () => window.removeEventListener("raahi:toast", handler);
  }, [show]);

  return (
    <ToastContext.Provider value={{ show }}>
      {/* toast container */}
      <div className="pointer-events-none fixed top-4 inset-x-0 z-[1000] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
