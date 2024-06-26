import { getCollectorList, getControllerList } from "@/apis/request/test.ts";

const controllerList = "controllerList";
const collectorList = "collectorList";


export interface ControllerAndCollector {
    id: number;
    name: string;
}

const setControllerToLocal = (data: ControllerAndCollector[]) => {
    sessionStorage.setItem(controllerList, JSON.stringify(data))
}

const getControllerFromLocal = async (): Promise<ControllerAndCollector[]> => {
    const data = sessionStorage.getItem(controllerList);
    if (!data || JSON.parse(data).length === 0) {
        const response = await getControllerList()
        setControllerToLocal(response.data)
        return response.data
    }
    console.log(data)
    return JSON.parse(data)
}

const setCollectorToLocal = (data: ControllerAndCollector[]) => {
    sessionStorage.setItem(collectorList, JSON.stringify(data))
}

const getCollectorFromLocal = async (): Promise<ControllerAndCollector[]> => {
    const data = sessionStorage.getItem(collectorList);
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