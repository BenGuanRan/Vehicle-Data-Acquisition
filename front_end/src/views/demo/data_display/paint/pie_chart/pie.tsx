import {Pie} from "@antv/g2plot";


const PieChart = () => {
    const data = [
        {
            type: '分类一',
            value: 27,
        },
        {
            type: '分类二',
            value: 25,
        },
        {
            type: '分类三',
            value: 18,
        },
        {
            type: '分类四',
            value: 15,
        },
        {
            type: '分类五',
            value: 10,
        },
        {
            type: '其它',
            value: 5,
        },
    ];

    const piePlot = new Pie(document.getElementById('container'), {
        forceFit: true,

        radius: 0.8,
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
            visible: true,
            type: 'inner',
        },
    });

    piePlot.render();
    return (
        <div id="container" style={{
            height: 500,
            width: 500,
        }}>
        </div>
    )
}

export default PieChart;