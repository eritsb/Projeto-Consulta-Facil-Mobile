import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Botao,
  Cartao,
  CartaoAgendamento,
  Tela,
  Toast,
  agendamentoEstaAtivo,
  dataHoraNoPassado,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarAgendamentosPaciente } from '../../servicos/agendamentos';
import { listarEspecialidades } from '../../servicos/catalogo';
import { cores, espacos, raios } from '../../tema';
import { fontes } from '../../tema/fontes';
import type { Especialidade } from '../../tipos/api';

export function InicioTela() {
  const { usuario, token, sair } = useAuth();
  const [aviso, setAviso] = useState<string | null>(null);
  const primeiroNome = usuario?.nome.split(' ')[0] ?? '';

  const agendamentos = useRecurso(`inicio-agendamentos:${usuario?.id ?? 0}`, () =>
    usuario ? listarAgendamentosPaciente(usuario.id, token) : Promise.resolve([]),
  );

  const especialidades = useRecurso('inicio-especialidades', async () => {
    const lista = await listarEspecialidades(undefined, token);
    return lista.filter((especialidade) => especialidade.ativo);
  });

  const proximo = useMemo(() => {
    const lista = agendamentos.dados ?? [];
    return (
      lista
        .filter((agendamento) => agendamentoEstaAtivo(agendamento.status))
        .filter(
          (agendamento) =>
            !dataHoraNoPassado(agendamento.data_consulta, agendamento.hora_consulta),
        )
        .sort((a, b) =>
          `${a.data_consulta}${a.hora_consulta}`.localeCompare(
            `${b.data_consulta}${b.hora_consulta}`,
          ),
        )[0] ?? null
    );
  }, [agendamentos.dados]);

  const atalhos = useMemo(() => (especialidades.dados ?? []).slice(0, 8), [especialidades.dados]);

  function abrirEspecialidade(especialidade: Especialidade) {
    router.push({
      pathname: '/(app)/agendamento/clinica',
      params: {
        especialidadeId: String(especialidade.id_especialidade),
        especialidadeNome: especialidade.nome,
      },
    });
  }

  async function aoSair() {
    await sair();
    router.replace('/(auth)/boas-vindas');
  }

  return (
    <Tela
      cabecalhoCompacto
      titulo={primeiroNome ? `Olá, ${primeiroNome}!` : 'Olá!'}
      subtitulo="Como podemos ajudar?"
      acaoDireita={
        <Pressable
          onPress={() => setAviso('As notificações estarão disponíveis em breve.')}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
          style={({ pressed }) => [estilos.botaoAvisos, pressed ? estilos.pressionado : null]}
        >
          <Text style={estilos.textoAvisos}>Avisos</Text>
        </Pressable>
      }
    >
      {aviso ? <Toast mensagem={aviso} tom="info" aoFechar={() => setAviso(null)} /> : null}

      <Cartao
        aoPressionar={() => router.push('/(app)/triagem')}
        rotuloAcessivel="Preciso de atendimento"
        dicaAcessivel="Responda algumas perguntas e descubra um possível caminho de atendimento"
        estilo={estilos.acaoPrincipal}
      >
        <Text style={[estilos.acaoTitulo, estilos.textoClaro]}>Preciso de atendimento</Text>
        <Text style={[estilos.acaoTexto, estilos.textoClaroSuave]}>
          Responda algumas perguntas e descubra qual atendimento pode ser mais adequado para
          você.
        </Text>
        <Text style={[estilos.acaoLink, estilos.textoClaro]}>Começar ›</Text>
      </Cartao>

      <Cartao
        aoPressionar={() =>
          router.push({
            pathname: '/(app)/agendamento/especialidade',
            params: { reiniciar: '1' },
          })
        }
        rotuloAcessivel="Já sei o que preciso"
        dicaAcessivel="Encontre uma especialidade, clínica ou profissional"
      >
        <Text style={estilos.acaoTitulo}>Já sei o que preciso</Text>
        <Text style={estilos.acaoTexto}>
          Encontre uma especialidade, clínica ou profissional.
        </Text>
        <Text style={estilos.acaoLink}>Escolher especialidade ›</Text>
      </Cartao>

      <View style={estilos.secaoTopo}>
        <Text style={estilos.secaoTitulo} accessibilityRole="header">
          Próximo atendimento
        </Text>
        <Pressable
          onPress={() => router.push('/(app)/historico')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Ver histórico de consultas"
        >
          <Text style={estilos.link}>Histórico</Text>
        </Pressable>
      </View>

      {agendamentos.carregando ? (
        <Cartao>
          <View style={estilos.linhaCarregando}>
            <ActivityIndicator color={cores.primaria} />
            <Text style={estilos.textoApoio}>Buscando seu próximo atendimento...</Text>
          </View>
        </Cartao>
      ) : agendamentos.erro ? (
        <View style={estilos.blocoErro}>
          <Toast mensagem={agendamentos.erro} tom="erro" />
          <Botao
            titulo="Tentar novamente"
            aoPressionar={agendamentos.recarregar}
            variante="secundaria"
            compacto
          />
        </View>
      ) : proximo ? (
        <CartaoAgendamento
          agendamento={proximo}
          compacto
          aoPressionar={() => router.push(`/(app)/agendamentos/${proximo.id_agendamento}`)}
        />
      ) : (
        <Cartao>
          <Text style={estilos.semConsulta}>Você ainda não tem atendimentos agendados.</Text>
          <Botao
            titulo="Agendar um atendimento"
            aoPressionar={() =>
              router.push({
                pathname: '/(app)/agendamento/especialidade',
                params: { reiniciar: '1' },
              })
            }
            compacto
          />
        </Cartao>
      )}

      <View style={estilos.secaoTopo}>
        <Text style={estilos.secaoTitulo} accessibilityRole="header">
          Especialidades
        </Text>
        <Pressable
          onPress={() => router.push('/(app)/busca')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Ver todas as especialidades"
        >
          <Text style={estilos.link}>Ver todas</Text>
        </Pressable>
      </View>

      {especialidades.carregando ? (
        <View style={estilos.linhaCarregando}>
          <ActivityIndicator color={cores.primaria} />
          <Text style={estilos.textoApoio}>Carregando especialidades...</Text>
        </View>
      ) : especialidades.erro ? (
        <Pressable
          onPress={especialidades.recarregar}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar especialidades novamente"
        >
          <Text style={estilos.link}>Não foi possível carregar. Tentar novamente</Text>
        </Pressable>
      ) : atalhos.length === 0 ? (
        <Text style={estilos.textoApoio}>Nenhuma especialidade disponível no momento.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.listaAtalhos}
        >
          {atalhos.map((especialidade) => (
            <Pressable
              key={especialidade.id_especialidade}
              onPress={() => abrirEspecialidade(especialidade)}
              accessibilityRole="button"
              accessibilityLabel={`Agendar em ${especialidade.nome}`}
              style={({ pressed }) => [estilos.chip, pressed ? estilos.pressionado : null]}
            >
              <Text style={estilos.chipTexto}>{especialidade.nome}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={estilos.acoesFinais}>
        <Botao
          titulo="Ver histórico"
          aoPressionar={() => router.push('/(app)/historico')}
          variante="secundaria"
          estilo={estilos.acaoFinal}
        />
        <Botao
          titulo="Sair da conta"
          aoPressionar={aoSair}
          variante="texto"
          estilo={estilos.acaoFinal}
        />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  botaoAvisos: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: espacos.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: raios.pill,
    borderWidth: 1,
    borderColor: cores.bordaForte,
    backgroundColor: cores.superficie,
  },
  textoAvisos: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
    color: cores.primariaEscura,
  },
  acaoPrincipal: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  acaoTitulo: {
    fontSize: fontes.tamanho.lg,
    lineHeight: fontes.altura.lg,
    fontWeight: fontes.peso.extra,
    color: cores.texto,
  },
  acaoTexto: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.md,
    color: cores.textoSecundario,
  },
  acaoLink: {
    fontSize: fontes.tamanho.sm,
    fontWeight: fontes.peso.forte,
    color: cores.primaria,
  },
  textoClaro: {
    color: cores.superficie,
  },
  textoClaroSuave: {
    color: cores.primariaClara,
  },
  secaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacos.sm,
    marginTop: espacos.sm,
  },
  secaoTitulo: {
    fontSize: fontes.tamanho.lg,
    lineHeight: fontes.altura.lg,
    fontWeight: fontes.peso.forte,
    color: cores.texto,
  },
  link: {
    fontSize: fontes.tamanho.sm,
    fontWeight: fontes.peso.forte,
    color: cores.primaria,
    paddingVertical: espacos.xs,
  },
  linhaCarregando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },
  textoApoio: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.sm,
    color: cores.textoSecundario,
  },
  blocoErro: {
    gap: espacos.sm,
  },
  semConsulta: {
    fontSize: fontes.tamanho.md,
    lineHeight: fontes.altura.md,
    color: cores.textoSecundario,
  },
  listaAtalhos: {
    gap: espacos.sm,
    paddingVertical: espacos.xs,
    paddingRight: espacos.md,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: espacos.md,
    borderRadius: raios.pill,
    borderWidth: 1,
    borderColor: cores.bordaForte,
    backgroundColor: cores.superficie,
  },
  chipTexto: {
    fontSize: fontes.tamanho.sm,
    fontWeight: fontes.peso.medio,
    color: cores.primariaEscura,
  },
  pressionado: {
    opacity: 0.8,
  },
  acoesFinais: {
    flexDirection: 'row',
    gap: espacos.sm,
    marginTop: espacos.md,
  },
  acaoFinal: {
    flex: 1,
  },
});
