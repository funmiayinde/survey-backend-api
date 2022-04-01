/* eslint-disable @typescript-eslint/camelcase */
require('dotenv').config();

const PORT = process.env.PORT || 4042;
module.exports = {
    app: {
        appName: process.env.APP_NAME || 'Survey-API',
        environment: process.env.NODE_ENV || 'development',
        superSecret: process.env.SERVER_SECRET || 'Survey',
        encryption_key: process.env.SERVER_SECRET || 'appSecret',
        baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`,
        port: PORT,
    },
    services: {
        survey: process.env.SURVEY || 'SURVEY',
    },
    api: {
        lang: 'en',
        surveyApiKey: process.env.API_KEY || '',
        prefix: '^/api/v[1-9]',
        versions: [1],
        pagination: {
            itemsPerPage: 10,
        },
    },
};
