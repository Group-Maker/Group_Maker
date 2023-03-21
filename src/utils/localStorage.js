export const ORGANIZATION_KEY = 'organization';
export const ONBOARDING_KEY = 'isOnboarding';

export class LocalStorage {
  constructor(key) {
    this.key = key;
  }

  getItem() {
    try {
      const parsed = JSON.parse(localStorage.getItem(this.key));
      return parsed;
    } catch (err) {
      throw new Error('localStorage parsing error');
    }
  }

  setItem(value) {
    const serialized = JSON.stringify(value);
    localStorage.setItem(this.key, serialized);
  }
}
