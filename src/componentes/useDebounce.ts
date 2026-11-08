import { useEffect, useState } from 'react';

export function useDebounce<T>(valor: T, atraso = 350): T {
  const [adiado, setAdiado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setAdiado(valor), atraso);
    return () => clearTimeout(temporizador);
  }, [valor, atraso]);

  return adiado;
}
