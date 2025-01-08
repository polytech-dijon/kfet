import prisma from '../prisma'
import { Queue } from 'bullmq';
import { Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({ path: "/var/run/redis/redis.sock", maxRetriesPerRequest: null });
const PREFIX = 'command_';

export const commandDeletionQueue = new Queue('commandDeletionQueue', { connection });

/**
 * Known limitation: There is no way to properly cancel an ongoing command deletion with bullmq.
 * This is a workaround to prevent deletion of a command that is not done yet.
 * A more complicated solution is proposed here : https://docs.bullmq.io/patterns/timeout-jobs
 * See GitHub Issue : https://github.com/taskforcesh/bullmq/issues/632
 */
new Worker("commandDeletionQueue", async ({data:{id,expires_at}}: {data:{id:number, expires_at : string}}) => {
    let lineToRemove = await prisma.command.findFirst({
        where: { id: id },
    });
    if(!lineToRemove) return;
    if (lineToRemove.status !== 'DONE') return;
    if(!lineToRemove.expires_at) return;
    if (lineToRemove.expires_at.getTime() === new Date(expires_at).getTime()) {
        await prisma.command.delete({
            where: { id: id },
        });
    }
}, { connection });


export const schedulecommandDeletion = (commandId: number, expiresAt: Date) => {
    const delay = expiresAt.getTime() - new Date().getTime();
    commandDeletionQueue.add(`${PREFIX}${commandId}`, { id: commandId, expires_at : expiresAt }, { removeOnComplete: 1000, delay: delay });
};