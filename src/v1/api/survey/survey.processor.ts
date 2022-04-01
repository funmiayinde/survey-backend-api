/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppModel } from '../_core/app.model';
import { Document } from 'mongoose';
import ObjectId from 'bson-objectid';
import AppError from '../../../lib/app-error';
import { BAD_REQUEST } from '../../../utils/codes';
import lang from '../../../v1/lang';
import Pagination from '../../../lib/pagination';
import QueryParser from '../../../lib/query-parser';

export type Survey = {
  id: ObjectId;
  name: string;
  options: Option[];
};

export type Option = {
  id: ObjectId;
  description: string;
};

const surveys: Survey[] = [];
const surveyResult: any = {};

/**
 * The SurveyProcessor  class
 * */
class SurveyProcessor {
  // real time db model
  protected _model: AppModel<any | Document>;

  constructor(model?: any | AppModel<any | Document>) {
    this._model = model;
  }

  /**
   * @param {String} name This is used to find survey by the name
   * @returns {Object}
   */
  async findByName(name: string): Promise<any> {
    // if real time model
    // return await this._model.find({name});
    return surveys.find((s: Survey) => s.name === name);
  }

  /**
   * @param {String} id This is used to find survey by the Id
   * @returns {Object}
   */
  async findById(id: string): Promise<any> {
    if (!ObjectId.isValid(id)) {
      throw new AppError(lang.get('error').invalid_id, BAD_REQUEST);
    }
    return surveys.find((s: Survey) => String(s.id) === id);
  }

  /**
   * @param {String} id This is used to find survey by the Id
   * @returns {Object}
   */
  async checkExistOptions(survey: Survey, optionId: string): Promise<any> {
    if (!ObjectId.isValid(optionId)) {
      throw new Error(lang.get('error').invalid_id);
    }
    return survey.options.find(({ id }: Option) => String(id) === optionId);
  }

  /**
   * @param {Survey} survey This payload survey to save
   * @returns {Object}
   */
  async create({ name, options }: Survey): Promise<any> {
    const survey: Survey = {
      name,
      id: ObjectId(),
      options: options.map((option: Option) => ({
        ...option,
        id: ObjectId(),
      })),
    };
    surveys.push(survey);
    surveyResult[String(survey.id)] = {
      ...survey,
      stats: {
        hits: 0,
        options: {
          ...survey.options.reduce((accum: any, curr) => {
            accum[String(curr.id)] = {
              ...curr,
              hits: 0,
            };
            return accum;
          }, {}),
        },
      },
    };
    return survey;
  }

  /**
   * @param {String} surveyId This payload survey Id
   * @returns {Object}
   */
  async takeSurvey({
    surveyId,
    optionId,
  }: {
    surveyId: string;
    optionId: string;
  }): Promise<any> {
    if (!ObjectId.isValid(surveyId) && !ObjectId.isValid(optionId)) {
      throw new AppError(lang.get('error').invalid_id, BAD_REQUEST);
    }
    surveyResult[String(surveyId)].stats.hits++;
    surveyResult[String(surveyId)].stats.options[String(optionId)].hits++;
    return surveyResult[surveyId];
  }

  /**
   * @param {String} surveyId This payload survey Id
   * @returns {Object}
   */
  async surveyResult(surveyId: string): Promise<any> {
    if (!ObjectId.isValid(surveyId)) {
      throw new AppError(lang.get('error').invalid_id, BAD_REQUEST);
    }
    return surveyResult[surveyId];
  }

  /**
   * @param {String} surveyId This payload survey Id
   * @returns {Object}
   */
  async find(queryParser: QueryParser, pagination?: Pagination) {
    if (pagination && queryParser && !queryParser.getAll) {
      const count = surveys.length;
      pagination.totalCount = count;
      if (pagination.morePages(count)) {
        pagination.next = pagination.current + 1;
      }
      return surveys.slice(
        (pagination.current - 1) * pagination.current,
        pagination.perPage * pagination.current,
      );
    }
    return surveys;
  }
}

export default SurveyProcessor;
