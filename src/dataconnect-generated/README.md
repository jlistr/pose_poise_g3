# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetProfile*](#getprofile)
  - [*GetPortfolio*](#getportfolio)
  - [*GetShootsForPortfolio*](#getshootsforportfolio)
  - [*GetLibrary*](#getlibrary)
  - [*getImagesByHash*](#getimagesbyhash)
  - [*GetCompCards*](#getcompcards)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpsertProfile*](#upsertprofile)
  - [*UpsertPortfolio*](#upsertportfolio)
  - [*DeletePortfolio*](#deleteportfolio)
  - [*UpsertShoot*](#upsertshoot)
  - [*DeleteShoot*](#deleteshoot)
  - [*UpsertImage*](#upsertimage)
  - [*DeleteImage*](#deleteimage)
  - [*AddImageToShoot*](#addimagetoshoot)
  - [*UpsertCompCard*](#upsertcompcard)
  - [*DeleteCompCard*](#deletecompcard)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetProfile
You can execute the `GetProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProfile(vars: GetProfileVariables): QueryPromise<GetProfileData, GetProfileVariables>;

interface GetProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProfileVariables): QueryRef<GetProfileData, GetProfileVariables>;
}
export const getProfileRef: GetProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProfile(dc: DataConnect, vars: GetProfileVariables): QueryPromise<GetProfileData, GetProfileVariables>;

interface GetProfileRef {
  ...
  (dc: DataConnect, vars: GetProfileVariables): QueryRef<GetProfileData, GetProfileVariables>;
}
export const getProfileRef: GetProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProfileRef:
```typescript
const name = getProfileRef.operationName;
console.log(name);
```

### Variables
The `GetProfile` query requires an argument of type `GetProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProfileVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProfile, GetProfileVariables } from '@dataconnect/generated';

// The `GetProfile` query requires an argument of type `GetProfileVariables`:
const getProfileVars: GetProfileVariables = {
  uid: ..., 
};

// Call the `getProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProfile(getProfileVars);
// Variables can be defined inline as well.
const { data } = await getProfile({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProfile(dataConnect, getProfileVars);

console.log(data.profiles);

// Or, you can use the `Promise` API.
getProfile(getProfileVars).then((response) => {
  const data = response.data;
  console.log(data.profiles);
});
```

### Using `GetProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProfileRef, GetProfileVariables } from '@dataconnect/generated';

// The `GetProfile` query requires an argument of type `GetProfileVariables`:
const getProfileVars: GetProfileVariables = {
  uid: ..., 
};

// Call the `getProfileRef()` function to get a reference to the query.
const ref = getProfileRef(getProfileVars);
// Variables can be defined inline as well.
const ref = getProfileRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProfileRef(dataConnect, getProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.profiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.profiles);
});
```

## GetPortfolio
You can execute the `GetPortfolio` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPortfolio(vars: GetPortfolioVariables): QueryPromise<GetPortfolioData, GetPortfolioVariables>;

interface GetPortfolioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPortfolioVariables): QueryRef<GetPortfolioData, GetPortfolioVariables>;
}
export const getPortfolioRef: GetPortfolioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPortfolio(dc: DataConnect, vars: GetPortfolioVariables): QueryPromise<GetPortfolioData, GetPortfolioVariables>;

interface GetPortfolioRef {
  ...
  (dc: DataConnect, vars: GetPortfolioVariables): QueryRef<GetPortfolioData, GetPortfolioVariables>;
}
export const getPortfolioRef: GetPortfolioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPortfolioRef:
```typescript
const name = getPortfolioRef.operationName;
console.log(name);
```

### Variables
The `GetPortfolio` query requires an argument of type `GetPortfolioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPortfolioVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetPortfolio` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPortfolioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPortfolioData {
  portfolios: ({
    isPublic: boolean;
    settings?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  })[];
}
```
### Using `GetPortfolio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPortfolio, GetPortfolioVariables } from '@dataconnect/generated';

// The `GetPortfolio` query requires an argument of type `GetPortfolioVariables`:
const getPortfolioVars: GetPortfolioVariables = {
  uid: ..., 
};

// Call the `getPortfolio()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPortfolio(getPortfolioVars);
// Variables can be defined inline as well.
const { data } = await getPortfolio({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPortfolio(dataConnect, getPortfolioVars);

console.log(data.portfolios);

// Or, you can use the `Promise` API.
getPortfolio(getPortfolioVars).then((response) => {
  const data = response.data;
  console.log(data.portfolios);
});
```

### Using `GetPortfolio`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPortfolioRef, GetPortfolioVariables } from '@dataconnect/generated';

// The `GetPortfolio` query requires an argument of type `GetPortfolioVariables`:
const getPortfolioVars: GetPortfolioVariables = {
  uid: ..., 
};

// Call the `getPortfolioRef()` function to get a reference to the query.
const ref = getPortfolioRef(getPortfolioVars);
// Variables can be defined inline as well.
const ref = getPortfolioRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPortfolioRef(dataConnect, getPortfolioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.portfolios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolios);
});
```

## GetShootsForPortfolio
You can execute the `GetShootsForPortfolio` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getShootsForPortfolio(vars: GetShootsForPortfolioVariables): QueryPromise<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;

interface GetShootsForPortfolioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetShootsForPortfolioVariables): QueryRef<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;
}
export const getShootsForPortfolioRef: GetShootsForPortfolioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getShootsForPortfolio(dc: DataConnect, vars: GetShootsForPortfolioVariables): QueryPromise<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;

interface GetShootsForPortfolioRef {
  ...
  (dc: DataConnect, vars: GetShootsForPortfolioVariables): QueryRef<GetShootsForPortfolioData, GetShootsForPortfolioVariables>;
}
export const getShootsForPortfolioRef: GetShootsForPortfolioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getShootsForPortfolioRef:
```typescript
const name = getShootsForPortfolioRef.operationName;
console.log(name);
```

### Variables
The `GetShootsForPortfolio` query requires an argument of type `GetShootsForPortfolioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetShootsForPortfolioVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetShootsForPortfolio` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetShootsForPortfolioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetShootsForPortfolio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getShootsForPortfolio, GetShootsForPortfolioVariables } from '@dataconnect/generated';

// The `GetShootsForPortfolio` query requires an argument of type `GetShootsForPortfolioVariables`:
const getShootsForPortfolioVars: GetShootsForPortfolioVariables = {
  uid: ..., 
};

// Call the `getShootsForPortfolio()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getShootsForPortfolio(getShootsForPortfolioVars);
// Variables can be defined inline as well.
const { data } = await getShootsForPortfolio({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getShootsForPortfolio(dataConnect, getShootsForPortfolioVars);

console.log(data.shoots);

// Or, you can use the `Promise` API.
getShootsForPortfolio(getShootsForPortfolioVars).then((response) => {
  const data = response.data;
  console.log(data.shoots);
});
```

### Using `GetShootsForPortfolio`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getShootsForPortfolioRef, GetShootsForPortfolioVariables } from '@dataconnect/generated';

// The `GetShootsForPortfolio` query requires an argument of type `GetShootsForPortfolioVariables`:
const getShootsForPortfolioVars: GetShootsForPortfolioVariables = {
  uid: ..., 
};

// Call the `getShootsForPortfolioRef()` function to get a reference to the query.
const ref = getShootsForPortfolioRef(getShootsForPortfolioVars);
// Variables can be defined inline as well.
const ref = getShootsForPortfolioRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getShootsForPortfolioRef(dataConnect, getShootsForPortfolioVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shoots);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shoots);
});
```

## GetLibrary
You can execute the `GetLibrary` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLibrary(vars: GetLibraryVariables): QueryPromise<GetLibraryData, GetLibraryVariables>;

interface GetLibraryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLibraryVariables): QueryRef<GetLibraryData, GetLibraryVariables>;
}
export const getLibraryRef: GetLibraryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLibrary(dc: DataConnect, vars: GetLibraryVariables): QueryPromise<GetLibraryData, GetLibraryVariables>;

interface GetLibraryRef {
  ...
  (dc: DataConnect, vars: GetLibraryVariables): QueryRef<GetLibraryData, GetLibraryVariables>;
}
export const getLibraryRef: GetLibraryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLibraryRef:
```typescript
const name = getLibraryRef.operationName;
console.log(name);
```

### Variables
The `GetLibrary` query requires an argument of type `GetLibraryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLibraryVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetLibrary` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLibraryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLibraryData {
  images: ({
    id: UUIDString;
    url: string;
    uploadedAt: TimestampString;
    metadata?: string | null;
  } & Image_Key)[];
}
```
### Using `GetLibrary`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLibrary, GetLibraryVariables } from '@dataconnect/generated';

// The `GetLibrary` query requires an argument of type `GetLibraryVariables`:
const getLibraryVars: GetLibraryVariables = {
  uid: ..., 
};

// Call the `getLibrary()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLibrary(getLibraryVars);
// Variables can be defined inline as well.
const { data } = await getLibrary({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLibrary(dataConnect, getLibraryVars);

console.log(data.images);

// Or, you can use the `Promise` API.
getLibrary(getLibraryVars).then((response) => {
  const data = response.data;
  console.log(data.images);
});
```

### Using `GetLibrary`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLibraryRef, GetLibraryVariables } from '@dataconnect/generated';

// The `GetLibrary` query requires an argument of type `GetLibraryVariables`:
const getLibraryVars: GetLibraryVariables = {
  uid: ..., 
};

// Call the `getLibraryRef()` function to get a reference to the query.
const ref = getLibraryRef(getLibraryVars);
// Variables can be defined inline as well.
const ref = getLibraryRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLibraryRef(dataConnect, getLibraryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.images);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.images);
});
```

## getImagesByHash
You can execute the `getImagesByHash` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getImagesByHash(vars: GetImagesByHashVariables): QueryPromise<GetImagesByHashData, GetImagesByHashVariables>;

interface GetImagesByHashRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetImagesByHashVariables): QueryRef<GetImagesByHashData, GetImagesByHashVariables>;
}
export const getImagesByHashRef: GetImagesByHashRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getImagesByHash(dc: DataConnect, vars: GetImagesByHashVariables): QueryPromise<GetImagesByHashData, GetImagesByHashVariables>;

interface GetImagesByHashRef {
  ...
  (dc: DataConnect, vars: GetImagesByHashVariables): QueryRef<GetImagesByHashData, GetImagesByHashVariables>;
}
export const getImagesByHashRef: GetImagesByHashRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getImagesByHashRef:
```typescript
const name = getImagesByHashRef.operationName;
console.log(name);
```

### Variables
The `getImagesByHash` query requires an argument of type `GetImagesByHashVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetImagesByHashVariables {
  hash: string;
}
```
### Return Type
Recall that executing the `getImagesByHash` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetImagesByHashData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetImagesByHashData {
  images: ({
    id: UUIDString;
    url: string;
    user: {
      uid: string;
    } & User_Key;
  } & Image_Key)[];
}
```
### Using `getImagesByHash`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getImagesByHash, GetImagesByHashVariables } from '@dataconnect/generated';

// The `getImagesByHash` query requires an argument of type `GetImagesByHashVariables`:
const getImagesByHashVars: GetImagesByHashVariables = {
  hash: ..., 
};

// Call the `getImagesByHash()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getImagesByHash(getImagesByHashVars);
// Variables can be defined inline as well.
const { data } = await getImagesByHash({ hash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getImagesByHash(dataConnect, getImagesByHashVars);

console.log(data.images);

// Or, you can use the `Promise` API.
getImagesByHash(getImagesByHashVars).then((response) => {
  const data = response.data;
  console.log(data.images);
});
```

### Using `getImagesByHash`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getImagesByHashRef, GetImagesByHashVariables } from '@dataconnect/generated';

// The `getImagesByHash` query requires an argument of type `GetImagesByHashVariables`:
const getImagesByHashVars: GetImagesByHashVariables = {
  hash: ..., 
};

// Call the `getImagesByHashRef()` function to get a reference to the query.
const ref = getImagesByHashRef(getImagesByHashVars);
// Variables can be defined inline as well.
const ref = getImagesByHashRef({ hash: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getImagesByHashRef(dataConnect, getImagesByHashVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.images);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.images);
});
```

## GetCompCards
You can execute the `GetCompCards` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCompCards(vars: GetCompCardsVariables): QueryPromise<GetCompCardsData, GetCompCardsVariables>;

interface GetCompCardsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompCardsVariables): QueryRef<GetCompCardsData, GetCompCardsVariables>;
}
export const getCompCardsRef: GetCompCardsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompCards(dc: DataConnect, vars: GetCompCardsVariables): QueryPromise<GetCompCardsData, GetCompCardsVariables>;

interface GetCompCardsRef {
  ...
  (dc: DataConnect, vars: GetCompCardsVariables): QueryRef<GetCompCardsData, GetCompCardsVariables>;
}
export const getCompCardsRef: GetCompCardsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCompCardsRef:
```typescript
const name = getCompCardsRef.operationName;
console.log(name);
```

### Variables
The `GetCompCards` query requires an argument of type `GetCompCardsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCompCardsVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetCompCards` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCompCardsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetCompCards`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompCards, GetCompCardsVariables } from '@dataconnect/generated';

// The `GetCompCards` query requires an argument of type `GetCompCardsVariables`:
const getCompCardsVars: GetCompCardsVariables = {
  uid: ..., 
};

// Call the `getCompCards()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompCards(getCompCardsVars);
// Variables can be defined inline as well.
const { data } = await getCompCards({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompCards(dataConnect, getCompCardsVars);

console.log(data.compCards);

// Or, you can use the `Promise` API.
getCompCards(getCompCardsVars).then((response) => {
  const data = response.data;
  console.log(data.compCards);
});
```

### Using `GetCompCards`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCompCardsRef, GetCompCardsVariables } from '@dataconnect/generated';

// The `GetCompCards` query requires an argument of type `GetCompCardsVariables`:
const getCompCardsVars: GetCompCardsVariables = {
  uid: ..., 
};

// Call the `getCompCardsRef()` function to get a reference to the query.
const ref = getCompCardsRef(getCompCardsVars);
// Variables can be defined inline as well.
const ref = getCompCardsRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCompCardsRef(dataConnect, getCompCardsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.compCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.compCards);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  uid: string;
  email?: string | null;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_upsert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  uid: ..., 
  email: ..., // optional
  now: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ uid: ..., email: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  uid: ..., 
  email: ..., // optional
  now: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ uid: ..., email: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpsertProfile
You can execute the `UpsertProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertProfile(vars: UpsertProfileVariables): MutationPromise<UpsertProfileData, UpsertProfileVariables>;

interface UpsertProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertProfileVariables): MutationRef<UpsertProfileData, UpsertProfileVariables>;
}
export const upsertProfileRef: UpsertProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertProfile(dc: DataConnect, vars: UpsertProfileVariables): MutationPromise<UpsertProfileData, UpsertProfileVariables>;

interface UpsertProfileRef {
  ...
  (dc: DataConnect, vars: UpsertProfileVariables): MutationRef<UpsertProfileData, UpsertProfileVariables>;
}
export const upsertProfileRef: UpsertProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertProfileRef:
```typescript
const name = upsertProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertProfile` mutation requires an argument of type `UpsertProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertProfileData {
  profile_upsert: Profile_Key;
}
```
### Using `UpsertProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertProfile, UpsertProfileVariables } from '@dataconnect/generated';

// The `UpsertProfile` mutation requires an argument of type `UpsertProfileVariables`:
const upsertProfileVars: UpsertProfileVariables = {
  uid: ..., 
  name: ..., 
  instagram: ..., // optional
  avatar: ..., // optional
  height: ..., 
  bust: ..., 
  waist: ..., 
  hips: ..., 
  shoeSize: ..., 
  dressSize: ..., 
  hairColor: ..., 
  eyeColor: ..., 
  description: ..., // optional
  careerGoals: ..., // optional
};

// Call the `upsertProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertProfile(upsertProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertProfile({ uid: ..., name: ..., instagram: ..., avatar: ..., height: ..., bust: ..., waist: ..., hips: ..., shoeSize: ..., dressSize: ..., hairColor: ..., eyeColor: ..., description: ..., careerGoals: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertProfile(dataConnect, upsertProfileVars);

console.log(data.profile_upsert);

// Or, you can use the `Promise` API.
upsertProfile(upsertProfileVars).then((response) => {
  const data = response.data;
  console.log(data.profile_upsert);
});
```

### Using `UpsertProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertProfileRef, UpsertProfileVariables } from '@dataconnect/generated';

// The `UpsertProfile` mutation requires an argument of type `UpsertProfileVariables`:
const upsertProfileVars: UpsertProfileVariables = {
  uid: ..., 
  name: ..., 
  instagram: ..., // optional
  avatar: ..., // optional
  height: ..., 
  bust: ..., 
  waist: ..., 
  hips: ..., 
  shoeSize: ..., 
  dressSize: ..., 
  hairColor: ..., 
  eyeColor: ..., 
  description: ..., // optional
  careerGoals: ..., // optional
};

// Call the `upsertProfileRef()` function to get a reference to the mutation.
const ref = upsertProfileRef(upsertProfileVars);
// Variables can be defined inline as well.
const ref = upsertProfileRef({ uid: ..., name: ..., instagram: ..., avatar: ..., height: ..., bust: ..., waist: ..., hips: ..., shoeSize: ..., dressSize: ..., hairColor: ..., eyeColor: ..., description: ..., careerGoals: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertProfileRef(dataConnect, upsertProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.profile_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.profile_upsert);
});
```

## UpsertPortfolio
You can execute the `UpsertPortfolio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertPortfolio(vars: UpsertPortfolioVariables): MutationPromise<UpsertPortfolioData, UpsertPortfolioVariables>;

interface UpsertPortfolioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPortfolioVariables): MutationRef<UpsertPortfolioData, UpsertPortfolioVariables>;
}
export const upsertPortfolioRef: UpsertPortfolioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertPortfolio(dc: DataConnect, vars: UpsertPortfolioVariables): MutationPromise<UpsertPortfolioData, UpsertPortfolioVariables>;

interface UpsertPortfolioRef {
  ...
  (dc: DataConnect, vars: UpsertPortfolioVariables): MutationRef<UpsertPortfolioData, UpsertPortfolioVariables>;
}
export const upsertPortfolioRef: UpsertPortfolioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertPortfolioRef:
```typescript
const name = upsertPortfolioRef.operationName;
console.log(name);
```

### Variables
The `UpsertPortfolio` mutation requires an argument of type `UpsertPortfolioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertPortfolioVariables {
  uid: string;
  settings: string;
  isPublic: boolean;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `UpsertPortfolio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPortfolioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPortfolioData {
  portfolio_upsert: Portfolio_Key;
}
```
### Using `UpsertPortfolio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPortfolio, UpsertPortfolioVariables } from '@dataconnect/generated';

// The `UpsertPortfolio` mutation requires an argument of type `UpsertPortfolioVariables`:
const upsertPortfolioVars: UpsertPortfolioVariables = {
  uid: ..., 
  settings: ..., 
  isPublic: ..., 
  now: ..., 
};

// Call the `upsertPortfolio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPortfolio(upsertPortfolioVars);
// Variables can be defined inline as well.
const { data } = await upsertPortfolio({ uid: ..., settings: ..., isPublic: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertPortfolio(dataConnect, upsertPortfolioVars);

console.log(data.portfolio_upsert);

// Or, you can use the `Promise` API.
upsertPortfolio(upsertPortfolioVars).then((response) => {
  const data = response.data;
  console.log(data.portfolio_upsert);
});
```

### Using `UpsertPortfolio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertPortfolioRef, UpsertPortfolioVariables } from '@dataconnect/generated';

// The `UpsertPortfolio` mutation requires an argument of type `UpsertPortfolioVariables`:
const upsertPortfolioVars: UpsertPortfolioVariables = {
  uid: ..., 
  settings: ..., 
  isPublic: ..., 
  now: ..., 
};

// Call the `upsertPortfolioRef()` function to get a reference to the mutation.
const ref = upsertPortfolioRef(upsertPortfolioVars);
// Variables can be defined inline as well.
const ref = upsertPortfolioRef({ uid: ..., settings: ..., isPublic: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertPortfolioRef(dataConnect, upsertPortfolioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.portfolio_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolio_upsert);
});
```

## DeletePortfolio
You can execute the `DeletePortfolio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePortfolio(vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;

interface DeletePortfolioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
}
export const deletePortfolioRef: DeletePortfolioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePortfolio(dc: DataConnect, vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;

interface DeletePortfolioRef {
  ...
  (dc: DataConnect, vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
}
export const deletePortfolioRef: DeletePortfolioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePortfolioRef:
```typescript
const name = deletePortfolioRef.operationName;
console.log(name);
```

### Variables
The `DeletePortfolio` mutation requires an argument of type `DeletePortfolioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePortfolioVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `DeletePortfolio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePortfolioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePortfolioData {
  portfolio_delete?: Portfolio_Key | null;
}
```
### Using `DeletePortfolio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePortfolio, DeletePortfolioVariables } from '@dataconnect/generated';

// The `DeletePortfolio` mutation requires an argument of type `DeletePortfolioVariables`:
const deletePortfolioVars: DeletePortfolioVariables = {
  uid: ..., 
};

// Call the `deletePortfolio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePortfolio(deletePortfolioVars);
// Variables can be defined inline as well.
const { data } = await deletePortfolio({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePortfolio(dataConnect, deletePortfolioVars);

console.log(data.portfolio_delete);

// Or, you can use the `Promise` API.
deletePortfolio(deletePortfolioVars).then((response) => {
  const data = response.data;
  console.log(data.portfolio_delete);
});
```

### Using `DeletePortfolio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePortfolioRef, DeletePortfolioVariables } from '@dataconnect/generated';

// The `DeletePortfolio` mutation requires an argument of type `DeletePortfolioVariables`:
const deletePortfolioVars: DeletePortfolioVariables = {
  uid: ..., 
};

// Call the `deletePortfolioRef()` function to get a reference to the mutation.
const ref = deletePortfolioRef(deletePortfolioVars);
// Variables can be defined inline as well.
const ref = deletePortfolioRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePortfolioRef(dataConnect, deletePortfolioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.portfolio_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolio_delete);
});
```

## UpsertShoot
You can execute the `UpsertShoot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertShoot(vars: UpsertShootVariables): MutationPromise<UpsertShootData, UpsertShootVariables>;

interface UpsertShootRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertShootVariables): MutationRef<UpsertShootData, UpsertShootVariables>;
}
export const upsertShootRef: UpsertShootRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertShoot(dc: DataConnect, vars: UpsertShootVariables): MutationPromise<UpsertShootData, UpsertShootVariables>;

interface UpsertShootRef {
  ...
  (dc: DataConnect, vars: UpsertShootVariables): MutationRef<UpsertShootData, UpsertShootVariables>;
}
export const upsertShootRef: UpsertShootRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertShootRef:
```typescript
const name = upsertShootRef.operationName;
console.log(name);
```

### Variables
The `UpsertShoot` mutation requires an argument of type `UpsertShootVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertShootVariables {
  id: UUIDString;
  uid: string;
  name: string;
  vibes?: string | null;
  photographer?: string | null;
  studio?: string | null;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `UpsertShoot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertShootData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertShootData {
  shoot_upsert: Shoot_Key;
}
```
### Using `UpsertShoot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertShoot, UpsertShootVariables } from '@dataconnect/generated';

// The `UpsertShoot` mutation requires an argument of type `UpsertShootVariables`:
const upsertShootVars: UpsertShootVariables = {
  id: ..., 
  uid: ..., 
  name: ..., 
  vibes: ..., // optional
  photographer: ..., // optional
  studio: ..., // optional
  now: ..., 
};

// Call the `upsertShoot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertShoot(upsertShootVars);
// Variables can be defined inline as well.
const { data } = await upsertShoot({ id: ..., uid: ..., name: ..., vibes: ..., photographer: ..., studio: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertShoot(dataConnect, upsertShootVars);

console.log(data.shoot_upsert);

// Or, you can use the `Promise` API.
upsertShoot(upsertShootVars).then((response) => {
  const data = response.data;
  console.log(data.shoot_upsert);
});
```

### Using `UpsertShoot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertShootRef, UpsertShootVariables } from '@dataconnect/generated';

// The `UpsertShoot` mutation requires an argument of type `UpsertShootVariables`:
const upsertShootVars: UpsertShootVariables = {
  id: ..., 
  uid: ..., 
  name: ..., 
  vibes: ..., // optional
  photographer: ..., // optional
  studio: ..., // optional
  now: ..., 
};

// Call the `upsertShootRef()` function to get a reference to the mutation.
const ref = upsertShootRef(upsertShootVars);
// Variables can be defined inline as well.
const ref = upsertShootRef({ id: ..., uid: ..., name: ..., vibes: ..., photographer: ..., studio: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertShootRef(dataConnect, upsertShootVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shoot_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shoot_upsert);
});
```

## DeleteShoot
You can execute the `DeleteShoot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteShoot(vars: DeleteShootVariables): MutationPromise<DeleteShootData, DeleteShootVariables>;

interface DeleteShootRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteShootVariables): MutationRef<DeleteShootData, DeleteShootVariables>;
}
export const deleteShootRef: DeleteShootRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteShoot(dc: DataConnect, vars: DeleteShootVariables): MutationPromise<DeleteShootData, DeleteShootVariables>;

interface DeleteShootRef {
  ...
  (dc: DataConnect, vars: DeleteShootVariables): MutationRef<DeleteShootData, DeleteShootVariables>;
}
export const deleteShootRef: DeleteShootRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteShootRef:
```typescript
const name = deleteShootRef.operationName;
console.log(name);
```

### Variables
The `DeleteShoot` mutation requires an argument of type `DeleteShootVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteShootVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteShoot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteShootData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteShootData {
  shoot_delete?: Shoot_Key | null;
}
```
### Using `DeleteShoot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteShoot, DeleteShootVariables } from '@dataconnect/generated';

// The `DeleteShoot` mutation requires an argument of type `DeleteShootVariables`:
const deleteShootVars: DeleteShootVariables = {
  id: ..., 
};

// Call the `deleteShoot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteShoot(deleteShootVars);
// Variables can be defined inline as well.
const { data } = await deleteShoot({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteShoot(dataConnect, deleteShootVars);

console.log(data.shoot_delete);

// Or, you can use the `Promise` API.
deleteShoot(deleteShootVars).then((response) => {
  const data = response.data;
  console.log(data.shoot_delete);
});
```

### Using `DeleteShoot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteShootRef, DeleteShootVariables } from '@dataconnect/generated';

// The `DeleteShoot` mutation requires an argument of type `DeleteShootVariables`:
const deleteShootVars: DeleteShootVariables = {
  id: ..., 
};

// Call the `deleteShootRef()` function to get a reference to the mutation.
const ref = deleteShootRef(deleteShootVars);
// Variables can be defined inline as well.
const ref = deleteShootRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteShootRef(dataConnect, deleteShootVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shoot_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shoot_delete);
});
```

## UpsertImage
You can execute the `UpsertImage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertImage(vars: UpsertImageVariables): MutationPromise<UpsertImageData, UpsertImageVariables>;

interface UpsertImageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertImageVariables): MutationRef<UpsertImageData, UpsertImageVariables>;
}
export const upsertImageRef: UpsertImageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertImage(dc: DataConnect, vars: UpsertImageVariables): MutationPromise<UpsertImageData, UpsertImageVariables>;

interface UpsertImageRef {
  ...
  (dc: DataConnect, vars: UpsertImageVariables): MutationRef<UpsertImageData, UpsertImageVariables>;
}
export const upsertImageRef: UpsertImageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertImageRef:
```typescript
const name = upsertImageRef.operationName;
console.log(name);
```

### Variables
The `UpsertImage` mutation requires an argument of type `UpsertImageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertImageVariables {
  id: UUIDString;
  uid: string;
  url: string;
  now: TimestampString;
  fileHash?: string | null;
}
```
### Return Type
Recall that executing the `UpsertImage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertImageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertImageData {
  image_upsert: Image_Key;
}
```
### Using `UpsertImage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertImage, UpsertImageVariables } from '@dataconnect/generated';

// The `UpsertImage` mutation requires an argument of type `UpsertImageVariables`:
const upsertImageVars: UpsertImageVariables = {
  id: ..., 
  uid: ..., 
  url: ..., 
  now: ..., 
  fileHash: ..., // optional
};

// Call the `upsertImage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertImage(upsertImageVars);
// Variables can be defined inline as well.
const { data } = await upsertImage({ id: ..., uid: ..., url: ..., now: ..., fileHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertImage(dataConnect, upsertImageVars);

console.log(data.image_upsert);

// Or, you can use the `Promise` API.
upsertImage(upsertImageVars).then((response) => {
  const data = response.data;
  console.log(data.image_upsert);
});
```

### Using `UpsertImage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertImageRef, UpsertImageVariables } from '@dataconnect/generated';

// The `UpsertImage` mutation requires an argument of type `UpsertImageVariables`:
const upsertImageVars: UpsertImageVariables = {
  id: ..., 
  uid: ..., 
  url: ..., 
  now: ..., 
  fileHash: ..., // optional
};

// Call the `upsertImageRef()` function to get a reference to the mutation.
const ref = upsertImageRef(upsertImageVars);
// Variables can be defined inline as well.
const ref = upsertImageRef({ id: ..., uid: ..., url: ..., now: ..., fileHash: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertImageRef(dataConnect, upsertImageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.image_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.image_upsert);
});
```

## DeleteImage
You can execute the `DeleteImage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteImage(vars: DeleteImageVariables): MutationPromise<DeleteImageData, DeleteImageVariables>;

interface DeleteImageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteImageVariables): MutationRef<DeleteImageData, DeleteImageVariables>;
}
export const deleteImageRef: DeleteImageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteImage(dc: DataConnect, vars: DeleteImageVariables): MutationPromise<DeleteImageData, DeleteImageVariables>;

interface DeleteImageRef {
  ...
  (dc: DataConnect, vars: DeleteImageVariables): MutationRef<DeleteImageData, DeleteImageVariables>;
}
export const deleteImageRef: DeleteImageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteImageRef:
```typescript
const name = deleteImageRef.operationName;
console.log(name);
```

### Variables
The `DeleteImage` mutation requires an argument of type `DeleteImageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteImageVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteImage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteImageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteImageData {
  image_delete?: Image_Key | null;
}
```
### Using `DeleteImage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteImage, DeleteImageVariables } from '@dataconnect/generated';

// The `DeleteImage` mutation requires an argument of type `DeleteImageVariables`:
const deleteImageVars: DeleteImageVariables = {
  id: ..., 
};

// Call the `deleteImage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteImage(deleteImageVars);
// Variables can be defined inline as well.
const { data } = await deleteImage({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteImage(dataConnect, deleteImageVars);

console.log(data.image_delete);

// Or, you can use the `Promise` API.
deleteImage(deleteImageVars).then((response) => {
  const data = response.data;
  console.log(data.image_delete);
});
```

### Using `DeleteImage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteImageRef, DeleteImageVariables } from '@dataconnect/generated';

// The `DeleteImage` mutation requires an argument of type `DeleteImageVariables`:
const deleteImageVars: DeleteImageVariables = {
  id: ..., 
};

// Call the `deleteImageRef()` function to get a reference to the mutation.
const ref = deleteImageRef(deleteImageVars);
// Variables can be defined inline as well.
const ref = deleteImageRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteImageRef(dataConnect, deleteImageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.image_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.image_delete);
});
```

## AddImageToShoot
You can execute the `AddImageToShoot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addImageToShoot(vars: AddImageToShootVariables): MutationPromise<AddImageToShootData, AddImageToShootVariables>;

interface AddImageToShootRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddImageToShootVariables): MutationRef<AddImageToShootData, AddImageToShootVariables>;
}
export const addImageToShootRef: AddImageToShootRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addImageToShoot(dc: DataConnect, vars: AddImageToShootVariables): MutationPromise<AddImageToShootData, AddImageToShootVariables>;

interface AddImageToShootRef {
  ...
  (dc: DataConnect, vars: AddImageToShootVariables): MutationRef<AddImageToShootData, AddImageToShootVariables>;
}
export const addImageToShootRef: AddImageToShootRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addImageToShootRef:
```typescript
const name = addImageToShootRef.operationName;
console.log(name);
```

### Variables
The `AddImageToShoot` mutation requires an argument of type `AddImageToShootVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddImageToShootVariables {
  shootId: UUIDString;
  imageId: UUIDString;
  order: number;
  isVisible?: boolean | null;
}
```
### Return Type
Recall that executing the `AddImageToShoot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddImageToShootData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddImageToShootData {
  shootImage_upsert: ShootImage_Key;
}
```
### Using `AddImageToShoot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addImageToShoot, AddImageToShootVariables } from '@dataconnect/generated';

// The `AddImageToShoot` mutation requires an argument of type `AddImageToShootVariables`:
const addImageToShootVars: AddImageToShootVariables = {
  shootId: ..., 
  imageId: ..., 
  order: ..., 
  isVisible: ..., // optional
};

// Call the `addImageToShoot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addImageToShoot(addImageToShootVars);
// Variables can be defined inline as well.
const { data } = await addImageToShoot({ shootId: ..., imageId: ..., order: ..., isVisible: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addImageToShoot(dataConnect, addImageToShootVars);

console.log(data.shootImage_upsert);

// Or, you can use the `Promise` API.
addImageToShoot(addImageToShootVars).then((response) => {
  const data = response.data;
  console.log(data.shootImage_upsert);
});
```

### Using `AddImageToShoot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addImageToShootRef, AddImageToShootVariables } from '@dataconnect/generated';

// The `AddImageToShoot` mutation requires an argument of type `AddImageToShootVariables`:
const addImageToShootVars: AddImageToShootVariables = {
  shootId: ..., 
  imageId: ..., 
  order: ..., 
  isVisible: ..., // optional
};

// Call the `addImageToShootRef()` function to get a reference to the mutation.
const ref = addImageToShootRef(addImageToShootVars);
// Variables can be defined inline as well.
const ref = addImageToShootRef({ shootId: ..., imageId: ..., order: ..., isVisible: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addImageToShootRef(dataConnect, addImageToShootVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shootImage_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shootImage_upsert);
});
```

## UpsertCompCard
You can execute the `UpsertCompCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCompCard(vars: UpsertCompCardVariables): MutationPromise<UpsertCompCardData, UpsertCompCardVariables>;

interface UpsertCompCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompCardVariables): MutationRef<UpsertCompCardData, UpsertCompCardVariables>;
}
export const upsertCompCardRef: UpsertCompCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCompCard(dc: DataConnect, vars: UpsertCompCardVariables): MutationPromise<UpsertCompCardData, UpsertCompCardVariables>;

interface UpsertCompCardRef {
  ...
  (dc: DataConnect, vars: UpsertCompCardVariables): MutationRef<UpsertCompCardData, UpsertCompCardVariables>;
}
export const upsertCompCardRef: UpsertCompCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCompCardRef:
```typescript
const name = upsertCompCardRef.operationName;
console.log(name);
```

### Variables
The `UpsertCompCard` mutation requires an argument of type `UpsertCompCardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCompCardVariables {
  id: UUIDString;
  uid: string;
  layout: string;
  aesthetic: string;
  profileSnapshot: string;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `UpsertCompCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCompCardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCompCardData {
  compCard_upsert: CompCard_Key;
}
```
### Using `UpsertCompCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCompCard, UpsertCompCardVariables } from '@dataconnect/generated';

// The `UpsertCompCard` mutation requires an argument of type `UpsertCompCardVariables`:
const upsertCompCardVars: UpsertCompCardVariables = {
  id: ..., 
  uid: ..., 
  layout: ..., 
  aesthetic: ..., 
  profileSnapshot: ..., 
  now: ..., 
};

// Call the `upsertCompCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCompCard(upsertCompCardVars);
// Variables can be defined inline as well.
const { data } = await upsertCompCard({ id: ..., uid: ..., layout: ..., aesthetic: ..., profileSnapshot: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCompCard(dataConnect, upsertCompCardVars);

console.log(data.compCard_upsert);

// Or, you can use the `Promise` API.
upsertCompCard(upsertCompCardVars).then((response) => {
  const data = response.data;
  console.log(data.compCard_upsert);
});
```

### Using `UpsertCompCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCompCardRef, UpsertCompCardVariables } from '@dataconnect/generated';

// The `UpsertCompCard` mutation requires an argument of type `UpsertCompCardVariables`:
const upsertCompCardVars: UpsertCompCardVariables = {
  id: ..., 
  uid: ..., 
  layout: ..., 
  aesthetic: ..., 
  profileSnapshot: ..., 
  now: ..., 
};

// Call the `upsertCompCardRef()` function to get a reference to the mutation.
const ref = upsertCompCardRef(upsertCompCardVars);
// Variables can be defined inline as well.
const ref = upsertCompCardRef({ id: ..., uid: ..., layout: ..., aesthetic: ..., profileSnapshot: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCompCardRef(dataConnect, upsertCompCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.compCard_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.compCard_upsert);
});
```

## DeleteCompCard
You can execute the `DeleteCompCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCompCard(vars: DeleteCompCardVariables): MutationPromise<DeleteCompCardData, DeleteCompCardVariables>;

interface DeleteCompCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCompCardVariables): MutationRef<DeleteCompCardData, DeleteCompCardVariables>;
}
export const deleteCompCardRef: DeleteCompCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCompCard(dc: DataConnect, vars: DeleteCompCardVariables): MutationPromise<DeleteCompCardData, DeleteCompCardVariables>;

interface DeleteCompCardRef {
  ...
  (dc: DataConnect, vars: DeleteCompCardVariables): MutationRef<DeleteCompCardData, DeleteCompCardVariables>;
}
export const deleteCompCardRef: DeleteCompCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCompCardRef:
```typescript
const name = deleteCompCardRef.operationName;
console.log(name);
```

### Variables
The `DeleteCompCard` mutation requires an argument of type `DeleteCompCardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCompCardVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCompCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCompCardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCompCardData {
  compCard_delete?: CompCard_Key | null;
}
```
### Using `DeleteCompCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCompCard, DeleteCompCardVariables } from '@dataconnect/generated';

// The `DeleteCompCard` mutation requires an argument of type `DeleteCompCardVariables`:
const deleteCompCardVars: DeleteCompCardVariables = {
  id: ..., 
};

// Call the `deleteCompCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCompCard(deleteCompCardVars);
// Variables can be defined inline as well.
const { data } = await deleteCompCard({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCompCard(dataConnect, deleteCompCardVars);

console.log(data.compCard_delete);

// Or, you can use the `Promise` API.
deleteCompCard(deleteCompCardVars).then((response) => {
  const data = response.data;
  console.log(data.compCard_delete);
});
```

### Using `DeleteCompCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCompCardRef, DeleteCompCardVariables } from '@dataconnect/generated';

// The `DeleteCompCard` mutation requires an argument of type `DeleteCompCardVariables`:
const deleteCompCardVars: DeleteCompCardVariables = {
  id: ..., 
};

// Call the `deleteCompCardRef()` function to get a reference to the mutation.
const ref = deleteCompCardRef(deleteCompCardVars);
// Variables can be defined inline as well.
const ref = deleteCompCardRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCompCardRef(dataConnect, deleteCompCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.compCard_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.compCard_delete);
});
```

