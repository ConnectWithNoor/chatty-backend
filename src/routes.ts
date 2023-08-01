import { Application } from 'express';

import { BASE_PATH, BULL_DASHBOARD_PATH } from '@global/constants/constants';
import { authRoutes } from '@auth/routes/auth.routes';
import { serverAdapter } from '@services/queues/base.queue';
import { currentUserRoutes } from '@auth/routes/currentUser.routes';

export default (app: Application) => {
  const routes = () => {
    // bull dashboard
    app.use(`${BULL_DASHBOARD_PATH}`, serverAdapter.getRouter());
    // auth signup, signin routes
    app.use(`${BASE_PATH}`, authRoutes.routes());
    // auth signout route
    app.use(`${BASE_PATH}`, authRoutes.signoutRoute());
    // currentUser route
    // middleware to check if the user is signin.
    app.use(`${BASE_PATH}`, currentUserRoutes.routes());
  };

  routes();
};
