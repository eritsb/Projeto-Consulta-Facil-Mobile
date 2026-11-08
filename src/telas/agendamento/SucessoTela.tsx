import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Botao,
  Cartao,
  Etiqueta,
  Tela,
  etiquetaDoStatus,
  formatarDataLonga,
  formatarHora,
  nomeDiaSemana,
} from '../../componentes';
import { cores, espacos, raios } from '../../tema';
import { fontes } from '../../tema/fontes';
import { useFluxoAgendamento } from './contexto';
import { numeroParam, textoParam } from './parametros';

type ParametrosSucesso = {
  agendamentoId?: string | string[];
  especialidade?: string | string[];
  profissional?: string | string[];
  clinica?: string | string[];
  data?: string | string[];
  hora?: string | string[];
  status?: string | string[];
};

type LinhaProps = {
  rotulo: string;
  valor: string;
};

function LinhaResumo({ rotulo, valor }: LinhaProps) {
  return (
    <View style={estilos.linhaResumo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

export function SucessoTela() {
  const params = useLocalSearchParams() as ParametrosSucesso;
  const { limpar } = useFluxoAgendamento();

  useEffect(() => {
    limpar();
  }, [limpar]);

  const agendamentoId = numeroParam(params.agendamentoId);
  const especialidade = textoParam(params.especialidade);
  const profissional = textoParam(params.profissional);
  const clinica = textoParam(params.clinica);
  const data = textoParam(params.data);
  const hora = textoParam(params.hora);
  const status = etiquetaDoStatus(textoParam(params.status) ?? 'AGENDADO');

  return (
    <Tela
      titulo="Agendamento realizado!"
      subtitulo="Sua consulta foi agendada com sucesso."
    >
      <View style={estilos.hero}>
        <View style={estilos.circulo}>
          <Text style={estilos.check}>✓</Text>
        </View>
        <Text style={estilos.heroTitulo}>Tudo certo com o seu agendamento.</Text>
        <Text style={estilos.heroTexto}>
          Guarde as informações abaixo. Você também pode consultá-las no histórico.
        </Text>
      </View>

      {especialidade || profissional || clinica || data ? (
        <Cartao>
          {especialidade ? <LinhaResumo rotulo="Especialidade" valor={especialidade} /> : null}
          {profissional ? <LinhaResumo rotulo="Profissional" valor={profissional} /> : null}
          {clinica ? <LinhaResumo rotulo="Clínica" valor={clinica} /> : null}
          {data ? (
            <LinhaResumo
              rotulo="Data"
              valor={`${nomeDiaSemana(data)}, ${formatarDataLonga(data)}`}
            />
          ) : null}
          {hora ? <LinhaResumo rotulo="Horário" valor={formatarHora(hora)} /> : null}
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotulo}>Status</Text>
            <Etiqueta texto={status.texto} tom={status.tom} />
          </View>
        </Cartao>
      ) : null}

      <View style={estilos.acoes}>
        {agendamentoId ? (
          <Botao
            titulo="Ver agendamento"
            aoPressionar={() => router.push(`/(app)/agendamentos/${agendamentoId}`)}
          />
        ) : null}
        <Botao
          titulo="Voltar ao início"
          aoPressionar={() => router.replace('/(app)/inicio')}
          variante={agendamentoId ? 'secundaria' : 'primaria'}
        />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: espacos.sm,
    paddingVertical: espacos.md,
  },
  circulo: {
    width: 72,
    height: 72,
    borderRadius: raios.pill,
    backgroundColor: cores.sucessoFundo,
    borderWidth: 2,
    borderColor: cores.sucesso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 34,
    fontWeight: fontes.peso.extra,
    color: cores.sucesso,
  },
  heroTitulo: {
    fontSize: fontes.tamanho.lg,
    lineHeight: fontes.altura.lg,
    fontWeight: fontes.peso.forte,
    color: cores.texto,
    textAlign: 'center',
  },
  heroTexto: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.md,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  linhaResumo: {
    gap: 2,
    paddingVertical: espacos.xs,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  rotulo: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
    color: cores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valor: {
    fontSize: fontes.tamanho.md,
    lineHeight: fontes.altura.md,
    fontWeight: fontes.peso.medio,
    color: cores.texto,
  },
  acoes: {
    gap: espacos.sm,
    marginTop: espacos.sm,
  },
});
