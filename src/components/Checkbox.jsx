import React from "react";

const Checkbox = ({ id, type, name, handleClick, isChecked,className }) => {
  return (
    <input
      className={className}
      id={id}
      name={name}
      type={type}
      onChange={handleClick}
      checked={isChecked}
    />
  );
};

export default Checkbox;