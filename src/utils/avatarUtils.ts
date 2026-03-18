/**
 * Avatar utility — returns random human face images from the local dataset
 * stored in /public/avatars/
 * 
 * 200 AI-Generated face images (000001.jpg – 000200.jpg) are available.
 * Dan's profile pic goes in /public/my-avatar/ — the helper below returns
 * that path when a "me" / "myAvatar" is needed.
 */

const AVATAR_COUNT = 200;

// Returns a consistent random avatar for a given seed string (e.g. username)
// So the same person always gets the same face within a session.
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return Math.abs(hash);
}

function pad(n: number): string {
    return String(n).padStart(6, '0');
}

/** Pick a SEEDED avatar based on any string key (username, name, index…). */
export function getSeededAvatar(seed: string): string {
    const index = (hashCode(seed) % AVATAR_COUNT) + 1;
    return `/avatars/${pad(index)}.jpg`;
}

/** Pick a RANDOM avatar (changes each render / call). */
export function getRandomAvatar(): string {
    const index = Math.floor(Math.random() * AVATAR_COUNT) + 1;
    return `/avatars/${pad(index)}.jpg`;
}

/** Dan's own profile picture path.
 *  Drop any image into public/my-avatar/ and name it "profile.jpg".
 *  Falls back to a random face if the folder is empty. */
export const MY_AVATAR = '/my-avatar/profile.jpg';

/** Generates an array of N unique random face URLs */
export function getRandomAvatars(count: number): string[] {
    const indices = new Set<number>();
    while (indices.size < Math.min(count, AVATAR_COUNT)) {
        indices.add(Math.floor(Math.random() * AVATAR_COUNT) + 1);
    }
    return Array.from(indices).map(i => `/avatars/${pad(i)}.jpg`);
}
