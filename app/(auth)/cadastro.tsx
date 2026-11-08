import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Alerta } from '../../src/telas/auth/componentes/Alerta';
import { Botao } from '../../src/telas/auth/componentes/Botao';
import { CampoTexto } from '../../src/telas/auth/componentes/CampoTexto';
import { TelaAuth } from '../../src/telas/auth/componentes/TelaAuth';
import { useAuth } from '../../src/contexto/AuthContext';
import { cores, espacos } from '../../src/tema/cores';
import {
  dataParaIso,
  formatarCpf,
  formatarDataInput,
  formatarTelefone,
  somenteDigitos,
  validarCpf,
  validarEmail,
} from '../../src/utilitarios/formatos';

type Erros = Partial<
  Record<'nome' | 'cpf' | 'dataNascimento' | 'email' | 'senha' | 'confirmacao', string>
>;

export default function Cadastro() {
  const { cadastrar, usuario } = useAuth();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (usuario) router.replace('/(app)/inicio');
  }, [usuario]);

  async function aoCadastrar() {
    const novosErros: Erros = {};
    const nascimentoIso = dataParaIso(dataNascimento);

    if (!nome.trim()) novosErros.nome = 'Informe seu nome completo.';
    if (!validarCpf(cpf)) novosErros.cpf = 'Informe um CPF com 11 dígitos.';
    if (!nascimentoIso) novosErros.dataNascimento = 'Use o formato DD/MM/AAAA.';
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido.';
    if (senha.length < 8) novosErros.senha = 'A senha precisa ter pelo menos 8 caracteres.';
    if (senha !== confirmacao) novosErros.confirmacao = 'As senhas não conferem.';

    setErros(novosErros);
    setErroGeral(null);
    if (Object.keys(novosErros).length > 0 || !nascimentoIso) return;

    setCarregando(true);
    try {
      await cadastrar({
        nome: nome.trim(),
        cpf: somenteDigitos(cpf),
        data_nascimento: nascimentoIso,
        telefone: somenteDigitos(telefone) || undefined,
        email: email.trim().toLowerCase(),
        senha,
        endereco: endereco.trim() || undefined,
      });
    } catch (falha) {
      setErroGeral(falha instanceof Error ? falha.message : 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <TelaAuth
      titulo="Criar conta"
      subtitulo="Preencha seus dados para começar a agendar atendimentos."
      aoVoltar={() => router.back()}
    >
      {erroGeral ? <Alerta mensagem={erroGeral} /> : null}

      <CampoTexto
        label="Nome completo"
        valor={nome}
        aoMudar={setNome}
        placeholder="Como você se chama"
        autoCapitalize="words"
        erro={erros.nome}
      />

      <CampoTexto
        label="CPF"
        valor={cpf}
        aoMudar={(valor) => setCpf(formatarCpf(valor))}
        placeholder="000.000.000-00"
        tipoTeclado="numeric"
        maxLength={14}
        erro={erros.cpf}
      />

      <CampoTexto
        label="Data de nascimento"
        valor={dataNascimento}
        aoMudar={(valor) => setDataNascimento(formatarDataInput(valor))}
        placeholder="DD/MM/AAAA"
        tipoTeclado="numeric"
        maxLength={10}
        erro={erros.dataNascimento}
      />

      <CampoTexto
        label="Telefone (opcional)"
        valor={telefone}
        aoMudar={(valor) => setTelefone(formatarTelefone(valor))}
        placeholder="(81) 98888-8888"
        tipoTeclado="phone-pad"
        maxLength={15}
      />

      <CampoTexto
        label="E-mail"
        valor={email}
        aoMudar={setEmail}
        placeholder="voce@email.com"
        tipoTeclado="email-address"
        autoCapitalize="none"
        erro={erros.email}
      />

      <CampoTexto
        label="Senha"
        valor={senha}
        aoMudar={setSenha}
        placeholder="Mínimo de 8 caracteres"
        seguro
        autoCapitalize="none"
        erro={erros.senha}
      />

      <CampoTexto
        label="Confirmar senha"
        valor={confirmacao}
        aoMudar={setConfirmacao}
        placeholder="Digite a senha novamente"
        seguro
        autoCapitalize="none"
        erro={erros.confirmacao}
      />

      <CampoTexto
        label="Endereço (opcional)"
        valor={endereco}
        aoMudar={setEndereco}
        placeholder="Bairro, cidade"
      />

      <Botao titulo="Criar conta" aoPressionar={aoCadastrar} carregando={carregando} />

      <Text style={estilos.termos}>
        Ao criar sua conta, você concorda com o uso dos seus dados para a prestação do serviço.
      </Text>
    </TelaAuth>
  );
}

const estilos = StyleSheet.create({
  termos: {
    fontSize: 13,
    lineHeight: 19,
    color: cores.textoSuave,
    marginTop: espacos.sm,
  },
});
