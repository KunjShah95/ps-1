"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Dynamically import firebase auth to avoid SSR issues
    import("@/lib/firebase").then(({ auth }) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);

        if (!firebaseUser && pathname.startsWith("/dashboard")) {
          router.push("/auth/login");
        }
        if (firebaseUser && pathname.startsWith("/auth")) {
          router.push("/dashboard");
        }
      });

      return () => unsubscribe();
    });
  }, [router, pathname]);

  const logout = async () => {
    const { auth } = await import("@/lib/firebase");
    await firebaseSignOut(auth);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
