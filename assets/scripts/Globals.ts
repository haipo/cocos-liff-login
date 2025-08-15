export interface UserProfile {
    userId?: string;
    displayName?: string;    
    pictureUrl?: string;
}

export const globals: { userProfile: UserProfile | null } = {
    userProfile: null,
};
