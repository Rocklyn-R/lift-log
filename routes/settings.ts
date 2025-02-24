import { confirmEmailChange, createSettings, getSettings, setPendingEmail, setTheme, setUnitSystem } from '../controllers/settings';
import express from 'express';
import { changeUserPassword } from '../controllers/users';

const settingsRouter = express.Router();

settingsRouter.post('/', createSettings);

settingsRouter.get('/', getSettings);

settingsRouter.put('/unit-system', setUnitSystem);

settingsRouter.put('/change-password', changeUserPassword);

settingsRouter.put('/theme', setTheme);

settingsRouter.put('/email-pending', setPendingEmail);

settingsRouter.get('/validate-email-token');

settingsRouter.put('/confirm-email', confirmEmailChange);

export default settingsRouter;