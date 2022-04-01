import { Document, Model } from 'mongoose';
import AppValidation from './app.validation';

export interface AppModel<T extends any | Document> extends Model<any | Document> {

    getValidator(): any | AppValidation;

    searchQuery(query: string): any;

    likeSearchQuery(query: string): any;

    getProcessor(model?: any | AppModel<any | Document>): any;

    softDelete: boolean;
    returnDuplicate: boolean;
    overrideExisting: boolean;

    uniques: any[] | Array<any | object>;
    fillables: any[] | Array<any | object>;
    hiddenFields: any[] | Array<any | object>;
    updatedFillables: any[] | Array<any | object>;


}
