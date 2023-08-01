import { Router } from 'express';

import { Signin } from '@auth/controllers/signin.controller';
import { Signout } from '@auth/controllers/signout.controller';
import { Signup } from '@auth/controllers/signup.controller';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/signin', Signin.prototype.read);

    return this.router;
  }

  public signoutRoute(): Router {
    this.router.get('/signout', Signout.prototype.update);

    return this.router;
  }
}

const authRoutes = new AuthRoutes();

export { authRoutes };
