export default interface Agendamento {
  _id: number,
  cliente: string,
  data: Date,
  descricao: string,
  horaInicio: number,
  horaFim: number,
  procedimento:{
    descricao: string,
  }
}