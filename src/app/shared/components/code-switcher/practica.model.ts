export interface Practica {
  titulo: string;
  descripcion: string;
  respuesta: string;
  codigo_ejemplo: string;
}

export interface PracticasPorLenguaje {
  [key: string]: {
    [key: string]: Practica;
  };
}
