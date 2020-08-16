import React, { useState, useCallback, useContext } from 'react';
import CustomDialog from '../../components/CustomDialog';
import { Grid, TextField, DialogActions, Button } from '@material-ui/core';
import api from '../../utils/api';
import AuthContext from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';


const Login: React.FC = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const {setUsuario} = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    const response = await api.post('usuario/login', {
      nomeUsuario,
      senha,
    })
    if(response && response.data){
      setUsuario(response.data)
      localStorage.setItem("tokenUsuario", response.data.token);
      history.push('/');
    }
  }, [history, nomeUsuario, senha, setUsuario]);

  return (
    <CustomDialog open title="Login">
      <form onSubmit={handleSubmit}>
        <Grid container>
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
        </Grid>
        <DialogActions>
          <Button type="submit" variant="outlined">Login</Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
}

export default Login;