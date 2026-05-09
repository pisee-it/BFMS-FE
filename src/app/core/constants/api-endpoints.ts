export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  REVENUE: {
    TOTAL: '/revenue/total',
  },
  TICKETS: {
    STATISTICS: '/tickets/statistics',
  },
  SHIFTS: {
    BASE: '/shifts',
    NODE: (nodeId: number) => `/shifts/node/${nodeId}`,
    COMPLETE: (shiftId: number) => `/shifts/${shiftId}/complete`,
    ACTIVE: '/shifts/active',
  },
  ADS: {
    COMPANIES: '/ads/companies',
    CONTRACTS: '/ads/contracts',
    CONTRACT_APPROVE: (id: number) => `/ads/contracts/${id}/approve`,
    CONTRACT_REQUEST_DELETE: (id: number) => `/ads/contracts/${id}/request-delete`,
    ASSIGNMENTS: '/ads/assignments',
  },
  ROUTES: {
    BASE: '/routes',
    NODES: (routeId: number) => `/routes/${routeId}/nodes`,
  },
  BUSES: {
    BASE: '/buses',
  },
  REPORTS: {
    EXPORT: '/reports/export',
  },
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (fileName: string) => `/files/${fileName}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: number) => `/notifications/${id}/read`,
  },
} as const;
