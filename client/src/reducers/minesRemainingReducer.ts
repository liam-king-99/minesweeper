import type React from "react";

export interface MinesRemainingAction {
    type: 'set' | 'increment' | 'decrement',
    value?: number,
    maxNumberOfMines?: number
}

export function minesRemainingReducer(minesRemaining: number, action: MinesRemainingAction): number {
    switch (action.type) {
        case 'set': {
            return action.value!;
        }
        case 'increment': {
            return Math.min(minesRemaining + 1, action.maxNumberOfMines!);
        }
        case 'decrement': {
            return Math.min(minesRemaining - 1, action.maxNumberOfMines!);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export const incrementMinesRemaining = (dispatch: React.Dispatch<MinesRemainingAction>, TotalNumberOfMines: number) => {
    dispatch({
        type: 'increment',
        maxNumberOfMines: TotalNumberOfMines
      });
}

export const decrementMinesReamining = (dispatch: React.Dispatch<MinesRemainingAction>, TotalNumberOfMines: number) => {
    dispatch({
        type: 'decrement',
        maxNumberOfMines: TotalNumberOfMines
      });
}

export const setMinesRemaining = (dispatch: React.Dispatch<MinesRemainingAction>, newValue: number) => {
    dispatch({
        type: 'set',
        value: newValue
      });
}

