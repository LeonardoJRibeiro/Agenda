import React from 'react';
import { Toolbar, AppBar } from '@material-ui/core';

const Header: React.FC = (props) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {props.children}
      </Toolbar>
    </AppBar>
  );
}

export default Header;