import { Application } from 'express';

import { BASE_PATH } from '@global/constants/constants';
import { authRoutes } from '@auth/routes/auth.routes';

export default (app: Application) => {
  const routes = () => {
    app.use(`${BASE_PATH}`, authRoutes.routes());
  };

  routes();
};
