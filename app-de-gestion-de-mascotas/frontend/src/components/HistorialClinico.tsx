import React, { useEffect, useState } from 'react';
import { ChevronLeft, Plus, X, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';

interface HistorialClinicoProps {
  onBack: () => void;
}

interface Mascota {
  id: number;
  nombre: string;
  foto?: string;
}

interface EventoClinico {
  id: number;
  fecha: string;
  tipo: 'Vacuna' | 'Dieta' | 'Actividad' | 'Conducta' | 'Control';
  detalle: string;
  estado: 'Normal' | 'Alerta' | 'Seguimiento finalizado';
  fecha_creacion: string;
}

interface HistorialClinico {
  id: number;
  mascota_id: number;
  nombre_mascota: string;
  foto_mascota?: string;
  nota_inicial: string;
  fecha_creacion: string;
  eventos: EventoClinico[];
}

export function HistorialClinico({ onBack }: HistorialClinicoProps) {
  const { colors } = useTheme();
  const [historiales, setHistoriales] = useState<HistorialClinico[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form states (Create)
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [petHasHistory, setPetHasHistory] = useState<boolean>(false);
  const [notaInicial, setNotaInicial] = useState<string>('');
  const [showFullForm, setShowFullForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    fecha: string;
    tipo: 'Vacuna' | 'Dieta' | 'Actividad' | 'Conducta' | 'Control';
    detalle: string;
    estado: 'Normal' | 'Alerta' | 'Seguimiento finalizado';
  }>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Vacuna',
    detalle: '',
    estado: 'Normal'
  });

  // Edit states
  const [editingHistorialId, setEditingHistorialId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [showNewNoteForm, setShowNewNoteForm] = useState<boolean>(false);
  const [newEventData, setNewEventData] = useState<any>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Control',
    detalle: '',
    estado: 'Normal'
  });
  const [editEventData, setEditEventData] = useState<any>({
    fecha: '',
    tipo: 'Control',
    detalle: '',
    estado: 'Normal'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [historialesData, mascotasData] = await Promise.all([
        apiService.getHistoriales(),
        apiService.getMascotas()
      ]);
      setHistoriales(historialesData);
      setMascotas(mascotasData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePetSelect = async (petId: number) => {
    setSelectedPetId(petId);
    setPetHasHistory(false);
    setNotaInicial('');
    setShowFullForm(false);

    if (petId) {
      try {
        const result = await apiService.checkPetHasHistory(petId);
        setPetHasHistory(result.hasHistory);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleNotaInicialChange = (value: string) => {
    setNotaInicial(value);
    if (value.trim() && !petHasHistory) {
      setShowFullForm(true);
    } else {
      setShowFullForm(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!selectedPetId || !notaInicial.trim() || !formData.detalle.trim()) {
      return;
    }

    try {
      await apiService.createHistorial({
        mascota_id: selectedPetId,
        nota_inicial: notaInicial,
        primer_evento: formData
      });

      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el historial clínico');
    }
  };

  const resetForm = () => {
    setSelectedPetId(null);
    setPetHasHistory(false);
    setNotaInicial('');
    setShowFullForm(false);
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Vacuna',
      detalle: '',
      estado: 'Normal'
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Edit functions
  const handleStartEdit = (historial: HistorialClinico) => {
    setEditingHistorialId(historial.id);
    setEditingEventId(null);
  };

  const handleCancelEdit = () => {
    setEditingHistorialId(null);
    setEditingEventId(null);
    setShowNewNoteForm(false);
  };

  const handleEditEvent = (evento: EventoClinico) => {
    setEditingEventId(evento.id);
    setEditEventData({
      fecha: evento.fecha.split('T')[0],
      tipo: evento.tipo,
      detalle: evento.detalle,
      estado: evento.estado
    });
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    try {
      await apiService.deleteEvento(eventId);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el evento');
    }
  };

  const handleUpdateEvent = async (e: any) => {
    e.preventDefault();
    if (!editingEventId) return;
    try {
      await apiService.updateEvento(editingEventId, editEventData);
      setEditingEventId(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el evento');
    }
  };


  const isFormValid = selectedPetId && !petHasHistory && notaInicial.trim() && formData.detalle.trim();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Alerta': return '#f97316'; // Orange
      case 'Seguimiento finalizado': return '#000000'; // Black
      case 'Normal': return '#22c55e'; // Green
      default: return '#3b82f6'; // Blue
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Vacuna': return '💉';
      case 'Dieta': return '🍖';
      case 'Actividad': return '🏃';
      case 'Conducta': return '🧠';
      case 'Control': return '📋';
      default: return '📝';
    }
  };

  return (
    <div className={`${colors.cardBg} rounded-3xl shadow-sm p-6 w-full min-h-[600px]`}>
      <style>
        {`
          .custom-edit-btn:hover {
            background-color: #FACC15 !important; 
            border: 2px solid black !important;
            border-radius: 2px !important;
          }
          .custom-edit-btn:hover svg {
            color: black !important;
          }
          .custom-delete-btn:hover {
            background-color: #EF4444 !important;
            border: 2px solid black !important;
            border-radius: 2px !important;
          }
          .custom-delete-btn:hover svg {
            color: white !important;
          }
          .new-note-btn:hover {
            border: 2px solid black !important;
          }
          .finalize-btn {
            background-color: #10B981 !important;
            color: white !important;
            border: 2px solid transparent !important;
          }
          .finalize-btn:hover {
            background-color: white !important;
            color: #10B981 !important;
            border: 2px solid #10B981 !important;
          }
        `}
      </style>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={editingHistorialId ? handleCancelEdit : onBack}
          className={`p-2 ${colors.secondary} ${colors.secondaryHover} rounded-xl transition-colors`}
        >
          <ChevronLeft className={`w-6 h-6 ${colors.text}`} />
        </button>
        <div className="flex-1">
          <h1 className={`${colors.text} font-bold text-xl`}>Historial Clínico</h1>
          <p className={colors.textSecondary}>Registros de salud de tus mascotas</p>
        </div>
        <button
          onClick={() => setShowModal(!showModal)}
          className={`${colors.primary} ${colors.primaryHover} text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg font-bold`}
        >
          {showModal ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showModal ? 'Cerrar Formulario' : 'Agregar Registro'}
        </button>
      </div>

      {/* Form Panel - Now at the Top */}
      {showModal && (
        <div className={`mb-8 p-5 ${colors.inputBg} rounded-2xl border ${colors.inputBorder} max-h-[600px] overflow-y-auto shadow-inner`}>
          {/* Form Header */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <h2 className={`${colors.text} font-bold text-lg`}>Nuevo Registro Clínico</h2>
            <p className={`${colors.textSecondary} text-xs italic`}>Completa los datos para iniciar el historial</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pet Selector */}
            <div>
              <label className={`block mb-1.5 text-sm font-bold ${colors.text}`}>
                Mascota <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPetId || ''}
                onChange={(e) => handlePetSelect(Number(e.target.value))}
                className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} shadow-sm focus:ring-2 focus:ring-blue-500 transition-all`}
                required
              >
                <option value="">Seleccionar mascota...</option>
                {mascotas.length === 0 ? (
                  <option disabled>No hay mascotas registradas</option>
                ) : (
                  mascotas.map((mascota) => (
                    <option key={mascota.id} value={mascota.id}>
                      {mascota.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Warning for pet with existing history */}
            {petHasHistory && (
              <div className="flex items-start gap-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl my-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-400 text-sm font-bold">
                  Esta mascota ya cuenta con historial clínico. Selecciona otra.
                </p>
              </div>
            )}

            {/* Info message when no pets */}
            {mascotas.length === 0 && (
              <div className="flex items-start gap-2 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-500 rounded-xl my-2">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  Registra una mascota primero en la sección "Mis Mascotas".
                </p>
              </div>
            )}

            {/* Nota Inicial */}
            <div>
              <label className={`block mb-1.5 text-sm font-bold ${colors.text}`}>
                Nota Inicial <span className="text-red-500">*</span>
              </label>
              <textarea
                value={notaInicial}
                onChange={(e) => handleNotaInicialChange(e.target.value)}
                disabled={!selectedPetId || petHasHistory}
                className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} min-h-[80px] shadow-sm focus:ring-2 focus:ring-blue-500 transition-all ${(!selectedPetId || petHasHistory) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                placeholder="Motivo de inicio del historial..."
                required
              />
            </div>

            {/* Full Form - Only shown when nota inicial is filled */}
            {showFullForm && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha */}
                  <div>
                    <label className={`block mb-1.5 text-sm font-bold ${colors.text}`}>
                      📅 Fecha <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} shadow-sm focus:ring-2 focus:ring-blue-500 transition-all`}
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className={`block mb-1.5 text-sm font-bold ${colors.text}`}>
                      🏷️ Tipo <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                      className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} shadow-sm focus:ring-2 focus:ring-blue-500 transition-all`}
                      required
                    >
                      <option value="Vacuna">💉 Vacuna</option>
                      <option value="Dieta">🍖 Dieta</option>
                      <option value="Actividad">🏃 Actividad</option>
                      <option value="Conducta">🧠 Conducta</option>
                      <option value="Control">📋 Control</option>
                    </select>
                  </div>
                </div>

                {/* Detalle */}
                <div>
                  <label className={`block mb-1.5 text-sm font-bold ${colors.text}`}>
                    📝 Detalle del Registro <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.detalle}
                    onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
                    className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} min-h-[80px] shadow-sm focus:ring-2 focus:ring-blue-500 transition-all`}
                    placeholder="Detalles específicos..."
                    required
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className={`block mb-1.5 text-sm font-bold ${colors.text}`}>
                    ⭐ Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                    className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} shadow-sm focus:ring-2 focus:ring-blue-500 transition-all`}
                    required
                  >
                    <option value="Normal">Normal</option>
                    <option value="Alerta">Alerta</option>
                    <option value="Seguimiento finalizado">Seguimiento finalizado</option>
                  </select>
                </div>
              </div>
            )}

            {/* Buttons - Sticky at bottom of the panel */}
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-inherit pb-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className={`flex-1 p-3 rounded-xl ${colors.secondary} ${colors.textSecondary} font-bold border border-transparent hover:border-gray-300 transition-all`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 p-3 rounded-xl font-bold transition-all ${isFormValid
                  ? `${colors.primary} ${colors.primaryHover} text-white shadow-md active:scale-[0.98]`
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historiales List */}
      <div className="space-y-6">
        {loading ? (
          <p className={colors.textSecondary}>Cargando historiales...</p>
        ) : historiales.length > 0 ? (
          historiales.map((historial: HistorialClinico) => {
            const isImage = !!(historial.foto_mascota && historial.foto_mascota.length > 20);
            return (
              <div key={historial.id} className={`p-5 ${colors.inputBg} rounded-2xl border ${colors.inputBorder}`}>
                {editingHistorialId === historial.id ? (
                  /* Edit Form Inline */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                      <h3 className={`${colors.text} font-bold text-lg`}>Editando: {historial.nombre_mascota}</h3>
                      <button onClick={handleCancelEdit} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                      <p className={colors.text}>{historial.nota_inicial}</p>
                    </div>

                    {/* Events List in Edit Mode */}
                    <div className="space-y-3 mb-6">
                      {historial.eventos.map((evento) => (
                        <div key={evento.id} className={`p-3 ${colors.secondary} rounded-xl border border-transparent`}>
                          {editingEventId === evento.id ? (
                            <form onSubmit={handleUpdateEvent} className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="date"
                                  value={editEventData.fecha}
                                  onChange={(e) => setEditEventData({ ...editEventData, fecha: e.target.value })}
                                  className={`p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                                  required
                                />
                                <select
                                  value={editEventData.tipo}
                                  onChange={(e) => setEditEventData({ ...editEventData, tipo: e.target.value as any })}
                                  className={`p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                                  required
                                >
                                  <option value="Vacuna">💉 Vacuna</option>
                                  <option value="Dieta">🍖 Dieta</option>
                                  <option value="Actividad">🏃 Actividad</option>
                                  <option value="Conducta">🧠 Conducta</option>
                                  <option value="Control">📋 Control</option>
                                </select>
                              </div>
                              <textarea
                                value={editEventData.detalle}
                                onChange={(e) => setEditEventData({ ...editEventData, detalle: e.target.value })}
                                className={`w-full p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                                placeholder="Detalle..."
                                required
                              />
                              <select
                                value={editEventData.estado}
                                onChange={(e) => setEditEventData({ ...editEventData, estado: e.target.value as any })}
                                className={`w-full p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                                required
                              >
                                <option value="Normal">Normal</option>
                                <option value="Alerta">Alerta</option>
                                <option value="Seguimiento finalizado">Seguimiento finalizado</option>
                              </select>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => setEditingEventId(null)} style={{ backgroundColor: '#16a34a' }} className="flex-1 py-2 hover:bg-[#15803d] text-white rounded-lg text-xs font-bold transition-colors shadow-sm border-2 border-black">Cancelar</button>
                                <button type="submit" style={{ backgroundColor: '#16a34a' }} className="flex-1 py-2 hover:bg-[#15803d] text-white rounded-lg text-xs font-bold transition-colors shadow-sm border-2 border-black">Guardar</button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex gap-2">
                                <span className="text-xl">{getTipoIcon(evento.tipo)}</span>
                                <div>
                                  <p className={`${colors.text} font-bold text-sm`}>{evento.tipo} - {new Date(evento.fecha).toLocaleDateString()}</p>
                                  <p className={`${colors.textSecondary} text-xs line-clamp-1`}>{evento.detalle}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditEvent(evento)}
                                  className="p-1.5 transition-all shadow-sm custom-edit-btn rounded-sm"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(evento.id)}
                                  className="p-1.5 transition-all shadow-sm custom-delete-btn rounded-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add New Event Section */}
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowNewNoteForm(!showNewNoteForm)}
                        className={`w-fit px-4 py-2 rounded-xl border-2 border-dashed ${colors.inputBorder} ${colors.text} font-bold text-sm text-left transition-all new-note-btn flex items-center gap-2`}
                      >
                        <Plus className="w-4 h-4" />
                        Agregar nueva nota
                      </button>

                      {showNewNoteForm && (
                        <div className={`p-4 rounded-xl border ${colors.inputBorder} bg-white/50 dark:bg-black/20 space-y-3`}>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="date"
                              value={newEventData.fecha}
                              onChange={(e) => setNewEventData({ ...newEventData, fecha: e.target.value })}
                              className={`p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                              required
                            />
                            <select
                              value={newEventData.tipo}
                              onChange={(e) => setNewEventData({ ...newEventData, tipo: e.target.value as any })}
                              className={`p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                              required
                            >
                              <option value="Vacuna">💉 Vacuna</option>
                              <option value="Dieta">🍖 Dieta</option>
                              <option value="Actividad">🏃 Actividad</option>
                              <option value="Conducta">🧠 Conducta</option>
                              <option value="Control">📋 Control</option>
                            </select>
                          </div>
                          <textarea
                            value={newEventData.detalle}
                            onChange={(e) => setNewEventData({ ...newEventData, detalle: e.target.value })}
                            className={`w-full p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                            placeholder="Nueva nota o evento..."
                            required
                          />
                          <select
                            value={newEventData.estado}
                            onChange={(e) => setNewEventData({ ...newEventData, estado: e.target.value as any })}
                            className={`w-full p-2 rounded-lg ${colors.inputBg} border ${colors.inputBorder} ${colors.text} text-sm`}
                            required
                          >
                            <option value="Normal">Normal</option>
                            <option value="Alerta">Alerta</option>
                            <option value="Seguimiento finalizado">Seguimiento finalizado</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 sticky bottom-0 bg-inherit border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={async () => {
                          if (showNewNoteForm && newEventData.detalle.trim()) {
                            try {
                              await apiService.createEvento({
                                historial_id: historial.id,
                                ...newEventData
                              });
                            } catch (error) {
                              console.error(error);
                              alert('Error al guardar la nueva nota');
                              return;
                            }
                          }
                          handleCancelEdit();
                          loadData();
                        }}
                        className="w-full p-3 rounded-xl font-bold transition-all finalize-btn"
                      >
                        Finalizar Edición
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className={`w-12 h-12 ${colors.primary} rounded-xl flex items-center justify-center text-2xl shadow-md overflow-hidden`}>
                        {isImage ? (
                          <img src={historial.foto_mascota} alt={historial.nombre_mascota} className="w-full h-full object-cover" />
                        ) : (
                          historial.foto_mascota || '🐕'
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`${colors.text} font-bold text-lg`}>{historial.nombre_mascota}</h3>
                        <p className={colors.textSecondary}>{historial.eventos.length} evento(s)</p>
                      </div>
                      <button
                        onClick={() => handleStartEdit(historial)}
                        className="p-2 transition-all shadow-sm custom-edit-btn rounded-sm"
                        title="Editar Historial"
                      >
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {/* Nota Inicial */}
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className={colors.text}>{historial.nota_inicial}</p>
                    </div>

                    {/* Events */}
                    <div className="space-y-3">
                      {historial.eventos.map((evento) => (
                        <div
                          key={evento.id}
                          className={`p-4 ${colors.secondary} rounded-xl hover:shadow-md transition-all`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getTipoIcon(evento.tipo)}</span>
                              <div>
                                <h4 className={`${colors.text} font-bold`}>{evento.tipo}</h4>
                                <p className={`${colors.textSecondary} text-sm`}>
                                  {new Date(evento.fecha).toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <span
                              style={{ backgroundColor: getEstadoColor(evento.estado) }}
                              className="text-white px-3 py-1 rounded-lg text-xs font-bold"
                            >
                              {evento.estado}
                            </span>
                          </div>

                          <div>
                            <p className={colors.text}>{evento.detalle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p className={colors.textSecondary}>No hay historiales clínicos. Haz clic en "Agregar Registro" para crear uno.</p>
        )}
      </div>
    </div >
  );
}