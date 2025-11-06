

export enum Language {
  EN = 'en',
  ZH = 'zh',
}

// Fix: Moved SubPage type here to be shared across components.
export type SubPage = 'our-church' | 'our-beliefs' | 'job-opportunities' | 'ministry-leaders' | 'becoming-a-member';
export type MinistrySubPage = 'kids' | 'men' | 'women' | 'joint' | 'alpha' | 'prayer';
export type SermonSubPage = 'sunday-worship' | 'recent-sermons' | 'live-stream';
export type GivingSubPage = 'why-we-give' | 'what-is-tithing' | 'ways-to-give' | 'other-ways-to-give';
export type ContactSubPage = 'contact-us' | 'join-us' | 'prayer-request';
// Fix: Add missing PrayerRequestSubPage type for PrayerRequestPage.tsx component
export type PrayerRequestSubPage = 'submit-request';