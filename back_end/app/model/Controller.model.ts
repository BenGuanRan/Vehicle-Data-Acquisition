import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'

export interface IControllerModel {
    id?: number
    controllerName: string
    controllerAddress: string
}

@Table({
    tableName: 'controllers',
    timestamps: false
})
export default class Controller extends Model<IControllerModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    controllerName!: string;

    @Column(DataType.STRING)
    controllerAddress!: string;

}