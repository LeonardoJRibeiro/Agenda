import Agendamento from "../types/Agendamento";
interface Intervalo {
  inicio: number,
  fim: number,
}

export default function listIntervalos(agendamentos: Agendamento[]) {
  const intervalos = []
  let inicio;
  let fim;
  for (let i = 0; i <= agendamentos.length; i++) {
    console.log(i)
    if (i === 0) {
      inicio = 0;
    }
    else {
      inicio = agendamentos[i - 1].horaFim;
    }
    if (i >= agendamentos.length) {
      fim = 1440
    }
    else {
      fim = agendamentos[i].horaInicio;
    }
    if (inicio !== fim) {
      intervalos.push({ inicio, fim });
    }
  }
  return intervalos
}