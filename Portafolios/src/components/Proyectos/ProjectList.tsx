import React from 'react';
import styles from './Proyectos.module.css';
import ProjectCard from './ProjectCard';
import type { Project } from '../../types/project';

interface ProjectListProps {
  projects: Project[];
  updateProject: (projectId: string, updatedData: Omit<Project, 'userId' | 'id'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, updateProject, deleteProject }) => {
  return (
    <div className={styles['project-list-container']}>
      <h2>Mis Proyectos</h2>
      {projects.length === 0 ? (
        <p className={styles['no-projects-message']}>No tienes proyectos creados aún. ¡Empieza añadiendo uno!</p>
      ) : (
        <div className={styles['projects-grid']}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              updateProject={updateProject}
              deleteProject={deleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
