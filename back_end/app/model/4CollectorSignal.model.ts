import {AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript'
import TestObject from './2TestObject.model'
import Controller from './Controller.model'
import Collector from './Collector.model'
import Signal from './Signal.model'

export interface ICollectorSignalModel {
    id?: number
    collectorSignalName: string
    controllerId: number
    collectorId: number
    signalId: number
    testObjectId: number
}

@Table({
    tableName: 'colletor_signals',
    timestamps: false
})

/**
 * 采集指标，比如速度、里程等
 * 采集指标包含
 * 1. 采集板卡
 * 2. 采集板卡的信号
 * 3. 核心控制板卡
 */
export default class CollectorSignal extends Model<ICollectorSignalModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    collectorSignalName!: string;

    @ForeignKey(() => Controller)
    @Column(DataType.INTEGER)
    controllerId!: number;

    @BelongsTo(() => Controller)
    controllerInfo!: Controller

    @ForeignKey(() => Collector)
    @Column(DataType.INTEGER)
    collectorId!: number;

    @BelongsTo(() => Collector)
    collectorInfo!: Controller

    @ForeignKey(() => Signal)
    @Column(DataType.INTEGER)
    signalId!: number

    @BelongsTo(() => Signal)
    signalInfo!: Signal

    @ForeignKey(() => TestObject)
    @Column
    testObjectId!: number

    @BelongsTo(() => TestObject)
    testObject!: TestObject

}