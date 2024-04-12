import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

interface ITokenBlackListItemModel {
    token: string,
    timestamp: number
}

@Table({
    tableName: 'token_black_list',
    timestamps: false
})
export default class TokenBlackListItem extends Model<ITokenBlackListItemModel> {

    @AllowNull(false)
    @PrimaryKey
    @Column(DataType.STRING)
    token!: string;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    timestamp!: number;

}