const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'posepoiseg3',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const getProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProfile', inputVars);
}
getProfileRef.operationName = 'GetProfile';
exports.getProfileRef = getProfileRef;

exports.getProfile = function getProfile(dcOrVars, vars) {
  return executeQuery(getProfileRef(dcOrVars, vars));
};

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const upsertProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertProfile', inputVars);
}
upsertProfileRef.operationName = 'UpsertProfile';
exports.upsertProfileRef = upsertProfileRef;

exports.upsertProfile = function upsertProfile(dcOrVars, vars) {
  return executeMutation(upsertProfileRef(dcOrVars, vars));
};

const getPortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPortfolio', inputVars);
}
getPortfolioRef.operationName = 'GetPortfolio';
exports.getPortfolioRef = getPortfolioRef;

exports.getPortfolio = function getPortfolio(dcOrVars, vars) {
  return executeQuery(getPortfolioRef(dcOrVars, vars));
};

const getShootsForPortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetShootsForPortfolio', inputVars);
}
getShootsForPortfolioRef.operationName = 'GetShootsForPortfolio';
exports.getShootsForPortfolioRef = getShootsForPortfolioRef;

exports.getShootsForPortfolio = function getShootsForPortfolio(dcOrVars, vars) {
  return executeQuery(getShootsForPortfolioRef(dcOrVars, vars));
};

const upsertPortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPortfolio', inputVars);
}
upsertPortfolioRef.operationName = 'UpsertPortfolio';
exports.upsertPortfolioRef = upsertPortfolioRef;

exports.upsertPortfolio = function upsertPortfolio(dcOrVars, vars) {
  return executeMutation(upsertPortfolioRef(dcOrVars, vars));
};

const deletePortfolioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePortfolio', inputVars);
}
deletePortfolioRef.operationName = 'DeletePortfolio';
exports.deletePortfolioRef = deletePortfolioRef;

exports.deletePortfolio = function deletePortfolio(dcOrVars, vars) {
  return executeMutation(deletePortfolioRef(dcOrVars, vars));
};

const upsertShootRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertShoot', inputVars);
}
upsertShootRef.operationName = 'UpsertShoot';
exports.upsertShootRef = upsertShootRef;

exports.upsertShoot = function upsertShoot(dcOrVars, vars) {
  return executeMutation(upsertShootRef(dcOrVars, vars));
};

const deleteShootRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteShoot', inputVars);
}
deleteShootRef.operationName = 'DeleteShoot';
exports.deleteShootRef = deleteShootRef;

exports.deleteShoot = function deleteShoot(dcOrVars, vars) {
  return executeMutation(deleteShootRef(dcOrVars, vars));
};

const getLibraryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLibrary', inputVars);
}
getLibraryRef.operationName = 'GetLibrary';
exports.getLibraryRef = getLibraryRef;

exports.getLibrary = function getLibrary(dcOrVars, vars) {
  return executeQuery(getLibraryRef(dcOrVars, vars));
};

const upsertImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertImage', inputVars);
}
upsertImageRef.operationName = 'UpsertImage';
exports.upsertImageRef = upsertImageRef;

exports.upsertImage = function upsertImage(dcOrVars, vars) {
  return executeMutation(upsertImageRef(dcOrVars, vars));
};

const getImagesByHashRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getImagesByHash', inputVars);
}
getImagesByHashRef.operationName = 'getImagesByHash';
exports.getImagesByHashRef = getImagesByHashRef;

exports.getImagesByHash = function getImagesByHash(dcOrVars, vars) {
  return executeQuery(getImagesByHashRef(dcOrVars, vars));
};

const deleteImageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteImage', inputVars);
}
deleteImageRef.operationName = 'DeleteImage';
exports.deleteImageRef = deleteImageRef;

exports.deleteImage = function deleteImage(dcOrVars, vars) {
  return executeMutation(deleteImageRef(dcOrVars, vars));
};

const addImageToShootRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddImageToShoot', inputVars);
}
addImageToShootRef.operationName = 'AddImageToShoot';
exports.addImageToShootRef = addImageToShootRef;

exports.addImageToShoot = function addImageToShoot(dcOrVars, vars) {
  return executeMutation(addImageToShootRef(dcOrVars, vars));
};

const getCompCardsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompCards', inputVars);
}
getCompCardsRef.operationName = 'GetCompCards';
exports.getCompCardsRef = getCompCardsRef;

exports.getCompCards = function getCompCards(dcOrVars, vars) {
  return executeQuery(getCompCardsRef(dcOrVars, vars));
};

const upsertCompCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCompCard', inputVars);
}
upsertCompCardRef.operationName = 'UpsertCompCard';
exports.upsertCompCardRef = upsertCompCardRef;

exports.upsertCompCard = function upsertCompCard(dcOrVars, vars) {
  return executeMutation(upsertCompCardRef(dcOrVars, vars));
};

const deleteCompCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCompCard', inputVars);
}
deleteCompCardRef.operationName = 'DeleteCompCard';
exports.deleteCompCardRef = deleteCompCardRef;

exports.deleteCompCard = function deleteCompCard(dcOrVars, vars) {
  return executeMutation(deleteCompCardRef(dcOrVars, vars));
};
