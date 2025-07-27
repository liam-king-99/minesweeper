export const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1,
    NOT_STARTED: 2
};

export type difficultyOption = 'Beginner' | 'Intermediate' | 'Expert';

export interface gameSettings {
    totalNumberOfMines: number,
    width: number,
    height: number
}

export const mapDifficultyToGameSettings = {
    "Beginner": {
        totalNumberOfMines: 10,
        width: 9,
        height: 9,
    },
    "Intermediate": {
        totalNumberOfMines: 40,
        width: 16,
        height: 16,
    },
    "Expert": {
        totalNumberOfMines: 99,
        width: 30,
        height: 16,
    }
}