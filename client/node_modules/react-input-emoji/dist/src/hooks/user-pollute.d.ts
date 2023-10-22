/**
 * @typedef {import('../types/types').PolluteFn} PolluteFn
 */
/** */
export function usePollute(): {
    addPolluteFn: (fn: PolluteFn) => void;
    pollute: (html: string) => string;
};
export type PolluteFn = import('../types/types').PolluteFn;
