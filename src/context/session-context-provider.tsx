"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Session = {
    username: string;
    id: string;
    auth_service: "native" | "discord" | "github" | "google";
    auth_service_user_id: string | null;
    admin: boolean;
    premium: number;
    created_at: Date;
    pfp_url: string;
    iat: number;
    exp: number;
  }

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  error: null,
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/users/me/session")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching session data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, error }}>
      {children}
    </SessionContext.Provider>
  );
};