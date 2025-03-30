export function minesRemainingReducer(minesRemaining, action) {
    /*
    action {
        value: newValue to use for updating
        maxNumberOfMines: value to use to prevent minesRemaining count from going too high
    }
    */
    switch (action.type) {
        case 'set': {
            return action.value;
        }
        case 'increment': {
            return Math.min(minesRemaining + 1, action.maxNumberOfMines);
        }
        case 'decrement': {
            return Math.min(minesRemaining - 1, action.maxNumberOfMines);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export const incrementMinesRemaining = (dispatch, TotalNumberOfMines) => {
    dispatch({
        type: 'increment',
        maxNumberOfMines: TotalNumberOfMines
      });
}

export const decrementMinesReamining = (dispatch, TotalNumberOfMines) => {
    dispatch({
        type: 'decrement',
        maxNumberOfMines: TotalNumberOfMines
      });
}

export const setMinesRemaining = (dispatch, newValue) => {
    dispatch({
        type: 'set',
        value: newValue
      });
}

