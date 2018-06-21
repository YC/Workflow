import { CronJob } from 'cron';

// Import rep credit functions
import { creditMemberRep, creditTeamRep } from './rep';

// Set default rep amounts
const MEMBER_REP_AMOUNT: number = 20;
const TEAM_REP_AMOUNT: number = 20;

// Default timezone
const TIMEZONE: string = 'Australia/Melbourne';

// Run every Sunday, at 11:59:00
new CronJob(
    '00 59 23 * * 0',
    async () => {
        // Credit team and member rep
        await creditMemberRep(MEMBER_REP_AMOUNT);
        await creditTeamRep(TEAM_REP_AMOUNT);
    },
    undefined,
    true,
    TIMEZONE
);
