import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  BarraAbas,
  Campo,
  CartaoClinica,
  CartaoEspecialidade,
  CartaoProfissional,
  Carregando,
  EstadoErro,
  EstadoVazio,
  Tela,
  useDebounce,
  useRecurso,
} from '../../componentes';
import { useAuth } from '../../contexto/AuthContext';
import { listarClinicas, listarEspecialidades, listarProfissionais } from '../../servicos/catalogo';
import { cores, espacos } from '../../tema';
import { fontes } from '../../tema/fontes';
import type { Clinica, Especialidade, Profissional } from '../../tipos/api';
import {
  montarParametros,
  resumoClinica,
  resumoEspecialidade,
  resumoProfissional,
} from '../agendamento/parametros';

type AbaBusca = 'especialidades' | 'clinicas' | 'profissionais';

type ResultadoBusca =
  | { tipo: 'especialidades'; itens: Especialidade[] }
  | { tipo: 'clinicas'; itens: Clinica[] }
  | { tipo: 'profissionais'; itens: Profissional[] };

const ROTULOS: Record<AbaBusca, string> = {
  especialidades: 'especialidades',
  clinicas: 'clínicas',
  profissionais: 'profissionais',
};

export function BuscaTela() {
  const params = useLocalSearchParams() as { aba?: string | string[] };
  const abaParam = Array.isArray(params.aba) ? params.aba[0] : params.aba;
  const abaInicial: AbaBusca =
    abaParam === 'clinicas' || abaParam === 'profissionais' ? abaParam : 'especialidades';

  const { token } = useAuth();
  const [aba, setAba] = useState<AbaBusca>(abaInicial);
  const [termo, setTermo] = useState('');
  const termoAdiado = useDebounce(termo);
  const rotuloAba = ROTULOS[aba];

  const recurso = useRecurso<ResultadoBusca>(`busca:${aba}:${termoAdiado}`, async () => {
    const filtro = termoAdiado || undefined;

    if (aba === 'clinicas') {
      const lista = await listarClinicas(filtro, token);
      return { tipo: 'clinicas', itens: lista.filter((clinica) => clinica.ativo) };
    }

    if (aba === 'profissionais') {
      const lista = await listarProfissionais({ nome: filtro }, token);
      return { tipo: 'profissionais', itens: lista.filter((profissional) => profissional.ativo) };
    }

    const lista = await listarEspecialidades(filtro, token);
    return { tipo: 'especialidades', itens: lista.filter((especialidade) => especialidade.ativo) };
  });

  function contagemDe(tipo: AbaBusca): number | undefined {
    if (!recurso.dados || recurso.dados.tipo !== tipo) return undefined;
    return recurso.dados.itens.length;
  }

  function abrirEspecialidade(especialidade: Especialidade) {
    router.push({
      pathname: '/(app)/agendamento/clinica',
      params: montarParametros({ especialidade: resumoEspecialidade(especialidade) }),
    });
  }

  function abrirClinica(clinica: Clinica) {
    router.push({
      pathname: '/(app)/agendamento/profissional',
      params: montarParametros({ clinica: resumoClinica(clinica) }),
    });
  }

  function abrirProfissional(profissional: Profissional) {
    router.push({
      pathname: '/(app)/agendamento/data',
      params: montarParametros({
        especialidade: {
          id: Number(profissional.id_especialidade),
          nome: profissional.especialidade_nome,
        },
        clinica: {
          id: Number(profissional.id_clinica),
          nome: profissional.clinica_nome,
        },
        profissional: resumoProfissional(profissional),
      }),
    });
  }

  function renderizarResultados() {
    if (recurso.carregando) {
      return <Carregando mensagem={`Buscando ${rotuloAba}...`} />;
    }

    if (recurso.erro) {
      return <EstadoErro mensagem={recurso.erro} aoTentarNovamente={recurso.recarregar} />;
    }

    const dados = recurso.dados;

    if (!dados || dados.itens.length === 0) {
      if (termoAdiado) {
        return (
          <EstadoVazio
            simbolo="!"
            titulo="Nenhum resultado encontrado"
            descricao={`Não encontramos ${rotuloAba} para "${termoAdiado}". Tente outro termo.`}
          />
        );
      }

      return (
        <EstadoVazio
          titulo={`Buscar ${rotuloAba}`}
          descricao="Digite um nome para ver os resultados."
        />
      );
    }

    return (
      <View style={estilos.lista}>
        <Text style={estilos.resumo}>
          {dados.itens.length} {dados.itens.length === 1 ? 'resultado' : 'resultados'}
        </Text>

        {dados.tipo === 'especialidades'
          ? dados.itens.map((especialidade) => (
              <CartaoEspecialidade
                key={especialidade.id_especialidade}
                especialidade={especialidade}
                aoPressionar={() => abrirEspecialidade(especialidade)}
              />
            ))
          : null}

        {dados.tipo === 'clinicas'
          ? dados.itens.map((clinica) => (
              <CartaoClinica
                key={clinica.id_clinica}
                clinica={clinica}
                aoPressionar={() => abrirClinica(clinica)}
              />
            ))
          : null}

        {dados.tipo === 'profissionais'
          ? dados.itens.map((profissional) => (
              <CartaoProfissional
                key={profissional.id_profissional}
                profissional={profissional}
                aoPressionar={() => abrirProfissional(profissional)}
              />
            ))
          : null}
      </View>
    );
  }

  return (
    <Tela
      titulo="Buscar atendimento"
      subtitulo="Encontre por especialidade, clínica ou profissional."
      aoVoltar={() => router.back()}
    >
      <Campo
        valor={termo}
        aoMudar={setTermo}
        placeholder="Digite o nome para buscar"
        rotuloAcessivel="Buscar atendimento"
        aoLimpar={() => setTermo('')}
      />

      <BarraAbas
        ativa={aba}
        aoMudar={(chave) => setAba(chave as AbaBusca)}
        abas={[
          { chave: 'especialidades', rotulo: 'Especialidades', contagem: contagemDe('especialidades') },
          { chave: 'clinicas', rotulo: 'Clínicas', contagem: contagemDe('clinicas') },
          { chave: 'profissionais', rotulo: 'Profissionais', contagem: contagemDe('profissionais') },
        ]}
      />

      {renderizarResultados()}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: {
    gap: espacos.sm,
  },
  resumo: {
    fontSize: fontes.tamanho.xs,
    fontWeight: fontes.peso.forte,
    color: cores.textoSecundario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
