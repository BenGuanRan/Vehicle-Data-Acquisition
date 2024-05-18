import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

export interface ISendTestConfigVerifyCacheModel {
    id?: number
    userId: number
    testProcessId: number,
    controllerAddress: string,
    controllerServerPort: number
    collectorAddress: string
    checkPass?: boolean
}

@Table({
    tableName: 'send_test_config_verify_caches',
    timestamps: false
})
export default class SendTestConfigVeriftCache extends Model<ISendTestConfigVerifyCacheModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Column(DataType.INTEGER)
    userId!: number;

    @Column(DataType.INTEGER)
    testProcessId!: number;

    @Column(DataType.STRING)
    controllerAddress!: string;

    @Column(DataType.INTEGER)
    controllerServerPort!: number;

    @Column(DataType.STRING)
    collectorAddress!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    checkPass!: boolean

}