/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Router } from 'express';
import { SurveyController } from './survey.controller';
// import { SurveyModel } from './survey.model';

const router = Router();

const ctrl = new SurveyController();

router.route('/surveys').get(ctrl.find).post(ctrl.create);
router.route('/surveys/:id/result').get(ctrl.findSurveyResult);
router.route('/surveys/submit').post(ctrl.submitSurvey);

export default router;
