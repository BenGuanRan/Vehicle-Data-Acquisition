import { Sequelize } from 'sequelize-typescript'
import DB_CONFIG from '../config/db_config'
import User from '../model/User.model'
import UserService from '../service/UserService'

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = DB_CONFIG

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT,
  models: [User]
});

const DB_OPT = {
  async connectDB() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  },
  async initDB() {
    try {
      await sequelize.sync({ force: true })
      await UserService.initRootUser()
      console.log('The database table has been initialized.');
      // 初始化超级用户表
    } catch (error) {
      console.error('Description Database table initialization failed:', error);
    }
  },
  async closeConnection() {
    await sequelize.close()
  }
}
export default DB_OPT