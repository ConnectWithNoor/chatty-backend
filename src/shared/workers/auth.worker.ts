import { DoneCallback, Job } from 'bull';

import { config } from '@root/config';
import { authService } from '@services/db/auth.service';

const log = config.createLogger('auth.worker');

class AuthWorker {
  async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      // method to send data to DB
      await authService.createAuthUser(value);

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}
const authWorker = new AuthWorker();

export { authWorker };
