export default MentionWrapper;
export type MetionUser = import('../types/types').MentionUser;
export type TextInputListeners = import('../types/types').TextInputListeners;
export type SanitizeFn = import('../types/types').SanitizeFn;
export type Props = {
    searchMention?: (text: string) => Promise<MetionUser[]>;
    addEventListener: (event: keyof TextInputListeners, fn: import('../types/types').Listerner<any>) => () => void;
    appendContent: (html: string) => void;
    addSanitizeFn: (fn: SanitizeFn) => void;
};
/**
 * @typedef {import('../types/types').MentionUser} MetionUser
 */
/**
 * @typedef {import('../types/types').TextInputListeners} TextInputListeners
 */
/**
 * @typedef {import('../types/types').SanitizeFn} SanitizeFn
 */
/**
 * @typedef {Object} Props
 * @property {(text: string) => Promise<MetionUser[]>=} searchMention
 * @property {(event: keyof TextInputListeners, fn: import('../types/types').Listerner<any>) => () => void} addEventListener
 * @property {(html: string) => void} appendContent
 * @property {(fn: SanitizeFn) => void} addSanitizeFn
 */
/** @type {React.FC<Props>} */
declare const MentionWrapper: React.FC<Props>;
import React from "react";
