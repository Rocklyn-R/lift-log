import { createSettings, getSettings, setUnitSystem } from 'controllers/settings';
import express from 'express';
import { changeUserPassword } from 'controllers/users';

const settingsRouter = express.Router();

settingsRouter.post('/', createSettings);

settingsRouter.get('/', getSettings);

settingsRouter.put('/unit-system', setUnitSystem);

settingsRouter.put('/change-password', changeUserPassword);

export default settingsRouter;