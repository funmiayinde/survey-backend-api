/* eslint-disable @typescript-eslint/no-explicit-any */
import Validator from 'validatorjs';
import AppValidation from '../_core/app.validation';

/**
 * The SurveyValidation  class
 * */
export default class SurveyValidation extends AppValidation {
  /**
   * @param {Object} obj The object to validate
   * @return {Object} ValidatorD
   * */
  static create(obj: any | object): any | object {
    const rules: Validator.Rules = {
      name: 'required',
      options: 'required|array',
      'options*.description': 'required|string'
    };
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }

  /**
   * @param {Object} obj The object to validate
   * @return {Object} ValidatorD
   * */
  static surveyResult(obj: any | object): any | object {
    const rules: Validator.Rules = {
      id: 'required',
    };
    const validator = new Validator(obj, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }
}
