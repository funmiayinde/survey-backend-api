import Validator = require('validatorjs');
/**
 * The App Validation class
 * */
class AppValidation {
    /**
     * @param {Object} obj The object to validate
     * @return {Object} ValidatorD
     * */
    create(obj: any | object): any | object {
        const rules: Validator.Rules = {};
        const validator = new Validator(obj, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes(),
        };
    }

    /**
     * @param {Object} obj The object
     * @return {Object} ValidatorD
     * */
    update(obj: any): any | object {
        const rules: Validator.Rules = {};
        const validator = new Validator(obj, rules);
        return {
            errors: validator.errors.all(),
            passed: validator.passes(),
        };
    }
}

export default AppValidation;
