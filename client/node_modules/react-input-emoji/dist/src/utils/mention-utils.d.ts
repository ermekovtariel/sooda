/**
 *
 * @return {string | null}
 */
export function getTextFromAtToCaret(): string | null;
/** */
export function deleteTextFromAtToCaret(): void;
/**
 *
 * @return {{element: Node, caretOffset: number}}
 */
export function getElementWithFocus(): {
    element: Node;
    caretOffset: number;
};
