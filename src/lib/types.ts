export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkHub {
  id: string;
  userId: string;
  name: string;
  slug: string;
  bio?: string | null;
  avatar?: string | null;
  theme: string;
  customBackground?: string | null;
  isPersonal: boolean;
  isActive: boolean;
  buttonTextColor: string | null;
  buttonColor: string| null;
  textColor: string| null;
  backgroundType: string| null;
  backgroundColor: string| null;
  backgroundGradient: string| null;
  backgroundImage: string| null;
  buttonStyle: string| null;
  createdAt: Date;
  updatedAt: Date;
  links?: Link[];
}

export interface Link {
  id: string;
  linkHubId: string;
  title: string;
  url: string;
  description?: string | null;
  icon?: string | null;
  type: string;
  order: number;
  isActive: boolean;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  linkId: string;
  userId: string;
  clickedAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
  country?: string | null;
  city?: string | null;
}
