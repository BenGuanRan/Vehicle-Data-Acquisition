import 'dotenv/config'

// 数据库基本配置
export default {
    DB_NAME: process.env.DB_NAME!,
    DB_USERNAME: process.env.DB_USERNAME!,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT)
}