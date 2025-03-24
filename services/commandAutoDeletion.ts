import prisma from '../prisma'
import { Queue } from 'bullmq';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { env } from 'process';

const connection = new Redis({ host : env.REDIS_HOST, port: Number(env.REDIS_PORT), maxRetriesPerRequest: null });
const PREFIX = 'command_';

export const commandDeletionQueue = new Queue('commandDeletionQueue', { connection });

/**
 * Known limitation: There is no way to properly cancel an ongoing command deletion with bullmq.
 * This is a workaround to prevent deletion of a command that is not done yet.
 * A more complicated solution is proposed here : https://docs.bullmq.io/patterns/timeout-jobs
 * See GitHub Issue : https://github.com/taskforcesh/bullmq/issues/632
 */
new Worker("commandDeletionQueue", async (job) => {
    let lineToRemove = await prisma.command.findFirst({
        where: { id: job.data.id },
    });
    if (lineToRemove?.status !== 'DONE') {
        return;
    }
    if ((lineToRemove?.expires_at?.getUTCDate() ?? 0) <= new Date().getUTCDate()) {
        await prisma.command.delete({
            where: { id: job.data.id },
        });
    }
}, { connection });


export const schedulecommandDeletion = (commandId: number, expiresAt: Date) => {
    const delay = expiresAt.getTime() - new Date().getTime();
    commandDeletionQueue.add(`${PREFIX}${commandId}`, { id: commandId }, { removeOnComplete: 1000, delay: delay });
};
