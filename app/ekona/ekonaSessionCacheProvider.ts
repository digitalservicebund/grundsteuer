import { CacheProvider } from "node-saml";
import { Session } from "@remix-run/node";

export class SessionCacheProvider implements CacheProvider {
  session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  // Store an item in the cache, using the specified key and value.
  async saveAsync(key: string, value: string) {
    this.session.set(key, value);
    return Object.assign({
      key: key,
      value: value,
      createdAt: new Date().getTime(),
    });
  }

  // Returns the value of the specified key in the cache
  async getAsync(key: string) {
    return this.session.get(key);
  }

  // Removes an item from the cache if the key exists
  async removeAsync(key: string) {
    const oldValue = this.session.get(key);
    this.session.unset(key);
    return oldValue;
  }
}
