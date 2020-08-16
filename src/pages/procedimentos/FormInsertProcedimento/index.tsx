import React, { useState, useCallback } from 'react';
import { TextField, DialogActions, Button } from '@material-ui/core';
import CustomDialog from '../../../components/CustomDialog';
import { useHistory } from 'react-router-dom';
import useApi from '../../../hooks/useApi';


const FormInsertProcedimento: React.FC = () => {
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState(0);
  const history = useHistory();
  const {post} = useApi();
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    const response = await post('procedimento', { descricao, duracao });
    if (response.status === 201) {
      history.goBack()
    }
  }, [descricao, duracao, history, post]);

  return (
    <CustomDialog title="Inserir procedimento" open>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          fullWidth
          required
        />
        <TextField
          value={duracao}
          onChange={e => setDuracao(Number(e.target.value))}
          type="number"
          label="Duração em minutos"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 120 }
          }}
          required
        />
        <DialogActions>
          <Button variant="outlined" type="submit">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  )
}
export default FormInsertProcedimento;