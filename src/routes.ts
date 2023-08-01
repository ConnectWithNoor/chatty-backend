import { Application } from 'express';

import { BASE_PATH, BULL_DASHBOARD_PATH } from '@global/constants/constants';
import { authRoutes } from '@auth/routes/auth.routes';
import { serverAdapter } from '@services/queues/base.queue';
import { currentUserRoutes } from '@auth/routes/currentUser.routes';
import { authMiddleware } from '@global/helpers/middlewares/auth.middleware';

export default (app: Application) => {
  const routes = () => {
    // bull dashboard
    app.use(`${BULL_DASHBOARD_PATH}`, serverAdapter.getRouter());
    // auth signup, signin routes
    app.use(`${BASE_PATH}`, authRoutes.routes());
    // auth signout route
    app.use(`${BASE_PATH}`, authRoutes.signoutRoute());
    // currentUser route
    app.use(`${BASE_PATH}`, authMiddleware.verifyUser, currentUserRoutes.routes());
  };

  routes();
};
