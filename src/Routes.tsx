import React, { useEffect, useContext, useCallback } from 'react';
import { Switch, Route } from 'react-router-dom';
import ListagemProcedimentos from './pages/procedimentos/ListagemProcedimentos';
import Landing from './pages/Landing';
import ListagemAgendamentos from './pages/agendamentos/ListagemAgendamentos';
import AuthContext from './contexts/AuthContext';
import useAuth from './hooks/useAuth';
import Usuario from './types/Usuario';
import LandingAuth from './pages/LandingAuth';
import ApiContext from './contexts/ApiContext';


const Routes: React.FC = () => {
  const { usuario, setUsuario, } = useContext(AuthContext);
  const { logado } = useAuth();
  const { get } = useContext(ApiContext);

  const efetuarLoginPorToken = useCallback(async (token) => {
    const resposta = await get(
      "/usuario/loginPorToken",
    )
    if (resposta) {
      setUsuario({ ...usuario, ...resposta } as Usuario);
    }
  }, [get, setUsuario, usuario]);

  useEffect(() => {
    if (!logado && usuario && usuario.token) {
      efetuarLoginPorToken(usuario.token);
    }
  }, [efetuarLoginPorToken, logado, usuario]);

  return (
    <>
      {
        !logado ? < Landing /> : <LandingAuth />
      }
      {logado && (
        <Switch>
          <Route path='/procedimentos' component={ListagemProcedimentos} />
          <Route path='/agendamentos' component={ListagemAgendamentos} />
        </Switch>
      )}
    </>
  );
}

export default Routes;