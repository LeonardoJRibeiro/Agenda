import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Grid, Typography, Box, } from '@material-ui/core';
import CustomDialog from '../../../components/CustomDialog';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import ButtonInsert from '../../../components/ButtonInsert';
import convertMinutesToHours from '../../../utils/convertMinutesToHours';
import formatarData from '../../../utils/convertDateToString';
import FormInsertAgendamento from '../FormInsertAgendamento';
import FormSearch from '../FormSearch';
import ApiContext from '../../../contexts/ApiContext';
import Agendamento from '../../../types/Agendamento';


const ListagemAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const pathname = useLocation().pathname;
  const { get } = useContext(ApiContext);

  const listAgendamentos = useCallback(async () => {
    const response = await get('agendamento');
    if (response) {
      setAgendamentos(response as Agendamento[]);
    }
  }, [get]);

  useEffect(() => {
    listAgendamentos();
  }, [listAgendamentos, pathname])

  const handleSubmitSearch = useCallback(async (data) => {
    console.log(data)
    const response = await get(`agendamento/consulta?${data}`);
    if (response) {
      setAgendamentos(response as Agendamento[]);
    }
  }, []);

  return (
    <CustomDialog open title="Agendamentos" maxWidth="md" fullWidth>
      <FormSearch onSubmit={handleSubmitSearch} />
      {agendamentos.map((agendamento: Agendamento, index: number) =>
        <Box mt={5} p={1} border={1} key={index}>
          <Grid container spacing={2} justify="space-between">
            <Grid item >
              <Typography>Data {formatarData(agendamento.data)}</Typography>
            </Grid>
            <Grid item >
              <Typography>De {convertMinutesToHours(agendamento.horaInicio)}</Typography>
            </Grid>
            <Grid item >
              <Typography>Até {convertMinutesToHours(agendamento.horaFim)}</Typography>
            </Grid>
            <Grid item >
              <Typography>Cliente: {agendamento.cliente}</Typography>
            </Grid>
            <Grid item >
              <Typography>Procedimento: {agendamento.procedimento.descricao}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}
      <Switch>
        <Route path="/agendamentos/inserir">
          <FormInsertAgendamento />
        </Route>
      </Switch>
      <Link to="/agendamentos/inserir">
        <ButtonInsert title="Inserir agendamento" />
      </Link>
    </CustomDialog>
  );
}

export default ListagemAgendamentos;