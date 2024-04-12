import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

interface IUserModel {
    id?: number
    username: string
    password: string
    disabled?: boolean
    root_user_id?: number | null
}

@Table({
    tableName: 'users',
    timestamps: false
})
export default class User extends Model<IUserModel> {

    @PrimaryKey
    @Column(DataType.INTEGER)
    token!: number;

    @Column(DataType.STRING)
    username!: string;

    @Column(DataType.STRING)
    password!: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    disabled!: boolean

    @Column({
        type: DataType.INTEGER,
        defaultValue: null,
        allowNull: true
    })
    root_user_id?: number | null
}