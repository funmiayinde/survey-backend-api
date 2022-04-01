/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { AppModel } from '../_core/app.model';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../../lib/app-error';
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  NOT_FOUND,
  OK,
} from '../../../utils/codes';
import lang from '../../lang';
import AppResponse from '../../../lib/app-response';
import SurveyProcessor, { Survey } from './survey.processor';
import SurveyValidation from './survey.validation';
import Pagination from '../../../lib/pagination';
import _ from 'lodash';
import QueryParser from '../../../lib/query-parser';

/**
 * The SurveyController
 * */
export class SurveyController {
  private processor: SurveyProcessor;

  /**
   * @param {Model} model The name property is inherited from the parent
   */
  constructor(model?: any | AppModel<any>) {
    this.processor = new SurveyProcessor(model);
    this.create = this.create.bind(this);
    this.find = this.find.bind(this);
    this.submitSurvey = this.submitSurvey.bind(this);
    this.findSurveyResult = this.findSurveyResult.bind(this);
  }

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async create(
    req: any | object | Request,
    res: any | object | Response,
    next: any | object | NextFunction,
  ) {
    try {
      const body = req.body;
      const validator = SurveyValidation.create(body);
      if (!validator.passed) {
        return next(
          new AppError(lang.get('error').input, BAD_REQUEST, validator.errors),
        );
      }
      const { name, options } = body;
      const survey = await this.processor.findByName(name);
      if (survey && Object.keys(survey).length) {
        return next(
          new AppError(
            `Name: ${name} already exist use a different survey name`,
            CONFLICT,
          ),
        );
      }
      const data = await this.processor.create({ name, options } as Survey);
      const meta = AppResponse.getSuccessMeta();
      meta.code = CREATED;
      meta.message = lang.get('surveys').created;
      return res.status(CREATED).json(AppResponse.format(meta, data));
    } catch (e) {
      return next(e);
    }
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async find(
    req: Request,
    res: any | object | Response,
    next: any | object | NextFunction,
  ) {
    try {
      const queryParser: QueryParser = new QueryParser(
        Object.assign({}, req.query),
      );
      const pagination: Pagination = new Pagination(req.originalUrl);
      const data = await this.processor.find(queryParser, pagination);
      const meta = AppResponse.getSuccessMeta();
      meta.code = OK;
      meta.pagination = pagination.done();
      return res.status(OK).json(AppResponse.format(meta, data));
    } catch (e) {
      return next(e);
    }
  }

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async submitSurvey(
    req: Request,
    res: any | object | Response,
    next: any | object | NextFunction,
  ) {
    try {
      const surveyList: any[] = req.body;
      if (!_.isArray(surveyList)) {
        return next(
          new AppError(lang.get('error').invalid_survey, BAD_REQUEST),
        );
      }
      await Promise.all(
        surveyList.map(async (s) => {
          const survey = await this.processor.findById(s.surveyId);
          if (survey && Object.keys(survey).length > 0) {
            const option = await this.processor.checkExistOptions(
              survey,
              s.optionId,
            );
            if (!option) {
              throw new Error(
                `This answer Id: ${s.optionId} for survey id ${s.surveyId} does not exit `,
              );
            }
          } else {
            throw new Error(
              `This Survey Id: ${s.surveyId} for survey id ${s.surveyId} does not exit `,
            );
          }
        }),
      );
      const data = await Promise.all(
        surveyList.map(
          async ({ surveyId, optionId }) =>
            await this.processor.takeSurvey({ surveyId, optionId }),
        ),
      );
      const meta = AppResponse.getSuccessMeta();
      meta.code = OK;
      return res
        .status(OK)
        .json(
          AppResponse.format(
            meta,
            data
              ? {message: lang.get('surveys').submitted}
              : {message: lang.get('error').unsuccessful_survey},
          ),
        );
    } catch (e) {
      return next(new AppError(e.message, NOT_FOUND));
    }
  }

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next The callback to the next program handler
   * @return {Object} res The response object
   */
  async findSurveyResult(
    req: any | object | Request,
    res: any | object | Response,
    next: any | object | NextFunction,
  ) {
    try {
      const params = req.params;
      const validator = SurveyValidation.surveyResult(params);
      if (!validator.passed) {
        return next(
          new AppError(lang.get('error').input, BAD_REQUEST, validator.errors),
        );
      }
      const { id } = params || {};
      const data = await this.processor.surveyResult(id);
      if (!data) {
        return next(new AppError(lang.get('surveys').not_found, NOT_FOUND));
      }
      const meta = AppResponse.getSuccessMeta();
      meta.code = OK;
      return res.status(OK).json(AppResponse.format(meta, data));
    } catch (e) {
      return next(e);
    }
  }
}

export default SurveyController;
