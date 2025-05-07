import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enProceso: 0,
    resueltas: 0
  });
  const [recentDenuncias, setRecentDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, denunciasResponse] = await Promise.all([
          axios.get('/api/denuncias/stats'),
          axios.get('/api/denuncias?limit=5')
        ]);

        setStats(statsResponse.data);
        setRecentDenuncias(denunciasResponse.data);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total de Denuncias
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pendientes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pendientes}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        En Proceso
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.enProceso}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Resueltas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.resueltas}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Denuncias */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Denuncias Recientes
            </h2>
            <Link
              to="/denuncias"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Ver todas
            </Link>
          </div>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {recentDenuncias.map((denuncia) => (
                <li key={denuncia.id}>
                  <Link
                    to={`/denuncias/${denuncia.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {denuncia.tipo}
                          </p>
                          <div
                            className={`ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                              denuncia.estado
                            )}`}
                          >
                            <div className="flex items-center">
                              {getStatusIcon(denuncia.estado)}
                              <span className="ml-1">
                                {denuncia.estado.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {new Date(denuncia.fecha).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <MapPinIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {denuncia.barrio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 