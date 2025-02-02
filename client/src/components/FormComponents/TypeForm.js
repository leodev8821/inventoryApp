import React from 'react';

const TypeForm = ({ className = '', ...props }) => (
  <form className={className} {...props} />
);

export default TypeForm;