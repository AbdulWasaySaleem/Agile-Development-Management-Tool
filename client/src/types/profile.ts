export interface UserProfile {
  user: {
    _id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    address?: string;
    biography?: string;
    profilePicture?: { url?: string } | null;
    socials?: Partial<Record<"twitter"|"github"|"linkedin"|"instagram"|"dribbble", string>>;
    locations: string[];
    skills?: string[];
  };
}
