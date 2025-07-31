import React from 'react';
import styles from './Proyectos.module.css';

interface Project {
  id?: string;
  userId: string;
  projectName: string;
  description: string;
  images: string[];
  videos: string[];
  codeSnippet: string;
  evidenceLinks: string[];
  type: string;
  completionDate: string;
  status: string;
}

interface ProjectDetailsModalProps {
  selectedProject: Project | null;
  closeProjectModal: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ selectedProject, closeProjectModal }) => {
  if (!selectedProject) return null;

  // Helper function to check if a URL is a YouTube URL and extract the video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className={styles.modalOverlay} onClick={closeProjectModal}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={closeProjectModal}>&times;</button>
        <h3>{selectedProject.projectName}</h3>
        <p>{selectedProject.description}</p>
        <p><strong>Tipo:</strong> {selectedProject.type}</p>
        <p><strong>Fecha:</strong> {selectedProject.completionDate}</p>
        <p><strong>Estado:</strong> {selectedProject.status}</p>

        <div className={styles['project-details-tabs']}>
          <div className={styles['tab-header']}>Imágenes</div>
          <div className={styles['tab-content']}>
            {selectedProject.images.length > 0 ? (
              <div className={styles['image-carousel']}>
                {selectedProject.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Imagen del proyecto ${selectedProject.projectName} ${idx + 1}`} className={styles['project-image']} onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x100/CCCCCC/000000?text=No+Image')} />
                ))}
              </div>
            ) : (
              <p>No hay imágenes.</p>
            )}
          </div>

          <div className={styles['tab-header']}>Código</div>
          <div className={styles['tab-content']}>
            {selectedProject.codeSnippet ? (
              <pre className={styles['code-snippet']}><code>{selectedProject.codeSnippet}</code></pre>
            ) : (
              <p>No hay fragmento de código.</p>
            )}
          </div>

          <div className={styles['tab-header']}>Videos</div>
          <div className={styles['tab-content']}>
            {selectedProject.videos.length > 0 ? (
              selectedProject.videos.map((videoUrl, idx) => {
                const youtubeId = getYouTubeVideoId(videoUrl);
                return youtubeId ? (
                  <iframe
                    key={idx}
                    className={styles['project-video']}
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`YouTube video ${selectedProject.projectName}`}
                  ></iframe>
                ) : (
                  <video key={idx} controls className={styles['project-video']} onError={(e) => console.error("Error loading video:", e)}>
                    <source src={videoUrl} />
                    Tu navegador no soporta el tag de video.
                  </video>
                );
              })
            ) : (
              <p>No hay videos.</p>
            )}
          </div>

          <div className={styles['tab-header']}>Evidencia</div>
          <div className={styles['tab-content']}>
            {selectedProject.evidenceLinks.length > 0 ? (
              <ul>
                {selectedProject.evidenceLinks.map((link, idx) => (
                  <li key={idx}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                ))}
              </ul>
            ) : (
              <p>No hay enlaces de evidencia.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
