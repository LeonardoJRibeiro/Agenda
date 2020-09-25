import React, { useState, useEffect, useCallback, useRef } from 'react';
import CustomDialog from '../../../components/CustomDialog';
import { FormControl, InputLabel, Select, MenuItem, Grid, DialogActions, Button } from '@material-ui/core';
import listIntervalosa from '../../../utils/listIntervalos';
import Procedimento from '../../../types/Procedimento';
import Intervalo from '../../../types/Intervalo';
import convertMinutesToHurs from '../../../utils/convertMinutesToHours';
import convertHourToMinutes from '../../../utils/convertHourToMinutes';
import { useHistory } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import { DateField, Form } from '../../../components/Form';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import TextField from '../../../components/Form/Fields/TextField';
import NumberField from '../../../components/Form/Fields/NumberField';
import { FormProviderHandles } from '../../../components/Form/types';
import SelectField from '../../../components/Form/Fields/SelectField';

const FormInsertAgendamento: React.FC = () => {
  const [intervalos, setIntervalos] = useState(Array<Intervalo>());
  const [procedimentos, setProcedimentos] = useState(Array<Procedimento>());
  const [procedimento, setProcedimento] = useState<number | null>(null);
  const [intervalosCompativeis, setIntervalosCompativeis] = useState(Array<Intervalo>());
  const duracao = useRef(0);
  const [horario, setHorario] = useState("");
  const [hora, setHora] = useState("00:00");
  const [horaValida, setHoraValida] = useState(true);
  const history = useHistory();
  const formRef = useRef<FormProviderHandles>({} as FormProviderHandles);
  const { get, post } = useApi();

  const listIntervalos = useCallback(async (data: Date) => {
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

  const listarIntervalosCompativeis = useCallback(() => {
    const intervalosCompativeis = Array<Intervalo>();
    intervalos.forEach((intervalo: Intervalo) => {
      if (intervalo.fim - intervalo.inicio >= duracao.current) {
        intervalosCompativeis.push(intervalo);
      }
    })
    console.log(intervalos)
    setIntervalosCompativeis(intervalosCompativeis);
  }, [intervalos])

  const handleChangeData = useCallback((date: MaterialUiPickersDate, value?: string | null | undefined) => {
    if (date) {
      listIntervalos(date);
    }
  }, [listIntervalos]);

  const refreshHoraValida = useCallback(({ horaNova, horarioNovo, duracaoNova }) => {
    const minutes = convertHourToMinutes(horaNova ? horaNova : hora);
    const intervalo = intervalosCompativeis[Number(horarioNovo ? horarioNovo : horario)];
    const duracaoP = duracaoNova ? duracaoNova : duracao.current;
    if (intervalo) {
      console.log(minutes >= intervalo.inicio, minutes + duracaoP <= intervalo.fim)
      if (minutes >= intervalo.inicio && minutes + duracaoP <= intervalo.fim) {
        setHoraValida(true);
      }
      else {
        setHoraValida(false);
      }
    }
  }, [hora, horario, intervalosCompativeis])

  const handleChangeProcedimento = useCallback((e) => {
    const valor = e.target.value;
    let indexProcedimentoSelecionado: number = -1;
    procedimentos.forEach((procedimento: Procedimento, index) => {
      if (valor === procedimento._id) {
        indexProcedimentoSelecionado = index;
      }
    })
    formRef.current.setFieldValue("duracao", procedimentos[indexProcedimentoSelecionado].duracao);
    duracao.current = procedimentos[indexProcedimentoSelecionado].duracao;
    listarIntervalosCompativeis();
    setProcedimento(valor);
    refreshHoraValida({})
  }, [listarIntervalosCompativeis, procedimentos, refreshHoraValida]);

  const handleChangeDuracao = useCallback((e) => {
    duracao.current = Number(e.target.value);
    listarIntervalosCompativeis();
    refreshHoraValida({ duracaoNova: Number(e.target.value) });
  }, [listarIntervalosCompativeis, refreshHoraValida])

  const handleChangeHorario = useCallback((e) => {
    setHorario(e.target.value);
    const hora = convertMinutesToHurs(intervalosCompativeis[Number(e.target.value)].inicio);
    setHora(hora);
    refreshHoraValida({ horaNova: hora, horarioNovo: e.target.value })
  }, [intervalosCompativeis, refreshHoraValida])

  const handleChangeHora = useCallback((e) => {
    setHora(e.target.value);
    refreshHoraValida({ horaNova: e.target.value })
  }, [refreshHoraValida]);

  const handleSubmit = useCallback(async (value: any) => {

    if (value.data) {
      const dados = {
        cliente: value.cliente,
        data: value.data,
        hora: value.hora,
        duracao: value.duracao,
        idProcedimento: procedimento,
      }
      const response = await post('agendamento', dados);
      if (response.status === 201) {
        history.goBack()
      }
    }
  }, [history, post, procedimento]);



  return (
    <CustomDialog open title="Inserir agendamento">
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DateField
              name="data"
              label="Data"
              fullWidth
              onChange={handleChangeData}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <SelectField
                disabled={!procedimentos.length}
                onChange={handleChangeProcedimento}
                name="procedimento"
                label="Procedimento"
                required
              >
                {procedimentos.map((procedimento: Procedimento, index: number) => (
                  <MenuItem value={procedimento._id} key={index}>
                    {procedimento.descricao}
                  </MenuItem>
                ))}
              </SelectField>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <NumberField
              label="Duração do procedimento"
              name="duracao"
              min={0}
              disabled={procedimento === undefined}
              fullWidth
              required
              onChange={handleChangeDuracao}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Horários disponíveis</InputLabel>
              <Select
                disabled={procedimento === undefined || !duracao}
                onChange={handleChangeHorario}
                required
                value={horario}
              >
                {intervalosCompativeis.map((intervalo: Intervalo, index: number) => (
                  <MenuItem value={String(index)} key={index}>
                    de {convertMinutesToHurs(intervalo.inicio)} até {convertMinutesToHurs(intervalo.fim)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="hora"
              label="Hora"
              type="time"
              value={hora}
              fullWidth
              disabled={horario === undefined}
              onChange={handleChangeHora}
              error={!horaValida}
              helperText={!horaValida && "Hora indisponível"}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Paciente"
              name="cliente"
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <DialogActions>
          <Button variant="outlined" type="submit">
            Salvar
          </Button>
        </DialogActions>
      </Form>
    </CustomDialog >
  );
}

export default FormInsertAgendamento;