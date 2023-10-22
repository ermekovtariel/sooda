/**
 * @typedef {Object} Props
 * @property {React.Ref<any>} ref
 * @property {React.MutableRefObject<import('../text-input').Ref | null>} textInputRef
 * @property {(value: string) => void} setValue
 * @property {() => void} emitChange
 */
/**
 *
 * @param {Props} props
 */
export function useExpose({ ref, textInputRef, setValue, emitChange }: Props): void;
export type Props = {
    ref: React.Ref<any>;
    textInputRef: React.MutableRefObject<import('../text-input').Ref | null>;
    setValue: (value: string) => void;
    emitChange: () => void;
};
