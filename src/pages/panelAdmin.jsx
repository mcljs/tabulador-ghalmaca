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
      setOpen(false);
      getOrders();
    } catch (error) {
      toast.error('Error al actualizar el estado de la orden');
      console.error(error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await apiService.delete(`/envios/${selectedUser.id}`);
      console.log('Orden eliminada con éxito');
      setOpen(false);
      getOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const filteredAndSortedDataUser = dataUser
    .filter(
      (order) =>
        (filterStatus ? order.status === filterStatus : true) &&
        (searchTracking ? order.trackingNumber.includes(searchTracking) : true),
    )
    .sort((a, b) => {
      if (a.status === 'Finalizado' && b.status !== 'Finalizado') return 1;
      if (a.status !== 'Finalizado' && b.status === 'Finalizado') return -1;
      return 0;
    });

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        {selectedUser && (
          <>
            <h1 className="text-center text-xl font-bold">
              Panel de Actualizacion
            </h1>
            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Nombre y Apelldio</dt>
                <dd className="text-gray-700">
                  {selectedUser.user.firstName} {selectedUser.user.lastName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Telefono</dt>
                <dd className="text-gray-700">{selectedUser.user.phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Email</dt>
                <dd className="text-gray-700">{selectedUser.user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Ruta Final</dt>
                <dd className="text-gray-700">{selectedUser.ruteFinish}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Tracking</dt>
                <dd className="text-gray-700">{selectedUser.trackingNumber}</dd>
              </div>

              <div className="flex justify-between">
                <dt className=" text-gray-900">Total a Pagar</dt>
                <dd className="text-gray-900 ">
                  {selectedUser.totalAPagar} USD
                </dd>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Status
                </label>
                <select
                  id="location"
                  name="location"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={selectedUser.status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Por Confirmar</option>
                  <option>En Proceso</option>
                  <option>Finalizado</option>
                </select>
                <button
                  type="button"
                  onClick={handleUpdateOrderStatus}
                  className="w-full mt-5 rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                  onClick={handleDeleteOrder}
                >
                  Eliminar Orden
                </button>
              </div>
            </dl>
          </>
        )}
      </Modal>
      <div className="px-4 sm:px-6 lg:px-8 mt-20">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Usuarios
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Es una lista de los usuarios que han realizado pedidos en la
              pagina web.
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
                <option value="En Proceso">En Proceso</option>
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
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Telefono
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Flete
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Total a Paga
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Direccion de Entrega
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Tracking
                    </th>

                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Editar</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredAndSortedDataUser.map((person, personIdx) => (
                    <tr key={personIdx}>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                        )}
                      >
                        {person.user.firstName} {person.user.lastName}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap  px-3 py-4 text-sm text-gray-500 sm:table-cell',
                        )}
                      >
                        {person.user.phone}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap  px-3 py-4 text-sm text-gray-500 sm:table-cell',
                        )}
                      >
                        {person.user.email}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap  px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {Number(person.flete).toFixed(0)}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap  px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {Number(person.totalAPagar).toFixed(2)} USD
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                        )}
                      >
                        {person.ruteFinish}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                        )}
                      >
                        {person.status}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                        )}
                      >
                        {person.trackingNumber}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8',
                        )}
                      >
                        <button
                          onClick={() => handleEditClick(person)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar<span className="sr-only">, {person.name}</span>
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
