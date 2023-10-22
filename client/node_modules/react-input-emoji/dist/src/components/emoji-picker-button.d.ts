export default EmojiPickerButton;
export type Props = {
    showPicker: boolean;
    toggleShowPicker: (event: React.MouseEvent) => void;
    buttonElement?: HTMLDivElement | undefined;
    buttonRef?: React.MutableRefObject<any> | undefined;
};
/**
 * @typedef {object} Props
 * @property {boolean} showPicker
 * @property {(event: React.MouseEvent) => void} toggleShowPicker
 * @property {HTMLDivElement=} buttonElement
 * @property {React.MutableRefObject=} buttonRef
 */
/**
 * Emoji Picker Button Component
 * @param {Props} props
 * @return {JSX.Element}
 */
declare function EmojiPickerButton({ showPicker, toggleShowPicker, buttonElement, buttonRef }: Props): JSX.Element;
import React from "react";
