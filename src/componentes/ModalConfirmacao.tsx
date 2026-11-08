import { Modal, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';
import { Botao } from './Botao';

type Props = {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
  carregando?: boolean;
  perigoso?: boolean;
};

export function ModalConfirmacao({
  visivel,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  aoConfirmar,
  aoCancelar,
  carregando = false,
  perigoso = false,
}: Props) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoCancelar}
      accessibilityViewIsModal
    >
      <View style={estilos.fundo}>
        <View style={estilos.cartao} accessibilityRole="alert">
          <Text style={estilos.titulo} accessibilityRole="header">
            {titulo}
          </Text>
          <Text style={estilos.mensagem}>{mensagem}</Text>

          <View style={estilos.acoes}>
            <Botao
              titulo={textoCancelar}
              aoPressionar={aoCancelar}
              variante="secundaria"
              desabilitado={carregando}
              estilo={estilos.acao}
            />
            <Botao
              titulo={textoConfirmar}
              aoPressionar={aoConfirmar}
              variante={perigoso ? 'perigo' : 'primaria'}
              carregando={carregando}
              estilo={estilos.acao}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacos.lg,
  },
  cartao: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: cores.superficie,
    borderRadius: raios.lg,
    padding: espacos.lg,
    gap: espacos.md,
  },
  titulo: {
    fontSize: fontes.tamanho.xl,
    lineHeight: fontes.altura.xl,
    fontWeight: fontes.peso.extra,
    color: cores.texto,
  },
  mensagem: {
    fontSize: fontes.tamanho.md,
    lineHeight: fontes.altura.md,
    color: cores.textoSecundario,
  },
  acoes: {
    flexDirection: 'row',
    gap: espacos.sm,
    marginTop: espacos.sm,
  },
  acao: {
    flex: 1,
  },
});
