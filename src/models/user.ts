export interface User {
    id?: string;
    name: string;
    passwordHash: string;
    my_friends?: string[];
    friendRequests?: { [key: string]: true };
}
