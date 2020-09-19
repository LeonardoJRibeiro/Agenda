import React, { memo, useRef, useCallback, useEffect, useState } from 'react';
import useField from '../../Hooks/useField';
import { DatePickerViewsProps, KeyboardDatePicker, KeyboardDatePickerProps } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { da } from 'date-fns/locale';

interface DateFieldProps extends DatePickerViewsProps {
  name: string,
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  format?: string;
  onChange?: (date: MaterialUiPickersDate, value?: string | null | undefined) => void;
}


interface Ref {
  value: Date | string;
}

const DateField: React.FC<DateFieldProps> = ({ name, onChange, ...props }) => {
  const [valid, setValid] = useState<boolean>(true);
  const [value, setValue] = useState<Date>(new Date());
  const ref = useRef<Ref>({} as Ref);
  const inputRef = useRef<HTMLInputElement>();
  const { registerField, fieldName, defaultValue } = useField(name);

  ref.current.value = value;

  const validate = useCallback(() => {
    if (ref && ref.current) {
      if (!props.required && !Number.isNaN(new Date(ref.current.value).getTime())) {
        return true;
      }
      if (!Number.isNaN(new Date(ref.current.value).getTime()) && ref.current.value) {
        setValid(true);
        return (true);
      }
      else {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setValid(false);
        return (false);
      }
    }
    else {
      throw new Error("");

    }
  }, [props.required]);

  const clear = useCallback(() => {
    setValue(new Date());
    setValid(true);
  }, [])

  useEffect(() => {
    registerField({
      validate,
      ref: ref.current,
      name: fieldName,
      path: "value",
      clear
    });
  }, [clear, fieldName, registerField, validate]);

  useEffect(() => {
    if (defaultValue) {
      const value = new Date(defaultValue)
      setValue(value);
      ref.current.value = value;
    }
  }, [defaultValue]);

  const handleChange = useCallback((date: MaterialUiPickersDate, value?: string | null | undefined) => {
    ref.current.value = date as Date;
    if (!valid) {
      validate();
    }
    setValue(date as Date);
    if (onChange) {
      onChange(date, value);
    }
  }, [value, valid, validate, onChange]);

  return (
    <KeyboardDatePicker
      value={value}
      onChange={handleChange}
      format="dd/MM/yyyy"
      error={!valid}
      invalidDateMessage="Formato de data inválido."
      inputRef={inputRef}
      {...props}
    />
  );
}

export default memo(DateField);