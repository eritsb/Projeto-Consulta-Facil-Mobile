import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Alerta } from '../../src/telas/auth/componentes/Alerta';
import { Botao } from '../../src/telas/auth/componentes/Botao';
import { CampoTexto } from '../../src/telas/auth/componentes/CampoTexto';
import { TelaAuth } from '../../src/telas/auth/componentes/TelaAuth';
import { useAuth } from '../../src/contexto/AuthContext';
import { cores, espacos } from '../../src/tema/cores';
import { validarEmail } from '../../src/utilitarios/formatos';

export default function Login() {
  const { entrar, usuario } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (usuario) router.replace('/(app)/inicio');
  }, [usuario]);

  async function aoEntrar() {
    setErro(null);

    if (!validarEmail(email)) {
      setErro('Informe um e-mail válido.');
      return;
    }
    if (!senha) {
      setErro('Informe sua senha.');
      return;
    }

    setCarregando(true);
    try {
      await entrar(email, senha);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaAuth
      titulo="Entrar"
      subtitulo="Acesse sua conta para acompanhar seus agendamentos."
      aoVoltar={() => router.back()}
    >
      {erro ? <Alerta mensagem={erro} /> : null}

      <CampoTexto
        label="E-mail"
        valor={email}
        aoMudar={setEmail}
        placeholder="voce@email.com"
        tipoTeclado="email-address"
        autoCapitalize="none"
      />

      <CampoTexto
        label="Senha"
        valor={senha}
        aoMudar={setSenha}
        placeholder="Sua senha"
        seguro
        autoCapitalize="none"
      />

      <Pressable
        onPress={() => router.push('/(auth)/esqueci-senha')}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Esqueci minha senha"
        style={estilos.link}
      >
        <Text style={estilos.linkTexto}>Esqueci minha senha</Text>
      </Pressable>

      <Botao titulo="Entrar" aoPressionar={aoEntrar} carregando={carregando} />

      <Pressable
        onPress={() => router.push('/(auth)/cadastro')}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Criar conta"
        style={estilos.link}
      >
        <Text style={estilos.linkTexto}>Não tenho conta. Criar agora</Text>
      </Pressable>
    </TelaAuth>
  );
}

const estilos = StyleSheet.create({
  link: {
    alignSelf: 'flex-start',
    paddingVertical: espacos.xs,
  },
  linkTexto: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
  },
});
