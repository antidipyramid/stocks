import React from 'react';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';

export default function GraphOptions({ options }) {
  const handleSelect = (eventKey) => console.log(eventKey);

  return (
    <Nav onSelect={handleSelect}>
      {options.map((option) => {
        return (
          <Dropdown as={NavItem}>
            <Dropdown.Toggle as={NavLink}>
              <b>{option.title}</b>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {option.dropdown.map((o, i) => (
                <Dropdown.Item key={i} onClick={() => option.update(o)}>
                  {o}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        );
      })}
    </Nav>
  );
}

GraphOptions.propTypes = {
  options: PropTypes.object,
};
