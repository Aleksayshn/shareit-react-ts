import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";
import { AuthProvider, type AuthUser } from "@/src/shared/auth";

interface RenderWithProvidersOptions {
  user?: AuthUser | null;
  queryClient?: QueryClient;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

export function renderWithProviders(
  ui: ReactElement,
  {
    user = null,
    queryClient = createTestQueryClient(),
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  };
}
