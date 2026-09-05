export type AlumniStatus = 'PENDING' | 'APPROVED';

export type BlogCategory =
  | 'Interview Experience'
  | 'Career Advice'
  | 'Referral Tips'
  | 'General';

export interface Alumni {
  id: string;
  name: string;
  email: string;
  password: string;

  graduationYear: number;
  currentCompany: string;
  currentRole: string;
  department: string;
  linkedIn: string;

  alumniStatus: AlumniStatus;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  category: BlogCategory;
  postedDate: string;
  alumniId: string;
  published: boolean;
}

export interface Referral {
  id: string;
  alumniId: string;
  companyName: string;
  role: string;
  description: string;
  postedDate: string;
  active: boolean;
}

/*
 * Request contracts.
 * These are the objects that can later be sent directly
 * to your Spring Boot APIs.
 */

export interface AlumniRegistrationRequest {
  name: string;
  email: string;
  password: string;
  graduationYear: number;
  currentCompany: string;
  currentRole: string;
  department: string;
  linkedIn: string;
}

export interface AlumniLoginRequest {
  email: string;
  password: string;
}

export interface BlogRequest {
  title: string;
  content: string;
  category: BlogCategory;
  published: boolean;
}

export interface ReferralRequest {
  companyName: string;
  role: string;
  description: string;
  active: boolean;
}

/*
 * Local frontend repository.
 * This is only persistence for the frontend while
 * the backend APIs are being integrated.
 */

const ALUMNI_KEY = 'placex_alumni';
const BLOG_KEY = 'placex_alumni_blogs';
const REFERRAL_KEY = 'placex_alumni_referrals';

const read = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const alumniApi = {
  getAll(): Alumni[] {
    return read<Alumni[]>(ALUMNI_KEY, []);
  },

  saveAll(alumni: Alumni[]) {
    write(ALUMNI_KEY, alumni);
  },

  register(request: AlumniRegistrationRequest): Alumni {
    const alumni = this.getAll();

    const existing = alumni.find(
      (item) => item.email.toLowerCase() === request.email.toLowerCase()
    );

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newAlumni: Alumni = {
      id: `ALU-${Date.now()}`,
      ...request,
      alumniStatus: 'PENDING'
    };

    this.saveAll([...alumni, newAlumni]);

    return newAlumni;
  },

  login(request: AlumniLoginRequest): Alumni {
    const alumni = this.getAll();

    const account = alumni.find(
      (item) =>
        item.email.toLowerCase() === request.email.toLowerCase() &&
        item.password === request.password
    );

    if (!account) {
      throw new Error('Invalid alumni email or password.');
    }

    if (account.alumniStatus !== 'APPROVED') {
      throw new Error(
        'Your alumni registration is still waiting for TPO approval.'
      );
    }

    return account;
  },

  approve(id: string) {
    const alumni = this.getAll();

    const updated = alumni.map((item) =>
      item.id === id
        ? {
            ...item,
            alumniStatus: 'APPROVED' as AlumniStatus
          }
        : item
    );

    this.saveAll(updated);
  },

  reject(id: string) {
    const alumni = this.getAll();

    /*
     * The architecture defines PENDING / APPROVED.
     * Therefore a rejected registration is removed from
     * the pending registration list instead of introducing
     * an unsupported REJECTED status.
     */
    this.saveAll(alumni.filter((item) => item.id !== id));
  },

  getBlogs(): Blog[] {
    return read<Blog[]>(BLOG_KEY, []);
  },

  saveBlogs(blogs: Blog[]) {
    write(BLOG_KEY, blogs);
  },

  createBlog(alumniId: string, request: BlogRequest): Blog {
    const blog: Blog = {
      id: `BLOG-${Date.now()}`,
      title: request.title,
      content: request.content,
      category: request.category,
      published: request.published,
      postedDate: new Date().toISOString().split('T')[0],
      alumniId
    };

    this.saveBlogs([blog, ...this.getBlogs()]);

    return blog;
  },

  updateBlog(id: string, request: BlogRequest) {
    const blogs = this.getBlogs();

    const updated = blogs.map((blog) =>
      blog.id === id
        ? {
            ...blog,
            ...request
          }
        : blog
    );

    this.saveBlogs(updated);
  },

  deleteBlog(id: string) {
    this.saveBlogs(this.getBlogs().filter((blog) => blog.id !== id));
  },

  getReferrals(): Referral[] {
    return read<Referral[]>(REFERRAL_KEY, []);
  },

  saveReferrals(referrals: Referral[]) {
    write(REFERRAL_KEY, referrals);
  },

  createReferral(
    alumniId: string,
    request: ReferralRequest
  ): Referral {
    const referral: Referral = {
      id: `REF-${Date.now()}`,
      alumniId,
      companyName: request.companyName,
      role: request.role,
      description: request.description,
      active: request.active,
      postedDate: new Date().toISOString().split('T')[0]
    };

    this.saveReferrals([referral, ...this.getReferrals()]);

    return referral;
  },

  updateReferral(id: string, request: ReferralRequest) {
    const referrals = this.getReferrals();

    const updated = referrals.map((referral) =>
      referral.id === id
        ? {
            ...referral,
            ...request
          }
        : referral
    );

    this.saveReferrals(updated);
  },

  deleteReferral(id: string) {
    this.saveReferrals(
      this.getReferrals().filter((referral) => referral.id !== id)
    );
  }
};