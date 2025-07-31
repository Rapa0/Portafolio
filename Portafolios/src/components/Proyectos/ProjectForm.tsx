import React from 'react';
import styles from './Proyectos.module.css';
import type { Project } from '../../types/project';

interface ProjectFormProps {
  initialData: Omit<Project, 'userId' | 'id'>;
  onSubmit: (data: Omit<Project, 'userId' | 'id'>) => Promise<void>;
  onCancel: () => void;
  formTitle: string;
  isEditing: boolean;
}

const PROJECT_TYPES = [
  'Desarrollo Web (Frontend)',
  'Desarrollo Web (Backend)',
  'Desarrollo Móvil (Android/iOS)',
  'Fullstack',
  'Ciencia de Datos / Machine Learning',
  'Juegos',
  'Escritorio',
  'DevOps',
  'IoT (Internet de las Cosas)',
  'Blockchain',
  'Automatización / Scripts',
  'UI/UX Design',
  'Otros',
];

const LANGUAGES = [
  'JavaScript',
  'Python',
  'TypeScript',
  'React Native',
  'Java',
  'C#',
  'C++',
  'PHP',
  'Go',
  'Swift',
  'Kotlin',
  'Ruby',
  'Rust',
  'HTML/CSS',
  'SQL',
  'Dart (Flutter)',
  'Vue.js',
  'Angular',
  'Node.js',
  'Shell Script',
  'Unity/C#',
  'Unreal Engine/C++',
  'Solidity',
  'R',
  'Scala',
  'Perl',
  'Groovy',
  'Elixir',
  'Erlang',
  'Assembly',
  'Objective-C',
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  formTitle,
  isEditing,
}) => {
  const [formData, setFormData] = React.useState<Omit<Project, 'userId' | 'id'>>(initialData);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'images' | 'videos' | 'evidenceLinks') => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()).filter(item => item !== '') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className={styles['form-section']}>
      <h3>{formTitle}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="projectName"
          placeholder="Nombre del Proyecto"
          value={formData.projectName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción del Proyecto"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="text"
          name="images"
          placeholder="URLs de Imágenes (separadas por coma)"
          value={formData.images.join(', ')}
          onChange={(e) => handleArrayChange(e as React.ChangeEvent<HTMLInputElement>, 'images')}
        />
        <input
          type="text"
          name="videos"
          placeholder="URLs de Videos (separadas por coma)"
          value={formData.videos.join(', ')}
          onChange={(e) => handleArrayChange(e as React.ChangeEvent<HTMLInputElement>, 'videos')}
        />
        <textarea
          name="codeSnippet"
          placeholder="Fragmento de Código"
          value={formData.codeSnippet}
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="evidenceLinks"
          placeholder="Enlaces de Evidencia (separados por coma)"
          value={formData.evidenceLinks.join(', ')}
          onChange={(e) => handleArrayChange(e as React.ChangeEvent<HTMLInputElement>, 'evidenceLinks')}
        />
        
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Selecciona Tipo de Proyecto</option>
          {PROJECT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select name="languageUsed" value={formData.languageUsed} onChange={handleChange} required>
          <option value="">Selecciona Lenguaje Utilizado</option>
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <input
          type="date"
          name="completionDate"
          placeholder="Fecha de Finalización"
          value={formData.completionDate}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="En Progreso">En Progreso</option>
          <option value="Completado">Completado</option>
          <option value="Archivado">Archivado</option>
        </select>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="submit">{isEditing ? 'Actualizar Proyecto' : 'Añadir Proyecto'}</button>
          <button type="button" onClick={onCancel} className={styles['cancel-button']}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
