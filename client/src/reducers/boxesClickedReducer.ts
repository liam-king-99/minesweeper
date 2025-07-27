export interface BoxesClickedAction {
    type: 'addOne' | 'addMany' | 'reset',
    value?: Set<number> | number
}

const union = (baseSet: Set<number>, itemsToAdd: Set<number>): Set<number> => {
    return new Set([...baseSet, ...itemsToAdd]);
}

export function boxesClickedReducer(boxesClicked: Set<number>, action: BoxesClickedAction): Set<number> {
    switch (action.type) {
        case 'addOne': {
            return new Set(boxesClicked).add(action.value as number)
        }
        case 'addMany': {
            return union(boxesClicked, action.value as Set<number>)
        }
        case 'reset': {
            return new Set()
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export const addOneBox = (dispatch: React.Dispatch<BoxesClickedAction>, id: number) => {
    dispatch({
        type: 'addOne',
        value: id
      });
}

export const addManyBoxes = (dispatch: React.Dispatch<BoxesClickedAction>, boxesToAdd: Set<number>) => {
    dispatch({
        type: 'addMany',
        value: boxesToAdd
      });
}

export const resetBoxesClicked = (dispatch: React.Dispatch<BoxesClickedAction>) => {
    dispatch({
        type: 'reset'
      });
}

