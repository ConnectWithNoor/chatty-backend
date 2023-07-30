import { Signin } from '@auth/controllers/signin.controller';
import { Signup } from '@auth/controllers/signup.controller';
import { Router } from 'express';

class AuthRoutes {
  private router: Router;
  signinService: Signin;

  constructor() {
    this.router = Router();
    this.signinService = new Signin();
  }

  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/signin', this.signinService.read);

    return this.router;
  }
}

const authRoutes = new AuthRoutes();

export { authRoutes };
