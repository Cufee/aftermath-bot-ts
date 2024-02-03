import { Result } from "$core/Result.d.ts";
import { getUserById } from "$core/backend/users.ts";
import { realmFromPlayerId } from "$core/backend/utils.ts";
import { getPermission } from "$core/backend/permissions.ts";

export class User {
  private _data: UserData;

  constructor(data: UserData) {
    this._data = data;
  }

  static async find(id: string): Promise<Result<User>> {
    const user = await getUserById(id);
    if (!user.ok) {
      return user;
    }
    return { ok: true, data: new User({ ...user.data, id }) };
  }

  get id() {
    return this._data.id;
  }

  get banned() {
    return this._data.is_banned;
  }

  get permissions() {
    let perms = this._data.permissions;
    for (const v of this._data?.connections || []) {
      perms |= v.permissions;
    }
    for (const v of this._data?.subscriptions || []) {
      perms |= v.permissions;
    }
    return perms;
  }
  hasPermission(name: string) {
    const perms = getPermission(name);
    return (this.permissions & perms) === perms;
  }

  hasFeatureFlag(value: string) {
    return this._data.featureFlags.includes(value);
  }

  get wargaming(): {
    connection: WargamingConnection;
    exists: true;
  } | {
    connection: null;
    exists: false;
  } {
    const connection = (this._data?.connections || []).find((v) =>
      v.connectionType === "wargaming"
    );
    if (!connection) {
      return { connection: null, exists: false };
    }
    return {
      connection: {
        accountId: +connection.connectionID,
        verified: connection.metadata.verified === true,
        realm: realmFromPlayerId(+connection.connectionID),
      },
      exists: true,
    };
  }
}

interface WargamingConnection {
  accountId: number;
  verified: boolean;
  realm: string;
}

interface UserConnection {
  id: string;

  userID: string;
  permissions: bigint;

  connectionID: string;
  connectionType: string;

  metadata: Record<string, unknown>;
}
interface UserSubscription {
  userID: string;
  referenceID: string;
  permissions: bigint;

  subscriptionType: string;
  creationDate: Date;
  expiryDate: Date;
}

export interface UserData {
  id: string;
  is_banned: boolean;

  permissions: bigint;
  featureFlags: string[];

  connections: UserConnection[];
  subscriptions: UserSubscription[];
}
