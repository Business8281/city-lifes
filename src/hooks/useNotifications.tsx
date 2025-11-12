// Deprecated: in-app notifications feature has been removed.
// This no-op hook remains to satisfy any lingering imports during refactors.
export function useNotifications(_userId: string | undefined) {
  const notifications: unknown[] = [];
  const loading = false;
  const noop = async () => {};
  return {
    notifications,
    loading,
    markAsRead: noop,
    deleteNotification: noop,
    refetch: noop,
  };
}
