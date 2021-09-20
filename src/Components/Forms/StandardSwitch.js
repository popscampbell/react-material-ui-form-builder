import React, { forwardRef, useCallback } from "react";
import {
  Switch,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import _ from "lodash";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";
import Title from "../Widgets/Title";

const useStyles = makeStyles(() => ({
  ml0: {
    marginLeft: 0,
  },
}));

const StandardSwitch = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("mixed", field, form, updateForm);

  const handleSwitchChange = useCallback(
    (checked) => {
      if (checked) {
        updateForm(field.attribute, checked);
      } else {
        updateForm(field.attribute, undefined);
      }
    },
    [updateForm, field.attribute]
  );

  const componentProps = (field) => {
    const isSelected = !!_.get(form, field.attribute);
    return {
      id: field.id || field.attribute,
      key: field.id,
      size: "small",
      color: "primary",
      checked: isSelected,
      onChange: (event) => handleSwitchChange(event.target.checked),
      onBlur: () => validate(_.get(form, field.attribute)),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <FormControl error={errors?.length > 0}>
        <FormControlLabel
          inputRef={ref}
          key={field.id}
          control={<Switch {...componentProps(field)} />}
          label={field.label}
          className={classes.ml0}
          {...field.labelProps}
        />
        <FormHelperText>{errors[0]}</FormHelperText>
      </FormControl>
    </Fragment>
  );
});

StandardSwitch.displayName = "StandardSwitch";

StandardSwitch.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardSwitch.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export default StandardSwitch;
