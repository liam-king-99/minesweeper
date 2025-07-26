export function boxesClickedReducer(boxesClicked, action) {
    /*
    action {
        value: newValue to use for updating
    }
    */
    switch (action.type) {
        case 'addOne': {
            return new Set(boxesClicked).add(action.value)
        }
        case 'addMany': {
            return new Set(boxesClicked).union(action.value)
        }
        case 'reset': {
            return new Set()
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export const addOneBox = (dispatch, id) => {
    dispatch({
        type: 'addOne',
        value: id
      });
}

export const addManyBoxes = (dispatch, boxesToAdd) => {
    dispatch({
        type: 'addMany',
        value: boxesToAdd
      });
}

export const resetBoxesClicked = (dispatch) => {
    dispatch({
        type: 'reset'
      });
}

