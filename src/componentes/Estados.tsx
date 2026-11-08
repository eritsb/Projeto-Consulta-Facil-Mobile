import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';
import { Botao } from './Botao';

type CarregandoProps = {
  mensagem?: string;
};

export function Carregando({ mensagem = 'Carregando...' }: CarregandoProps) {
  return (
    <View style={estilos.centro} accessibilityRole="progressbar" accessibilityLabel={mensagem}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={estilos.textoApoio}>{mensagem}</Text>
    </View>
  );
}

type EstadoVazioProps = {
  titulo: string;
  descricao?: string;
  acaoTitulo?: string;
  aoAcao?: () => void;
  simbolo?: string;
};

export function EstadoVazio({
  titulo,
  descricao,
  acaoTitulo,
  aoAcao,
  simbolo = '○',
}: EstadoVazioProps) {
  return (
    <View style={estilos.centro}>
      <View style={estilos.simbolo}>
        <Text style={estilos.simboloTexto}>{simbolo}</Text>
      </View>
      <Text style={estilos.titulo}>{titulo}</Text>
      {descricao ? <Text style={estilos.textoApoio}>{descricao}</Text> : null}
      {acaoTitulo && aoAcao ? (
        <Botao titulo={acaoTitulo} aoPressionar={aoAcao} variante="secundaria" compacto />
      ) : null}
    </View>
  );
}

type EstadoErroProps = {
  mensagem: string;
  aoTentarNovamente: () => void;
};

export function EstadoErro({ mensagem, aoTentarNovamente }: EstadoErroProps) {
  return (
    <EstadoVazio
      simbolo="!"
      titulo="Não foi possível carregar"
      descricao={mensagem}
      acaoTitulo="Tentar novamente"
      aoAcao={aoTentarNovamente}
    />
  );
}

const estilos = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espacos.xxl,
    paddingHorizontal: espacos.lg,
    gap: espacos.sm,
  },
  simbolo: {
    width: 56,
    height: 56,
    borderRadius: raios.pill,
    backgroundColor: cores.fundoSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espacos.xs,
  },
  simboloTexto: {
    fontSize: 24,
    color: cores.primariaEscura,
    fontWeight: fontes.peso.extra,
  },
  titulo: {
    fontSize: fontes.tamanho.lg,
    lineHeight: fontes.altura.lg,
    fontWeight: fontes.peso.forte,
    color: cores.texto,
    textAlign: 'center',
  },
  textoApoio: {
    fontSize: fontes.tamanho.sm,
    lineHeight: fontes.altura.md,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: espacos.xs,
  },
});
