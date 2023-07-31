import { Signin } from '@auth/controllers/signin.controller';
import { Signup } from '@auth/controllers/signup.controller';
import { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/signin', Signin.prototype.read);
    this.router.post('/signup', Signup.prototype.create);

    return this.router;
  }
}

const authRoutes = new AuthRoutes();

export { authRoutes };
