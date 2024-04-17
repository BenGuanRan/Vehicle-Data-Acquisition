import {useEffect, useRef} from "react";
import {Column} from "@antv/g2plot";

const HisChart = () => {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const data = [
            {
                type: '家具家电',
                sales: 38,
            },
            {
                type: '粮油副食',
                sales: 52,
            },
            {
                type: '生鲜水果',
                sales: 61,
            },
            {
                type: '美容洗护',
                sales: 145,
            },
            {
                type: '母婴用品',
                sales: 48,
            },
            {
                type: '进口食品',
                sales: 38,
            },
            {
                type: '食品饮料',
                sales: 38,
            },
            {
                type: '家庭清洁',
                sales: 38,
            },
        ];

        const columnPlot = new Column(document.getElementById('his-chart'), {
            height: 500,
            width: 500,
            title: {
                visible: true,
                text: '基础柱状图',
            },
            data,
            padding: 'auto',
            xField: 'type',
            yField: 'sales',
            meta: {
                type: {
                    alias: '类别',
                },
                sales: {
                    alias: '销售额(万)',
                },
            },
            label: {
                visible: true,
                position: 'middle',
            },
        });

        columnPlot.render();
    })

    return (
        <div id="his-chart" ref={container} style={{
            height: 500,
            width: 500,
        }}>
        </div>
    )
}

export default HisChart;