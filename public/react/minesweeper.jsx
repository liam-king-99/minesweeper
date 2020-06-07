class Box extends React.Component {
    constructor(props) {
        super(props)
        let mineID = this.props.mineID
        let mineLocations = this.props.mineLocations
        let value = 0
        let neighborIDs = []
        //if the box does not contain a mine, the loops determine how many mines surround the box
        if (!mineLocations.includes(this.props.mineID)) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    //if the box is the rightmost or leftmost box of a row, only its 5 neighbors are considered
                    if (!(mineID % 9 === 8 && j === 1) && !(mineID % 9 === 0 && j === -1)) {
                        let neighborID = mineID + (9*i + j)
                        //Add neighbor's ID to the box's neighbor ID array if the ID is valid and is not equal to the box in question
                        if (neighborID !== mineID && neighborID >=0 && neighborID <= 80) neighborIDs.push(neighborID)
                        //Increment the value of mines adjacent to the box for each neighboring box that contains a mine
                        if (mineLocations.includes(neighborID)) value++
                    }
                }
            }

            /*
                Set state of a box that does not hold a mine
                isMine: false -> box does not hold a mine
                value -> represents how many mines are adjacent to the box
                leftClicked -> will only be true if the box is not flagged when left clicked
                rightClicked -> will only be true if the box is right clicked in its initial state
                neighborIDs -> array containing the IDs of all neighboring mines
            */
            this.state = {
                isMine: false,
                value: value,
                leftClicked: false,
                rightClicked: false,
                neighborIDs: neighborIDs
            }
        } else {
            /*
                Set state of a box that does not hold a mine
                isMine: true -> box holds a mine
                value -> null because the box is a mine
                leftClicked -> will only be true if the box is not flagged when left clicked
                rightClicked -> will only be true if the box is right clicked in its initial state
            */
            this.state = {
                isMine: true,
                value: null,
                leftClicked: false,
                rightClicked: false
            }
        }

        
    }

    /*
        Takes in the state of a box and sends a left click to all of its neighbors
        Effectively calls cascadeOnEmptyBoxNeighbor on all of the neighboring boxes
        Didn't want to have this code in multiple places so I made it a function
    */
    clickOnNeighbors(state) {
            if (!state.leftClicked) {
                state.neighborIDs.map(id => {
                    if (document.getElementById(`${id}`)) {
                        document.getElementById(`${id}`).click()
                    }    
                })
            }
    }

    // onClick function of each box, does not get triggered by mousedown
    cascadeOnEmptyBoxNeighbor(state) {
        if (!state.leftClicked) {
            //removes flag from the box if it has been flagged by sending a right click to the box
            if (state.rightClicked) {
                let rightClick = new MouseEvent("contextmenu", {
                    bubbles: true,
                    cancelable: false,
                    view: window,
                    button: 2,
                    buttons: 2
                })
                document.getElementById(this.props.mineID).dispatchEvent(rightClick)
            } else {
                //clears the box
                this.setState((state) => ({
                    leftClicked: true
                }))

                if (state.value !== null) {
                    this.props.countBoxesCleared()
                }
                //calls clickOnNeighbors to send a left click to all surrounding boxes if the box is empty
                /*if (state.value === 0) {
                    this.clickOnNeighbors(state)
                }*/
            }
        }
        
        
        
    }

    boxMouseDown(state, mouseButton) {
        switch (mouseButton) {
            case 0:
                //Left mouse button clicked
                if (state.rightClicked) {
                    //Doesn't affect flagged box
                    break
                } else {
                    //Clears the box
                    this.setState((state) => ({
                        leftClicked: true
                    }))
                    if (state.value === null) {
                        //Game ends if the box is a mine
                        this.props.endGame()
                    } else {
                        //The box is not a mine, total boxes cleared increases by 1
                        this.props.countBoxesCleared()
                        //DO THE CASCADE
                        if (state.value === 0) {
                            this.clickOnNeighbors(state)
                        }
                    }
                    break
                }
                
            case 2:
                //Right mouse button clicked, updates how many mines are left by adding 1 to the total if a flag is removed, or subtracting one from the total if a flag is placed
                state.rightClicked ? this.props.updateMinesRemaining(-1) : this.props.updateMinesRemaining(1)
                this.setState((state) => ({
                    //Toggles the box between flagged and initial state
                    rightClicked: !state.rightClicked
                }))
            default:
                break
        }

    }

    render() {
        if (this.state.leftClicked) {
            switch (this.state.value) {
                case 0:
                    return (
                        <img src = '/public/images/Minesweeper_0.png' alt = '0' className='box'></img>
                    )
                case 1:
                    return (
                        <img src = '/public/images/Minesweeper_1.png' alt = '1' className='box'></img>
                    )
                case 2:
                    return (
                        <img src = '/public/images/Minesweeper_2.png' alt = '2' className='box'></img>
                    )
                case 3:
                    return (
                        <img src = '/public/images/Minesweeper_3.png' alt = '3' className='box'></img>
                    )
                case 4:
                    return (
                        <img src = '/public/images/Minesweeper_4.png' alt = '4' className='box'></img>
                    )
                case 5:
                    return (
                        <img src = '/public/images/Minesweeper_5.png' alt = '5' className='box'></img>
                    )
                case 6:
                    return (
                        <img src = '/public/images/Minesweeper_6.png' alt = '6' className='box'></img>
                    )
                case 7:
                    return (
                        <img src = '/public/images/Minesweeper_7.png' alt = '7' className='box'></img>
                    )
                case 8:
                    return (
                        <img src = '/public/images/Minesweeper_8.png' alt = '8' className='box'></img>
                    )
                default:
                    return (
                        <img src = '/public/images/Minesweeper_mine.png' alt = 'X' className='box'></img>
                    )
            }
        } else if (this.state.rightClicked) {
            return (
                <img src = '/public/images/Minesweeper_flag.png' alt = 'F' className='box' id={this.props.mineID} onMouseDown={(e) => this.boxMouseDown(this.state, event.button)} onClick={(e) => this.cascadeOnEmptyBoxNeighbor(this.state)}></img>
                //<img src = '/public/images/Minesweeper_flag.png' alt = 'F' id={this.props.mineID} onClick={(e) => this.boxClick(this.state, event.button)} onContextMenu={(e) => this.boxClick(this.state, event.button)}></img>
            )  
        } else {
            return (
                <img src = 'public/images/Minesweeper_unopened_square.png' alt = '' className='box' id={this.props.mineID} onMouseDown={(e) => this.boxMouseDown(this.state, event.button)} onClick={(e) => this.cascadeOnEmptyBoxNeighbor(this.state)}></img>
                //<img src = '/public/images/Minesweeper_unopened_square.png' alt = '' id={this.props.mineID} onClick={(e) => this.boxClick(this.state, event.button)} onContextMenu={(e) => this.boxClick(this.state, event.button)}></img>

                )
        }
        
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props)
        //mineIDs holds 10 unique random numbers from 0 to 80. These numbers represent the locations of the mines
        let mineIDs = []
        //10 is the number of mines
        while(mineIDs.length < 10){
            //80 is length*width - 1
            let mineID = Math.floor(Math.random() * 80);
            if(mineIDs.indexOf(mineID) === -1) mineIDs.push(mineID);
        }
        
        this.state = {
            mineLocations: mineIDs,
            boxesCleared: 0,
            minesRemaining: 10,
            gameOver: false,
            gameWin: false
        }
    }

    //Called every time a box that is not a mine is cleared
    countBoxesCleared() {
        this.setState((state) => ({
            boxesCleared: (state.boxesCleared + 1)
        }))
        // If all the boxes that are not mines have been cleared, the game ends and the user is shown a congratulatory message
        if (this.state.boxesCleared === 70) {
            this.setState((state) => ({
                gameOver: true,
                gameWin: true
            }))
        }
    }

    updateMinesRemaining(n) {
        this.setState((state) => ({
            minesRemaining: (state.minesRemaining - n)
        }))
    }

    //Called when a mine is cleared
    endGame() {
        this.setState((state) => ({
            gameOver: true,
            gameWin: false
        }))
    }

    createRow(rowNum) {
        //returns a row of 9 boxes
        let boxRow = []
        for (let i = 0; i < 9; i++) {
            boxRow.push(i)
        }

        return (
            <div className="boxRow">
                {boxRow.map(item => (<Box mineID={9*rowNum + item} mineLocations={this.state.mineLocations} countBoxesCleared={this.countBoxesCleared.bind(this)} endGame={this.endGame.bind(this)} updateMinesRemaining={this.updateMinesRemaining.bind(this)}/>))}

            </div>
        )
    }

    gameOverClick() {
        if (this.state.gameOver) {
            if (this.state.gameWin) {
                alert("Congratulations!")
                alert("Click OK to play again")
            } else {
                alert("Game over. Click OK to play again")
            }
            window.location.reload()
        }
    }

    render() {
        //returns a 9x9 board of boxes
        let boxTable = []
        for (let i = 0; i < 9; i++) {
            boxTable.push(i)
        }

        

        return (
            <div className="boxTable" id="boxTable" onClick={this.gameOverClick.bind(this)}>
                <p>{this.state.minesRemaining}</p>
                {boxTable.map(item => (this.createRow(item)))}
                </div>
        )
    }
}

ReactDOM.render(<Board />, document.getElementById('gameBoard'))
document.getElementById('boxTable').addEventListener('contextmenu', event => event.preventDefault())