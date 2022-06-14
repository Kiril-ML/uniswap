import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppState, AppDispatch } from './store';

// Используйте во всем приложении вместо обычных `useDispatch` и `useSelector`
const useAppDispatch = () => useDispatch<AppDispatch>();

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export { useAppDispatch, useAppSelector };
