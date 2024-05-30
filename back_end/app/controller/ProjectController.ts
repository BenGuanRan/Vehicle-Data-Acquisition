import {SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import {IResBody} from "../types";
import {Context} from "koa";
import ProjectService from "../service/ProjectService";
import Project from "../model/3Project.model";

const projectService = new ProjectService();

class ProjectController {
    //获取所有Project
    async getProjectList(ctx: Context) {
        const res = await projectService.getProjectList();
        (ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        }
    }

    //根据Id获取Project
    async getProjectById(ctx: Context) {
        const {id} = ctx.params;
        const res = await projectService.getProjectById(Number(id));

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    //创建Project
    async createProject(ctx: Context) {
        const {projectName} = ctx.request.body as Project
        const res = await projectService.createProject(projectName);

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    //更新Project
    async updateProject(ctx: Context) {
        const {id} = ctx.params;
        const {projectName} = ctx.request.body as Project;
        const res = await projectService.updateProject(Number(id), projectName);

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    //删除Project
    async deleteProject(ctx: Context) {
        const {id} = ctx.params;
        const res = await projectService.deleteProject(Number(id));

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }
}

export default new ProjectController()