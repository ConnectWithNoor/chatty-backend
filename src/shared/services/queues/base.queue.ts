import Logger from 'bunyan';
import Queue, { Job } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

import { config } from '@root/config';
import { BULL_DASHBOARD_PATH } from '@global/constants/constants';
import { IAuthJob } from '@auth/interfaces/auth.interface';

// list of bull adapters
let bullAdapter: BullAdapter[] = [];

// bull dashboard respresentative
let serverAdapter: ExpressAdapter;

type IBaseJobData = IAuthJob;

abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);

    // push every queue to bullAdapter
    bullAdapter.push(new BullAdapter(this.queue));
    // remove duplicates
    bullAdapter = [...new Set(bullAdapter)];

    // bull Dashboard path
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(BULL_DASHBOARD_PATH);

    // bull dashboard creation
    createBullBoard({
      queues: bullAdapter,
      serverAdapter
    });

    this.log = config.createLogger(queueName);

    // remove job from queue, when it is completed
    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} is completed`);
    });

    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }

  protected addJob(jobName: string, data: IBaseJobData): void {
    // can retry 3 times for 5 fixed seconds in case of failture.
    this.queue.add(jobName, data, {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 5000
      }
    });
  }

  protected processJob(jobName: string, concurrency: number, cb: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(jobName, concurrency, cb);
  }
}

export { BaseQueue, serverAdapter };
