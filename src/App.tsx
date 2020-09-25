import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import datefns, {} from '@date-io/date-fns';
import ptLocale from "date-fns/locale/pt-BR";
import { ApiProvider } from './contexts/ApiContext';

class LocalizedUtils extends datefns {
  getDatePickerHeaderText(date: Date) {
    return this.format(date, "dd/MM/yyyy");
  };

  
}


function App() {
  return (
    <BrowserRouter>
      <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptLocale}>
        <AuthProvider>
          <ApiProvider>
            <Routes />
          </ApiProvider>
        </AuthProvider>
      </MuiPickersUtilsProvider>
    </BrowserRouter>
  );
}

export default App;
