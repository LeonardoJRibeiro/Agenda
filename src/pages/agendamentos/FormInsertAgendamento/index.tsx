import React, { useState, useEffect, useCallback } from 'react';
import CustomDialog from '../../../components/CustomDialog';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid, DialogActions, Button } from '@material-ui/core';
import listIntervalosa from '../../../utils/listIntervalos';
import Procedimento from '../../../types/Procedimento';
import Intervalo from '../../../types/Intervalo';
import convertMinutesToHurs from '../../../utils/convertMinutesToHours';
import convertHourToMinutes from '../../../utils/convertHourToMinutes';
import { useHistory } from 'react-router-dom';
import useApi from '../../../hooks/useApi';

const FormInsertAgendamento: React.FC = () => {
  const [data, setData] = useState('');
  const [intervalos, setIntervalos] = useState(Array<Intervalo>());
  const [procedimentos, setProcedimentos] = useState(Array<Procedimento>());
  const [procedimento, setProcedimento] = useState(-1);
  const [intervalosCompativeis, setIntervalosCompativeis] = useState(Array<Intervalo>());
  const [duracao, setDuracao] = useState(0);
  const [horario, setHorario] = useState(-1)
  const [hora, setHora] = useState("00:00");
  const [horaValida, setHoraValida] = useState(true);
  const [cliente, setCliente] = useState("");
  const history = useHistory();
  const {get, post} = useApi();

  const listIntervalos = useCallback(async (data: string) => {
    const response = await get(`agendamento/intervalo?data=${data}`);
    if (response && response.data) {
      const interval = listIntervalosa(response.data)
      setIntervalos(interval);
    }
  }, [get]);

  const listProcedimentos = useCallback(async () => {
    const response = await get('procedimento');
    if (response && response.data) {
      setProcedimentos(response.data);
    }
  }, [get])

  useEffect(() => {
    listProcedimentos()
  }, [listProcedimentos])

  useEffect(() => {
    const intervalosCompativeis = Array<Intervalo>();
    intervalos.forEach((intervalo: Intervalo) => {
      if (intervalo.fim - intervalo.inicio >= duracao) {
        intervalosCompativeis.push(intervalo);
      }
    })
    setIntervalosCompativeis(intervalosCompativeis);
  }, [duracao, intervalos, procedimentos])

  const handleChangeData = useCallback((e) => {
    const data = e.target.value
    if (new Date(data).getTime() > 0) {
      listIntervalos(data)
      setData(data);
    }
  }, [listIntervalos]);

  const refreshHoraValida = useCallback(({ horaNova, horarioNovo, duracaoNova }) => {
    const minutes = convertHourToMinutes(horaNova ? horaNova : hora);
    const intervalo = intervalosCompativeis[Number(horarioNovo ? horarioNovo : horario)];
    const duracaoP = duracaoNova ? duracaoNova : duracao
    if (intervalo) {
      if (minutes >= intervalo.inicio && minutes + duracaoP <= intervalo.fim) {
        setHoraValida(true);
      }
      else {
        setHoraValida(false);
      }
    }
  }, [duracao, hora, horario, intervalosCompativeis])

  const handleChangeProcedimento = useCallback((e) => {
    const valor = e.target.value;
    let indexProcedimentoSelecionado: number = -1;
    procedimentos.forEach((procedimento: Procedimento, index) => {
      if (valor === procedimento._id) {
        indexProcedimentoSelecionado = index;
      }
    })
    setDuracao(procedimentos[indexProcedimentoSelecionado].duracao);
    setProcedimento(valor);
    refreshHoraValida({})
  }, [procedimentos, refreshHoraValida]);

  const handleChangeDuracao = useCallback((e) => {
    setDuracao(Number(e.target.value));
    refreshHoraValida({ duracaoNova: Number(e.target.value) });
  }, [refreshHoraValida])

  const handleChangeHorario = useCallback((e) => {
    setHorario(e.target.value)
    const hora = convertMinutesToHurs(intervalosCompativeis[Number(e.target.value)].inicio)
    setHora(hora)
    refreshHoraValida({ horaNova: hora, horarioNovo: e.target.value })
  }, [intervalosCompativeis, refreshHoraValida])

  const handleChangeHora = useCallback((e) => {
    setHora(e.target.value)
    refreshHoraValida({ horaNova: e.target.value })
  }, [refreshHoraValida]);

  const handleSubmit = useCallback(async (e) => {
    if(e){
      e.preventDefault()
    }
    const dados = {
      cliente,
      data,
      hora,
      duracao,
      idProcedimento : procedimento,
    }
    const response = await post('agendamento', dados);
    if(response.status === 201){
      history.goBack()
    }
  }, [cliente, data, duracao, history, hora, post, procedimento]);

  return (
    <CustomDialog open title="Inserir agendamento">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              type="date"
              label="Data"
              fullWidth
              onChange={handleChangeData}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Procedimento</InputLabel>
              <Select
                disabled={!data.length}
                onChange={handleChangeProcedimento}
                value={procedimento}
                required
              >
                {procedimentos.map((procedimento: Procedimento, index: number) => (
                  <MenuItem value={procedimento._id} key={index}>
                    {procedimento.descricao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Duração do procedimento"
              disabled={procedimento < 0}
              fullWidth
              required
              value={duracao}
              onChange={handleChangeDuracao}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Horários disponíveis</InputLabel>
              <Select
                disabled={procedimento === null || !duracao}
                onChange={handleChangeHorario}
                required
                value={horario}
              >
                {intervalosCompativeis.map((intervalo: Intervalo, index: number) => (
                  <MenuItem value={index} key={index}>
                    de {convertMinutesToHurs(intervalo.inicio)} até {convertMinutesToHurs(intervalo.fim)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Hora"
              type="time"
              value={hora}
              fullWidth
              disabled={horario < 0}
              onChange={handleChangeHora}
              error={!horaValida}
              helperText={!horaValida && "Hora indisponível"}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Paciente"
              fullWidth
              required
              value={cliente}
              onChange={e=>setCliente(e.target.value)}
            />
          </Grid>
        </Grid>
        <DialogActions>
          <Button variant="outlined" type="submit">
            Salvar
        </Button>
        </DialogActions>
      </form>
    </CustomDialog >
  );
}

export default FormInsertAgendamento;