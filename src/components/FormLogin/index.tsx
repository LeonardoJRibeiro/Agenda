import React, { useState, useCallback, useContext } from 'react';
import { Grid, TextField, Button, Paper, Box, makeStyles } from '@material-ui/core';
import api from '../../utils/api';
import AuthContext from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

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
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const { setUsuario } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    const response = await api.post('usuario/login', {
      nomeUsuario,
      senha,
    })
    if (response && response.data) {
      setUsuario(response.data)
      localStorage.setItem("tokenUsuario", response.data.token);
      history.push('/');
    }
  }, [history, nomeUsuario, senha, setUsuario]);

  return (
    <Paper elevation={2} className={classes.formLogin}>
      <Box p={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1} justify="flex-end">
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Usuário"
                value={nomeUsuario}
                required
                fullWidth
                onChange={(e) => setNomeUsuario(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Senha"
                value={senha}
                required
                fullWidth
                type="password"
                onChange={(e) => setSenha(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Box mt={2}>
                <Button type="submit" variant="outlined">Login</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  );
}

export default FormLogin;