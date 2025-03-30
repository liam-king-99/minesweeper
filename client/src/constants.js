export const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1,
    NOT_STARTED: 2
};

export const mapDifficultyToGameSettings = {
    "Beginner": {
        _totalNumberOfMines: 10,
        _width: 9,
        _height: 9,
    },
    "Intermediate": {
        _totalNumberOfMines: 40,
        _width: 16,
        _height: 16,
    },
    "Expert": {
        _totalNumberOfMines: 99,
        _width: 30,
        _height: 16,
    }
}