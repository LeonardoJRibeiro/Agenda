import React, { useState, useCallback, useContext } from 'react';
import { Grid, Button, Paper, Box, makeStyles } from '@material-ui/core';
import api from '../../utils/api';
import AuthContext from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import { Form } from '../Form';
import PasswordField from '../Form/Fields/PasswordField';
import TextField from '../Form/Fields/TextField';

const useStyles = makeStyles((theme) => ({
  formLogin: {
    maxWidth: "256px",
    [theme.breakpoints.up("xs")]: {
      maxWidth: "100%"
    },
  }
}))

const FormLogin: React.FC = () => {
  const classes = useStyles();
  const { setUsuario } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = useCallback(async (data) => {
    const response = await api.post('usuario/login', data)
    if (response && response.data) {
      setUsuario(response.data)
      localStorage.setItem("tokenUsuario", response.data.token);
      history.push('/');
    }
  }, [history, setUsuario]);

  return (
    <Paper elevation={2} className={classes.formLogin}>
      <Box p={3}>
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={1} justify="flex-end">
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Usuário"
                name="nomeUsuario"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                label="Senha"
                name="senha"
                required
                fullWidth
                type="password"
              />
            </Grid>
            <Grid item>
              <Box mt={2}>
                <Button type="submit" variant="outlined">Login</Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </Paper>
  );
}

export default FormLogin;