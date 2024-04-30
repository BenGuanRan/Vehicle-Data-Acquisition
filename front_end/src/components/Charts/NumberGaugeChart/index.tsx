import * as echarts from "echarts"
import { useEffect, useMemo, useRef, useState } from "react"

const NumberGaugeChart: React.FC<{
    min: number
    max: number
    startRequest: boolean
    requestSignalId: number | null
    unit: string
    title: string
    width: number
    height: number
    interval: number
}> = ({ startRequest, requestSignalId, unit, title, width, height, interval, min, max }) => {

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [value, setValue] = useState(0)
    const chartRef = useRef<echarts.ECharts | null>()

    useMemo(() => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignalId !== null) {
            timerRef.current = setInterval(() => {
                setValue(Number((Math.random() * 100).toFixed(2)))
            }, interval)
        }
    }, [startRequest, interval])

    useEffect(() => {
        chartRef.current?.setOption({
            series: [
                {
                    data: [
                        {
                            value: +(Math.random() * 100).toFixed(2),
                            name: title
                        }
                    ]
                }
            ]
        });
    }, [value])

    useEffect(() => {
        const gc = document.querySelector('#number-gauge-container') as HTMLDivElement
        chartRef.current = echarts.init(gc)

        const option = {
            series: [
                {
                    type: 'gauge',
                    min,
                    max,
                    splitNumber: 10,
                    progress: {
                        show: true,
                        width: Math.min(height, width) / 25
                    },
                    axisLine: {
                        lineStyle: {
                            width: Math.min(height, width) / 25
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        length: Math.min(height, width) / 26,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: Math.min(height, width) / 22,
                        color: '#999',
                        fontSize: Math.min(height, width) / 23
                    },
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: Math.min(height, width) / 22,
                        itemStyle: {
                            borderWidth: Math.min(height, width) / 30
                        }
                    },
                    title: {
                        offsetCenter: [0, '-120%'],
                        fontSize: Math.min(height, width) / 15
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: Math.min(height, width) / 18,
                        offsetCenter: [0, '70%'],
                        formatter: `{value} ${unit}`,
                        color: 'inherit'
                    },
                    data: [
                        {
                            value,
                            name: title
                        }
                    ]
                }
            ]
        };

        const resizeObserver = new ResizeObserver(() => {
            chartRef.current && chartRef.current.resize()
        })
        resizeObserver.observe(gc)
        chartRef.current.setOption(option)

        return () => {
            resizeObserver.disconnect()
            chartRef.current?.dispose()
        }
    }, [unit, title, width, height, min, max])

    return <div id="number-gauge-container" style={{ width, height }}></div>
}

export default NumberGaugeChart