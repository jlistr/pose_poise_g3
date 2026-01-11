import { GetProfileData, GetProfileVariables, CreateUserData, CreateUserVariables, UpsertProfileData, UpsertProfileVariables, GetPortfolioData, GetPortfolioVariables, GetShootsForPortfolioData, GetShootsForPortfolioVariables, UpsertPortfolioData, UpsertPortfolioVariables, DeletePortfolioData, DeletePortfolioVariables, UpsertShootData, UpsertShootVariables, DeleteShootData, DeleteShootVariables, GetLibraryData, GetLibraryVariables, UpsertImageData, UpsertImageVariables, GetImagesByHashData, GetImagesByHashVariables, DeleteImageData, DeleteImageVariables, AddImageToShootData, AddImageToShootVariables, GetCompCardsData, GetCompCardsVariables, UpsertCompCardData, UpsertCompCardVariables, DeleteCompCardData, DeleteCompCardVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useGetProfile(vars: GetProfileVariables, options?: useDataConnectQueryOptions<GetProfileData>): UseDataConnectQueryResult<GetProfileData, GetProfileVariables>;
export function useGetProfile(dc: DataConnect, vars: GetProfileVariables, options?: useDataConnectQueryOptions<GetProfileData>): UseDataConnectQueryResult<GetProfileData, GetProfileVariables>;

export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useUpsertProfile(options?: useDataConnectMutationOptions<UpsertProfileData, FirebaseError, UpsertProfileVariables>): UseDataConnectMutationResult<UpsertProfileData, UpsertProfileVariables>;
export function useUpsertProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertProfileData, FirebaseError, UpsertProfileVariables>): UseDataConnectMutationResult<UpsertProfileData, UpsertProfileVariables>;

export function useGetPortfolio(vars: GetPortfolioVariables, options?: useDataConnectQueryOptions<GetPortfolioData>): UseDataConnectQueryResult<GetPortfolioData, GetPortfolioVariables>;
export function useGetPortfolio(dc: DataConnect, vars: GetPortfolioVariables, options?: useDataConnectQueryOptions<GetPortfolioData>): UseDataConnectQueryResult<GetPortfolioData, GetPortfolioVariables>;

export function useGetShootsForPortfolio(vars: GetShootsForPortfolioVariables, options?: useDataConnectQueryOptions<GetShootsForPortfolioData>): UseDataConnectQueryResult<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;
export function useGetShootsForPortfolio(dc: DataConnect, vars: GetShootsForPortfolioVariables, options?: useDataConnectQueryOptions<GetShootsForPortfolioData>): UseDataConnectQueryResult<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;

export function useUpsertPortfolio(options?: useDataConnectMutationOptions<UpsertPortfolioData, FirebaseError, UpsertPortfolioVariables>): UseDataConnectMutationResult<UpsertPortfolioData, UpsertPortfolioVariables>;
export function useUpsertPortfolio(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertPortfolioData, FirebaseError, UpsertPortfolioVariables>): UseDataConnectMutationResult<UpsertPortfolioData, UpsertPortfolioVariables>;

export function useDeletePortfolio(options?: useDataConnectMutationOptions<DeletePortfolioData, FirebaseError, DeletePortfolioVariables>): UseDataConnectMutationResult<DeletePortfolioData, DeletePortfolioVariables>;
export function useDeletePortfolio(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePortfolioData, FirebaseError, DeletePortfolioVariables>): UseDataConnectMutationResult<DeletePortfolioData, DeletePortfolioVariables>;

export function useUpsertShoot(options?: useDataConnectMutationOptions<UpsertShootData, FirebaseError, UpsertShootVariables>): UseDataConnectMutationResult<UpsertShootData, UpsertShootVariables>;
export function useUpsertShoot(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertShootData, FirebaseError, UpsertShootVariables>): UseDataConnectMutationResult<UpsertShootData, UpsertShootVariables>;

export function useDeleteShoot(options?: useDataConnectMutationOptions<DeleteShootData, FirebaseError, DeleteShootVariables>): UseDataConnectMutationResult<DeleteShootData, DeleteShootVariables>;
export function useDeleteShoot(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteShootData, FirebaseError, DeleteShootVariables>): UseDataConnectMutationResult<DeleteShootData, DeleteShootVariables>;

export function useGetLibrary(vars: GetLibraryVariables, options?: useDataConnectQueryOptions<GetLibraryData>): UseDataConnectQueryResult<GetLibraryData, GetLibraryVariables>;
export function useGetLibrary(dc: DataConnect, vars: GetLibraryVariables, options?: useDataConnectQueryOptions<GetLibraryData>): UseDataConnectQueryResult<GetLibraryData, GetLibraryVariables>;

export function useUpsertImage(options?: useDataConnectMutationOptions<UpsertImageData, FirebaseError, UpsertImageVariables>): UseDataConnectMutationResult<UpsertImageData, UpsertImageVariables>;
export function useUpsertImage(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertImageData, FirebaseError, UpsertImageVariables>): UseDataConnectMutationResult<UpsertImageData, UpsertImageVariables>;

export function useGetImagesByHash(vars: GetImagesByHashVariables, options?: useDataConnectQueryOptions<GetImagesByHashData>): UseDataConnectQueryResult<GetImagesByHashData, GetImagesByHashVariables>;
export function useGetImagesByHash(dc: DataConnect, vars: GetImagesByHashVariables, options?: useDataConnectQueryOptions<GetImagesByHashData>): UseDataConnectQueryResult<GetImagesByHashData, GetImagesByHashVariables>;

export function useDeleteImage(options?: useDataConnectMutationOptions<DeleteImageData, FirebaseError, DeleteImageVariables>): UseDataConnectMutationResult<DeleteImageData, DeleteImageVariables>;
export function useDeleteImage(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteImageData, FirebaseError, DeleteImageVariables>): UseDataConnectMutationResult<DeleteImageData, DeleteImageVariables>;

export function useAddImageToShoot(options?: useDataConnectMutationOptions<AddImageToShootData, FirebaseError, AddImageToShootVariables>): UseDataConnectMutationResult<AddImageToShootData, AddImageToShootVariables>;
export function useAddImageToShoot(dc: DataConnect, options?: useDataConnectMutationOptions<AddImageToShootData, FirebaseError, AddImageToShootVariables>): UseDataConnectMutationResult<AddImageToShootData, AddImageToShootVariables>;

export function useGetCompCards(vars: GetCompCardsVariables, options?: useDataConnectQueryOptions<GetCompCardsData>): UseDataConnectQueryResult<GetCompCardsData, GetCompCardsVariables>;
export function useGetCompCards(dc: DataConnect, vars: GetCompCardsVariables, options?: useDataConnectQueryOptions<GetCompCardsData>): UseDataConnectQueryResult<GetCompCardsData, GetCompCardsVariables>;

export function useUpsertCompCard(options?: useDataConnectMutationOptions<UpsertCompCardData, FirebaseError, UpsertCompCardVariables>): UseDataConnectMutationResult<UpsertCompCardData, UpsertCompCardVariables>;
export function useUpsertCompCard(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompCardData, FirebaseError, UpsertCompCardVariables>): UseDataConnectMutationResult<UpsertCompCardData, UpsertCompCardVariables>;

export function useDeleteCompCard(options?: useDataConnectMutationOptions<DeleteCompCardData, FirebaseError, DeleteCompCardVariables>): UseDataConnectMutationResult<DeleteCompCardData, DeleteCompCardVariables>;
export function useDeleteCompCard(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCompCardData, FirebaseError, DeleteCompCardVariables>): UseDataConnectMutationResult<DeleteCompCardData, DeleteCompCardVariables>;
