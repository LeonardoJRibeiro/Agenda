import Agendamento from "../types/Agendamento";
interface Intervalo {
  inicio: number,
  fim: number,
}

export default function listIntervalos(agendamentos: Agendamento[]) {
  const agendamentosSorted = agendamentos.sort((agA, agB) => {
    if (agA.horaInicio > agB.horaInicio) {
      return 1;
    }
    if (agA.horaInicio < agB.horaInicio) {
      return -1;
    }
    return 0;
  })
  const intervalos = []
  let inicio;
  let fim;
  for (let i = 0; i <= agendamentosSorted.length; i++) {
    console.log(i)
    if (i === 0) {
      inicio = 0;
    }
    else {
      inicio = agendamentosSorted[i - 1].horaFim;
    }
    if (i >= agendamentosSorted.length) {
      fim = 1440
    }
    else {
      fim = agendamentosSorted[i].horaInicio;
    }
    if (inicio !== fim) {
      intervalos.push({ inicio, fim });
    }
  }
  return intervalos
}