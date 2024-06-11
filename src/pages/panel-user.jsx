import Modal from '@/components/Modal';
import { useAuthContext } from '@/context/AuthContext';
import apiService from '@/services/apiService';
import { useEffect, useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function panelUser() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const getOrders = async () => {
    try {
      const response = await apiService.get(
        `/envios/user`,
      );

      setDataUser(response);
      console.log(response);
      return response.orders;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, [user]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  return (
    <>

      <div className="px-4 sm:px-6 lg:px-8 mt-20">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Mis Envios
            </h1>
    
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ordenar
            </button>
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

                 
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {dataUser.map((person, personIdx) => (
                    <tr key={personIdx}>
                  
                   
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap  px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {person.flete}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== dataUser.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap  px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {person.totalAPagar} USD
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
