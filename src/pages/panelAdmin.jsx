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

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [loading, setLoading] = useState(false);

  // Función para obtener órdenes con paginación
  const getOrders = async (page = 1, limit = itemsPerPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(filterStatus && { status: filterStatus }),
        ...(searchTracking && { trackingNumber: searchTracking }),
      };
      
      const [ordersData, total] = await apiService.get('/envios/all', { params });
      setDataUser(ordersData);
      setTotalOrders(total);
      setCurrentPage(page);
      
      console.log(`📋 Página ${page}: ${ordersData.length} órdenes de ${total} total`);
    } catch (err) {
      toast.error('Error al cargar las órdenes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalOrders / itemsPerPage)) {
      getOrders(newPage, itemsPerPage);
    }
  };

  // Función para cambiar filtros (reinicia a página 1)
  const handleFilterChange = () => {
    getOrders(1, itemsPerPage);
  };

  // Función para búsqueda con debounce
  const handleSearchChange = (e) => {
    setSearchTracking(e.target.value);
    // Buscar después de una pausa (debounce)
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleFilterChange();
    }, 500);
  };

  // Función para filtro de status
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    handleFilterChange();
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
      getOrders(currentPage, itemsPerPage); // Recargar página actual
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
      getOrders(currentPage, itemsPerPage); // Recargar página actual
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
    getOrders(1, itemsPerPage);
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

  // Calcular información de paginación
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalOrders);

  return (
    <>
      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600 text-center">Cargando órdenes...</p>
          </div>
        </div>
      )}

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
              Lista de todas las órdenes de envío con información de pago. Total: {totalOrders} órdenes
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar por Tracking"
                value={searchTracking}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <select
                value={filterStatus}
                onChange={handleStatusFilterChange}
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
                  {dataUser.map((person, personIdx) => (
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

        {/* Información y controles de paginación */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startItem}</span> a{' '}
                <span className="font-medium">{endItem}</span> de{' '}
                <span className="font-medium">{totalOrders}</span> resultados
              </p>
              
              {/* Selector de elementos por página */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  setItemsPerPage(newLimit);
                  getOrders(1, newLimit);
                }}
                className="rounded-md border-gray-300 text-sm"
              >
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
            </div>
            
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                {/* Botón Anterior */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  ←
                </button>
                
                {/* Números de página */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === pageNum
                          ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {/* Botón Siguiente */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}