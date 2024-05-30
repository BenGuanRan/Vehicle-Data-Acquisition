import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    HasMany,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import TestObject from "./2TestObject.model";
import CollectorSignal from "./4CollectorSignal.model";

interface IProjectModel {
    id?: number
    projectName: string
    testObjectId?: number  // 这里将testObjectId设为可选
}

@Table({
    tableName: 'projects',
    timestamps: false
})

//Project可以作为一个独立的元素，也可以属于一个TestObject
export default class Project extends Model<IProjectModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    projectName!: string;
    //
    // @BelongsTo(() => TestObject)
    // testObject?: TestObject  // 这里将testObject设为可选
    //
    // @ForeignKey(() => TestObject)
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: true  // 这里允许testObjectId为空
    // })
    // testObjectId?: number
}