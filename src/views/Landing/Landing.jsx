import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import apiService from '@/services/apiService';
import { useSpinner } from '@/context/SpinnerContext';
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  Autocomplete,
} from '@react-google-maps/api';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { useAuthContext } from '@/context/AuthContext';
import { CheckIcon, InformationCircleIcon, TruckIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import MoneyIcon from '@/components/icons/MoneyIcon';

export default function Hero() {
  const { showSpinner, hideSpinner } = useSpinner();
  const [distancia, setDistancia] = useState(0);
  // Primero definimos tipoPaquete y luego peso
  const [tipoPaquete, setTipoPaquete] = useState('sobre'); // 'sobre' o 'paquete'
  const [peso, setPeso] = useState(tipoPaquete === 'sobre' ? 0.5 : 1);
  const [tipoArticulo, setTipoArticulo] = useState('Documentos');
  const [valorDeclarado, setValorDeclarado] = useState(0);
  const [map, setMap] = useState();
  const { user } = useAuthContext();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [ModalResult, setModalResult] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [routeDistance, setRouteDistance] = useState(0);

  const [autocompleteOrigin, setAutocompleteOrigin] = useState(null);
  const [autocompleteDestination, setAutocompleteDestination] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [avisoEnvio, setAvisoEnvio] = useState(false);
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now());

  // Nuevos estados para las funcionalidades añadidas
  const [tipoEnvio, setTipoEnvio] = useState('NORMAL');
  const [ancho, setAncho] = useState(20);
  const [alto, setAlto] = useState(15);
  const [largo, setLargo] = useState(10);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Estado derivado para esSobre (para API)
  const esSobre = tipoPaquete === 'sobre';

  // Efecto para manejar el peso default cuando cambia el tipo de paquete
  useEffect(() => {
    if (tipoPaquete === 'sobre') {
      setPeso(Math.min(peso, 1)); // Asegurarnos que no exceda 1kg para sobres
    } else if (peso < 1) {
      setPeso(1); // Para paquetes, mínimo 1kg
    }
  }, [tipoPaquete, peso]);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const createMarker = (location) => {
    if (map) {
      return new window.google.maps.Marker({
        position: location,
        map: map,
      });
    }
    return null;
  };

  const onPlaceChanged = (autocomplete, setLocation, setAddress) => {
    const place = autocomplete.getPlace();
    if (place && place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setLocation(location);
      setAddress(place.formatted_address);
      if (!origin || (origin && !destination)) {
        calculateRoute(origin || location, destination || location);
      }
    } else {
      console.log(
        'No se seleccionó un lugar o falta información de localización.',
      );
    }
  };

  const calculateRoute = (origin, destination) => {
    if (window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        },
      );
    }
  };

  const geocodeCoordinates = (coordinates, setAddress) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coordinates }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          console.log('No se encontraron resultados');
        }
      } else {
        console.log('Geocoder falló debido a: ' + status);
      }
    });
  };

  const onMapClick = (event) => {
    if (directionsResponse) return;

    if (!origin) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setOrigin(location);
      geocodeCoordinates(location, setOriginAddress);
      const marker = createMarker(location);
      setOriginMarker(marker);
    } else if (!destination) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setDestination(location);
      geocodeCoordinates(location, setDestinationAddress);
      const marker = createMarker(location);
      setDestinationMarker(marker);
    }
  };

  useEffect(() => {
    if (origin && destination) {
      if (typeof window !== 'undefined' && window.google) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirectionsResponse(result);
              const distance = result.routes[0].legs[0].distance.value / 1000; // Convertir de metros a kilómetros
              setRouteDistance(distance);
              setDistancia(distance);
            } else {
              console.error(`error fetching directions ${result}`);
            }
          },
        );
      }
    }
  }, [origin, destination]);

  const clearRoute = () => {
    if (originMarker) {
      originMarker.setMap(null); 
    }
    if (destinationMarker) {
      destinationMarker.setMap(null); 
    }
    setOrigin(null); 
    setDestination(null); 
    setOriginMarker(null); 
    setDestinationMarker(null); 
    setDirectionsResponse(null); 
    setOriginAddress('');
    setDestinationAddress('');
    setMapKey(Date.now());
  };

  const handleSubmit = async (event) => {
    showSpinner('Calculando costo de envío...');
    try {
      // Valores que se envían a la API
      const requestData = {
        distancia: routeDistance,
        peso: Number(peso),
        tipoArticulo: tipoArticulo,
        valorDeclarado: Number(valorDeclarado),
        tipoEnvio: tipoEnvio,
        esSobre: esSobre,
      };

      // Si no es un sobre, añadir las dimensiones
      if (!esSobre) {
        requestData.ancho = Number(ancho);
        requestData.alto = Number(alto);
        requestData.largo = Number(largo);
      }

      console.log("Enviando datos:", requestData); // Para depuración
      const response = await apiService.post('/envios/calcularEnvio', requestData);

      toast.success('Costo de envío calculado con éxito');
      console.log(response);
      setModalResult(true);
      setResultData(response);
    } catch (error) {
      console.error("Error al calcular el envío:", error);
      toast.error('Error al calcular el costo de envío: ' + 
        (error.response?.data?.message || 'Verifica los datos ingresados'));
    } finally {
      hideSpinner();
    }
  };

  const crearOrdenEnvio = async () => {
    showSpinner('Creando orden de envío...');
    try {
      // Incluir los nuevos campos en los datos de envío
      const datosEnvio = {
        ...resultData,
        tipoArticulo: resultData.tipoArticulo,
        ruteInitial: originAddress,
        ruteFinish: destinationAddress,
        tipoEnvio: resultData.tipoEnvio,
        esSobre: resultData.esSobre,
      };

      // Añadir dimensiones solo si no es un sobre
      if (!resultData.esSobre) {
        datosEnvio.ancho = resultData.ancho;
        datosEnvio.alto = resultData.alto;
        datosEnvio.largo = resultData.largo;
      }

      const response = await apiService.post(
        '/envios/crearOrdenEnvio',
        datosEnvio,
      );
      console.log(response);
      toast.success('Orden de envío creada con éxito');
      setAvisoEnvio(true);
    } catch (error) {
      console.log(error);
      toast.error('Error al crear la orden de envío');
    } finally {
      hideSpinner();
    }
  };

  const caracasCoordinates = {
    lat: 10.4806,
    lng: -66.9036,
  };

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const autocompleteOptions = {
    componentRestrictions: { country: 'VE' },
  };

  const mapStyles = [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [{ saturation: 0 }, { hue: '#e7ecf0' }],
    },
  ];

  const returnModal = () => {
    setModalResult(false);
    setAvisoEnvio(false);
  }

  // Función para determinar si el botón de calcular debe estar deshabilitado
  const isCalculateButtonDisabled = () => {
    // Validaciones comunes para todos los tipos de envío
    if (!origin || !destination || !valorDeclarado) return true;
    
    // Si es un paquete, validar que tenga dimensiones válidas
    if (tipoPaquete === 'paquete') {
      return !ancho || !alto || !largo;
    }
    
    return false;
  };


  return (
    <>
      <Modal size="lg" open={ModalResult} setOpen={setModalResult}>
        {avisoEnvio ? (
          <>
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Gracias por confiar en nosotros
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    En breve nos pondremos en contacto contigo para coordinar el
                    pago del envío
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => returnModal()}
              >
                Regresar
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-xl font-bold">Detalles del Envío</h1>
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-700">Información del Envío</h2>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">Tipo de Envío</dt>
                  <dd className="text-gray-600">{resultData?.tipoEnvio === 'EXPRESS' ? 'Express' : 'Normal'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Tipo de Artículo</dt>
                  <dd className="text-gray-600">{resultData?.tipoArticulo}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Tipo</dt>
                  <dd className="text-gray-600">{resultData?.esSobre ? 'Sobre' : 'Paquete'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Peso</dt>
                  <dd className="text-gray-600">{resultData?.peso} kg</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Distancia</dt>
                  <dd className="text-gray-600">{resultData?.distancia.toFixed(2)} km</dd>
                </div>
                {!resultData?.esSobre && (
                  <>
                    <div>
                      <dt className="font-medium text-gray-700">Volumen</dt>
                      <dd className="text-gray-600">{resultData?.volumen?.toFixed(4)} m³</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Vehículo Asignado</dt>
                      <dd className="text-gray-600">{resultData?.tipoVehiculo?.replace("_", " ")}</dd>
                    </div>
                  </>
                )}
              </div>
            </div>
            <dl className="space-y-4 border-t border-gray-200 pt-6 mt-6 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Flete</dt>
                <dd className="text-gray-700">
                  ${resultData?.flete?.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">
                  Protección de Encomienda
                </dt>
                <dd className="text-gray-700">
                  ${resultData?.proteccionEncomienda?.toFixed(2)}
                </dd>
              </div>
              {resultData?.costoHospedaje > 0 && (
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-900">Hospedaje</dt>
                  <dd className="text-gray-700">
                    ${resultData?.costoHospedaje?.toFixed(2)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Subtotal</dt>
                <dd className="text-gray-700">
                  ${resultData?.subtotal?.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">IVA</dt>
                <dd className="text-gray-700">
                  ${resultData?.iva?.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Franqueo Postal</dt>
                <dd className="text-gray-700">
                  ${resultData?.franqueoPostal?.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-bold text-gray-900">Total a Pagar</dt>
                <dd className="text-gray-900 font-bold">
                  ${resultData?.totalAPagar?.toFixed(2)}
                </dd>
              </div>
              {user ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    crearOrdenEnvio();
                  }}
                  className="w-full text-center rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Requerir Pago de Envío
                </button>
              ) : (
                <Link
                  type="button"
                  href={`/register`}
                  className="w-full text-center rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Registrate Para Pagar
                </Link>
              )}
            </dl>
          </>
        )}
      </Modal>
      <div className="relative isolate overflow-hidden bg-primary px-6 py-8 sm:py-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <MoneyIcon className="w-12 h-12 mx-auto text-white " />
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl uppercase">
            Calcula un precio
          </h2>
        </div>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center py-20">
        <div className="w-full max-w-2xl">
          <div className="relative bg-white p-8 shadow-md rounded-lg">
            {/* Pestañas para seleccionar el tipo de envío */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Tipo de Envío</h3>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div 
                  className={`flex-1 p-4 border rounded-lg cursor-pointer transition ${tipoEnvio === 'NORMAL' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => setTipoEnvio('NORMAL')}
                >
                  <div className="flex items-center mb-2">
                    <input
                      id="normal"
                      name="tipoEnvio"
                      type="radio"
                      checked={tipoEnvio === 'NORMAL'}
                      onChange={() => setTipoEnvio('NORMAL')}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="normal" className="ml-2 block font-medium text-gray-700">
                      Normal
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Envío según la planificación de rutas semanales.
                  </p>
                </div>
                <div 
                  className={`flex-1 p-4 border rounded-lg cursor-pointer transition ${tipoEnvio === 'EXPRESS' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => setTipoEnvio('EXPRESS')}
                >
                  <div className="flex items-center mb-2">
                    <input
                      id="express"
                      name="tipoEnvio"
                      type="radio"
                      checked={tipoEnvio === 'EXPRESS'}
                      onChange={() => setTipoEnvio('EXPRESS')}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="express" className="ml-2 block font-medium text-gray-700">
                      Express
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Unidad exclusiva para el envío, salida inmediata.
                  </p>
                  {routeDistance > 400 && tipoEnvio === 'EXPRESS' && (
                    <p className="text-xs text-blue-600 mt-2">
                      *Incluye $30 por hospedaje (distancia {`>`} 400km)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pestañas combinadas para tipo de artículo y paquete */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">¿Qué vas a enviar?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition ${tipoPaquete === 'sobre' && tipoArticulo === 'Documentos' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => {
                    setTipoPaquete('sobre');
                    setTipoArticulo('Documentos');
                    setPeso(0.5); // Peso predeterminado para sobres
                  }}
                >
                  <div className="flex items-center mb-2">
                    <DocumentIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <label className="block font-medium text-gray-700">
                      Sobre de Documentos
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Documentos en sobre (máx. 1kg)
                  </p>
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition ${tipoPaquete === 'paquete' && tipoArticulo === 'Documentos' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => {
                    setTipoPaquete('paquete');
                    setTipoArticulo('Documentos');
                    if (peso < 1) setPeso(1);
                  }}
                >
                  <div className="flex items-center mb-2">
                    <DocumentIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <label className="block font-medium text-gray-700">
                      Paquete de Documentos
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Documentos pesados (más de 1kg)
                  </p>
                </div>

                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition ${tipoPaquete === 'paquete' && tipoArticulo === 'Mercancia' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => {
                    setTipoPaquete('paquete');
                    setTipoArticulo('Mercancia');
                    if (peso < 1) setPeso(1);
                  }}
                >
                  <div className="flex items-center mb-2">
                    <TruckIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <label className="block font-medium text-gray-700">
                      Mercancía
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Envío de productos o artículos
                  </p>
                </div>
              </div>
            </div>

            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              libraries={['places']}
            >
              <h3 className="text-lg font-medium mb-4">Ruta del Envío</h3>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Autocomplete
                  onLoad={(autocomplete) => {
                    setAutocompleteOrigin(autocomplete);
                  }}
                  onPlaceChanged={() =>
                    onPlaceChanged(
                      autocompleteOrigin,
                      setOrigin,
                      setOriginAddress,
                    )
                  }
                  options={autocompleteOptions}
                >
                  <div>
                    <label
                      htmlFor="origin"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Punto Inicial
                    </label>
                    <input
                      id="origin"
                      type="text"
                      placeholder="Seleccione origen"
                      value={originAddress}
                      onChange={(e) => setOriginAddress(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                </Autocomplete>

                <Autocomplete
                  onLoad={(autocomplete) => {
                    setAutocompleteDestination(autocomplete);
                  }}
                  onPlaceChanged={() =>
                    onPlaceChanged(
                      autocompleteDestination,
                      setDestination,
                      setDestinationAddress,
                    )
                  }
                  options={autocompleteOptions}
                >
                  <div>
                    <label
                      htmlFor="destination"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Punto Final
                    </label>
                    <input
                      id="destination"
                      type="text"
                      placeholder="Seleccione destino"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                </Autocomplete>
              </div>

              <GoogleMap
                key={mapKey}
                mapContainerStyle={containerStyle}
                center={caracasCoordinates}
                options={{
                  mapTypeId: 'terrain',
                  mapId: '327f00d9bd231a33',
                  styles: mapStyles,
                }}
                zoom={13}
                onClick={onMapClick}
                onLoad={onMapLoad}
              >
                {origin && <Marker position={origin} />}
                {destination && <Marker position={destination} />}
                {directionsResponse && (
                  <DirectionsRenderer directions={directionsResponse} />
                )}
              </GoogleMap>

              {directionsResponse && (
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-600">Distancia: {routeDistance.toFixed(2)} km</span>
                  <button
                    className="text-primary hover:underline focus:outline-none"
                    onClick={clearRoute}
                  >
                    Borrar ruta
                  </button>
                </div>
              )}
            </LoadScript>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Detalles de Envío</h3>
              
              <div className="space-y-6">
                {/* El campo de peso ahora se maneja diferente según el tipo de paquete */}
                {tipoPaquete === 'paquete' && (
           <div>
           <label
             htmlFor="peso"
             className="block text-sm font-medium text-gray-700"
           >
             Peso del paquete (kg)
           </label>
           <input
             id="peso"
             name="peso"
             type="number"
             min="1"
             onChange={(e) => setPeso(e.target.value)}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
           />
         </div>
)}

                {/* Campos para dimensiones (solo visibles si es un paquete) */}
                {tipoPaquete === 'paquete' && (
  <div>
    <h4 className="text-sm font-medium text-gray-700 mb-3">Dimensiones (cm)</h4>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label htmlFor="ancho" className="block text-sm text-gray-700">
          Ancho
        </label>
        <input
          id="ancho"
          name="ancho"
          type="number"
          min="1"
          value={ancho}
          onChange={(e) => setAncho(e.target.value)}
          onBlur={(e) => {
            if (e.target.value === '' || Number(e.target.value) < 1) {
              setAncho(1);
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="alto" className="block text-sm text-gray-700">
          Alto
        </label>
        <input
          id="alto"
          name="alto"
          type="number"
          min="1"
          value={alto}
          onChange={(e) => setAlto(e.target.value)}
          onBlur={(e) => {
            if (e.target.value === '' || Number(e.target.value) < 1) {
              setAlto(1);
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="largo" className="block text-sm text-gray-700">
          Largo
        </label>
        <input
          id="largo"
          name="largo"
          type="number"
          min="1"
          value={largo}
          onChange={(e) => setLargo(e.target.value)}
          onBlur={(e) => {
            if (e.target.value === '' || Number(e.target.value) < 1) {
              setLargo(1);
            }
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>
    </div>
  </div>
)}
            <div>
  <label
    htmlFor="valor-declarado"
    className="block text-sm font-medium text-gray-700"
  >
    Valor declarado (USD)
  </label>
  <input
    id="valor-declarado"
    name="valor-declarado"
    type="number"
    min="1"
    required
    value={valorDeclarado}
    onChange={(e) => setValorDeclarado(e.target.value)}
    onBlur={(e) => {
      if (e.target.value === '' || Number(e.target.value) < 1) {
        setValorDeclarado(1);
      }
    }}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
  />
</div>

                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    disabled={isCalculateButtonDisabled()}
                    className="w-full disabled:opacity-75 rounded-md bg-primary hover:bg-primary/90 transition-colors py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Calcular
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}