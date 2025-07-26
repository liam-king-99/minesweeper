export function mineLocationsReducer(mineLocations, action) {
    /*
    action {
        value?: newValue to use for updating
    }
    */
    switch (action.type) {
        case 'set': {
            return action.value;
        }
        case 'reset': {
            return [];
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export const setMineLocations = (dispatch, mineLocations) => {
    dispatch({
        type: 'set',
        value: mineLocations
      });
}

export const resetMineLocations = (dispatch) => {
    dispatch({
        type: 'reset'
      });
}

