/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import * as _ from 'lodash';
import mongoose from 'mongoose';

/**
 * The QueryParser class
 * */
class QueryParser {
    private _query: any;
    private _all: any;
    private _sort: any;
    private _search: any;
    private _filters: any;
    private _population: any | Array<object | any> | object;
    private _selection: any;

    /**
     * @constructor
     * @param {Object} query This is a query object of the request
     * */
    constructor(query: any | object) {
        this._query = query;
        this.initialize(query);
        const excluded: string[] = [
            'per_page',
            'page',
            'limit',
            'sort',
            'all',
            'includes',
            'filters',
            'selection',
            'population',
            'search',
            'regex',
            'nested',
        ];
        // omit special query string keys from query before passing down to the model for filtering
        this._query = _.omit(this._query, ...excluded);
        // Only get collection that has not been virtually deleted
        _.extend(this._query, {deleted: false});
        Object.assign(this, this._query);
    }

    /**
     * Initialize all the special object required for the find query
     * @param {Object} query This is a query object of the request
     * */
    initialize(query: any | object) {
        this._all = query.all;
        this._sort = query.sort;
        if (query.population) {
            this.population = query.population;
        }
        if (query.selection) {
            this.selection = query.selection;
        }
        if (query.search) {
            this._search = query.search;
        }
        if (query.filters) {
            try {
                this._filters = JSON.parse(query.filters);
            } catch (e) {
                console.log('filter-error:', e.getMessages());
            }
        }
        if (query.nested) {
            this._query = {...this._query, ...this.processNestedQuery(query)};
        }
        if (query.regex) {
            this._query = {...this._query, ...this.processRegSearch(query)};
        }
    }

    /**
     * @return {Object} get the parsed query
     * */
    get query() {
        return this._query;
    }

    /**
     * @return {Object} get the parsed query
     * */
    get search() {
        return this._search;
    }

    /**
     * @return {Object} get the parsed query
     * */
    get filters() {
        return this._filters;
    }

    /**
     * @return {Boolean} get the value for all data request
     * */
    get getAll() {
        return this._all;
    }


    /**
     * @return {Object} get the parsed query
     * */
    get selection() {
        if (this._selection) {
            return this._selection;
        }
        return [];
    }

    /**
     * @param {Object} value is the population for object
     * */
    set population(value) {
        this._population = value;
        if (!_.isObject(value)) {
            try {
                this._population = JSON.parse(value.toString());
            } catch (e) {
                console.log('population-error:', e);
            }
        }
    }

    /**
     * @return {Object} get the population object for query
     * */
    get population() {
        if (this._population) {
            return this._population;
        }
        return [];
    }

    /**
     * @param {Object} value is the selection object
     * */
    set selection(value) {
        this._selection = value;
    }

    /**
     * @return {Object} get the sort property
     * */
    get sort() {
        if (this._sort) {
            return this._sort;
        }
        return '-createdAt';
    }

    /**
     * @param {Object} query is the query object
     * @return {Object} the nested query
     * */
    processNestedQuery(query: any | object): any {
        let value: any = query.nested;
        const result: any = {};
        if (value) {
            try {
                value = JSON.parse(value.toString());
                for (const filter of value) {
                    if (filter.hasOwnProperty('key') && filter.hasOwnProperty('value')) {
                        filter.value = {$in: filter.value.in_array.map((v: any) => mongoose.Types.ObjectId(v))};
                    }
                    result[filter.key] = filter.value;
                }
            } catch (e) {
                console.log(e);
            }
        }
        return result;
    }

    /**
     * @param {Object} query is the query object
     * @return {Object} the nested query
     * */
    processRegSearch(query: any | object): any {
        const value = query.regex;
        const result: any = {};
        if (!_.isObject(value)) {
            try {
                const regex = JSON.parse(value.toString());
                for (const r of regex) {
                    const q = new RegExp(r.value);
                    result[r.key] = {$regex: q, $options: 'i'};
                }
            } catch (e) {
                console.log(e);
            }
        }
        return result;
    }
}

export default QueryParser;
