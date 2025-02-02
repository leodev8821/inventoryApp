import React from 'react';

const Button = ({ type = 'button', ...props }) =>  <button type={type} {...props} />;

export default Button;