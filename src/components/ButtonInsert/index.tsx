import React, { memo, } from 'react';
import { makeStyles, Tooltip, Fab, Box,} from '@material-ui/core';
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  container:{
    height: "80px",
  }
}));

interface ButtonInsertProps {
  title: string,
}


const BotaoInserir: React.FC<ButtonInsertProps> = ({ title, ...props }) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <Tooltip title={title}>
        <Fab className={classes.fab} color="primary"  {...props}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}

export default memo(BotaoInserir);