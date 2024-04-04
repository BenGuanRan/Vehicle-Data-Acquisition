import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'
import OT_CONFIG from '../config/ot_config'

interface IUserModel {
    id?: number
    username: string
    password: string
    disabled?: boolean
    is_root_user?: boolean
}

@Table({
    tableName: 'users',
    timestamps: false
})
export class User extends Model<IUserModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

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
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_root_user!: boolean

    static async initRootUser() {
        try {
            await this.bulkCreate([{
                username: OT_CONFIG.ROOT_USERNAME,
                password: OT_CONFIG.ROOT_PASSWORD,
                is_root_user: true
            }, {
                username: OT_CONFIG.TEST_ROOT_USERNAME,
                password: OT_CONFIG.TEST_ROOT_PASSWORD,
                is_root_user: true
            }]);
            console.log('The super user table was successfully initialized. Procedure.');
        } catch (error) {
            console.error('Description Failed to initialize the super user table:', error);
        }
    }
}