import { Router } from 'express';

import { CurrentUser } from '@auth/controllers/currentUser.controller';
import { authMiddleware } from '@global/helpers/middlewares/auth.middleware';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    // middleware to check if the user is authenticated.
    this.router.get('/currentuser', authMiddleware.checkAuthentication, CurrentUser.prototype.read);

    return this.router;
  }
}

const currentUserRoutes = new CurrentUserRoutes();

export { currentUserRoutes };
