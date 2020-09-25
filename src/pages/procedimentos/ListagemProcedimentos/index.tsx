import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Grid, Typography, Container, Tooltip, IconButton, } from '@material-ui/core';
import Dialog from '../../../components/CustomDialog';
import FormInsertProcedimento from '../FormInsertProcedimento';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import ButtonInsert from '../../../components/ButtonInsert';
import EditIcon from '@material-ui/icons/Edit';
import ApiContext from '../../../contexts/ApiContext';
interface Procedimento {
  descricao: string,
  duracao: number,
  _id: number,
}

const ListagemProcedimentos: React.FC = () => {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const pathname = useLocation().pathname;
  const { get } = useContext(ApiContext);
  const listProcedimentos = useCallback(async () => {
    const response = await get('procedimento',);
    if (response) {
      setProcedimentos(response as Procedimento[]);
    }
  }, [get]);

  useEffect(() => {
    listProcedimentos();
  }, [listProcedimentos, pathname]);
  return (
    <Container>
      <Dialog open title="Procedimentos" maxWidth="sm" fullWidth>
        {procedimentos.map((procedimento: Procedimento) =>
          <Grid container spacing={2} key={procedimento._id} justify="space-between">
            <Grid item >
              <Typography>{procedimento.descricao}</Typography>
            </Grid>
            <Grid item >
              <Grid container spacing={2} alignItems="center">
                <Grid item >
                  <Typography>{procedimento.duracao} min</Typography>
                </Grid>
                <Grid item >
                  <Tooltip title={`alterar o procedimento ${procedimento.descricao}`}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Switch>
          <Route path="/procedimentos/inserir">
            <FormInsertProcedimento />
          </Route>
        </Switch>
        <Link to="/procedimentos/inserir">
          <ButtonInsert title="Inserir procedimento" />
        </Link>
      </Dialog>
    </Container>
  );
}

export default ListagemProcedimentos;