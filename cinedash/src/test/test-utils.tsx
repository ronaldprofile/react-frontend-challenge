import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig
} from "@tanstack/react-query";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions
} from "@testing-library/react";
import type { ReactNode } from "react";

import { Toaster } from "@/shared/ui/sonner";

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false
    },
    mutations: {
      retry: false
    }
  }
};

export const queryClient = new QueryClient(queryClientConfig);

function wrapAllProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      {children}
    </QueryClientProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {}

const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) =>
  render(ui, {
    wrapper: ({ children }) =>
      wrapAllProviders({
        children
      }),
    ...options
  });

function customRenderHook<Result, Props>(
  renderCallback: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper">
) {
  return renderHook(renderCallback, {
    wrapper: wrapAllProviders,
    ...options
  });
}

export * from "@testing-library/react";
export * from "@testing-library/user-event";
export { customRender as render, customRenderHook as renderHook };
