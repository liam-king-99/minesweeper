import { createContext, type Dispatch } from 'react';
import { type MinesRemainingAction } from './reducers/minesRemainingReducer';

export const BoxesClickedContext = createContext(null);
export const BoxesClickedDispatchContext = createContext(null);

export const MineLocationsContext = createContext([]);
export const MineLocationsDispatchContext = createContext(null);

export const MinesRemainingContext = createContext(null);
export const MinesRemainingDispatchContext = createContext<Dispatch<MinesRemainingAction>>(() => {});