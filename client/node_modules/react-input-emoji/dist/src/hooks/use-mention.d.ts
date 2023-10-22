/**
 * @typedef {import('../types/types').MentionUser} MentionUser
 */
/**
 *
 * @param {(text: string) => Promise<MentionUser[]>=} searchMention
 * @returns {{mentionSearchText: string | null, mentionUsers: MentionUser[], onKeyUp: (event: React.KeyboardEvent) => void, onFocus: () => void, onSelectUser: () => void, loading: boolean}}
 */
export function useMention(searchMention?: (text: string) => Promise<MentionUser[]>): {
    mentionSearchText: string | null;
    mentionUsers: MentionUser[];
    onKeyUp: (event: React.KeyboardEvent) => void;
    onFocus: () => void;
    onSelectUser: () => void;
    loading: boolean;
};
export type MentionUser = import('../types/types').MentionUser;
