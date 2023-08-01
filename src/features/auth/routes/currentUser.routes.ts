import { Router } from 'express';

import { CurrentUser } from '@auth/controllers/currentUser.controller';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/currentuser', CurrentUser.prototype.read);

    return this.router;
  }
}

const currentUserRoutes = new CurrentUserRoutes();

export { currentUserRoutes };
