import { Router } from 'express';

import survey from './api/survey/survey.route';

const router: Router = Router();

router.use(survey);

export default router;
