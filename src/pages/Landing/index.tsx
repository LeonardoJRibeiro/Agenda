import React from 'react';
import Header from '../../components/Header';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import FormLogin from '../../components/FormLogin';

const useStyles = makeStyles((theme) => ({
  landing: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center"
  }
}));

const Landing: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Header>
        <Grid container spacing={2}>
          <Grid item>
            Agenda
          </Grid>
        </Grid>
      </Header>
      <Container maxWidth="sm" className={classes.landing}>
        <Grid container justify="space-around" spacing={4} alignItems="center">
          <Grid item sm={6}>
            <Typography variant="h6" align="center">Informe suas credenciais para utilizar o APP.</Typography>
          </Grid>
          <Grid item sm={6}>
            <FormLogin />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Landing;