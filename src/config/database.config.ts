import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: process.env.DB_TYPE,
    host: process.env.DB_DATABASE_HOST,
    port: parseInt(process.env.DB_HOST_PORT, 10),
    password: process.env.DB_ROOT_PASSWORD,
    name: process.env.DB_DATABASE_NAME,
    username: process.env.DB_USER_ROOT,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    // maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
}));


