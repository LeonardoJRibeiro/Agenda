import React, { useCallback } from 'react';
import { Dialog as Dialogo, makeStyles, useTheme, DialogTitle, Typography, IconButton, DialogContent, useMediaQuery, DialogProps } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialog: {
    [theme.breakpoints.down("xs")]: {
      padding: "8px"
    },
  },
}));

interface CustomDialogProps extends DialogProps{
  title: string,
}


const CustomDialog: React.FC<CustomDialogProps> = ({title, ...props}) => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const handleClose = useCallback(() => {
    if (history.length > 1) {
      history.goBack();
    }
    else {
      history.replace("/")
    }
  }, [history]);

  return (
    <Dialogo fullScreen={fullScreen} disablePortal onClose={handleClose} disableBackdropClick {...props}>
      <DialogTitle>
        <Typography >{title}</Typography>
        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        {
          props.children
        }
      </DialogContent>
    </Dialogo>
  );
}

export default CustomDialog;