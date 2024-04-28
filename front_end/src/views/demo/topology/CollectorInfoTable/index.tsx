import { Table } from "antd";
import { IcollectorsConfigItem } from "../PhyTopology";

const CollectorInfoTable: React.FC<{
    dataSource: IcollectorsConfigItem[]
}> = ({ dataSource }) => {
    const columns = [
        {
            title: '采集板卡代号',
            dataIndex: 'collectorName',
            key: 'collectorName',
        },
        {
            title: '采集板卡地址',
            dataIndex: 'collectorAddress',
            key: 'collectorAddress',
        },
    ];



    return <div style={{ height: 350 }}>
        <Table scroll={{ y: 300 }} sticky={true} bordered={true} pagination={false} rowKey={'id'} dataSource={dataSource} columns={columns} />
    </div>
}

export default CollectorInfoTable  