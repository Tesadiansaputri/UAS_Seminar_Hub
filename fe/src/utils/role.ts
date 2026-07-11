export const normalizeRole = (role?: string | null) =>
  (role || '').trim().toUpperCase().replace(/\s+/g, '_');
