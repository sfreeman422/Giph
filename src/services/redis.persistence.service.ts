import ioredis, { Redis } from 'ioredis';

export enum MuzzleRedisTypeEnum {
  'Muzzled' = 'muzzled',
  'Requestor' = 'requestor',
}

export enum SuppressionType {
  'Muzzle' = 'muzzle',
  'Backfire' = 'backfire',
}

export class RedisPersistenceService {
  public static getInstance(): RedisPersistenceService {
    if (!RedisPersistenceService.instance) {
      RedisPersistenceService.instance = new RedisPersistenceService();
    }
    return RedisPersistenceService.instance;
  }

  private static instance: RedisPersistenceService;
  private static redis: Redis = new ioredis('172.20.0.1').on('connect', () => console.log('Connected to Redis.'));

  getValue(key: string): Promise<string | null> {
    return RedisPersistenceService.redis.get(key);
  }

  getRedisKeyName(
    userId: string,
    teamId: string,
    suppressionType: SuppressionType,
    muzzleType?: MuzzleRedisTypeEnum,
  ): string {
    if (muzzleType) {
      return `${suppressionType}.${muzzleType}.${userId}-${teamId}`;
    }
    return `${suppressionType}.${userId}-${teamId}`;
  }
}
