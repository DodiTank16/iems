import React from 'react';
import { useSelector } from 'react-redux';

// Render an alert message if alert state is changed
const Alert = () => {
  const alerts = useSelector((state) => state.Alert);
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(({ id, msg, alertType }) => {
      return (
        <div
          tabIndex='-1'
          key={id}
          className={'alert alert-' + alertType}
          role='alert'
        >
          {msg}
        </div>
      );
    })
  );
};

export default Alert;
