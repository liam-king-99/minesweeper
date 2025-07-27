export interface MineLocationsAction {
    type: 'set' | 'reset',
    value?: number[]
}

export function mineLocationsReducer (_mineLocations: number[], action: MineLocationsAction): number[] {
    switch (action.type) {
        case 'set': {
            return action.value!;
        }
        case 'reset': {
            return [];
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export const setMineLocations = (dispatch: React.Dispatch<MineLocationsAction>, mineLocations: number[]) => {
    dispatch({
        type: 'set',
        value: mineLocations
      });
}

export const resetMineLocations = (dispatch: React.Dispatch<MineLocationsAction>) => {
    dispatch({
        type: 'reset'
      });
}

