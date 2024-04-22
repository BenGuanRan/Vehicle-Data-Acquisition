import {getCollectorList, getControllerList} from "@/apis/request/test.ts";

const controllerList = "controllerList";
const collectorList = "collectorList";


export interface ControllerAndCollector {
    id: number;
    name: string;
}

const setControllerToLocal = (data: ControllerAndCollector[]) => {
    localStorage.setItem(controllerList, JSON.stringify(data))
}

const getControllerFromLocal = async (): Promise<ControllerAndCollector[]> => {
    const data = localStorage.getItem(controllerList);
    if (!data || JSON.parse(data).length === 0) {
        const response = await getControllerList()
        setControllerToLocal(response.data)
        return response.data
    }
    return JSON.parse(data)
}

const setCollectorToLocal = (data: ControllerAndCollector[]) => {
    localStorage.setItem(collectorList, JSON.stringify(data))
}

const getCollectorFromLocal = async (): Promise<ControllerAndCollector[]> => {
    const data = localStorage.getItem(collectorList);
    if (!data || JSON.parse(data).length === 0) {
        const response = await getCollectorList()
        setCollectorToLocal(response.data)
        return response.data
    }
    return JSON.parse(data)
}


export {
    setControllerToLocal,
    getControllerFromLocal,
    setCollectorToLocal,
    getCollectorFromLocal
}