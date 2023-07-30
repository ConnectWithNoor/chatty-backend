import { DoneCallback, Job } from 'bull';

import { config } from '@root/config';
import { userService } from '@services/db/user.service';

const log = config.createLogger('user.worker');

class UserWorker {
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      // method to send data to DB
      await userService.createUser(value);

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}
const userWorker = new UserWorker();

export { userWorker };
