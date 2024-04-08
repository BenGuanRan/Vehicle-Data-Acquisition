declare module '@antv/g6';

export type BaseGraphOptions = {
    container: string,
    width: number,
    height: number,
    layout: {
        type: string,
    },
    defaultNode: {
        type: string,
        width: number,
        height: number,
        style: {
            stroke: string,
            lineWidth: number,
        },
    },
}