// No-op replacement for 'sonner' to disable all toast popups across the app.
// We export the same named exports used in the app: `Toaster` and `toast`.
import React from "react";

export const Toaster: React.FC<Record<string, unknown>> = () => null;

type NoopFn = (...args: unknown[]) => void;

const noop: NoopFn = () => {};

export const toast = Object.assign(noop, {
  success: noop,
  error: noop,
  info: noop,
  warning: noop,
  message: noop,
  dismiss: noop,
  promise: async <T>(p: Promise<T>, _opts?: Record<string, unknown>) => p,
  custom: noop,
});

export default { Toaster, toast };
