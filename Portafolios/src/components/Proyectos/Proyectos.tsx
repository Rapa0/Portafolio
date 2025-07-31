import React, { useState, useEffect, useContext } from 'react';
import styles from './Proyectos.module.css';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import ProjectCharts from './ProjectCharts';
import { AuthContext } from '../../context/AuthContext';
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Project } from '../../types/project';

declare const __app_id: string | undefined;

const Proyectos: React.FC = () => {
  const { user, db, loading: authLoading } = useContext(AuthContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const defaultNewProjectState: Omit<Project, 'userId' | 'id'> = {
    projectName: '',
    description: '',
    images: [],
    videos: [],
    codeSnippet: '',
    evidenceLinks: [],
    type: '',
    languageUsed: '',
    completionDate: '',
    status: 'En Progreso',
  };

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  useEffect(() => {
    if (!db || !user || authLoading) {
      return;
    }

    const projectsCollectionRef = collection(db, `artifacts/${appId}/users/${user.uid}/projects`);
    const q = query(projectsCollectionRef, orderBy('completionDate', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData: Project[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Project, 'id'>
      }));
      setProjects(projectsData);
    }, (err: unknown) => {
      console.error("Error fetching projects:", err);
      let errorMessage = "Error al cargar los proyectos. Intenta recargar la página.";
      if (err instanceof Error) {
        errorMessage = "Error al cargar: " + err.message;
      }
      setError(errorMessage);
    });

    return () => unsubscribe();
  }, [db, user, authLoading, appId]);

  const addProject = async (projectData: Omit<Project, 'userId' | 'id'>) => {
    if (!db || !user) {
      setError("Base de datos no disponible o usuario no autenticado.");
      return;
    }

    try {
      const projectToAdd = { ...projectData, userId: user.uid };
      await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}/projects`), projectToAdd);
      setMessage('Proyecto añadido con éxito!');
      setError('');
      setNewProject(defaultNewProjectState);
      setShowForm(false);
    } catch (err: unknown) {
      console.error("Error adding project:", err);
      let errorMessage = "Error desconocido al añadir el proyecto.";
      if (err instanceof Error) {
        errorMessage = "Error al añadir el proyecto: " + err.message;
      }
      setError(errorMessage);
    }
  };

  const handleUpdateProject = async (projectId: string, updatedData: Omit<Project, 'userId' | 'id'>) => {
    if (!db || !user || !projectId) {
      setError("No autenticado o proyecto no válido para actualizar.");
      return;
    }

    try {
      const projectDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/projects`, projectId);
      await updateDoc(projectDocRef, updatedData);
      setMessage('Proyecto actualizado con éxito!');
      setError('');
      setEditingProject(null);
      setNewProject(defaultNewProjectState);
      setShowForm(false);
    } catch (err: unknown) {
      console.error("Error actualizando proyecto:", err);
      let errorMessage = "Error desconocido al actualizar el proyecto.";
      if (err instanceof Error) {
        errorMessage = "Error al actualizar: " + err.message;
      }
      setError(errorMessage);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!db || !user || !projectId) {
      setError("No autenticado o proyecto no válido para eliminar.");
      return;
    }

    try {
      const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este proyecto?");
      if (confirmDelete) {
        const projectDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/projects`, projectId);
        await deleteDoc(projectDocRef);
        setMessage('Proyecto eliminado con éxito!');
        setError('');
      }
    } catch (err: unknown) {
      console.error("Error deleting project:", err);
      let errorMessage = "Error desconocido al eliminar el proyecto.";
      if (err instanceof Error) {
        errorMessage = "Error al eliminar: " + err.message;
      }
      setError(errorMessage);
    }
  };

  const setNewProject = useState<Omit<Project, 'userId' | 'id'>>(defaultNewProjectState)[1];

  const cancelForm = () => {
    setEditingProject(null);
    setNewProject(defaultNewProjectState);
    setShowForm(false);
    setMessage('');
    setError('');
  };

  const projectTypeData = projects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: project.type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const languageUsageData = projects.reduce((acc, project) => {
    if (project.languageUsed && project.languageUsed.trim() !== '') {
      const existing = acc.find(item => item.name === project.languageUsed);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: project.languageUsed, value: 1 });
      }
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  if (authLoading || !db || !user) {
    return <div className={styles['proyectos-container']}><p>Cargando proyectos...</p></div>;
  }

  return (
    <div className={styles['proyectos-container']}>
      <h2>Mis Proyectos Personales</h2>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <ProjectCharts typeData={projectTypeData} languageData={languageUsageData} />

      <div className={styles['action-buttons']}>
        <button onClick={() => { setShowForm(!showForm); setEditingProject(null); setNewProject(defaultNewProjectState); }} className={styles['toggle-form-button']}>
          {showForm ? 'Ocultar Formulario' : 'Añadir Nuevo Proyecto'}
        </button>
      </div>

      {showForm && (
        <ProjectForm
          initialData={editingProject ? {
            projectName: editingProject.projectName,
            description: editingProject.description,
            images: editingProject.images,
            videos: editingProject.videos,
            codeSnippet: editingProject.codeSnippet,
            evidenceLinks: editingProject.evidenceLinks,
            type: editingProject.type,
            languageUsed: editingProject.languageUsed,
            completionDate: editingProject.completionDate,
            status: editingProject.status,
          } : defaultNewProjectState}
          onSubmit={editingProject ? (data) => handleUpdateProject(editingProject.id!, data) : addProject}
          onCancel={cancelForm}
          formTitle={editingProject ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto'}
          isEditing={!!editingProject}
        />
      )}

      <ProjectList projects={projects} updateProject={handleUpdateProject} deleteProject={handleDeleteProject} />
      
      <div style={{ marginBottom: '50px' }}></div>
    </div>
  );
};

export default Proyectos;
