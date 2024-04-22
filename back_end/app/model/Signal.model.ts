import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import Collector from './Collector.model'

export interface ISignalModel {
    id?: number
    signalName: string
    signalUnit: string
    signalType: string
    remark: string
    collectorId: number
}

@Table({
    tableName: 'signals',
    timestamps: false
})
export default class Signal extends Model<ISignalModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    signalName!: string;

    @Column(DataType.STRING)
    signalUnit!: string;

    @Column(DataType.STRING)
    signalType!: string;

    @Column(DataType.STRING)
    remark!: string;

    @ForeignKey(() => Collector)
    @Column
    collectorId!: number

    @BelongsTo(() => Collector)
    collector!: Collector

}