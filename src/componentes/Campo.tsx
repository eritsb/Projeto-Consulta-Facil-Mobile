import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import { cores, espacos, raios } from '../tema/cores';
import { fontes } from '../tema/fontes';

type Props = {
  valor: string;
  aoMudar: (valor: string) => void;
  label?: string;
  placeholder?: string;
  tipoTeclado?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rotuloAcessivel?: string;
  aoLimpar?: () => void;
  aoEnviar?: () => void;
  maxLength?: number;
  multiline?: boolean;
  numeroLinhas?: number;
  erro?: string;
};

export function Campo({
  valor,
  aoMudar,
  label,
  placeholder,
  tipoTeclado = 'default',
  autoCapitalize = 'sentences',
  rotuloAcessivel,
  aoLimpar,
  aoEnviar,
  maxLength,
  multiline = false,
  numeroLinhas = 3,
  erro,
}: Props) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={estilos.container}>
      {label ? <Text style={estilos.label}>{label}</Text> : null}

      <View
        style={[
          estilos.caixa,
          multiline ? estilos.caixaMultilinha : null,
          focado ? estilos.caixaFocada : null,
          erro ? estilos.caixaComErro : null,
        ]}
      >
        <TextInput
          value={valor}
          onChangeText={aoMudar}
          placeholder={placeholder}
          placeholderTextColor={cores.placeholder}
          keyboardType={tipoTeclado}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numeroLinhas : undefined}
          returnKeyType={aoEnviar ? 'search' : 'default'}
          onSubmitEditing={aoEnviar}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          accessibilityLabel={rotuloAcessivel ?? label ?? placeholder ?? 'Campo de texto'}
          style={[estilos.entrada, multiline ? estilos.entradaMultilinha : null]}
        />

        {valor && aoLimpar ? (
          <Pressable
            onPress={aoLimpar}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Limpar campo"
            style={estilos.limpar}
          >
            <Text style={estilos.limparTexto}>×</Text>
          </Pressable>
        ) : null}
      </View>

      {erro ? (
        <Text style={estilos.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    gap: espacos.xs,
  },
  label: {
    fontSize: fontes.tamanho.sm,
    fontWeight: fontes.peso.medio,
    color: cores.texto,
  },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.bordaForte,
    backgroundColor: cores.superficie,
    borderRadius: raios.md,
    paddingHorizontal: espacos.md,
    minHeight: 52,
  },
  caixaMultilinha: {
    alignItems: 'flex-start',
    paddingVertical: espacos.sm,
  },
  caixaFocada: {
    borderColor: cores.primaria,
    borderWidth: 2,
  },
  caixaComErro: {
    borderColor: cores.erro,
  },
  entrada: {
    flex: 1,
    fontSize: fontes.tamanho.md,
    color: cores.texto,
    paddingVertical: espacos.md,
  },
  entradaMultilinha: {
    minHeight: 88,
    textAlignVertical: 'top',
    paddingVertical: espacos.sm,
  },
  limpar: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limparTexto: {
    fontSize: 22,
    color: cores.textoSecundario,
  },
  erro: {
    fontSize: fontes.tamanho.xs,
    color: cores.erro,
  },
});
