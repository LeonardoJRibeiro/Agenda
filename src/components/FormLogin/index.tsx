import React, { useCallback, useContext } from 'react';
import { Grid, Button, Paper, Box, makeStyles } from '@material-ui/core';
import AuthContext from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import { Form } from '../Form';
import PasswordField from '../Form/Fields/PasswordField';
import TextField from '../Form/Fields/TextField';
import ApiContext from '../../contexts/ApiContext';
import Usuario from '../../types/Usuario';

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
  const { post } = useContext(ApiContext);

  const handleSubmit = useCallback(async (data) => {
    const response = await post('usuario/login', data) as any;
    if (response) {
      setUsuario(response as Usuario)
      localStorage.setItem("tokenUsuario", response.token);
      history.push('/');
    }
  }, [history, post, setUsuario]);

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