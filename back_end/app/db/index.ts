import { Sequelize } from 'sequelize-typescript'
import DB_CONFIG from '../config/db_config'
import User from '../model/User.model'
import UserService from '../service/UserService'
import TokenBlackListItem from '../model/TokenBlackListItem.model'
import TestProcess from '../model/TestProcess.model'
import TestObject from '../model/TestObject.model'
import CollectorSignal from '../model/CollectorSignal.model'
import ControllerService from '../service/ControllerService'
import CollectorService from '../service/CollectorService'
import SignalService from '../service/SignalService'
import Controller from '../model/Controller.model'
import Collector from '../model/Collector.model'
import Signal from '../model/Signal.model'
import SendTestConfigRecord from '../model/SendTestConfigRecord.model'
import SendTestConfigVeriftCache from '../model/SendTestConfigVerifyCache.model'

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = DB_CONFIG

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: DB_PORT,
  logging: false,
  models: [User, TokenBlackListItem, TestProcess, TestObject, CollectorSignal, Controller, Collector, Signal, SendTestConfigRecord, SendTestConfigVeriftCache]
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
      // 初始化核心板卡
      await ControllerService.initControllers()
      // 初始化采集板卡
      await CollectorService.initCollectors()
      // 初始化采集信号
      await SignalService.initSignals()
      // 初始化超级用户表
      await UserService.initRootUser()
      console.log('The database table has been initialized.');
    } catch (error) {
      console.error('Description Database table initialization failed:', error);
    }
  },
  async closeConnection() {
    await sequelize.close()
  }
}
export default DB_OPT