import { useRouteError } from 'react-router-dom';
import { ErrorPage } from './ErrorPage.tsx';

/** Route-level error element: React Router renders this when a route render/loader/action throws. */
export const RouteError = () => {
  const error = useRouteError();
  console.error('[RouteError]', error);
  return <ErrorPage error={error} />;
};
