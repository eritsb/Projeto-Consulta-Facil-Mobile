import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { login as loginApi } from '../servicos/auth';
import { cadastrarPaciente } from '../servicos/pacientes';
import { lerSessao, limparSessao, salvarSessao } from '../servicos/sessao';
import type { CadastroPacientePayload, Usuario } from '../tipos/api';

type EstadoAuth = {
  usuario: Usuario | null;
  token: string | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (dados: CadastroPacientePayload) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<EstadoAuth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    (async () => {
      const sessao = await lerSessao();
      if (!ativo) return;
      if (sessao) {
        setUsuario(sessao.usuario);
        setToken(sessao.token);
      }
      setCarregando(false);
    })();

    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const resposta = await loginApi(email, senha);
    await salvarSessao(resposta.token, resposta.usuario);
    setUsuario(resposta.usuario);
    setToken(resposta.token);
  }, []);

  const cadastrar = useCallback(
    async (dados: CadastroPacientePayload) => {
      await cadastrarPaciente(dados);
      await entrar(dados.email, dados.senha);
    },
    [entrar],
  );

  const sair = useCallback(async () => {
    await limparSessao();
    setUsuario(null);
    setToken(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, token, carregando, entrar, cadastrar, sair }),
    [usuario, token, carregando, entrar, cadastrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): EstadoAuth {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return contexto;
}
