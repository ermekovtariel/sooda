/**
 * useEmit
 * @param {React.MutableRefObject<import('../text-input').Ref | null>} textInputRef
 * @param {(size: {width: number, height: number}) => void} onResize
 * @param {(text: string) => void} onChange
 */
export function useEmit(textInputRef: React.MutableRefObject<import('../text-input').Ref | null>, onResize: (size: {
    width: number;
    height: number;
}) => void, onChange: (text: string) => void): (sanitizedText: any) => void;
