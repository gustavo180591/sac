import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export default function Denuncias() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    tipo: '',
    barrio: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDenuncias();
  }, [filters]);

  const fetchDenuncias = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/denuncias?${params.toString()}`);
      setDenuncias(response.data);
    } catch (err) {
      setError('Error al cargar las denuncias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      estado: '',
      tipo: '',
      barrio: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800';
      case 'resuelta':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return <ClockIcon className="h-5 w-5" />;
      case 'en_proceso':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'resuelta':
        return <CheckCircleIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Denuncias</h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
              Filtros
            </button>
            <Link
              to="/denuncias/nueva"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Nueva Denuncia
            </Link>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.estado}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelta">Resuelta</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.tipo}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="Robo">Robo</option>
                  <option value="Vandalismo">Vandalismo</option>
                  <option value="Ruidos molestos">Ruidos molestos</option>
                  <option value="Basura">Basura</option>
                  <option value="Iluminación">Iluminación</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="barrio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Barrio
                </label>
                <input
                  type="text"
                  name="barrio"
                  id="barrio"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={filters.barrio}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="fechaDesde"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha desde
                </label>
                <input
                  type="date"
                  name="fechaDesde"
                  id="fechaDesde"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="fechaHasta"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha hasta
                </label>
                <input
                  type="date"
                  name="fechaHasta"
                  id="fechaHasta"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Fecha
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Barrio
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Ver</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {denuncias.map((denuncia) => (
                      <tr key={denuncia.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {denuncia.tipo}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              denuncia.estado
                            )}`}
                          >
                            {getStatusIcon(denuncia.estado)}
                            <span className="ml-1">
                              {denuncia.estado.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(denuncia.fecha).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPinIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {denuncia.barrio}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/denuncias/${denuncia.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ver detalles
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 