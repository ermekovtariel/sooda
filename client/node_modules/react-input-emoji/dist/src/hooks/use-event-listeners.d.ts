/**
 * @typedef {import('../types/types').TextInputListeners} TextInputListeners
 */
/** */
export function useEventListeners(): {
    addEventListener: (event: keyof TextInputListeners, fn: import('../types/types').Listerner<any>) => () => void;
    listeners: import("../types/types").TextInputListeners;
};
export type TextInputListeners = import('../types/types').TextInputListeners;
