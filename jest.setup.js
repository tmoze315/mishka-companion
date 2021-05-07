const { connect, connection } = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
import { registry } from '@alexlafroscia/service-locator';
import { Config } from './src/config/adventure';

const mongodb = new MongoMemoryServer();

beforeAll(async () => {
    const url = await mongodb.getUri();

    await connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoIndex: true,
    });
});

afterAll(async () => {
    await connection.close();
    await mongodb.stop();
});

beforeEach(() => {
    registry.register('Config', Config);
})

afterEach(async () => {
    registry.reset();
    await connection.dropDatabase();
});
