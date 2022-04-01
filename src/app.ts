/* eslint-disable @typescript-eslint/no-explicit-any */
import config from 'config';
import http from 'http';
import loadRoutes from './routing';
import express, { Request, NextFunction, Response } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Q from 'q';
import path from 'path';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({}));
app.use((req: any | Request, res: any | Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.set('port', config.get('app.port'));

export default loadRoutes(app)
  .then(
    async (app) => {
      const server = await http
        .createServer(app)
        .listen(config.get('app.port'));
      console.log(`\n
	\tApplication listening on ${config.get('app.baseUrl')}\n
	\tEnvironment => ${config.util.getEnv('NODE_ENV')}: ${server}\n
	\tDate: ${new Date()}`);
      return Q.resolve(app);
    },
    (err) => {
      console.log('There was an un catch error');
      console.error(err);
    },
  );
