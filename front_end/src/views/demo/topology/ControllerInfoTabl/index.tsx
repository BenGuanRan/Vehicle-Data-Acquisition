import { Table } from "antd";
import { IControllersDataItem } from "../PhyTopology";

const ControllerInfoTable: React.FC<{
    dataSource: IControllersDataItem[]
}> = ({ dataSource }) => {
    const columns = [
        {
            title: '核心板卡代号',
            dataIndex: 'controllerName',
            key: 'controllerName',
        },
        {
            title: '核心板卡地址',
            dataIndex: 'controllerAddress',
            key: 'controllerAddress',
        },
    ];



    return <>
        <Table pagination={false} rowKey={'id'} dataSource={dataSource} columns={columns} />;
    </>
}

export default ControllerInfoTable  