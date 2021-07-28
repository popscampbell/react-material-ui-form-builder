import React, { useMemo } from "react";
import { FormControl, InputLabel, Select } from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";

function StandardSelect(props) {
  const { field, form, updateForm } = props;

  const optionConfig = useMemo(
    () => (option) => {
      const config = {
        key: option,
        value: option,
        label: option,
      };

      if (!field.optionConfig) {
        return config;
      }

      config.key = field.optionConfig.key
        ? option[field.optionConfig.key]
        : config.key;
      config.value = field.optionConfig.value
        ? option[field.optionConfig.value]
        : config.value;
      config.label = field.optionConfig.label
        ? option[field.optionConfig.label]
        : config.label;

      return config;
    },
    [field]
  );

  const componentProps = (field) => {
    return {
      native: true,
      margin: "dense",
      inputProps: {
        name: field.attribute,
        id: field.id || field.attribute,
      },
      value: _.get(form, field.attribute),
      onChange: (event) => updateForm(field.attribute, event.target.value),
      label: field.label,
      ...(field.props || {}),
    };
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel margin="dense" htmlFor={field.id || field.attribute}>
        {field.label}
      </InputLabel>
      <Select id={field.id || field.attribute} {...componentProps(field)}>
        <option aria-label="None" value="" />
        {field.options.map((option) => (
          <option
            key={optionConfig(option).key}
            value={optionConfig(option).value}
          >
            {optionConfig(option).label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

StandardSelect.defaultProps = {
  updateForm: () => {},
};

StandardSelect.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardSelect;
