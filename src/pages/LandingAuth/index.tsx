import React, { useContext, useState, useCallback } from 'react';
import Header from '../../components/Header';
import { Container, Grid, makeStyles, Typography, Avatar, Menu, MenuItem, Paper, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  landing: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  paper: {
    padding: theme.spacing(6),
    textDecoration: "none",
    transition: "0.4s",
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)"
    }
  },
  link: {
    textDecoration: "none"
  }
}));

const LandingAuth: React.FC = () => {
  const [anchorElement, setAnchorElement] = useState(null);
  const menuOpen = Boolean(anchorElement);
  const classes = useStyles();
  const { logout, usuario } = useContext(AuthContext);

  const handleClickAvatar = useCallback((e) => {
    setAnchorElement(e.currentTarget);
  }, []);

  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Header>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Typography>Agenda</Typography>
          </Grid>
          <Grid item>
            <Avatar onClick={handleClickAvatar}>{usuario?.nome.charAt(0)}</Avatar>
          </Grid>
        </Grid>
      </Header>
      <Container maxWidth="sm" className={classes.landing}>
        <Grid container justify="center" spacing={4}>
          <Grid item>
            <Link to="/procedimentos" className={classes.link}>
              <Paper className={classes.paper} elevation={2}>
                <Typography variant="h5">Procedimentos</Typography>
              </Paper>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/agendamentos" className={classes.link}>
              <Paper className={classes.paper} elevation={2}>
                <Typography variant="h5">Agendamentos</Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>
      </Container>
      <Menu
        id="fade-menu"
        anchorEl={anchorElement}
        keepMounted
        open={menuOpen}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
      >
        <MenuItem>
          <Typography>Olá, {usuario?.nome}</Typography>
        </MenuItem>
        <MenuItem onClick={() => logout()}>Sair</MenuItem>
      </Menu>
    </>
  );
}

export default LandingAuth;