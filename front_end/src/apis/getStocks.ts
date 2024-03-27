import axios from 'axios'

export interface IGetStocks {
    code: string,
    start: string,
    end: string,
    predict_days: number
}

export interface IGetStocksRes {
    code: string,
    date: string,
    close: number,
    open: number,
    low: number,
    high: number
}

export function getStocks(params: IGetStocks): Promise<{ data: IGetStocksRes[] }> {
    return axios.postForm('/api/hello', { ...params })
}