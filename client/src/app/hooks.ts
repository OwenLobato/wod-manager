import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store.ts';

/** Typed `useDispatch` bound to the app store. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Typed `useSelector` bound to the app store. */
export const useAppSelector = useSelector.withTypes<RootState>();
