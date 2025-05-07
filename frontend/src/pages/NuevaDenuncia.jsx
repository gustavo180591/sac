import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PhotoIcon } from '@heroicons/react/24/outline';

const tiposDenuncia = [
  'Robo',
  'Vandalismo',
  'Ruidos molestos',
  'Basura',
  'Iluminación',
  'Seguridad',
  'Otro'
];

export default function NuevaDenuncia() {
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    direccion: '',
    barrio: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      setError('Máximo 5 archivos permitidos');
      return;
    }

    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setError('Solo se permiten archivos JPEG, PNG, GIF y MP4');
        return false;
      }

      if (file.size > maxSize) {
        setError('El tamaño máximo por archivo es 10MB');
        return false;
      }

      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      files.forEach(file => {
        formDataToSend.append('evidencias', file);
      });

      await axios.post('/api/denuncias', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/denuncias');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la denuncia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Nueva Denuncia</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Información de la Denuncia
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Complete todos los campos requeridos para crear una nueva denuncia.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label
                        htmlFor="tipo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tipo de Denuncia
                      </label>
                      <select
                        id="tipo"
                        name="tipo"
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={formData.tipo}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un tipo</option>
                        {tiposDenuncia.map(tipo => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="descripcion"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Descripción
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="descripcion"
                          name="descripcion"
                          rows={3}
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Describa el problema en detalle"
                          value={formData.descripcion}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="direccion"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Dirección
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="direccion"
                            id="direccion"
                            required
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.direccion}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="barrio"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Barrio
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="barrio"
                            id="barrio"
                            required
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.barrio}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="fecha"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Fecha del Incidente
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="fecha"
                          id="fecha"
                          required
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={formData.fecha}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Evidencias
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Subir archivos</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                multiple
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/jpeg,image/png,image/gif,video/mp4"
                              />
                            </label>
                            <p className="pl-1">o arrastrar y soltar</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF hasta 10MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Archivos seleccionados
                        </h4>
                        <ul className="mt-2 divide-y divide-gray-200">
                          {files.map((file, index) => (
                            <li
                              key={index}
                              className="py-3 flex justify-between items-center"
                            >
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-sm text-red-600 hover:text-red-500"
                              >
                                Eliminar
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Enviar Denuncia'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 