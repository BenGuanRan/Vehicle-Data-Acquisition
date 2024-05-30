import Project from "../model/3Project.model";


export default class ProjectService {
    async getProjectList() {
        return await Project.findAll();
    }

    async getProjectById(id: number) {
        return await Project
            .findOne({
                where: {
                    id
                }
            });
    }

    async createProject(projectName: string) {
        return await Project.create({projectName});
    }

    async updateProject(id: number, projectName: string) {
        const project = await Project.findByPk(id);
        if (project) {
            project.projectName = projectName;
            await project.save();
            return project;
        }
        return null;
    }

    async deleteProject(id: number) {
        const project = await Project.findByPk(id);
        if (project) {
            await project.destroy();
            return project.id;
        }
        return 0;
    }
}