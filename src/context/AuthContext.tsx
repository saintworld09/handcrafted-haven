"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller";
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (
    email: string,
    password: string
  ) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "buyer" | "seller"
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [users] =
    useState<User[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  /**
   * Ask the server who is currently
   * authenticated.
   *
   * No localStorage is used.
   */
  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response =
          await fetch(
            "/api/auth/me",
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data =
          await response.json();

        if (data.user) {
          setUser(
            data.user as User
          );
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error
        );

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void checkAuthentication();
  }, []);

  /**
   * Login.
   *
   * The server creates the HTTP-only
   * authentication cookie.
   */
  async function login(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: email
                .trim()
                .toLowerCase(),
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.user
      ) {
        return false;
      }

      setUser(
        data.user as User
      );

      return true;
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return false;
    }
  }

  /**
   * Register.
   *
   * The server creates the database
   * user and authentication cookie.
   */
  async function register(
    name: string,
    email: string,
    password: string,
    role: "buyer" | "seller"
  ): Promise<boolean> {
    try {
      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name: name.trim(),
              email: email
                .trim()
                .toLowerCase(),
              password,
              role,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.user
      ) {
        return false;
      }

      setUser(
        data.user as User
      );

      return true;
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return false;
    }
  }

  /**
   * Logout.
   *
   * The server removes the HTTP-only
   * authentication cookie.
   */
  async function logout(): Promise<void> {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        register,
        logout,
        isAuthenticated:
          user !== null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}