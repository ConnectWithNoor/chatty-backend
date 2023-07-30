import { Application } from 'express';

import { BASE_PATH, BULL_DASHBOARD_PATH } from '@global/constants/constants';
import { authRoutes } from '@auth/routes/auth.routes';
import { serverAdapter } from '@services/queues/base.queue';

export default (app: Application) => {
  const routes = () => {
    app.use(`${BULL_DASHBOARD_PATH}`, serverAdapter.getRouter());
    app.use(`${BASE_PATH}`, authRoutes.routes());
  };

  routes();
};
