import { createContext, type Dispatch } from 'react';
import { type BoxesClickedAction } from './reducers/boxesClickedReducer';
import { type MineLocationsAction } from './reducers/mineLocationsReducer';
import { type MinesRemainingAction } from './reducers/minesRemainingReducer';

export const BoxesClickedContext = createContext<Set<number>>(new Set<number>());
export const BoxesClickedDispatchContext = createContext<Dispatch<BoxesClickedAction>>(() => {});

export const MineLocationsContext = createContext(new Array<number>());
export const MineLocationsDispatchContext = createContext<Dispatch<MineLocationsAction>>(() => {});

export const MinesRemainingContext = createContext(0);
export const MinesRemainingDispatchContext = createContext<Dispatch<MinesRemainingAction>>(() => {});