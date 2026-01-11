import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddImageToShootData {
  shootImage_upsert: ShootImage_Key;
}

export interface AddImageToShootVariables {
  shootId: UUIDString;
  imageId: UUIDString;
  order: number;
  isVisible?: boolean | null;
}

export interface CompCard_Key {
  id: UUIDString;
  __typename?: 'CompCard_Key';
}

export interface CreateUserData {
  user_upsert: User_Key;
}

export interface CreateUserVariables {
  uid: string;
  email?: string | null;
  now: TimestampString;
}

export interface DeleteCompCardData {
  compCard_delete?: CompCard_Key | null;
}

export interface DeleteCompCardVariables {
  id: UUIDString;
}

export interface DeleteImageData {
  image_delete?: Image_Key | null;
}

export interface DeleteImageVariables {
  id: UUIDString;
}

export interface DeletePortfolioData {
  portfolio_delete?: Portfolio_Key | null;
}

export interface DeletePortfolioVariables {
  uid: string;
}

export interface DeleteShootData {
  shoot_delete?: Shoot_Key | null;
}

export interface DeleteShootVariables {
  id: UUIDString;
}

export interface GetCompCardsData {
  compCards: ({
    id: UUIDString;
    layout: string;
    aesthetic: string;
    profileSnapshot?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & CompCard_Key)[];
}

export interface GetCompCardsVariables {
  uid: string;
}

export interface GetImagesByHashData {
  images: ({
    id: UUIDString;
    url: string;
    user: {
      uid: string;
    } & User_Key;
  } & Image_Key)[];
}

export interface GetImagesByHashVariables {
  hash: string;
}

export interface GetLibraryData {
  images: ({
    id: UUIDString;
    url: string;
    uploadedAt: TimestampString;
    metadata?: string | null;
  } & Image_Key)[];
}

export interface GetLibraryVariables {
  uid: string;
}

export interface GetPortfolioData {
  portfolios: ({
    isPublic: boolean;
    settings?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  })[];
}

export interface GetPortfolioVariables {
  uid: string;
}

export interface GetProfileData {
  profiles: ({
    name: string;
    instagram?: string | null;
    avatar?: string | null;
    height: string;
    bust: string;
    waist: string;
    hips: string;
    shoeSize: string;
    dressSize: string;
    hairColor: string;
    eyeColor: string;
    description?: string | null;
    careerGoals?: string | null;
  })[];
}

export interface GetProfileVariables {
  uid: string;
}

export interface GetShootsForPortfolioData {
  shoots: ({
    id: UUIDString;
    name: string;
    vibes?: string | null;
    photographer?: string | null;
    studio?: string | null;
    shootImages_on_shoot: ({
      image: {
        id: UUIDString;
        url: string;
      } & Image_Key;
        order: number;
        isVisible: boolean;
    })[];
  } & Shoot_Key)[];
}

export interface GetShootsForPortfolioVariables {
  uid: string;
}

export interface Image_Key {
  id: UUIDString;
  __typename?: 'Image_Key';
}

export interface Portfolio_Key {
  userUid: string;
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

export interface UpsertCompCardData {
  compCard_upsert: CompCard_Key;
}

export interface UpsertCompCardVariables {
  id: UUIDString;
  uid: string;
  layout: string;
  aesthetic: string;
  profileSnapshot: string;
  now: TimestampString;
}

export interface UpsertImageData {
  image_upsert: Image_Key;
}

export interface UpsertImageVariables {
  id: UUIDString;
  uid: string;
  url: string;
  now: TimestampString;
  fileHash?: string | null;
}

export interface UpsertPortfolioData {
  portfolio_upsert: Portfolio_Key;
}

export interface UpsertPortfolioVariables {
  uid: string;
  settings: string;
  isPublic: boolean;
  now: TimestampString;
}

export interface UpsertProfileData {
  profile_upsert: Profile_Key;
}

export interface UpsertProfileVariables {
  uid: string;
  name: string;
  instagram?: string | null;
  avatar?: string | null;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  dressSize: string;
  hairColor: string;
  eyeColor: string;
  description?: string | null;
  careerGoals?: string | null;
}

export interface UpsertShootData {
  shoot_upsert: Shoot_Key;
}

export interface UpsertShootVariables {
  id: UUIDString;
  uid: string;
  name: string;
  vibes?: string | null;
  photographer?: string | null;
  studio?: string | null;
  now: TimestampString;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'GetProfile' Query. Allow users to execute without passing in DataConnect. */
export function getProfile(dc: DataConnect, vars: GetProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getProfile(vars: GetProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProfileData>>;

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertProfile(dc: DataConnect, vars: UpsertProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertProfile(vars: UpsertProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertProfileData>>;

/** Generated Node Admin SDK operation action function for the 'GetPortfolio' Query. Allow users to execute without passing in DataConnect. */
export function getPortfolio(dc: DataConnect, vars: GetPortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPortfolioData>>;
/** Generated Node Admin SDK operation action function for the 'GetPortfolio' Query. Allow users to pass in custom DataConnect instances. */
export function getPortfolio(vars: GetPortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPortfolioData>>;

/** Generated Node Admin SDK operation action function for the 'GetShootsForPortfolio' Query. Allow users to execute without passing in DataConnect. */
export function getShootsForPortfolio(dc: DataConnect, vars: GetShootsForPortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetShootsForPortfolioData>>;
/** Generated Node Admin SDK operation action function for the 'GetShootsForPortfolio' Query. Allow users to pass in custom DataConnect instances. */
export function getShootsForPortfolio(vars: GetShootsForPortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetShootsForPortfolioData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertPortfolio' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertPortfolio(dc: DataConnect, vars: UpsertPortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertPortfolioData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertPortfolio' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertPortfolio(vars: UpsertPortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertPortfolioData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePortfolio' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePortfolio(dc: DataConnect, vars: DeletePortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePortfolioData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePortfolio' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePortfolio(vars: DeletePortfolioVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePortfolioData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertShoot' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertShoot(dc: DataConnect, vars: UpsertShootVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertShootData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertShoot' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertShoot(vars: UpsertShootVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertShootData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteShoot' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteShoot(dc: DataConnect, vars: DeleteShootVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteShootData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteShoot' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteShoot(vars: DeleteShootVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteShootData>>;

/** Generated Node Admin SDK operation action function for the 'GetLibrary' Query. Allow users to execute without passing in DataConnect. */
export function getLibrary(dc: DataConnect, vars: GetLibraryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetLibraryData>>;
/** Generated Node Admin SDK operation action function for the 'GetLibrary' Query. Allow users to pass in custom DataConnect instances. */
export function getLibrary(vars: GetLibraryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetLibraryData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertImage' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertImage(dc: DataConnect, vars: UpsertImageVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertImageData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertImage' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertImage(vars: UpsertImageVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertImageData>>;

/** Generated Node Admin SDK operation action function for the 'GetImagesByHash' Query. Allow users to execute without passing in DataConnect. */
export function getImagesByHash(dc: DataConnect, vars: GetImagesByHashVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetImagesByHashData>>;
/** Generated Node Admin SDK operation action function for the 'GetImagesByHash' Query. Allow users to pass in custom DataConnect instances. */
export function getImagesByHash(vars: GetImagesByHashVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetImagesByHashData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteImage' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteImage(dc: DataConnect, vars: DeleteImageVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteImageData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteImage' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteImage(vars: DeleteImageVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteImageData>>;

/** Generated Node Admin SDK operation action function for the 'AddImageToShoot' Mutation. Allow users to execute without passing in DataConnect. */
export function addImageToShoot(dc: DataConnect, vars: AddImageToShootVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddImageToShootData>>;
/** Generated Node Admin SDK operation action function for the 'AddImageToShoot' Mutation. Allow users to pass in custom DataConnect instances. */
export function addImageToShoot(vars: AddImageToShootVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddImageToShootData>>;

/** Generated Node Admin SDK operation action function for the 'GetCompCards' Query. Allow users to execute without passing in DataConnect. */
export function getCompCards(dc: DataConnect, vars: GetCompCardsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCompCardsData>>;
/** Generated Node Admin SDK operation action function for the 'GetCompCards' Query. Allow users to pass in custom DataConnect instances. */
export function getCompCards(vars: GetCompCardsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCompCardsData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCompCard' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCompCard(dc: DataConnect, vars: UpsertCompCardVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCompCardData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCompCard' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCompCard(vars: UpsertCompCardVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCompCardData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCompCard' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCompCard(dc: DataConnect, vars: DeleteCompCardVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCompCardData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCompCard' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCompCard(vars: DeleteCompCardVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCompCardData>>;

