import { useCallback, useEffect, useRef, useState } from 'react';

type ResultadoRecurso<T> = {
  dados: T | null;
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
};

type Estado<T> = {
  chave: string;
  versao: number;
  concluido: boolean;
  dados: T | null;
  erro: string | null;
};

export function useRecurso<T>(chave: string, carregar: () => Promise<T>): ResultadoRecurso<T> {
  const [estado, setEstado] = useState<Estado<T>>({
    chave: '',
    versao: 0,
    concluido: false,
    dados: null,
    erro: null,
  });
  const [versao, setVersao] = useState(0);
  const carregarRef = useRef(carregar);

  useEffect(() => {
    carregarRef.current = carregar;
  });

  useEffect(() => {
    let ativo = true;

    carregarRef
      .current()
      .then((resultado) => {
        if (ativo) {
          setEstado({ chave, versao, concluido: true, dados: resultado, erro: null });
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setEstado({
            chave,
            versao,
            concluido: true,
            dados: null,
            erro:
              falha instanceof Error
                ? falha.message
                : 'Não foi possível carregar as informações.',
          });
        }
      });

    return () => {
      ativo = false;
    };
  }, [chave, versao]);

  const atualizado = estado.chave === chave && estado.versao === versao && estado.concluido;

  const recarregar = useCallback(() => setVersao((atual) => atual + 1), []);

  return {
    dados: atualizado ? estado.dados : null,
    carregando: !atualizado,
    erro: atualizado ? estado.erro : null,
    recarregar,
  };
}
