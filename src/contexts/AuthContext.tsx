/* eslint-disable import/no-cycle */
import { createContext, ReactNode, useState, useEffect } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';

import { api } from '@services/apiClient';
import { User } from '@entities/User';
import PagesEnum from '@enums/PagesEnum';
import CoockiesEnum from '@enums/CoockiesEnum';

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, CoockiesEnum.TOKEN);
  destroyCookie(undefined, CoockiesEnum.REFRESH_TOKEN);

  Router.push(PagesEnum.LOGIN);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { [CoockiesEnum.TOKEN]: token } = parseCookies();

    if (token) {
      api
        .get('/me')
        .then(response => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, CoockiesEnum.TOKEN, token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCookie(undefined, CoockiesEnum.REFRESH_TOKEN, refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      Router.push(PagesEnum.DASHBOARD);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
