import { BaseQueue } from './base.queue';

import { IAuthJob } from '@auth/interfaces/auth.interface';

import { ADD_AUTH_USER_TO_DB } from '@global/constants/constants';
import { authWorker } from '@worker/auth.worker';

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth.queue');
    this.processJob(`${ADD_AUTH_USER_TO_DB}`, 5, authWorker.addAuthUserToDB);
  }

  public addAuthUserJob(jobName: string, data: IAuthJob): void {
    this.addJob(jobName, data);
  }
}

const authQueue = new AuthQueue();

export { authQueue };
