import React from 'react';
import Form from 'react-bootstrap/Form';

import { v4 as uuidv4 } from 'uuid';

export default function CheckboxFilter({
  options,
  onRemove,
  onSelect,
  mapping,
}) {
  return options.map((option) => {
    const checked = option.checked;

    return (
      <Form.Check
        key={uuidv4()}
        type="checkbox"
        label={mapping ? mapping[option.value] : option.value}
        checked={option.checked}
        onChange={(e) => {
          if (checked) {
            e.target.checked = false;
            onRemove(option.value);
          } else {
            e.target.checked = true;
            onSelect(option.value);
          }
        }}
      />
    );
  });
}
