import React, { createContext, useContext, useState, useMemo } from 'react';

const SpinnerContext = createContext();

export function SpinnerProvider({ children }) {
  const [isSpinnerShown, setIsSpinnerShown] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState('');

  const showSpinner = (message = '') => {
    setSpinnerMessage(message);
    setIsSpinnerShown(true);
  };

  const hideSpinner = () => {
    setSpinnerMessage('');
    setIsSpinnerShown(false);
  };

  const data = useMemo(() => {
    return { isSpinnerShown, spinnerMessage, showSpinner, hideSpinner };
  }, [isSpinnerShown, spinnerMessage, showSpinner, hideSpinner]);

  return (
    <SpinnerContext.Provider value={data}>{children}</SpinnerContext.Provider>
  );
}

export const useSpinner = () => useContext(SpinnerContext);