import React, { useEffect, useState, useCallback } from 'react';
import { Container, Grid, Typography, Box, } from '@material-ui/core';
import CustomDialog from '../../../components/CustomDialog';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import ButtonInsert from '../../../components/ButtonInsert';
import convertMinutesToHours from '../../../utils/convertMinutesToHours';
import formatarData from '../../../utils/convertDateToString';
import FormInsertAgendamento from '../FormInsertAgendamento';
import useApi from '../../../hooks/useApi';

interface Agendamento {
  id: number,
  cliente: string,
  data: Date,
  descricao: string,
  horaInicio: number,
  horaFim: number,
  procedimento:{
    descricao: string,
  }
}

const ListagemAgendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const pathname = useLocation().pathname;
  const {get} = useApi();
  
  const listAgendamentos = useCallback(async () => {
    const response = await get('agendamento',);
    if (response && response.data) {
      setAgendamentos(response.data);
    }
  }, [get]);

  useEffect(() => {
    listAgendamentos();
  }, [listAgendamentos, pathname])

  return (
    <Container>
      <CustomDialog open title="Agendamentos" maxWidth="md" fullWidth>
        {agendamentos.map((agendamento: Agendamento, index: number) =>
          <Box mt={5} p={1} border={1}  key={index}>
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
            <FormInsertAgendamento/>
          </Route>
        </Switch>
        <Link to="/agendamentos/inserir">
          <ButtonInsert title="Inserir agendamento" />
        </Link>
      </CustomDialog>
    </Container>
  );
}

export default ListagemAgendamentos;