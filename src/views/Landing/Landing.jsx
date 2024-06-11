import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
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
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import MoneyIcon from '@/components/icons/MoneyIcon';

export default function Hero() {
  const { showSpinner, hideSpinner } = useSpinner();
  const [distancia, setDistancia] = useState(0);
  const [peso, setPeso] = useState(0);
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
      const response = await apiService.post('/envios/calcularEnvio', {
        distancia: routeDistance,
        peso,
        tipoArticulo: tipoArticulo,
        valorDeclarado,
      });

      toast.success('Costo de envío calculado con éxito');
      console.log(response);
      setModalResult(true);
      setResultData(response);
    } catch (error) {
      toast.error('Error al calcular el costo de envío');
    } finally {
      hideSpinner();
    }
  };

  const crearOrdenEnvio = async () => {
    showSpinner('Creando orden de envío...');
    try {
     
      const datosEnvio = {
        ...resultData, // Esto incluirá distancia, peso, valorDeclarado, flete, etc.
        tipoArticulo: resultData.tipoArticulo,
        ruteInitial: originAddress,
        ruteFinish: destinationAddress,
      };

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

  useEffect(() => {}, []);

  const containerStyle = {
    width: '100%',
    height: '500px',
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
            <h1 className="text-center text-xl font-bold">Calculo</h1>
            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
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
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              libraries={['places']}
            >
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
                    placeholder="Punto Inicial"
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
                <div className="my-5">
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Punto Final
                  </label>
                  <input
                    id="destination"
                    type="text"
                    placeholder="Punto Final"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </Autocomplete>

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
            </LoadScript>

            <button
              className="w-full rounded-md bg-secondary my-5 py-2 px-4 text-black  focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              onClick={clearRoute}
            >
              Borrar Ruta
            </button>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="peso"
                  className="block text-sm font-medium text-gray-700"
                >
                  Peso (kg)
                </label>
                <input
                  id="peso"
                  name="peso"
                  type="number"
                  required
                  onChange={(e) => setPeso(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="tipo-articulo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo de artículo
                </label>
                <select
                  id="tipo-articulo"
                  name="tipo-articulo"
                  required
                  onChange={(e) => setTipoArticulo(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <option value="Documentos">Documentos</option>
                  <option value="Mercancia">Mercancía</option>
                </select>
              </div>

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
                  required
                  onChange={(e) => setValorDeclarado(e.target.value)}
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
                  disabled={!origin || !destination || !peso || !valorDeclarado}
                  className="w-full disabled:opacity-75 rounded-md bg-primary hover:bg-primary/90 transition-colors py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Calcular
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
