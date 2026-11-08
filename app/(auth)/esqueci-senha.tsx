import { router } from 'expo-router';
import { useState } from 'react';

import { Alerta } from '../../src/telas/auth/componentes/Alerta';
import { Botao } from '../../src/telas/auth/componentes/Botao';
import { CampoTexto } from '../../src/telas/auth/componentes/CampoTexto';
import { TelaAuth } from '../../src/telas/auth/componentes/TelaAuth';
import {
  recuperacaoDisponivel,
  solicitarRecuperacao,
} from '../../src/servicos/recuperacaoSenha';
import { validarEmail } from '../../src/utilitarios/formatos';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function aoEnviar() {
    setErro(null);
    setAviso(null);

    if (!validarEmail(email)) {
      setErro('Informe um e-mail válido.');
      return;
    }

    if (!recuperacaoDisponivel) {
      setAviso(
        'A recuperação de senha ainda não está disponível no aplicativo. Em breve você poderá redefinir sua senha por aqui.',
      );
      return;
    }

    setCarregando(true);
    try {
      await solicitarRecuperacao(email);
      router.push({ pathname: '/(auth)/email-enviado', params: { email } });
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível enviar as instruções.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaAuth
      titulo="Esqueci minha senha"
      subtitulo="Informe o e-mail da sua conta para receber as instruções de recuperação."
      aoVoltar={() => router.back()}
    >
      {erro ? <Alerta mensagem={erro} /> : null}
      {aviso ? <Alerta mensagem={aviso} tipo="info" /> : null}

      <CampoTexto
        label="E-mail"
        valor={email}
        aoMudar={setEmail}
        placeholder="voce@email.com"
        tipoTeclado="email-address"
        autoCapitalize="none"
      />

      <Botao titulo="Enviar instruções" aoPressionar={aoEnviar} carregando={carregando} />
    </TelaAuth>
  );
}
