# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useGetProfile, useCreateUser, useUpsertProfile, useGetPortfolio, useGetShootsForPortfolio, useUpsertPortfolio, useDeletePortfolio, useUpsertShoot, useDeleteShoot, useGetLibrary } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useGetProfile(getProfileVars);

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useUpsertProfile(upsertProfileVars);

const { data, isPending, isSuccess, isError, error } = useGetPortfolio(getPortfolioVars);

const { data, isPending, isSuccess, isError, error } = useGetShootsForPortfolio(getShootsForPortfolioVars);

const { data, isPending, isSuccess, isError, error } = useUpsertPortfolio(upsertPortfolioVars);

const { data, isPending, isSuccess, isError, error } = useDeletePortfolio(deletePortfolioVars);

const { data, isPending, isSuccess, isError, error } = useUpsertShoot(upsertShootVars);

const { data, isPending, isSuccess, isError, error } = useDeleteShoot(deleteShootVars);

const { data, isPending, isSuccess, isError, error } = useGetLibrary(getLibraryVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getProfile, createUser, upsertProfile, getPortfolio, getShootsForPortfolio, upsertPortfolio, deletePortfolio, upsertShoot, deleteShoot, getLibrary } from '@dataconnect/generated';


// Operation GetProfile:  For variables, look at type GetProfileVars in ../index.d.ts
const { data } = await GetProfile(dataConnect, getProfileVars);

// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpsertProfile:  For variables, look at type UpsertProfileVars in ../index.d.ts
const { data } = await UpsertProfile(dataConnect, upsertProfileVars);

// Operation GetPortfolio:  For variables, look at type GetPortfolioVars in ../index.d.ts
const { data } = await GetPortfolio(dataConnect, getPortfolioVars);

// Operation GetShootsForPortfolio:  For variables, look at type GetShootsForPortfolioVars in ../index.d.ts
const { data } = await GetShootsForPortfolio(dataConnect, getShootsForPortfolioVars);

// Operation UpsertPortfolio:  For variables, look at type UpsertPortfolioVars in ../index.d.ts
const { data } = await UpsertPortfolio(dataConnect, upsertPortfolioVars);

// Operation DeletePortfolio:  For variables, look at type DeletePortfolioVars in ../index.d.ts
const { data } = await DeletePortfolio(dataConnect, deletePortfolioVars);

// Operation UpsertShoot:  For variables, look at type UpsertShootVars in ../index.d.ts
const { data } = await UpsertShoot(dataConnect, upsertShootVars);

// Operation DeleteShoot:  For variables, look at type DeleteShootVars in ../index.d.ts
const { data } = await DeleteShoot(dataConnect, deleteShootVars);

// Operation GetLibrary:  For variables, look at type GetLibraryVars in ../index.d.ts
const { data } = await GetLibrary(dataConnect, getLibraryVars);


```