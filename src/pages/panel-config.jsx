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

  // Estados para costos de peaje
  const [costoPeajeSusuki, setCostoPeajeSusuki] = useState('');
  const [costoPeajeL300, setCostoPeajeL300] = useState('');
  const [costoPeajeNHR, setCostoPeajeNHR] = useState('');
  const [costoPeajeCanterCorta, setCostoPeajeCanterCorta] = useState('');
  const [costoPeajeCanterLarga, setCostoPeajeCanterLarga] = useState('');
  const [costoPeajePlatforma, setCostoPeajePlatforma] = useState('');
  const [costoPeajePitman, setCostoPeajePitman] = useState('');
  const [costoPeajeChuto, setCostoPeajeChuto] = useState('');

  // Estados para constantes de cálculo
  const [constP1Hasta100Km, setConstP1Hasta100Km] = useState('');
  const [constP2Hasta100Km, setConstP2Hasta100Km] = useState('');
  const [constP1Hasta250Km, setConstP1Hasta250Km] = useState('');
  const [constP2Hasta250Km, setConstP2Hasta250Km] = useState('');
  const [constP1Hasta600Km, setConstP1Hasta600Km] = useState('');
  const [constP2Hasta600Km, setConstP2Hasta600Km] = useState('');
  const [constP1Desde600Km, setConstP1Desde600Km] = useState('');
  const [constP2Desde600Km, setConstP2Desde600Km] = useState('');

  const [openModalConfig, setOpenModalConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const obtenerConfiguracion = async () => {
    showSpinner('Cargando configuración...');
    try {
      const response = await apiService.get('/envios/configuracion');
      console.log(response);
      
      // Configuración general
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

      // Configurar costos de peaje
      setCostoPeajeSusuki(response.costoPeajeSusuki);
      setCostoPeajeL300(response.costoPeajeL300);
      setCostoPeajeNHR(response.costoPeajeNHR);
      setCostoPeajeCanterCorta(response.costoPeajeCanterCorta);
      setCostoPeajeCanterLarga(response.costoPeajeCanterLarga);
      setCostoPeajePlatforma(response.costoPeajePlatforma);
      setCostoPeajePitman(response.costoPeajePitman);
      setCostoPeajeChuto(response.costoPeajeChuto);

      // Configurar constantes de cálculo
      setConstP1Hasta100Km(response.constP1Hasta100Km);
      setConstP2Hasta100Km(response.constP2Hasta100Km);
      setConstP1Hasta250Km(response.constP1Hasta250Km);
      setConstP2Hasta250Km(response.constP2Hasta250Km);
      setConstP1Hasta600Km(response.constP1Hasta600Km);
      setConstP2Hasta600Km(response.constP2Hasta600Km);
      setConstP1Desde600Km(response.constP1Desde600Km);
      setConstP2Desde600Km(response.constP2Desde600Km);
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
        consumoCanterCavaLarga: parseFloat(consumoCanterCavaLarga),
        costoPeajeSusuki: parseFloat(costoPeajeSusuki),
        costoPeajeL300: parseFloat(costoPeajeL300),
        costoPeajeNHR: parseFloat(costoPeajeNHR),
        costoPeajeCanterCorta: parseFloat(costoPeajeCanterCorta),
        costoPeajeCanterLarga: parseFloat(costoPeajeCanterLarga),
        costoPeajePlatforma: parseFloat(costoPeajePlatforma),
        costoPeajePitman: parseFloat(costoPeajePitman),
        costoPeajeChuto: parseFloat(costoPeajeChuto),
        constP1Hasta100Km: parseFloat(constP1Hasta100Km),
        constP2Hasta100Km: parseFloat(constP2Hasta100Km),
        constP1Hasta250Km: parseFloat(constP1Hasta250Km),
        constP2Hasta250Km: parseFloat(constP2Hasta250Km),
        constP1Hasta600Km: parseFloat(constP1Hasta600Km),
        constP2Hasta600Km: parseFloat(constP2Hasta600Km),
        constP1Desde600Km: parseFloat(constP1Desde600Km),
        constP2Desde600Km: parseFloat(constP2Desde600Km),
      };
      await apiService.patch('/envios/configuracion', configuracion);
      toast.success('Configuración actualizada con éxito');
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

  // Renderizar los tabs de configuración
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Porcentaje de protección (%)"
                type="number"
                name="porcentajeProteccion"
                id="porcentajeProteccion"
                placeholder="Porcentaje de protección"
                value={porcentajeProteccion}
                onChange={(e) => setPorcentajeProteccion(e.target.value)}
                min="0.1"
                max="100"
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
                label="Costo por Gasolina ($)"
                type="number"
                name="costoGasolina"
                id="costoGasolina"
                placeholder="Costo por Gasolina"
                value={costoGasolina}
                onChange={(e) => setCostoGasolina(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        );
      case 'hospedaje':
        return (
          <div className="space-y-6">
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
        );
      case 'consumo':
        return (
          <div className="space-y-6">
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
        );
      case 'peajes':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Costos de Peaje por Vehículo</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Susuki ($)"
                type="number"
                name="costoPeajeSusuki"
                id="costoPeajeSusuki"
                placeholder="Costo peaje Susuki"
                value={costoPeajeSusuki}
                onChange={(e) => setCostoPeajeSusuki(e.target.value)}
                min="0"
                step="0.1"
              />
              <Field
                label="L300 ($)"
                type="number"
                name="costoPeajeL300"
                id="costoPeajeL300"
                placeholder="Costo peaje L300"
                value={costoPeajeL300}
                onChange={(e) => setCostoPeajeL300(e.target.value)}
                min="0"
                step="0.1"
              />
              <Field
                label="NHR - Cava Pequeña ($)"
                type="number"
                name="costoPeajeNHR"
                id="costoPeajeNHR"
                placeholder="Costo peaje NHR"
                value={costoPeajeNHR}
                onChange={(e) => setCostoPeajeNHR(e.target.value)}
                min="0"
                step="0.1"
              />
              <Field
                label="Canter - Cava Pequeña ($)"
                type="number"
                name="costoPeajeCanterCorta"
                id="costoPeajeCanterCorta"
                placeholder="Costo peaje Canter Corta"
                value={costoPeajeCanterCorta}
                onChange={(e) => setCostoPeajeCanterCorta(e.target.value)}
                min="0"
                step="0.1"
              />
              <Field
                label="Canter - Cava Larga ($)"
                type="number"
                name="costoPeajeCanterLarga"
                id="costoPeajeCanterLarga"
                placeholder="Costo peaje Canter Larga"
                value={costoPeajeCanterLarga}
                onChange={(e) => setCostoPeajeCanterLarga(e.target.value)}
                min="0"
                step="0.1"
              />
              <Field
                label="Canter - Plataforma ($)"
                type="number"
                name="costoPeajePlatforma"
                id="costoPeajePlatforma"
                placeholder="Costo peaje Plataforma"
                value={costoPeajePlatforma}
                onChange={(e) => setCostoPeajePlatforma(e.target.value)}
                min="0"
                step="0.1"
              />
              <Field
                label="Codiak - Pitman ($)"
                type="number"
                name="costoPeajePitman"
                id="costoPeajePitman"
                placeholder="Costo peaje Pitman"
                value={costoPeajePitman}
                onChange={(e) => setCostoPeajePitman(e.target.value)}
                min="0"
                step="0.1"
              />
              <Field
                label="CHUTO Freightliner ($)"
                type="number"
                name="costoPeajeChuto"
                id="costoPeajeChuto"
                placeholder="Costo peaje CHUTO"
                value={costoPeajeChuto}
                onChange={(e) => setCostoPeajeChuto(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          </div>
        );
      case 'constantes':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Constantes para Cálculos</h3>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Hasta 100 KM</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                <Field
                  label="Constante P1"
                  type="number"
                  name="constP1Hasta100Km"
                  id="constP1Hasta100Km"
                  value={constP1Hasta100Km}
                  onChange={(e) => setConstP1Hasta100Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Field
                  label="Constante P2"
                  type="number"
                  name="constP2Hasta100Km"
                  id="constP2Hasta100Km"
                  value={constP2Hasta100Km}
                  onChange={(e) => setConstP2Hasta100Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Hasta 250 KM</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                <Field
                  label="Constante P1"
                  type="number"
                  name="constP1Hasta250Km"
                  id="constP1Hasta250Km"
                  value={constP1Hasta250Km}
                  onChange={(e) => setConstP1Hasta250Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Field
                  label="Constante P2"
                  type="number"
                  name="constP2Hasta250Km"
                  id="constP2Hasta250Km"
                  value={constP2Hasta250Km}
                  onChange={(e) => setConstP2Hasta250Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Hasta 600 KM</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                <Field
                  label="Constante P1"
                  type="number"
                  name="constP1Hasta600Km"
                  id="constP1Hasta600Km"
                  value={constP1Hasta600Km}
                  onChange={(e) => setConstP1Hasta600Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Field
                  label="Constante P2"
                  type="number"
                  name="constP2Hasta600Km"
                  id="constP2Hasta600Km"
                  value={constP2Hasta600Km}
                  onChange={(e) => setConstP2Hasta600Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-700">Desde 600 KM en adelante</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                <Field
                  label="Constante P1"
                  type="number"
                  name="constP1Desde600Km"
                  id="constP1Desde600Km"
                  value={constP1Desde600Km}
                  onChange={(e) => setConstP1Desde600Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Field
                  label="Constante P2"
                  type="number"
                  name="constP2Desde600Km"
                  id="constP2Desde600Km"
                  value={constP2Desde600Km}
                  onChange={(e) => setConstP2Desde600Km(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[720px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <p className="mb-6 w-full text-sm text-gray-900">
              Para saber el uso de cada uno de estos campos, por favor
              <button
                type="button"
                onClick={() => setOpenModalConfig(true)}
                className="font-bold text-slate-800 underline lg:mr-1 ml-1"
              >
                haga clic aquí para ver la documentación ⭠
              </button>
            </p>

            {/* Tabs de navegación */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'general'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab('hospedaje')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'hospedaje'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Hospedaje
                </button>
                <button
                  onClick={() => setActiveTab('consumo')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'consumo'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Consumo
                </button>
                <button
                  onClick={() => setActiveTab('peajes')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'peajes'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Peajes
                </button>
                <button
                  onClick={() => setActiveTab('constantes')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'constantes'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Constantes
                </button>
              </nav>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                actualizarConfiguracion();
              }}
            >
              {renderTabContent()}

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