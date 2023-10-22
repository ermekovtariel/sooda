export default EmojiPickerContainer;
export type Props = {
    showPicker: boolean;
    theme: 'light' | 'dark' | 'auto';
    handleSelectEmoji: (emoji: import("../types/types").EmojiMartItem) => void;
    disableRecent: boolean;
    customEmojis?: any[] | undefined;
    position?: ('above' | 'below') | undefined;
    language?: import('../types/types').Languages | undefined;
};
/**
 * @typedef {object} Props
 * @property {boolean} showPicker
 * @property {'light' | 'dark' | 'auto'} theme
 * @property {(emoji: import("../types/types").EmojiMartItem) => void} handleSelectEmoji
 * @property {boolean} disableRecent
 * @property {any[]=} customEmojis
 * @property {('above' | 'below')=} position
 * @property {import('../types/types').Languages=} language
 */
/**
 * Emoji Picker Button Component
 * @param {Props} props
 * @return {JSX.Element}
 */
declare function EmojiPickerContainer({ showPicker, theme, handleSelectEmoji, disableRecent, customEmojis, position, language }: Props): JSX.Element;
