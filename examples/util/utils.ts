/**
 * Polls a job until completion, failure, or timeout.
 * 
 * @param client - The ElearningApiClient instance
 * @param jobId - The job ID to poll
 * @param options - Polling options
 * @returns The final Job object
 * @throws Error on timeout, failure, or API errors
 * 
 * @example
 * const exp = await client.createExport({ ... });
 * const finalJob = await waitForJob(client, exp.jobId, { intervalMs: 2000 });
 * console.log('Artifacts:', finalJob.artifacts);
 */
import { ElearningApiClient } from '../../ElearningApiClient.js';
import { Job } from '../../models/Job.js';

export async function waitForJob(
    client: ElearningApiClient,
    jobId: string,
    options: {
        /** Polling interval in ms (default: 1000) */
        intervalMs?: number;
        /** Max timeout in ms (default: 60000, 1 min) */
        timeoutMs?: number;
        /** Throw on 'failed' or 'canceled' (default: true) */
        throwOnError?: boolean;
        /** Exponential backoff multiplier (default: 1.5). Set <=1 to disable backoff */
        backoffMultiplier?: number;
        /** Maximum backoff interval in ms (default: 10000) */
        maxIntervalMs?: number;
    } = {}
): Promise<Job> {
    const {
        intervalMs = 1000,
        timeoutMs = 60000,
        throwOnError = true,
        backoffMultiplier = 1.5,
        maxIntervalMs = 10000,
    } = options;
    const startTime = Date.now();
    let currentDelayMs = intervalMs;

    while (true) {
        if (Date.now() - startTime > timeoutMs) {
            throw new Error(`Job ${jobId} timed out after ${timeoutMs}ms`);
        }

        const job = await client.getJob(jobId);

        if (job.status === Job.status.SUCCEEDED) {
            return job;
        }

        if (throwOnError && (job.status === Job.status.FAILED || job.status === Job.status.CANCELED)) {
            throw new Error(`Job ${jobId} ${job.status}: ${job.error?.detail ?? 'Unknown error'}`);
        }

        // Non-terminal: wait and retry
        await new Promise(resolve => setTimeout(resolve, currentDelayMs));
        if (backoffMultiplier > 1) {
            const next = Math.floor(currentDelayMs * backoffMultiplier);
            currentDelayMs = next > maxIntervalMs ? maxIntervalMs : next;
        }
    }
}

export function getEnv(name: string, fallback?: string): string {
    const value = process.env[name]
    if (value) return value
    if (fallback !== undefined) return fallback
    throw new Error(`Missing required environment variable: ${name}`)
}
