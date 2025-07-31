import React, { useState } from 'react';
import styles from './Proyectos.module.css';
import type { Project } from '../../types/project';
import ProjectForm from './ProjectForm';

interface ProjectCardProps {
  project: Project;
  updateProject: (projectId: string, updatedData: Omit<Project, 'userId' | 'id'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, updateProject, deleteProject }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const allMedia = [...project.images, ...project.videos];
  const isVideo = (url: string) => url.includes('youtube.com') || url.includes('youtu.be') || url.match(/\.(mp4|webm|ogg)$/i);
  
  const getYouTubeVideoId = (url: string) => {
    const regExp = /(?:https?:\/\/(?:www\.)?youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})(?:\S+)?/g;
    const match = regExp.exec(url);
    return match ? match[1] : null;
  };
  
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % allMedia.length);
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + allMedia.length) % allMedia.length);
  };

  const handleUpdate = async (updatedData: Omit<Project, 'userId' | 'id'>) => {
    if (!project.id) {
      setError("ID de proyecto no encontrado para actualizar.");
      return;
    }
    try {
      await updateProject(project.id, updatedData);
      setMessage('Proyecto actualizado!');
      setError('');
      setIsEditing(false);
    } catch (err: unknown) {
      console.error("Error al actualizar desde la tarjeta:", err);
      let errorMessage = "Error al actualizar el proyecto desde la tarjeta.";
      if (err instanceof Error) {
        errorMessage = "Error al actualizar: " + err.message;
      }
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!project.id) {
      setError("ID de proyecto no encontrado para eliminar.");
      return;
    }
    try {
      const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este proyecto?");
      if (confirmDelete) {
        await deleteProject(project.id);
        setMessage('Proyecto eliminado!');
        setError('');
      }
    } catch (err: unknown) {
      console.error("Error al eliminar desde la tarjeta:", err);
      let errorMessage = "Error al eliminar el proyecto desde la tarjeta.";
      if (err instanceof Error) {
        errorMessage = "Error al eliminar: " + err.message;
      }
      setError(errorMessage);
    }
  };

  if (isEditing) {
    return (
      <div className={`${styles['project-card']} ${styles['editing-mode']}`}>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <ProjectForm
          initialData={{
            projectName: project.projectName,
            description: project.description,
            images: project.images,
            videos: project.videos,
            codeSnippet: project.codeSnippet,
            evidenceLinks: project.evidenceLinks,
            type: project.type,
            languageUsed: project.languageUsed,
            completionDate: project.completionDate,
            status: project.status,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          formTitle="Editar Proyecto"
          isEditing={true}
        />
      </div>
    );
  }

  const currentMediaSrc = allMedia[currentMediaIndex];
  const isCurrentMediaVideo = isVideo(currentMediaSrc);
  const mediaToDisplay = isCurrentMediaVideo && getYouTubeVideoId(currentMediaSrc) ? getYouTubeThumbnail(currentMediaSrc) : currentMediaSrc;

  return (
    <div className={styles['project-card']}>
      <div className={styles['card-header']}>
        <h3>{project.projectName}</h3>
        <div className={styles['card-actions']}>
          <button onClick={() => setIsEditing(true)} className={styles['edit-button']} title="Editar Proyecto">
            ✏️
          </button>
          <button onClick={handleDelete} className={styles['delete-button']} title="Eliminar Proyecto">
            🗑️
          </button>
        </div>
      </div>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles['card-info']}>
        <p>Tipo:</p> <p>{project.type}</p>
        <p>Estado:</p> <p>{project.status}</p>
        <p>Lenguaje:</p> <p>{project.languageUsed || 'N/A'}</p>
        <p>Fecha:</p> <p>{project.completionDate}</p>
      </div>

      <div className={styles['card-description']}>
        <p>{project.description}</p>
      </div>

      {allMedia.length > 0 && (
        <div className={styles['card-media-gallery']}>
          {currentMediaSrc && (
            <div className={styles['image-viewer']}>
              {isCurrentMediaVideo && getYouTubeVideoId(currentMediaSrc) ? (
                <div className={styles['youtube-responsive']}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentMediaSrc)}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                  ></iframe>
                </div>
              ) : (
                <img
                  src={mediaToDisplay}
                  alt={project.projectName}
                  className={styles['main-expanded-media']}
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/350x200/cccccc/000000?text=Error+Loading+Image'; }}
                />
              )}
              {allMedia.length > 1 && (
                <>
                  <button onClick={handlePrevMedia} className={`${styles['nav-button']} ${styles['nav-prev']}`}>
                    ❮
                  </button>
                  <button onClick={handleNextMedia} className={`${styles['nav-button']} ${styles['nav-next']}`}>
                    ❯
                  </button>
                </>
              )}
            </div>
          )}
          {allMedia.length > 1 && (
            <div className={styles['thumbnail-dots']}>
              {allMedia.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${idx === currentMediaIndex ? styles['active-dot'] : ''}`}
                  onClick={() => setCurrentMediaIndex(idx)}
                ></span>
              ))}
            </div>
          )}
        </div>
      )}

      {project.codeSnippet && (
        <div className={styles['code-section']}>
          <h4>Fragmento de Código</h4>
          <pre className={styles['code-snippet']}>
            <code>{project.codeSnippet}</code>
          </pre>
        </div>
      )}

      {project.evidenceLinks && project.evidenceLinks.length > 0 && (
        <div className={styles['links-section']}>
          <h4>Enlaces de Evidencia</h4>
          <ul className={styles['evidence-links']}>
            {project.evidenceLinks.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
