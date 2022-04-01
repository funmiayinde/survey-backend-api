import { Schema } from 'mongoose';
import AppValidation from './app.validation';
import { AppModel } from './app.model';
import * as util from 'util';


/**
 * The Base types object where other types inherits or
 * overrides pre defined and static methods
 * */
class AppSchema extends Schema {
    statics: any;

    constructor(...args: any | object) {
        super();
        Schema.apply(this, args);
        this.statics.softDelete = true;
        this.statics.uniques = [];
        this.statics.returnDuplicate = false;
        this.statics.fillables = [];
        this.statics.hiddenFields = [];
        this.statics.updatedFillables = [];

        /**
         * @return {Object} The validator object with the specified rules
         * */
        this.statics.getValidator = (): any | AppValidation => {
            return new AppValidation();
        };

    }
}

util.inherits(AppSchema, Schema);

export default AppSchema;
