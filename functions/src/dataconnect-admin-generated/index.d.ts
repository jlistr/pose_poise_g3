import { ConnectorConfig } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface CompCard_Key {
  id: UUIDString;
  __typename?: 'CompCard_Key';
}

export interface Image_Key {
  id: UUIDString;
  __typename?: 'Image_Key';
}

export interface Portfolio_Key {
  id: UUIDString;
  __typename?: 'Portfolio_Key';
}

export interface Profile_Key {
  userUid: string;
  __typename?: 'Profile_Key';
}

export interface ShootImage_Key {
  shootId: UUIDString;
  imageId: UUIDString;
  __typename?: 'ShootImage_Key';
}

export interface Shoot_Key {
  id: UUIDString;
  __typename?: 'Shoot_Key';
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

