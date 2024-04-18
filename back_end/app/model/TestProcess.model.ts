import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import TestObject from './TestObject.model';
import User from './User.model';

export interface ITestProcessModel {
    id?: number
    userId: number
    testName: string
    createAt?: Date
    updateAt?: Date
}

@Table({
    tableName: 'test_processes'
})
export default class TestProcess extends Model<ITestProcessModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    testName!: string;

    @HasMany(() => TestObject)
    testObjects!: TestObject[]

    @ForeignKey(() => User)
    @Column
    userId!: number

    @BelongsTo(() => User)
    user!: User
}