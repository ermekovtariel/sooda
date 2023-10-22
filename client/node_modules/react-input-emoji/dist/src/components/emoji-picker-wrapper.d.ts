export default EmojiPickerWrapper;
export type SanitizeFn = import('../types/types').SanitizeFn;
export type PolluteFn = import('../types/types').PolluteFn;
export type Props = {
    theme: 'light' | 'dark' | 'auto';
    keepOpened: boolean;
    disableRecent: boolean;
    customEmojis?: any[] | undefined;
    addSanitizeFn: (fn: SanitizeFn) => void;
    addPolluteFn: (fn: PolluteFn) => void;
    appendContent: (html: string) => void;
    buttonElement?: HTMLDivElement | undefined;
    buttonRef?: React.MutableRefObject<any> | undefined;
    language?: import('../types/types').Languages | undefined;
};
/**
 * @typedef {import('../types/types').SanitizeFn} SanitizeFn
 */
/**
 * @typedef {import('../types/types').PolluteFn} PolluteFn
 */
/**
 * @typedef {Object} Props
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {boolean} keepOpened
 * @property {boolean} disableRecent
 * @property {any[]=} customEmojis
 * @property {(fn: SanitizeFn) => void} addSanitizeFn
 * @property {(fn: PolluteFn) => void} addPolluteFn
 * @property {(html: string) => void} appendContent
 * @property {HTMLDivElement=} buttonElement
 * @property {React.MutableRefObject=} buttonRef
 * @property {import('../types/types').Languages=} language
 */
/** @type {React.FC<Props>} */
declare const EmojiPickerWrapper: React.FC<Props>;
import React from "react";
