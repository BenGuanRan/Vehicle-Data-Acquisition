import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import TestObject from './TestObject.model'

export interface ICollectorSignalModel {
    id?: number
    collectorSignalName: string
    controllerId: number
    collectorId: number
    signal: string
    testObjectId: number
}

@Table({
    tableName: 'colletor_signals',
    timestamps: false
})
export default class CollectorSignal extends Model<ICollectorSignalModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    collectorSignalName!: string;

    @Column(DataType.INTEGER)
    controllerId!: number;

    @Column(DataType.INTEGER)
    collectorId!: number;

    @Column(DataType.STRING)
    signal!: string

    @ForeignKey(() => TestObject)
    @Column
    testObjectId!: number

    @BelongsTo(() => TestObject)
    testObject!: TestObject

}