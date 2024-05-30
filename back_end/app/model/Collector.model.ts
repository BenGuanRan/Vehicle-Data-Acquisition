import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import Signal from './Signal.model';
import User from './User.model';

//采集板卡
export interface ICollectorModel {
    id?: number
    collectorName: string
    collectorAddress: string
    userId: number | null
}

@Table({
    tableName: 'collectors',
    timestamps: false
})

/**
 * 采集板卡
 * 采集板卡包含
 * 1. 采集板卡的信号
 */
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    userId!: number

    @BelongsTo(() => User)
    user!: User
}