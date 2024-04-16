import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript'
import TestProcess from './TestProcess.model';
import CollectorSignal from './CollectorSignal.model';

export interface ITestObjectModel {
    id?: number
    objectName: string,
    testProcessId: number
}

@Table({
    tableName: 'test_objects',
    timestamps: false
})
export default class TestObject extends Model<ITestObjectModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    objectName!: string

    @ForeignKey(() => TestProcess)
    @Column
    testProcessId!: number

    @BelongsTo(() => TestProcess)
    testProcess!: TestProcess

    @HasMany(() => CollectorSignal)
    collectorSignals!: CollectorSignal[]

}