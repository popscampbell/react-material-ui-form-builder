import React, { forwardRef, Fragment, useCallback, useState } from "react";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { format, parse } from "date-fns";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Schedule } from "@mui/icons-material";
import {
  DesktopTimePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/lab";

const StandardTimePicker = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("date", field.validations);
  const [open, setOpen] = useState();
  const [error, setError] = useState();

  const component = useCallback(
    (props) => {
      if (field.keyboard) {
        return <DesktopTimePicker {...props} />;
      }
      return <MobileTimePicker {...props} />;
    },
    [field.keyboard]
  );

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      sx: {
        my: 0,
      },
      ampm: false,
      inputFormat: "HH:mm:ss",
      label: field.label,
      value: value ? parse(value, "HH:mm:ss", new Date()) : null,
      onChange: (value) => {
        setError();
        if (value) {
          try {
            const formatted = format(value, "HH:mm:ss");
            updateForm({ [field.attribute]: formatted });
          } catch (error) {
            console.log(error);
          }
        } else {
          updateForm({ [field.attribute]: undefined });
        }
      },
      onError: (reason, value) => {
        if (reason === "minTime") {
          setError(
            "Time should not be before " +
              format(field.props.minTime, "HH:mm:ss")
          );
        }
        if (reason === "maxTime") {
          setError(
            "Time should not be after " +
              format(field.props.maxTime, "HH:mm:ss")
          );
        }
      },
      renderInput: (params) => (
        <TextField
          fullWidth
          size="small"
          {...params}
          onClick={() => setOpen(true)}
          error={!!error || errors.length > 0}
          helperText={error || errors[0]}
        />
      ),
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open time picker" size="large">
              <Schedule />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          paddingRight: 0,
        },
      },
      onBlur: () =>
        validate(value ? parse(value, "HH:mm:ss", new Date()) : value),
      onKeyDown: (event) => {
        if (event.which === 13) {
          validate(value ? parse(value, "HH:mm:ss", new Date()) : value);
        }
      },
      open: !!open,
      onClose: () => setOpen(),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <div
        ref={(el) => {
          if (el && ref) {
            el.validate = (value) =>
              validate(value ? parse(value, "HH:mm:ss", new Date()) : value);
            ref(el);
          }
        }}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          {component(componentProps(field))}
        </LocalizationProvider>
      </div>
    </Fragment>
  );
});

StandardTimePicker.displayName = "StandardTimePicker";

StandardTimePicker.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardTimePicker.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardTimePicker };
