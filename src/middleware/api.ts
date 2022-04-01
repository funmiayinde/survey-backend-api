import { Response, Request, NextFunction } from 'express';
import config from 'config';
import AppError from '../lib/app-error';
import { UNAUTHORIZED } from '../utils/codes';

export default async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.body.api_key || req.headers['x-api-key'];
  if (!apiKey) {
    return next(new AppError('Api key absent', UNAUTHORIZED));
  }
  if (apiKey) {
    if (
      apiKey !== config.get('api.surveyApiKey') &&
      !process.env.API_KEY.includes(apiKey)
    ) {
      return next(new AppError('Invalid Api Key', UNAUTHORIZED));
    }
  }
  return next();
};
