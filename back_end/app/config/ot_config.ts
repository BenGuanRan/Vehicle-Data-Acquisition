import 'dotenv/config'

// 其他配置
export default {
    ROOT_USERNAME: process.env.ROOT_USERNAME!,
    ROOT_PASSWORD: process.env.ROOT_PASSWORD!,
    TEST_ROOT_USERNAME: process.env.TEST_ROOT_USERNAME!,
    TEST_ROOT_PASSWORD: process.env.TEST_ROOT_PASSWORD!,
    BASE_USER_COUNT: Number(process.env.BASE_USER_COUNT!),
    TOKEN_PRIVATE_KEY: process.env.TOKEN_PRIVATE_KEY!,
    TOKEN_EXPIRE: Number(process.env.TOKEN_EXPIRE!),
    TEST_CONFIG_FILE_NAME: process.env.TEST_CONFIG_FILE_NAME
}