import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface GetProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProfileVariables): QueryRef<GetProfileData, GetProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProfileVariables): QueryRef<GetProfileData, GetProfileVariables>;
  operationName: string;
}
export const getProfileRef: GetProfileRef;

export function getProfile(vars: GetProfileVariables): QueryPromise<GetProfileData, GetProfileVariables>;
export function getProfile(dc: DataConnect, vars: GetProfileVariables): QueryPromise<GetProfileData, GetProfileVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpsertProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertProfileVariables): MutationRef<UpsertProfileData, UpsertProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertProfileVariables): MutationRef<UpsertProfileData, UpsertProfileVariables>;
  operationName: string;
}
export const upsertProfileRef: UpsertProfileRef;

export function upsertProfile(vars: UpsertProfileVariables): MutationPromise<UpsertProfileData, UpsertProfileVariables>;
export function upsertProfile(dc: DataConnect, vars: UpsertProfileVariables): MutationPromise<UpsertProfileData, UpsertProfileVariables>;

interface GetPortfolioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPortfolioVariables): QueryRef<GetPortfolioData, GetPortfolioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPortfolioVariables): QueryRef<GetPortfolioData, GetPortfolioVariables>;
  operationName: string;
}
export const getPortfolioRef: GetPortfolioRef;

export function getPortfolio(vars: GetPortfolioVariables): QueryPromise<GetPortfolioData, GetPortfolioVariables>;
export function getPortfolio(dc: DataConnect, vars: GetPortfolioVariables): QueryPromise<GetPortfolioData, GetPortfolioVariables>;

interface GetShootsForPortfolioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetShootsForPortfolioVariables): QueryRef<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetShootsForPortfolioVariables): QueryRef<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;
  operationName: string;
}
export const getShootsForPortfolioRef: GetShootsForPortfolioRef;

export function getShootsForPortfolio(vars: GetShootsForPortfolioVariables): QueryPromise<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;
export function getShootsForPortfolio(dc: DataConnect, vars: GetShootsForPortfolioVariables): QueryPromise<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;

interface UpsertPortfolioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPortfolioVariables): MutationRef<UpsertPortfolioData, UpsertPortfolioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPortfolioVariables): MutationRef<UpsertPortfolioData, UpsertPortfolioVariables>;
  operationName: string;
}
export const upsertPortfolioRef: UpsertPortfolioRef;

export function upsertPortfolio(vars: UpsertPortfolioVariables): MutationPromise<UpsertPortfolioData, UpsertPortfolioVariables>;
export function upsertPortfolio(dc: DataConnect, vars: UpsertPortfolioVariables): MutationPromise<UpsertPortfolioData, UpsertPortfolioVariables>;

interface DeletePortfolioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
  operationName: string;
}
export const deletePortfolioRef: DeletePortfolioRef;

export function deletePortfolio(vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;
export function deletePortfolio(dc: DataConnect, vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;

interface UpsertShootRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertShootVariables): MutationRef<UpsertShootData, UpsertShootVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertShootVariables): MutationRef<UpsertShootData, UpsertShootVariables>;
  operationName: string;
}
export const upsertShootRef: UpsertShootRef;

export function upsertShoot(vars: UpsertShootVariables): MutationPromise<UpsertShootData, UpsertShootVariables>;
export function upsertShoot(dc: DataConnect, vars: UpsertShootVariables): MutationPromise<UpsertShootData, UpsertShootVariables>;

interface DeleteShootRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteShootVariables): MutationRef<DeleteShootData, DeleteShootVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteShootVariables): MutationRef<DeleteShootData, DeleteShootVariables>;
  operationName: string;
}
export const deleteShootRef: DeleteShootRef;

export function deleteShoot(vars: DeleteShootVariables): MutationPromise<DeleteShootData, DeleteShootVariables>;
export function deleteShoot(dc: DataConnect, vars: DeleteShootVariables): MutationPromise<DeleteShootData, DeleteShootVariables>;

interface GetLibraryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLibraryVariables): QueryRef<GetLibraryData, GetLibraryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLibraryVariables): QueryRef<GetLibraryData, GetLibraryVariables>;
  operationName: string;
}
export const getLibraryRef: GetLibraryRef;

export function getLibrary(vars: GetLibraryVariables): QueryPromise<GetLibraryData, GetLibraryVariables>;
export function getLibrary(dc: DataConnect, vars: GetLibraryVariables): QueryPromise<GetLibraryData, GetLibraryVariables>;

interface UpsertImageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertImageVariables): MutationRef<UpsertImageData, UpsertImageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertImageVariables): MutationRef<UpsertImageData, UpsertImageVariables>;
  operationName: string;
}
export const upsertImageRef: UpsertImageRef;

export function upsertImage(vars: UpsertImageVariables): MutationPromise<UpsertImageData, UpsertImageVariables>;
export function upsertImage(dc: DataConnect, vars: UpsertImageVariables): MutationPromise<UpsertImageData, UpsertImageVariables>;

interface GetImagesByHashRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetImagesByHashVariables): QueryRef<GetImagesByHashData, GetImagesByHashVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetImagesByHashVariables): QueryRef<GetImagesByHashData, GetImagesByHashVariables>;
  operationName: string;
}
export const getImagesByHashRef: GetImagesByHashRef;

export function getImagesByHash(vars: GetImagesByHashVariables): QueryPromise<GetImagesByHashData, GetImagesByHashVariables>;
export function getImagesByHash(dc: DataConnect, vars: GetImagesByHashVariables): QueryPromise<GetImagesByHashData, GetImagesByHashVariables>;

interface DeleteImageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteImageVariables): MutationRef<DeleteImageData, DeleteImageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteImageVariables): MutationRef<DeleteImageData, DeleteImageVariables>;
  operationName: string;
}
export const deleteImageRef: DeleteImageRef;

export function deleteImage(vars: DeleteImageVariables): MutationPromise<DeleteImageData, DeleteImageVariables>;
export function deleteImage(dc: DataConnect, vars: DeleteImageVariables): MutationPromise<DeleteImageData, DeleteImageVariables>;

interface AddImageToShootRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddImageToShootVariables): MutationRef<AddImageToShootData, AddImageToShootVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddImageToShootVariables): MutationRef<AddImageToShootData, AddImageToShootVariables>;
  operationName: string;
}
export const addImageToShootRef: AddImageToShootRef;

export function addImageToShoot(vars: AddImageToShootVariables): MutationPromise<AddImageToShootData, AddImageToShootVariables>;
export function addImageToShoot(dc: DataConnect, vars: AddImageToShootVariables): MutationPromise<AddImageToShootData, AddImageToShootVariables>;

interface GetCompCardsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompCardsVariables): QueryRef<GetCompCardsData, GetCompCardsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCompCardsVariables): QueryRef<GetCompCardsData, GetCompCardsVariables>;
  operationName: string;
}
export const getCompCardsRef: GetCompCardsRef;

export function getCompCards(vars: GetCompCardsVariables): QueryPromise<GetCompCardsData, GetCompCardsVariables>;
export function getCompCards(dc: DataConnect, vars: GetCompCardsVariables): QueryPromise<GetCompCardsData, GetCompCardsVariables>;

interface UpsertCompCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompCardVariables): MutationRef<UpsertCompCardData, UpsertCompCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCompCardVariables): MutationRef<UpsertCompCardData, UpsertCompCardVariables>;
  operationName: string;
}
export const upsertCompCardRef: UpsertCompCardRef;

export function upsertCompCard(vars: UpsertCompCardVariables): MutationPromise<UpsertCompCardData, UpsertCompCardVariables>;
export function upsertCompCard(dc: DataConnect, vars: UpsertCompCardVariables): MutationPromise<UpsertCompCardData, UpsertCompCardVariables>;

interface DeleteCompCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCompCardVariables): MutationRef<DeleteCompCardData, DeleteCompCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCompCardVariables): MutationRef<DeleteCompCardData, DeleteCompCardVariables>;
  operationName: string;
}
export const deleteCompCardRef: DeleteCompCardRef;

export function deleteCompCard(vars: DeleteCompCardVariables): MutationPromise<DeleteCompCardData, DeleteCompCardVariables>;
export function deleteCompCard(dc: DataConnect, vars: DeleteCompCardVariables): MutationPromise<DeleteCompCardData, DeleteCompCardVariables>;

