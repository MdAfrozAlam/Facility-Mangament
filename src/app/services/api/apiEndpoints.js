export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
  },

  ASSETS: {
    LIST: "/assets",
    CREATE: "/assets",
    UPDATE: "/assets",
    DELETE: "/assets",
  },

  ACCOUNTS: {
    LIST: "/accounts",
    CREATE: "/accounts",
    UPDATE: "/accounts",
    DELETE: "/accounts",
  },

  ORGANIZATIONS: {
    LIST: "/organizations/tenant/:tenantId",
    CREATE: "/organizations",
    UPDATE: "/organizations",
    DELETE: "/organizations",
  },

  PPM: {
    LIST: "/ppm",
    CREATE: "/ppm",
    UPDATE: "/ppm",
    DELETE: "/ppm",
  },
};