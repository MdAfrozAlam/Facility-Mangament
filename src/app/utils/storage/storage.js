const TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const storage = {
  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  setUser(user) {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );
    }
  },

  getUser() {
    if (typeof window === "undefined") {
      return null;
    }

    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
  },

  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
};