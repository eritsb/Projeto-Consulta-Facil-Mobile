import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  numeroParam,
  textoParam,
  type ClinicaResumo,
  type DisponibilidadeResumo,
  type EspecialidadeResumo,
  type ParametrosFluxo,
  type ProfissionalResumo,
} from './parametros';

type FluxoAgendamento = {
  especialidade: EspecialidadeResumo | null;
  clinica: ClinicaResumo | null;
  profissional: ProfissionalResumo | null;
  disponibilidade: DisponibilidadeResumo | null;
  definirEspecialidade: (especialidade: EspecialidadeResumo | null) => void;
  definirClinica: (clinica: ClinicaResumo | null) => void;
  definirProfissional: (profissional: ProfissionalResumo | null) => void;
  definirDisponibilidade: (disponibilidade: DisponibilidadeResumo | null) => void;
  limpar: () => void;
};

const FluxoContext = createContext<FluxoAgendamento | null>(null);

export function FluxoAgendamentoProvider({ children }: { children: ReactNode }) {
  const [especialidade, setEspecialidade] = useState<EspecialidadeResumo | null>(null);
  const [clinica, setClinica] = useState<ClinicaResumo | null>(null);
  const [profissional, setProfissional] = useState<ProfissionalResumo | null>(null);
  const [disponibilidade, setDisponibilidade] = useState<DisponibilidadeResumo | null>(null);

  const definirEspecialidade = useCallback((novo: EspecialidadeResumo | null) => {
    setEspecialidade(novo);
    setClinica(null);
    setProfissional(null);
    setDisponibilidade(null);
  }, []);

  const definirClinica = useCallback((novo: ClinicaResumo | null) => {
    setClinica(novo);
    setProfissional(null);
    setDisponibilidade(null);
  }, []);

  const definirProfissional = useCallback((novo: ProfissionalResumo | null) => {
    setProfissional(novo);
    setDisponibilidade(null);
  }, []);

  const definirDisponibilidade = useCallback((novo: DisponibilidadeResumo | null) => {
    setDisponibilidade(novo);
  }, []);

  const limpar = useCallback(() => {
    setEspecialidade(null);
    setClinica(null);
    setProfissional(null);
    setDisponibilidade(null);
  }, []);

  const valor = useMemo(
    () => ({
      especialidade,
      clinica,
      profissional,
      disponibilidade,
      definirEspecialidade,
      definirClinica,
      definirProfissional,
      definirDisponibilidade,
      limpar,
    }),
    [
      especialidade,
      clinica,
      profissional,
      disponibilidade,
      definirEspecialidade,
      definirClinica,
      definirProfissional,
      definirDisponibilidade,
      limpar,
    ],
  );

  return <FluxoContext.Provider value={valor}>{children}</FluxoContext.Provider>;
}

export function useFluxoAgendamento(): FluxoAgendamento {
  const contexto = useContext(FluxoContext);
  if (!contexto) {
    throw new Error('useFluxoAgendamento deve ser usado dentro de FluxoAgendamentoProvider.');
  }
  return contexto;
}

export function useHidratarFluxo(params: ParametrosFluxo) {
  const fluxo = useFluxoAgendamento();
  const aplicado = useRef(false);

  useEffect(() => {
    if (aplicado.current) return;
    aplicado.current = true;

    if (textoParam(params.reiniciar)) fluxo.limpar();

    const especialidadeId = numeroParam(params.especialidadeId);
    const especialidadeNome = textoParam(params.especialidadeNome);
    if (especialidadeId && especialidadeNome) {
      fluxo.definirEspecialidade({ id: especialidadeId, nome: especialidadeNome });
    }

    const clinicaId = numeroParam(params.clinicaId);
    const clinicaNome = textoParam(params.clinicaNome);
    if (clinicaId && clinicaNome) {
      fluxo.definirClinica({
        id: clinicaId,
        nome: clinicaNome,
        endereco: textoParam(params.clinicaEndereco) ?? undefined,
      });
    }

    const profissionalId = numeroParam(params.profissionalId);
    const profissionalNome = textoParam(params.profissionalNome);
    if (profissionalId && profissionalNome) {
      fluxo.definirProfissional({
        id: profissionalId,
        nome: profissionalNome,
        registro: textoParam(params.profissionalRegistro) ?? undefined,
        conselho: textoParam(params.profissionalConselho) ?? undefined,
        clinicaNome: clinicaNome ?? textoParam(params.profissionalClinica) ?? undefined,
        especialidadeNome:
          especialidadeNome ?? textoParam(params.profissionalEspecialidade) ?? undefined,
      });
    }

    const disponibilidadeId = numeroParam(params.disponibilidadeId);
    const data = textoParam(params.data);
    const horaInicio = textoParam(params.horaInicio);
    if (disponibilidadeId && data && horaInicio) {
      fluxo.definirDisponibilidade({
        id: disponibilidadeId,
        data,
        horaInicio,
        horaFim: textoParam(params.horaFim) ?? '',
      });
    }
  }, [fluxo, params]);
}
