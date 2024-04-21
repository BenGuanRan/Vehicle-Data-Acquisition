import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import Signal from './Signal.model';

export interface ICollectorModel {
    id?: number
    collectorName: string
    collectorAddress: string
}

@Table({
    tableName: 'collectors',
    timestamps: false
})
export default class Collector extends Model<ICollectorModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    collectorName!: string;

    @Column(DataType.STRING)
    collectorAddress!: string

    @HasMany(() => Signal)
    signals!: Signal[]
}