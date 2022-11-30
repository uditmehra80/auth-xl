import React from "react";
import { FormGroup, Label, Input } from "reactstrap";

const InputField = (props) => {
  return (
    <FormGroup>
      <Label for={props.for}>{props.label}</Label>
      <Input
        className={props.className}
        type={props.type}
        name={props.name}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      />
    </FormGroup>
  );
};
export default InputField;
