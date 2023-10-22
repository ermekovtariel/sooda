export default MentionUserListWithRef;
export type MentionUser = import('../types/types').MentionUser;
export type TextInputListeners = import('../types/types').TextInputListeners;
export type Props = {
    users: MentionUser[];
    mentionSearchText: string | null;
    onSelect: (user: MentionUser) => void;
    addEventListener: (event: keyof TextInputListeners, fn: import('../types/types').Listerner<any>) => () => void;
};
export type Ref = {
    prevUser: () => void;
    nextUser: () => void;
};
declare const MentionUserListWithRef: React.ForwardRefExoticComponent<Props & React.RefAttributes<Ref>>;
import React from "react";
