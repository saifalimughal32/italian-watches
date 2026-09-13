"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Notice = {
  id: number;
  message: string;
  tone?: "success" | "error";
};

type OrderNotifyContextValue = {
  notify: (message: string, tone?: "success" | "error") => void;
};

const OrderNotifyContext = createContext<OrderNotifyContextValue | null>(null);

export function OrderNotifyProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    const id = Date.now();
    setNotices((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setNotices((current) => current.filter((notice) => notice.id !== id));
    }, 5200);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <OrderNotifyContext.Provider value={value}>
      {children}
      <div className="order-toast-stack" aria-live="polite">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`order-toast ${notice.tone === "error" ? "order-toast--error" : "order-toast--success"}`}
            role="status"
          >
            {notice.message}
          </div>
        ))}
      </div>
    </OrderNotifyContext.Provider>
  );
}

export function useOrderNotify() {
  const context = useContext(OrderNotifyContext);
  if (!context) throw new Error("useOrderNotify must be used within OrderNotifyProvider");
  return context;
}
