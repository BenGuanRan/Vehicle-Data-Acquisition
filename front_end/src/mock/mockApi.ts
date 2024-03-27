import sleep from '@/utils/sleep'
import mockData from './data.json'

export interface IMockDataItem {
    code: string,
    date: string,
    close: number,
    open: number,
    high: number,
    low: number,
}

export function getMockData() {
    return new Promise<IMockDataItem[]>(async (resolve) => {
        await sleep(3000)
        resolve(mockData)
    })
}
