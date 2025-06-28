import crypto from 'crypto';

export interface IProject {
  id: string;
  name: string;
  description?: string;
  path?: string;
  github?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectManager {
  private static instance: ProjectManager;
  private projects: IProject[] = [];

  private constructor() {}

  public static getInstance(): ProjectManager {
    if (!ProjectManager.instance) {
      ProjectManager.instance = new ProjectManager();
    }
    return ProjectManager.instance;
  }

  /**
   * Cria um novo projeto.
   * @param project Dados do projeto (exceto id, createdAt, updatedAt)
   * @returns Projeto criado
   * @example
   *   manager.createProject({ name: 'Meu Projeto', path: '/caminho', isActive: true })
   */
  public async createProject(
    project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IProject> {
    const now = new Date();
    const newProject: IProject = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };
    this.projects.push(newProject);
    return newProject;
  }

  /**
   * Busca um projeto pelo id.
   * @param id Id do projeto
   * @returns Projeto ou null
   * @example
   *   manager.getProject('abc123')
   */
  public async getProject(id: string): Promise<IProject | null> {
    return this.projects.find((p) => p.id === id) || null;
  }

  /**
   * Atualiza um projeto.
   * @param id Id do projeto
   * @param updates Campos a atualizar
   * @returns Projeto atualizado ou null
   * @example
   *   manager.updateProject('abc123', { name: 'Novo nome' })
   */
  public async updateProject(id: string, updates: Partial<IProject>): Promise<IProject | null> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = {
      ...this.projects[idx],
      ...updates,
      updatedAt: new Date(),
    };
    return this.projects[idx];
  }

  /**
   * Remove um projeto.
   * @param id Id do projeto
   * @returns true se removido
   * @example
   *   manager.deleteProject('abc123')
   */
  public async deleteProject(id: string): Promise<boolean> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    return true;
  }

  /**
   * Lista todos os projetos.
   * @returns Array de projetos
   * @example
   *   manager.listProjects()
   */
  public async listProjects(): Promise<IProject[]> {
    return this.projects;
  }
}
