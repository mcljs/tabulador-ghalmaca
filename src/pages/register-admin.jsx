import React, { useEffect, useState } from 'react';
import { Field } from '@/components/FormElements';
import DataCountries, { DataVenezuela } from '../Data/countries';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast from 'react-hot-toast';
import apiService from '../services/apiService';
import { useRouter } from 'next/router';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import { useSpinner } from '@/context/SpinnerContext';
import LoadingSpinner from '@/utils/LoadingSpinner';

export default function Register() {
  const history = useRouter();
  const { Id } = history.query;
  const { isSpinnerShown, spinnerMessage, showSpinner, hideSpinner } =
    useSpinner();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');

  const [checkedTerm, setCheckedTerm] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('Caracas');
  const [region, setRegion] = useState('Caracas');
  const [userName, setUserName] = useState('');
  const [documentType, setDocumentType] = useState('V');
  const [documentNumber, setDocumentNumber] = useState('');

  useEffect(() => {
    if (isCPasswordDirty) {
      if (password === cPassword) {
        setShowErrorMessage(false);
      } else {
        setShowErrorMessage(true);
      }
    }
  }, [cPassword]);

  const toggle = () => {
    setEyeOpen(!eyeOpen);
  };

  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setIsCPasswordDirty(true);
  };

  const handleSubmit = async () => {
    showSpinner('Registrando...');
    try {
      await apiService.post('/users/register', {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        phone,
        city: region,
        username: userName,
        document_type: documentType,
        document_number: documentNumber,
        role: 'ADMIN',
      });
      history.push('/login');
      toast.success('Usuario registrado con éxito');
    } catch (error) {
      console.log(error);
      if (error.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al registrar usuario');
      }
    } finally {
      hideSpinner();
    }
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(password);
  };

  console.log(documentType);

  return (
    <>
      {isSpinnerShown && <LoadingSpinner>{spinnerMessage}</LoadingSpinner>}
      <div className="overflow-hidden  bg-cover bg-center py-16 px-4 sm:px-6  lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-xl">
          <div className="rounded-lg bg-white p-8 ">
            <h1 className="text-center text-2xl font-bold text-black">
              REGISTRO
            </h1>
            <div className="mt-12">
              <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="first-name"
                      id="first-name"
                      placeholder="Nombre"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="mt-1">
                    <Field
                      type="text"
                      name="last-name"
                      id="last-name"
                      placeholder="Apellido"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative mt-1">
                    <Field
                      id="password"
                      name="password"
                      type={eyeOpen === false ? 'password' : 'text'}
                      autoComplete="current-password"
                      required
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <div className="absolute top-7 right-5 text-2xl lg:top-8">
                      {eyeOpen === false ? (
                        <EyeSlashIcon className="w-5" onClick={toggle} />
                      ) : (
                        <EyeIcon className="w-5" onClick={toggle} />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="relative mt-1">
                    <Field
                      id="confirm-password"
                      name="confirm-password"
                      type={eyeOpen === false ? 'password' : 'text'}
                      autoComplete="current-password"
                      required
                      placeholder="Confirmar Contraseña"
                      value={cPassword}
                      onChange={handleCPassword}
                    />
                    {showErrorMessage && isCPasswordDirty ? (
                      <div className="mt-3 font-bold text-red-400">
                        {' '}
                        Las contraseñas no coinciden{' '}
                      </div>
                    ) : (
                      ''
                    )}
                    <div className="absolute top-7 right-5 text-2xl lg:top-8">
                      {eyeOpen === false ? (
                        <EyeSlashIcon className="w-5" onClick={toggle} />
                      ) : (
                        <EyeIcon className="w-5" onClick={toggle} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  {validatePassword(password) ? (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            {' '}
                            Contraseña valida{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon
                            className="h-5 w-5 text-yellow-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            La contraseña debe tener al menos 8 caracteres, una
                            mayuscula y un numero{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Fecha de Nacimiento"
                    type="date"
                    id="start"
                    name="trip-start"
                    min="1940-01-01"
                    max="2002-12-31"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                  {dateOfBirth >= '2002-12-31' && (
                    <div className="mt-4 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircleIcon
                            className="h-5 w-5 text-red-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            {' '}
                            Tienes que ser mayor de edad{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <div className="mt-1">
                    <div>
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-slate-900"
                      >
                        Ciudad
                      </label>

                      <select
                        id="region"
                        name="region"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={region}
                        onChange={(event) => setRegion(event.target.value)}
                      >
                        {DataVenezuela[0].regions.map((region) => (
                          <option
                            key={region.shortCode}
                            value={region.shortCode}
                          >
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-1">
                    <Field
                      label="Correo Electronico"
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Correo Electronico"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="mt-1">
                    <Field
                      label="Username"
                      type="text"
                      name="last-name"
                      id="last-name"
                      placeholder="Username"
                      autoComplete="family-name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-1 sm:col-span-2">
                <div className='mb-4'>
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Documento de Identidad
                  </label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <label htmlFor="document" className="sr-only">
                        document
                      </label>
                      <select
                        id="document_type"
                        name="document_type"
                        autoComplete="document_type"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                      >
                        <option>V</option>
                        <option>E</option>
                        <option>P</option>
                        <option>J</option>
                        <option>G</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      name="document_number"
                      id="document_number"
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      className="block w-full rounded-md border-0 py-3 pl-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="Documento de Identidad"
                    />
                  </div>
                </div>
                  <Field
                    label="Telefono"
                    type="number"
                    name="last-name"
                    id="last-name"
                    placeholder="Telefono"
                    autoComplete="family-name"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
        
                <div className="flex w-full items-center sm:col-span-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => setCheckedTerm(!checkedTerm)}
                  />
                  <p className="ml-2  w-full text-sm text-gray-900">
                    Al registrarte aceptas nuestros{' '}
                    <button
                      type="button"
                      onClick={() => setOpenModal(true)}
                      className="font-bold text-slate-800 underline lg:mr-1"
                    >
                      Términos y condiciones{'  '}
                    </button>
                    Declaracion de privacidad
                  </p>
                </div>
           

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    disabled={
                      !firstName ||
                      !lastName ||
                      !validatePassword(password) ||
                      dateOfBirth >= '2002-12-31' ||
                      !email ||
                      phone.length < 7 ||
                      !region ||
                      !dateOfBirth ||
                      checkedTerm ||
                      !cPassword ||
                      (showErrorMessage && isCPasswordDirty)
                    }
                    className="mb-6 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-primary hover:bg-primary/90 transition-colors px-6 py-3 text-base font-medium text-slate-100 shadow-sm focus:outline-none  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    Registrarse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
