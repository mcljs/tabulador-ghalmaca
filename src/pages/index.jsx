import { useSpinner } from '@/context/SpinnerContext';
import LoadingSpinner from '@/utils/LoadingSpinner';
import Hero from '@/views/Landing/Landing';
import React from 'react';

function Landing() {
  const { isSpinnerShown, spinnerMessage, showSpinner, hideSpinner } =
    useSpinner();

  return (
    <>
      {isSpinnerShown && <LoadingSpinner>{spinnerMessage}</LoadingSpinner>}
      <Hero />
    </>
  );
}

export default Landing;
