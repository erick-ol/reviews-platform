import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string,
    name: string;
    login: string;
  }
}

type AuthContextData = {
  user: User | null;
  signInUrl: string
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type IAuthProvider = {
  children: ReactNode;
}

export function AuthProvider(props: IAuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `http://github.com/login/oauth/authorize?scope=user&client_id=a0f23ae038b5615dba6c`;

  const signIn = async (githubCode: string) => {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem('@reviews:token', token);

    api.defaults.headers.common.authorization = `Bearer ${ token }`

    setUser(user);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('@reviews:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@reviews:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${ token }`

      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if(hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
      
      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={ { signInUrl, user, signOut } }>
      { props.children }
    </AuthContext.Provider>
  );
}