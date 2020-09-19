import { Box, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import React, { memo, useCallback, useState } from 'react';
import { DateField, Form, NameField } from '../../../components/Form';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';

type Filter = "cliente" | "data";

interface FormSearchProps {
  onSubmit: (search: string) => void;
}

const FormSearch: React.FC<FormSearchProps> = ({ onSubmit }) => {
  const [filter, setFilter] = useState<Filter>("data");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleSubmitSearch = useCallback((data) => {
    onSubmit(`${filter}=${data.search}`);
  }, [filter, onSubmit]);

  const getFieldForCurrentFilter = useCallback(() => {
    const props = { name: "search", fullWidth: true, label: `Consultar por ${filter}`, noValidate: true };
    switch (filter) {
      case "cliente": {
        return <NameField {...props} />
      }
      case "data": {
        return <DateField {...props}/>
      }
    }
    return
  }, [filter]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleFilterChange = useCallback((filter: Filter) => {
    setFilter(filter);
    handleClose();
  }, [handleClose]);
  return (
    <Form onSubmit={handleSubmitSearch}>
      <Box display="flex">
        {getFieldForCurrentFilter()}
        <IconButton onClick={handleClick}>
          <Tooltip title="Escolher filtro">
            <FilterListIcon />
          </Tooltip>
        </IconButton>
        <IconButton type="submit">
          <Tooltip title="Consultar">
            <SearchIcon />
          </Tooltip>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Box m={1}>
            <MenuItem onClick={() => handleFilterChange("cliente")}>Cliente</MenuItem>
            <MenuItem onClick={() => handleFilterChange("data")}>Data</MenuItem>
          </Box>
        </Menu>
      </Box>
    </Form>
  );
}

export default memo(FormSearch);