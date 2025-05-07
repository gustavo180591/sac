import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function DenunciaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [denuncia, setDenuncia] = useState(null);
  const [evidencias, setEvidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchDenuncia = async () => {
      try {
        const [denunciaResponse, evidenciasResponse] = await Promise.all([
          axios.get(`/api/denuncias/${id}`),
          axios.get(`/api/denuncias/${id}/evidencias`)
        ]);

        setDenuncia(denunciaResponse.data);
        setEvidencias(evidenciasResponse.data);
      } catch (err) {
        setError('Error al cargar los detalles de la denuncia');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDenuncia();
  }, [id]);

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

  const isImage = (file) => {
    return file.tipo.startsWith('image/');
  };

  const isVideo = (file) => {
    return file.tipo.startsWith('video/');
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

  if (!denuncia) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Denuncia no encontrada
        </h3>
        <div className="mt-6">
          <button
            onClick={() => navigate('/denuncias')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Volver a denuncias
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Detalles de la Denuncia
          </h1>
          <button
            onClick={() => navigate('/denuncias')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Volver
          </button>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {denuncia.tipo}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Denuncia #{denuncia.id}
                </p>
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  denuncia.estado
                )}`}
              >
                {getStatusIcon(denuncia.estado)}
                <span className="ml-1">
                  {denuncia.estado.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(denuncia.fecha).toLocaleDateString()}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {denuncia.descripcion}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {denuncia.direccion}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Barrio</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <MapPinIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {denuncia.barrio}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {evidencias.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Evidencias
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {evidencias.map((evidencia) => (
                <div
                  key={evidencia.id}
                  className="relative group"
                  onClick={() => isImage(evidencia) && setSelectedImage(evidencia)}
                >
                  <div className="aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden">
                    {isImage(evidencia) ? (
                      <img
                        src={evidencia.url}
                        alt="Evidencia"
                        className="object-cover"
                      />
                    ) : isVideo(evidencia) ? (
                      <video
                        src={evidencia.url}
                        controls
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      {isImage(evidencia) ? (
                        <PhotoIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="ml-2 text-sm text-gray-500">
                        {evidencia.nombre}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setSelectedImage(null)}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <img
                    src={selectedImage.url}
                    alt="Evidencia"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 