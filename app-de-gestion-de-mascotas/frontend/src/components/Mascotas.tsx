import { ChevronLeft, Plus, Pencil, Upload, Ban } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState, useRef } from 'react';
import { apiService } from '../services/apiService';

interface MascotasProps {
  onBack: () => void;
  initialMode?: 'list' | 'create';
}

interface Mascota {
  id: number;
  nombre: string;
  tipo: string;
  raza: string;
  edad: string;
  peso: string;
  foto?: string;
}

// Initial form state
const initialFormState = {
  nombre: '',
  tipo: '',
  raza: '',
  edad: '',
  peso: '',
  foto: '🐕'
};

const ANIMAL_ICONS = [
  '🐕', '🐈', '🦜', '🐇',
  '🐹', '🐢', '🐠', '🦎',
  '🐍', '🐎', '🐄', '🐖',
  '🐘', '🦒', '🦓'
];

export function Mascotas({ onBack, initialMode = 'list' }: MascotasProps) {
  const { colors } = useTheme();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(initialMode === 'create');
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [photoMode, setPhotoMode] = useState<'icon' | 'upload'>('icon');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMascotas();
  }, []);

  useEffect(() => {
    setShowForm(initialMode === 'create');
    if (initialMode === 'create') handleCreate();
  }, [initialMode]);

  const loadMascotas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMascotas();
      setMascotas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mascota: Mascota) => {
    setFormData({
      nombre: mascota.nombre,
      tipo: mascota.tipo,
      raza: mascota.raza || '',
      edad: mascota.edad || '',
      peso: mascota.peso || '',
      foto: mascota.foto || '🐕'
    });
    setEditingId(mascota.id);
    // Detect if current photo is an emoji or base64/url to set mode
    const isEmoji = ANIMAL_ICONS.includes(mascota.foto || '') || (mascota.foto && mascota.foto.length < 10) || mascota.foto === '';
    setPhotoMode(isEmoji ? 'icon' : 'upload');
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setPhotoMode('icon');
    setShowForm(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiService.updateMascota(String(editingId), formData);
      } else {
        await apiService.createMascota(formData);
      }
      setShowForm(false);
      setFormData(initialFormState);
      setEditingId(null);
      loadMascotas();
    } catch (error) {
      console.error(error);
      alert('Error al guardar mascota');
    }
  };

  return (
    <div className={`${colors.cardBg} rounded-3xl shadow-sm p-6 w-full min-h-[600px]`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className={`p-2 ${colors.secondary} ${colors.secondaryHover} rounded-xl transition-colors`}
        >
          <ChevronLeft className={`w-6 h-6 ${colors.text}`} />
        </button>
        <div className="flex-1">
          <h1 className={`${colors.text} font-bold text-xl`}>Mis Mascotas</h1>
          <p className={colors.textSecondary}>{mascotas.length} mascotas registradas</p>
        </div>
      </div>

      {/* Formulario o Lista */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-6">
          <h2 style={{ fontWeight: 'bold' }} className={`${colors.text} text-lg mb-4 uppercase`}>{editingId ? 'Editar Mascota' : 'Nueva Mascota'}</h2>

          {/* Photo Selection */}
          <div className={`p-4 rounded-xl border ${colors.inputBorder} ${colors.inputBg} mb-4`}>
            <p className={`${colors.text} block mb-3 font-extrabold text-base uppercase tracking-tight`}>Foto de la mascota</p>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPhotoMode('icon')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${photoMode === 'icon' ? `${colors.primary} text-white` : `${colors.secondary} ${colors.textSecondary}`}`}
              >
                Usar Icono
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode('upload')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${photoMode === 'upload' ? `${colors.primary} text-white` : `${colors.secondary} ${colors.textSecondary}`}`}
              >
                Subir Foto
              </button>
            </div>

            {photoMode === 'icon' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, foto: '' })}
                  className={`aspect-square text-2xl p-2 rounded-lg transition-colors flex items-center justify-center ${formData.foto === '' ? `${colors.primary} text-white` : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                  title="Sin icono"
                >
                  <Ban className="w-6 h-6" />
                </button>
                {ANIMAL_ICONS.map(icon => (
                  <button
                    type="button"
                    key={icon}
                    onClick={() => setFormData({ ...formData, foto: icon })}
                    className={`aspect-square text-2xl p-2 rounded-lg transition-colors ${formData.foto === icon ? `${colors.primary} text-white` : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  {formData.foto && formData.foto.length > 20 ? (
                    <div className="relative w-24 h-24 mx-auto">
                      <img src={formData.foto} alt="Preview" className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Pencil className="text-white w-6 h-6" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Clic para subir imagen</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block mb-1 text-sm font-bold ${colors.textSecondary}`}>Nombre</label>
              <input
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                className={`p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} w-full`}
                required
              />
            </div>
            <div>
              <label className={`block mb-1 text-sm font-bold ${colors.textSecondary}`}>Tipo</label>
              <input
                value={formData.tipo}
                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                className={`p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} w-full`}
              />
            </div>
            <div>
              <label className={`block mb-1 text-sm font-bold ${colors.textSecondary}`}>Raza</label>
              <input
                value={formData.raza}
                onChange={e => setFormData({ ...formData, raza: e.target.value })}
                className={`p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} w-full`}
              />
            </div>
            <div>
              <label className={`block mb-1 text-sm font-bold ${colors.textSecondary}`}>Edad</label>
              <input
                value={formData.edad}
                onChange={e => setFormData({ ...formData, edad: e.target.value })}
                className={`p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} w-full`}
              />
            </div>
            <div>
              <label className={`block mb-1 text-sm font-bold ${colors.textSecondary}`}>Peso</label>
              <input
                value={formData.peso}
                onChange={e => setFormData({ ...formData, peso: e.target.value })}
                className={`p-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} w-full`}
              />
            </div>
          </div>
          <div className="flex gap-4 pt-10 mt-6 md:mt-10">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={`flex-1 p-3 rounded-xl ${colors.secondary} ${colors.textSecondary} font-bold`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 p-3 rounded-xl ${colors.primary} text-white font-bold`}
            >
              Guardar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {loading ? (
              <p className={colors.textSecondary}>Cargando mascotas...</p>
            ) : mascotas.length === 0 ? (
              <p className={colors.textSecondary}>No hay mascotas registradas.</p>
            ) : (
              mascotas.map((mascota) => {
                const isImage = mascota.foto && mascota.foto.length > 20;
                return (
                  <div
                    key={mascota.id}
                    className={`relative p-5 ${colors.inputBg} rounded-2xl hover:shadow-lg transition-all border ${colors.inputBorder}`}
                  >
                    <style>
                      {`
                        .custom-edit-btn:hover {
                          background-color: #FACC15 !important; /* Yellow-400 */
                          border: 2px solid black !important;
                          border-radius: 2px !important; /* Square-ish */
                        }
                        .custom-edit-btn:hover svg {
                          color: black !important;
                        }
                      `}
                    </style>
                    <button
                      onClick={() => handleEdit(mascota)}
                      style={{ position: 'absolute', top: '1rem', right: '1rem' }}
                      className="absolute p-2 transition-all shadow-sm custom-edit-btn rounded-sm"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>

                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 ${colors.primary} rounded-xl flex items-center justify-center text-3xl shadow-md overflow-hidden`}>
                        {isImage ? (
                          <img src={mascota.foto} alt={mascota.nombre} className="w-full h-full object-cover" />
                        ) : (
                          mascota.foto || '🐕'
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`${colors.text} mb-1 font-bold`}>{mascota.nombre}</h3>
                        <p className={colors.textSecondary}>{mascota.raza}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className={`p-3 ${colors.secondary} rounded-xl`}>
                        <p className={`${colors.textSecondary} text-xs uppercase font-bold mb-1`}>Tipo</p>
                        <p className={colors.text}>{mascota.tipo}</p>
                      </div>
                      <div className={`p-3 ${colors.secondary} rounded-xl`}>
                        <p className={`${colors.textSecondary} text-xs uppercase font-bold mb-1`}>Edad</p>
                        <p className={colors.text}>{mascota.edad}</p>
                      </div>
                      <div className={`p-3 ${colors.secondary} rounded-xl`}>
                        <p className={`${colors.textSecondary} text-xs uppercase font-bold mb-1`}>Peso</p>
                        <p className={colors.text}>{mascota.peso}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleCreate}
            className={`w-full ${colors.primary} ${colors.primaryHover} text-white py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg font-bold`}
          >
            <Plus className="w-5 h-5" />
            Agregar nueva mascota
          </button>
        </>
      )}
    </div>
  );
}