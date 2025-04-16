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
  const [franqueoPostal, setFranqueoPostal] = useState('');
  const [costoHospedaje, setCostoHospedaje] = useState('');
  const [aplicableHospedaje, setAplicableHospedaje] = useState('EXPRESS');
  
  // Estados para consumo de combustible
  const [consumoSusukiEECO, setConsumoSusukiEECO] = useState('');
  const [consumoMitsubishiL300, setConsumoMitsubishiL300] = useState('');
  const [consumoNHR, setConsumoNHR] = useState('');
  const [consumoCanterCavaCorta, setConsumoCanterCavaCorta] = useState('');
  const [consumoCanterCavaLarga, setConsumoCanterCavaLarga] = useState('');

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
      setFranqueoPostal(response.franqueoPostal);
      setCostoHospedaje(response.costoHospedaje);
      setAplicableHospedaje(response.aplicableHospedaje || 'EXPRESS');
      
      // Configurar consumo de combustible
      setConsumoSusukiEECO(response.consumoSusukiEECO);
      setConsumoMitsubishiL300(response.consumoMitsubishiL300);
      setConsumoNHR(response.consumoNHR);
      setConsumoCanterCavaCorta(response.consumoCanterCavaCorta);
      setConsumoCanterCavaLarga(response.consumoCanterCavaLarga);
    } catch (error) {
      console.error('Error al obtener la configuración', error);
      toast.error('Error al cargar la configuración');
    } finally {
      hideSpinner();
    }
  };

  const actualizarConfiguracion = async () => {
    showSpinner('Actualizando configuración...');
    try {
      const configuracion = {
        costoPorKm: parseFloat(costoPorKm),
        costoGasolina: parseFloat(costoGasolina),
        porcentajeProteccion: parseFloat(porcentajeProteccion),
        proteccionMinima: parseFloat(proteccionMinima),
        franqueoPostal: parseFloat(franqueoPostal),
        costoHospedaje: parseFloat(costoHospedaje),
        aplicableHospedaje,
        consumoSusukiEECO: parseFloat(consumoSusukiEECO),
        consumoMitsubishiL300: parseFloat(consumoMitsubishiL300),
        consumoNHR: parseFloat(consumoNHR),
        consumoCanterCavaCorta: parseFloat(consumoCanterCavaCorta),
        consumoCanterCavaLarga: parseFloat(consumoCanterCavaLarga)
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

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[600px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <p className="mb-8 w-full text-sm text-gray-900">
              Para saber el uso de cada uno de estos campos, por favor
              <button
                type="button"
                onClick={() => setOpenModalConfig(true)}
                className="font-bold text-slate-800 underline lg:mr-1 ml-1"
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
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Configuración General</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Costo por Km"
                    type="number"
                    name="costoPorKm"
                    id="costoPorKm"
                    placeholder="Costo por Km"
                    value={costoPorKm}
                    onChange={(e) => setCostoPorKm(e.target.value)}
                    min="0"
                    step="0.001"
                  />
                  <Field
                    label="Costo por Gasolina"
                    type="number"
                    name="costoGasolina"
                    id="costoGasolina"
                    placeholder="Costo por Gasolina"
                    value={costoGasolina}
                    onChange={(e) => setCostoGasolina(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Field
                    label="Porcentaje de protección"
                    type="number"
                    name="porcentajeProteccion"
                    id="porcentajeProteccion"
                    placeholder="Porcentaje de protección"
                    value={porcentajeProteccion}
                    onChange={(e) => setPorcentajeProteccion(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Field
                    label="Protección mínima ($)"
                    type="number"
                    name="proteccionMinima"
                    id="proteccionMinima"
                    placeholder="Protección mínima"
                    value={proteccionMinima}
                    onChange={(e) => setProteccionMinima(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                  <Field
                    label="Franqueo Postal ($)"
                    type="number"
                    name="franqueoPostal"
                    id="franqueoPostal"
                    placeholder="Franqueo Postal"
                    value={franqueoPostal}
                    onChange={(e) => setFranqueoPostal(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Configuración de Hospedaje</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Costo de Hospedaje ($)"
                    type="number"
                    name="costoHospedaje"
                    id="costoHospedaje"
                    placeholder="Costo de Hospedaje"
                    value={costoHospedaje}
                    onChange={(e) => setCostoHospedaje(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Aplicable a
                    </label>
                    <select
                      id="aplicableHospedaje"
                      name="aplicableHospedaje"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={aplicableHospedaje}
                      onChange={(e) => setAplicableHospedaje(e.target.value)}
                    >
                      <option value="EXPRESS">Solo envíos Express</option>
                      <option value="TODOS">Todos los envíos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Consumo de Combustible</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Susuki EECO"
                    type="number"
                    name="consumoSusukiEECO"
                    id="consumoSusukiEECO"
                    placeholder="Consumo Susuki EECO"
                    value={consumoSusukiEECO}
                    onChange={(e) => setConsumoSusukiEECO(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Field
                    label="Mitsubishi L300"
                    type="number"
                    name="consumoMitsubishiL300"
                    id="consumoMitsubishiL300"
                    placeholder="Consumo Mitsubishi L300"
                    value={consumoMitsubishiL300}
                    onChange={(e) => setConsumoMitsubishiL300(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Field
                    label="NHR"
                    type="number"
                    name="consumoNHR"
                    id="consumoNHR"
                    placeholder="Consumo NHR"
                    value={consumoNHR}
                    onChange={(e) => setConsumoNHR(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Field
                    label="Canter Cava Corta"
                    type="number"
                    name="consumoCanterCavaCorta"
                    id="consumoCanterCavaCorta"
                    placeholder="Consumo Canter Cava Corta"
                    value={consumoCanterCavaCorta}
                    onChange={(e) => setConsumoCanterCavaCorta(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <Field
                    label="Canter Cava Larga"
                    type="number"
                    name="consumoCanterCavaLarga"
                    id="consumoCanterCavaLarga"
                    placeholder="Consumo Canter Cava Larga"
                    value={consumoCanterCavaLarga}
                    onChange={(e) => setConsumoCanterCavaLarga(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Actualizar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}