import { Field } from '@/components/FormElements';
import ModalPanel from '@/components/ModalPanel';
import apiService from '@/services/apiService';
import { useEffect, useState } from 'react';
import { useSpinner } from '@/context/SpinnerContext';
import LoadingSpinner from '@/utils/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function PanelConfing() {
  const { isSpinnerShown, spinnerMessage, showSpinner, hideSpinner } =
    useSpinner();
  const [costoPorKm, setCostoPorKm] = useState('');
  const [costoGasolina, setCostoGasolina] = useState('');
  const [porcentajeProteccion, setPorcentajeProteccion] = useState('');
  const [proteccionMinima, setProteccionMinima] = useState('');
  const [openModalConfig, setOpenModalConfig] = useState(false);

  const obtenerConfiguracion = async () => {
    showSpinner('Cargando configuración...');
    try {
      const response = await apiService.get('/envios/configuracion');
      console.log(response);
      setCostoPorKm(response.costoPorKm);
      setCostoGasolina(response.costoGasolina);
      setPorcentajeProteccion(response.porcentajeProteccion);
      setProteccionMinima(response.proteccionMinima);
    } catch (error) {
      console.error('Error al obtener la configuración', error);
    } finally {
      hideSpinner();
    }
  };

  const actualizarConfiguracion = async () => {
    showSpinner('Actualizando configuración...');
    try {
      const configuracion = {
        costoPorKm,
        costoGasolina,
        porcentajeProteccion,
        proteccionMinima,
      };
      await apiService.patch('/envios/configuracion', configuracion);
      toast.success('Configuración actualizada');
    } catch (error) {
      console.error('Error al actualizar la configuración', error);
      toast.error('Error al actualizar la configuración');
    } finally {
      hideSpinner();
    }
  };

  useEffect(() => {
    obtenerConfiguracion();
  }, []);
  return (
    <>
      {isSpinnerShown && <LoadingSpinner>{spinnerMessage}</LoadingSpinner>}
      <ModalPanel open={openModalConfig} setOpen={setOpenModalConfig} />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="/logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Panel de Configuración
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <p className="mb-8  w-full text-sm text-gray-900">
              Para saber el uso de cada uno de estos campos, por favor
              <button
                type="button"
                onClick={() => setOpenModalConfig(true)}
                className="font-bold text-slate-800 underline lg:mr-1"
              >
                haga clic aquí para ver la documentación ⭠
              </button>
            </p>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                actualizarConfiguracion();
              }}
            >
              <Field
                label="Costo por Km"
                type="number"
                name="costoPorKm"
                id="costoPorKm"
                placeholder="Costo por Km"
                value={costoPorKm}
                onChange={(e) => setCostoPorKm(e.target.value)}
              />
              <Field
                label="Costo por Gasolina"
                type="number"
                name="costoGasolina"
                id="costoGasolina"
                placeholder="Costo por Gasolina"
                value={costoGasolina}
                onChange={(e) => setCostoGasolina(e.target.value)}
              />
              <Field
                label="Porcentaje de protección"
                type="number"
                name="porcentajeProteccion"
                id="porcentajeProteccion"
                placeholder="Porcentaje de protección"
                value={porcentajeProteccion}
                onChange={(e) => setPorcentajeProteccion(e.target.value)}
              />
              <Field
                label="Protección mínima"
                type="number"
                name="proteccionMinimal"
                id="proteccionMinimal"
                placeholder="Protección mínima"
                value={proteccionMinima}
                onChange={(e) => setProteccionMinima(e.target.value)}
              />

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
