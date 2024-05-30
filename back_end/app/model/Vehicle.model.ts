import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

interface IVehicleModel {
    id?: number
    vehicleName: string
}

@Table({
    tableName: 'vehicles'
})

export default class Vehicle extends Model<IVehicleModel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    vehicleName!: string;
}