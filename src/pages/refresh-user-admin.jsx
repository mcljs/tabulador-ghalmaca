import Modal from '@/components/Modal';
import apiService from '@/services/apiService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function UserManagementPanel() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    document_type: 'V',
    document_number: '',
    dateOfBirth: '',
    city: '',
    role: 'BASIC',
    password: ''
  });
  const [filterRole, setFilterRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/users/all');
      setUsers(response);
      console.log('Users loaded:', response);
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId) => {
    try {
      const response = await apiService.get(`/users/${userId}`);
      setSelectedUser(response);
      setFormData({
        email: response.email || '',
        username: response.username || '',
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        phone: response.phone || '',
        document_type: response.document_type || 'V',
        document_number: response.document_number || '',
        dateOfBirth: response.dateOfBirth || '',
        city: response.city || '',
        role: response.role || 'BASIC',
        password: response.password || ''
      });
      console.log('User details loaded:', response);
    } catch (err) {
      console.error('Error loading user details:', err);
      toast.error('Error al cargar los detalles del usuario');
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const response = await apiService.put(`/users/${selectedUser.id}`, formData);
      console.log('User updated:', response);
      toast.success('Usuario actualizado correctamente');
      setOpen(false);
      getAllUsers();
    } catch (error) {
      toast.error('Error al actualizar el usuario');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiService.delete(`/users/${selectedUser.id}`);
      console.log('Usuario eliminado con éxito');
      toast.success('Usuario eliminado correctamente');
      setOpen(false);
      getAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleEditClick = async (user) => {
    setOpen(true);
    await getUserById(user.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesSearch = searchQuery 
      ? user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesRole && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        {selectedUser && (
          <>
            <h1 className="text-center text-xl font-bold mb-6">
              Editar Usuario
            </h1>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    name="document_type"
                    value={formData.document_type}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                    <option value="J">J</option>
                    <option value="G">G</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    name="document_number"
                    value={formData.document_number}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder="DD-MM-YYYY"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="BASIC">BASIC</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  disabled={loading}
                  className="flex-1 rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="flex-1 rounded-md bg-red-600 py-2 px-4 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Eliminando...' : 'Eliminar Usuario'}
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <div className="px-4 sm:px-6 lg:px-8 mt-20">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Gestión de Usuarios
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Lista de todos los usuarios registrados en el sistema.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre, email o usuario"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Todos los roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="BASIC">BASIC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 lg:overflow-hidden overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Cargando usuarios...</div>
                </div>
              ) : (
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Nombre Completo
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Usuario
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                      >
                        Teléfono
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Documento
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Ciudad
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Rol
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        F. Creación
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
                    {filteredUsers.map((user, userIdx) => (
                      <tr key={user.id}>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                          )}
                        >
                          {user.firstName} {user.lastName}
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell',
                          )}
                        >
                          {user.username}
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell',
                          )}
                        >
                          {user.email}
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell',
                          )}
                        >
                          {user.phone}
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                          )}
                        >
                          {user.document_type}-{user.document_number}
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                          )}
                        >
                          {user.city}
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                          )}
                        >
                          <span
                            className={classNames(
                              user.role === 'ADMIN'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800',
                              'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                            )}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                          )}
                        >
                          {formatDate(user.createdAt)}
                        </td>
                        <td
                          className={classNames(
                            userIdx !== filteredUsers.length - 1
                              ? 'border-b border-gray-200'
                              : '',
                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8',
                          )}
                        >
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            disabled={loading}
                          >
                            Editar<span className="sr-only">, {user.firstName}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}