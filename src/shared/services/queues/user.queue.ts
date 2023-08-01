import { BaseQueue } from './base.queue';

import { ADD_USER_TO_DB } from '@global/constants/constants';
import { userWorker } from '@worker/user.worker';

class UserQueue extends BaseQueue {
  constructor() {
    super('user.queue');
    this.processJob(`${ADD_USER_TO_DB}`, 5, userWorker.addUserToDB);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addUserJob(jobName: string, data: any): void {
    this.addJob(jobName, data);
  }
}

const userQueue = new UserQueue();

export { userQueue };
