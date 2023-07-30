import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from './base.queue';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth.queue');
  }

  public addAuthUserJob(jobName: string, data: IAuthJob): void {
    this.addJob(jobName, data);
  }
}

const authQueue = new AuthQueue();

export { authQueue };
