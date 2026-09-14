export interface NavigateOptions {
  state?: any;
  replace?: boolean;
}

type RouterNavigateFn = (to: string, options?: { state?: any; replace?: boolean }) => void;

let routerNavigate: RouterNavigateFn | null = null;

export const setRouterNavigate = (fn: RouterNavigateFn | null) => {
  routerNavigate = fn;
};

/**
 * Universal client-side navigation handler.
 * Supports React Router when configured while retaining standard popstate event synchronization.
 */
export const navigate = (to: string, options?: NavigateOptions) => {
  if (routerNavigate) {
    try {
      routerNavigate(to, options);
    } catch {
      if (options?.replace) {
        window.history.replaceState(options?.state ?? null, '', to);
      } else {
        window.history.pushState(options?.state ?? null, '', to);
      }
    }
  } else {
    if (options?.replace) {
      window.history.replaceState(options?.state ?? null, '', to);
    } else {
      window.history.pushState(options?.state ?? null, '', to);
    }
  }
  window.dispatchEvent(new PopStateEvent('popstate', { state: options?.state ?? null }));
};
