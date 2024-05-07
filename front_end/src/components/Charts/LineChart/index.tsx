import {animation} from "@antv/g2plot/lib/adaptor/common"
import * as echarts from "echarts"
import {min} from "moment"
import {useEffect, useMemo, useRef, useState} from "react"

const LineChart: React.FC<{
    startRequest: boolean
    requestSignalId: number | null
    title: string
    width: number
    height: number
    interval: number
    during: number
    label: string
}> = ({startRequest, requestSignalId, title, width, height, interval, during, label}) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [data, setData] = useState<[number, number][]>([])
    const chartRef = useRef<echarts.ECharts | null>()
    const dataRef = useRef<{ name: number, value: [number, number] }[]>([])
    const lineContainerRef = useRef<HTMLDivElement>(null)

    useMemo(() => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignalId !== null) {
            timerRef.current = setInterval(() => {
                const nowTimeStramp = +new Date()
                while (dataRef.current.length) {
                    const {name: time} = dataRef.current[0]
                    if (nowTimeStramp - time > during * 1000)
                        dataRef.current.shift()
                    else break
                }
                dataRef.current.push({
                    name: nowTimeStramp,
                    value: [nowTimeStramp, Number((Math.random() * 1000).toFixed(2))]
                })
                chartRef.current?.setOption({
                    series: [
                        {
                            data: dataRef.current
                        }
                    ]
                });
            }, interval)
        }
    }, [startRequest, interval, during])

    useEffect(() => {
        chartRef.current = echarts.init(lineContainerRef.current)
        const option = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis',

                axisPointer: {
                    animation: false
                }
            },
            xAxis: {
                splitNumber: 5,
                type: 'time',
                splitLine: {
                    show: false
                },
                animation: false,
                axisLabel: {
                    rotate: -20
                },
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    name: label,
                    type: 'line',
                    showSymbol: false,
                    data: dataRef.current
                }
            ]
        };
        const resizeObserver = new ResizeObserver(() => {
            chartRef.current && chartRef.current.resize()
        })
        lineContainerRef.current && resizeObserver.observe(lineContainerRef.current)
        chartRef.current?.setOption(option)

        return () => {
            resizeObserver.disconnect()
            chartRef.current?.dispose()
        }
    }, [title, label])


    return <div ref={lineContainerRef} style={{
        width: '100%', height: '100%'
    }}></div>
}

export default LineChart