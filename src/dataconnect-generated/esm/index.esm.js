import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'posepoiseg3',
  location: 'us-east4'
};

export const getProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProfile', inputVars);
}
getProfileRef.operationName = 'GetProfile';

export function getProfile(dcOrVars, vars) {
  return executeQuery(getProfileRef(dcOrVars, vars));
}

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const upsertProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertProfile', inputVars);
}
upsertProfileRef.operationName = 'UpsertProfile';

export function upsertProfile(dcOrVars, vars) {
  return executeMutation(upsertProfileRef(dcOrVars, vars));
}

export const getPortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPortfolio', inputVars);
}
getPortfolioRef.operationName = 'GetPortfolio';

export function getPortfolio(dcOrVars, vars) {
  return executeQuery(getPortfolioRef(dcOrVars, vars));
}

export const getShootsForPortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetShootsForPortfolio', inputVars);
}
getShootsForPortfolioRef.operationName = 'GetShootsForPortfolio';

export function getShootsForPortfolio(dcOrVars, vars) {
  return executeQuery(getShootsForPortfolioRef(dcOrVars, vars));
}

export const upsertPortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPortfolio', inputVars);
}
upsertPortfolioRef.operationName = 'UpsertPortfolio';

export function upsertPortfolio(dcOrVars, vars) {
  return executeMutation(upsertPortfolioRef(dcOrVars, vars));
}

export const deletePortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePortfolio', inputVars);
}
deletePortfolioRef.operationName = 'DeletePortfolio';

export function deletePortfolio(dcOrVars, vars) {
  return executeMutation(deletePortfolioRef(dcOrVars, vars));
}

export const upsertShootRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertShoot', inputVars);
}
upsertShootRef.operationName = 'UpsertShoot';

export function upsertShoot(dcOrVars, vars) {
  return executeMutation(upsertShootRef(dcOrVars, vars));
}

export const deleteShootRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteShoot', inputVars);
}
deleteShootRef.operationName = 'DeleteShoot';

export function deleteShoot(dcOrVars, vars) {
  return executeMutation(deleteShootRef(dcOrVars, vars));
}

export const getLibraryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLibrary', inputVars);
}
getLibraryRef.operationName = 'GetLibrary';

export function getLibrary(dcOrVars, vars) {
  return executeQuery(getLibraryRef(dcOrVars, vars));
}

export const upsertImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertImage', inputVars);
}
upsertImageRef.operationName = 'UpsertImage';

export function upsertImage(dcOrVars, vars) {
  return executeMutation(upsertImageRef(dcOrVars, vars));
}

export const getImagesByHashRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getImagesByHash', inputVars);
}
getImagesByHashRef.operationName = 'getImagesByHash';

export function getImagesByHash(dcOrVars, vars) {
  return executeQuery(getImagesByHashRef(dcOrVars, vars));
}

export const deleteImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteImage', inputVars);
}
deleteImageRef.operationName = 'DeleteImage';

export function deleteImage(dcOrVars, vars) {
  return executeMutation(deleteImageRef(dcOrVars, vars));
}

export const addImageToShootRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddImageToShoot', inputVars);
}
addImageToShootRef.operationName = 'AddImageToShoot';

export function addImageToShoot(dcOrVars, vars) {
  return executeMutation(addImageToShootRef(dcOrVars, vars));
}

export const getCompCardsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompCards', inputVars);
}
getCompCardsRef.operationName = 'GetCompCards';

export function getCompCards(dcOrVars, vars) {
  return executeQuery(getCompCardsRef(dcOrVars, vars));
}

export const upsertCompCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCompCard', inputVars);
}
upsertCompCardRef.operationName = 'UpsertCompCard';

export function upsertCompCard(dcOrVars, vars) {
  return executeMutation(upsertCompCardRef(dcOrVars, vars));
}

export const deleteCompCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCompCard', inputVars);
}
deleteCompCardRef.operationName = 'DeleteCompCard';

export function deleteCompCard(dcOrVars, vars) {
  return executeMutation(deleteCompCardRef(dcOrVars, vars));
}

