export default function minesRemainingReducer(minesRemaining, action) {
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