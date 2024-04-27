import { Table } from "antd";
import { ICollectorsDataItem } from "../PhyTopology";

const CollectorInfoTable: React.FC<{
    dataSource: ICollectorsDataItem[]
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



    return <>
        <Table pagination={false} rowKey={'id'} dataSource={dataSource} columns={columns} />;
    </>
}

export default CollectorInfoTable  