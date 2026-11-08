import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import { cores, espacos, raios } from '../../../tema/cores';

type Props = {
  label: string;
  valor: string;
  aoMudar: (valor: string) => void;
  placeholder?: string;
  seguro?: boolean;
  tipoTeclado?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  erro?: string;
  maxLength?: number;
};

export function CampoTexto({
  label,
  valor,
  aoMudar,
  placeholder,
  seguro = false,
  tipoTeclado = 'default',
  autoCapitalize = 'sentences',
  erro,
  maxLength,
}: Props) {
  const [visivel, setVisivel] = useState(false);
  const [focado, setFocado] = useState(false);

  return (
    <View style={estilos.container}>
      <Text style={estilos.label}>{label}</Text>

      <View
        style={[
          estilos.caixa,
          focado && estilos.caixaFocada,
          erro ? estilos.caixaComErro : null,
        ]}
      >
        <TextInput
          value={valor}
          onChangeText={aoMudar}
          placeholder={placeholder}
          placeholderTextColor={cores.placeholder}
          secureTextEntry={seguro && !visivel}
          keyboardType={tipoTeclado}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          accessibilityLabel={label}
          style={estilos.entrada}
        />

        {seguro ? (
          <Pressable
            onPress={() => setVisivel((atual) => !atual)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Text style={estilos.mostrar}>{visivel ? 'Ocultar' : 'Mostrar'}</Text>
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
    fontSize: 14,
    fontWeight: '600',
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
  caixaFocada: {
    borderColor: cores.primaria,
  },
  caixaComErro: {
    borderColor: cores.erro,
  },
  entrada: {
    flex: 1,
    fontSize: 16,
    color: cores.texto,
    paddingVertical: espacos.md,
  },
  mostrar: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
    paddingLeft: espacos.sm,
  },
  erro: {
    fontSize: 13,
    color: cores.erro,
  },
});
