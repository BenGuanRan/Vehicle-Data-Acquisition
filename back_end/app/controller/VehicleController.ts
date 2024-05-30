import VehicleService from "../service/VehicleService";
import {Context} from "koa";
import Vehicle from "../model/Vehicle.model";
import {IResBody} from "../types";
import {LOGIN_FAIL, LOGIN_SUCCESS, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import tokenUtils from "../../utils/token";

const vehicleService = new VehicleService();

class VehicleController {

    async createVehicle(ctx: Context) {
        const {vehicleName} = ctx.request.body as Vehicle;
        const res = await vehicleService.createVehicle(vehicleName);

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: {
                vehicleName: res.vehicleName,
                vehicleId: res.id,
            }
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    //获取所有车辆
    async getVehicles(ctx: Context) {
        const res = await vehicleService.getVehicles();
        (ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        }
    }

    //根据Id获取车辆
    async getVehicleById(ctx: Context) {
        const {id} = ctx.params;
        const res = await vehicleService.getVehicleById(Number(id));

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

    //更新车辆
    async updateVehicle(ctx: Context) {
        const {id} = ctx.params;
        const {vehicleName} = ctx.request.body as Vehicle;
        const res = await vehicleService.updateVehicle(Number(id), vehicleName);

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

    //删除车辆
    async deleteVehicle(ctx: Context) {
        const {id} = ctx.params;
        const res = await vehicleService.deleteVehicle(Number(id));

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

export default new VehicleController()