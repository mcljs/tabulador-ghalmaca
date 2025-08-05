import Modal from '@/components/Modal';
import apiService from '@/services/apiService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function panelAdmin() {
  const [open, setOpen] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [status, setStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTracking, setSearchTracking] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const getOrders = async () => {
    try {
      const [ordersData, totalOrders] = await apiService.get('/envios/all');
      setDataUser(ordersData);
      console.log(ordersData, totalOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async () => {
    try {
      const response = await apiService.patch(
        `/envios/actualizarEstadoOrden/${selectedUser.id}`,
        {
          status: status,
        },
      );
      console.log(response);
      toast.success('Estado actualizado correctamente');
      setOpen(false);
      getOrders();
    } catch (error) {
      toast.error('Error al actualizar el estado de la orden');
      console.error(error);
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta orden?')) return;
    
    try {
      await apiService.delete(`/envios/${selectedUser.id}`);
      toast.success('Orden eliminada con éxito');
      setOpen(false);
      getOrders();
    } catch (error) {
      toast.error('Error al eliminar la orden');
      console.error(error);
    }
  };

  const viewComprobante = (imagePath) => {
    // Construir la URL completa de la imagen
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://tabghalmaca.com'}/${imagePath}`;
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setStatus(user.status); // Pre-seleccionar el status actual
    setOpen(true);
  };

  // Función para obtener el color del status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Por Confirmar':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente de Verificación':
        return 'bg-orange-100 text-orange-800';
      case 'Confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'En Proceso':
        return 'bg-purple-100 text-purple-800';
      case 'En Tránsito':
        return 'bg-indigo-100 text-indigo-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'Finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedDataUser = dataUser
    .filter(
      (order) =>
        (filterStatus ? order.status === filterStatus : true) &&
        (searchTracking ? order.trackingNumber.includes(searchTracking) : true),
    )
    .sort((a, b) => {
      // Priorizar órdenes con pago pendiente de verificación
      if (a.status === 'Pendiente de Verificación' && b.status !== 'Pendiente de Verificación') return -1;
      if (a.status !== 'Pendiente de Verificación' && b.status === 'Pendiente de Verificación') return 1;
      if (a.status === 'Finalizado' && b.status !== 'Finalizado') return 1;
      if (a.status !== 'Finalizado' && b.status === 'Finalizado') return -1;
      return new Date(b.createdAt) - new Date(a.createdAt); // Más recientes primero
    });

  return (
    <>
      {/* Modal de detalles de la orden */}
      <Modal open={open} setOpen={setOpen}>
        {selectedUser && (
          <>
            <h1 className="text-center text-xl font-bold mb-4">
              Panel de Actualización - {selectedUser.trackingNumber}
            </h1>
            
            <div className="max-h-96 overflow-y-auto">
              <dl className="space-y-4 border-t border-gray-200 pt-6 text-sm">
                {/* Información del cliente */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-700">Nombre</dt>
                      <dd className="text-gray-600">
                        {selectedUser.user.firstName} {selectedUser.user.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Teléfono</dt>
                      <dd className="text-gray-600">{selectedUser.user.phone}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="font-medium text-gray-700">Email</dt>
                      <dd className="text-gray-600">{selectedUser.user.email}</dd>
                    </div>
                  </div>
                </div>

                {/* Información del envío */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Información del Envío</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-700">Origen</dt>
                      <dd className="text-gray-600 text-xs">{selectedUser.ruteInitial}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Destino</dt>
                      <dd className="text-gray-600 text-xs">{selectedUser.ruteFinish}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Tipo</dt>
                      <dd className="text-gray-600">{selectedUser.esSobre ? 'Sobre' : 'Paquete'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Peso</dt>
                      <dd className="text-gray-600">{selectedUser.peso} kg</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Total a Pagar</dt>
                      <dd className="text-gray-900 font-bold">
                        ${Number(selectedUser.totalAPagar).toFixed(2)} USD
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Información de pago - Solo mostrar si tiene datos de pago */}
                {selectedUser.numeroTransferencia && (
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h3 className="font-medium text-green-900 mb-3">
                      💳 Información de Pago Reportada
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="font-medium text-green-700">Número de Transferencia</dt>
                        <dd className="text-green-800 font-mono">
                          {selectedUser.numeroTransferencia}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-green-700">Banco Emisor</dt>
                        <dd className="text-green-800">{selectedUser.bancoEmisor}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-green-700">Fecha del Pago</dt>
                        <dd className="text-green-800">{selectedUser.fechaPago}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-green-700">Hora del Pago</dt>
                        <dd className="text-green-800">{selectedUser.horaPago}</dd>
                      </div>
                      {selectedUser.comprobantePago && (
                        <div className="col-span-2">
                          <dt className="font-medium text-green-700">Comprobante</dt>
                          <dd>
                            <button
                              onClick={() => viewComprobante(selectedUser.comprobantePago)}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              📄 Ver comprobante de pago
                            </button>
                          </dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actualizar status */}
                <div className="bg-white p-4 border rounded-lg">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Actualizar Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Por Confirmar">Por Confirmar</option>
                    <option value="Pendiente de Verificación">Pendiente de Verificación</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="En Tránsito">En Tránsito</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </dl>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleUpdateOrderStatus}
                className="flex-1 rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Actualizar Status
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                onClick={handleDeleteOrder}
              >
                Eliminar Orden
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Modal para ver imagen del comprobante */}
      <Modal open={showImageModal} setOpen={setShowImageModal}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Comprobante de Pago
          </h3>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Comprobante de pago"
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/placeholder-image.png';
                toast.error('No se pudo cargar la imagen');
              }}
            />
          )}
          <button
            onClick={() => setShowImageModal(false)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      <div className="px-4 sm:px-6 lg:px-8 mt-20">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Gestión de Órdenes de Envío
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Lista de todas las órdenes de envío con información de pago.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar por Tracking"
                value={searchTracking}
                onChange={(e) => setSearchTracking(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Todos los status</option>
                <option value="Por Confirmar">Por Confirmar</option>
                <option value="Pendiente de Verificación">Pendiente de Verificación</option>
                <option value="Confirmado">Confirmado</option>
                <option value="En Proceso">En Proceso</option>
                <option value="En Tránsito">En Tránsito</option>
                <option value="Entregado">Entregado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 lg:overflow-hidden overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                      Cliente
                    </th>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                      Email
                    </th>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                      Total
                    </th>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                      Destino
                    </th>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                      Status
                    </th>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                      Banco/Pago
                    </th>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                      Tracking
                    </th>
                    <th className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredAndSortedDataUser.map((person, personIdx) => (
                    <tr key={person.id} className={person.status === 'Pendiente de Verificación' ? 'bg-orange-50' : ''}>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}>
                        {person.user.firstName} {person.user.lastName}
                        <div className="text-xs text-gray-500">{person.user.phone}</div>
                      </td>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                      )}>
                        {person.user.email}
                      </td>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900'
                      )}>
                        ${Number(person.totalAPagar).toFixed(2)}
                      </td>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'px-3 py-4 text-xs text-gray-500 max-w-32 truncate'
                      )}>
                        {person.ruteFinish}
                      </td>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap px-3 py-4 text-sm'
                      )}>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(person.status)}`}>
                          {person.status}
                        </span>
                      </td>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap px-3 py-4 text-xs text-gray-500'
                      )}>
                        {person.bancoEmisor ? (
                          <div>
                            <div className="font-medium text-green-700">{person.bancoEmisor}</div>
                            <div className="text-gray-500">#{person.numeroTransferencia}</div>
                            {person.comprobantePago && (
                              <button
                                onClick={() => viewComprobante(person.comprobantePago)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                📄 Ver
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin pago</span>
                        )}
                      </td>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap px-3 py-4 text-xs font-mono text-gray-500'
                      )}>
                        {person.trackingNumber}
                      </td>
                      <td className={classNames(
                        personIdx !== dataUser.length - 1 ? 'border-b border-gray-200' : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                      )}>
                        <button
                          onClick={() => handleEditClick(person)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Ver/Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}