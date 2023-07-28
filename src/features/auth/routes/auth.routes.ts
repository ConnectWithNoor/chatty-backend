import { Signup } from '@auth/controllers/signup.controller';
import { Router } from 'express';

class AuthRoutes {
  private router: Router;
  private signupController: Signup;

  constructor() {
    this.router = Router();
    this.signupController = new Signup();
  }

  public routes(): Router {
    this.router.post('/signup', this.signupController.create);

    return this.router;
  }
}

const authRoutes = new AuthRoutes();

export { authRoutes };
