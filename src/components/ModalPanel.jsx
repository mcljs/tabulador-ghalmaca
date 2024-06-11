import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

export default function ModalPanel({ open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10">
          <div className="flex h-full items-end justify-center p-0 text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="h-[calc(100%-3rem) h-full  w-full items-stretch overflow-y-auto bg-slate-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8  sm:p-6 ">
                <div className="mt-10">
                  <div className="">
                    <div className="mx-auto max-w-4xl divide-y divide-gray-100">
                      <h2 className="text-center text-2xl font-bold leading-10 tracking-tight text-gray-900">
                        Cómo Funciona el Tabulador de Costos de Envío:
                      </h2>
                      <p className="my-5">
                        Nuestro sistema de cálculo de costos de envío utiliza
                        una serie de variables configurables que nos permiten
                        ajustar los precios de manera dinámica y precisa,
                        reflejando los costos operativos reales y ofreciendo
                        tarifas justas tanto para la empresa como para nuestros
                        clientes. A continuación, explicaremos cada una de estas
                        variables:
                      </p>
                      <ul className="list-disc space-y-2 pl-5 text-left">
                        <li>
                          <strong>Costo por Km:</strong> Esta variable determina
                          la tarifa base que se cobra por cada kilómetro
                          recorrido durante el envío. Es una medida directa del
                          costo de transporte y es esencial para calcular el
                          costo total del envío basado en la distancia entre el
                          punto de origen y el destino del paquete.
                        </li>
                        <li>
                          <strong>Costo de Gasolina:</strong> El costo de la
                          gasolina influye directamente en los costos de
                          transporte. Al ajustar este valor, podemos adaptarnos
                          a las fluctuaciones en los precios del combustible,
                          asegurando que el costo de envío refleje de cerca los
                          gastos reales de operación.
                        </li>
                        <li>
                          <strong>Porcentaje de Protección:</strong> Este
                          porcentaje se aplica al valor declarado del paquete y
                          representa el costo adicional por asegurar el envío
                          contra daños o pérdidas. Ajustar este porcentaje
                          permite ofrecer diferentes niveles de protección
                          basados en las necesidades y preferencias del cliente,
                          impactando en el costo final del envío.
                        </li>
                        <li>
                          <strong>Protección Mínima:</strong> Establece el monto
                          mínimo que se cobrará por concepto de protección del
                          paquete, independientemente de su valor declarado.
                          Esto garantiza que todos los envíos tengan un nivel
                          básico de seguro, brindando tranquilidad tanto al
                          remitente como al destinatario.
                        </li>
                        <li>
                          <strong>Franqueo Postal:</strong> Es una tarifa fija
                          que se agrega a todos los envíos para cubrir los
                          costos asociados con los servicios postales
                          adicionales. Este valor puede ser ajustado para
                          reflejar los cambios en los costos operativos o para
                          ofrecer promociones especiales.
                        </li>
                      </ul>
                      <h2 className="mt-12 text-center text-2xl font-bold leading-10 tracking-tight text-gray-900">
                        Aplicación Práctica
                      </h2>
                      <p className="my-5">
                        Cuando se crea una orden de envío o se calcula el costo
                        de un envío mediante nuestro sistema, este utiliza las
                        configuraciones actuales de estas variables para
                        determinar el costo total. Por ejemplo, si se aumenta el
                        costo de la gasolina en la configuración, el costo total
                        del envío aumentará proporcionalmente para reflejar este
                        cambio en los gastos operativos.
                      </p>
                      <p className="mt-3">
                        Esta flexibilidad permite a la administración adaptarse
                        rápidamente a cambios en el mercado y asegurar la
                        sostenibilidad del servicio, manteniendo al mismo tiempo
                        precios justos y competitivos para nuestros clientes.
                      </p>
                      <h2 className="mt-12 text-center text-2xl font-bold leading-10 tracking-tight text-gray-900">
                        Importancia de la Configuración Correcta
                      </h2>
                      <p className="my-5">
                        Es crucial que estas variables se configuren
                        cuidadosamente y se mantengan actualizadas para reflejar
                        con precisión los costos operativos y las condiciones
                        del mercado. Una configuración incorrecta podría
                        resultar en precios de envío no competitivos o en una
                        compensación insuficiente por los costos reales,
                        afectando negativamente tanto a la empresa como a los
                        clientes.
                      </p>
                      <p className="mt-3 mb-16">
                      Nuestro panel de configuración permite a los administradores ajustar estas variables fácilmente, asegurando que nuestro servicio de envíos sea tanto confiable como rentable.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="fixed left-3 top-0 flex  pr-4 pt-4 ">
                  <button
                    type="button"
                    className="text-slate-100   focus:ring-slate-100 rounded-md bg-black focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-auto w-7" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
