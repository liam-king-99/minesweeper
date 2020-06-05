class Box extends React.Component {
    constructor(props) {
        super(props)
        let mineID = this.props.mineID
        let mineLocations = this.props.mineLocations
        let value = 0
        //if the box does not contain a mine, the loops determine how many mines surround the box
        if (!mineLocations.includes(this.props.mineID)) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    //if the box is the rightmost or leftmost box of a row, only its 5 neighbors are considered
                    if (!(mineID % 9 === 8 && j === 1) && !(mineID % 9 === 0 && j === -1)) {
                        let neighborID = mineID + (9*i + j)
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
            */
            this.state = {
                isMine: false,
                value: value,
                leftClicked: false,
                rightClicked: false
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


    boxClick(state, mouseButton) {
        console.log(mouseButton)
        switch (mouseButton) {
            case 1:
                if (state.rightClicked) {
                    this.setState(() => ({
                        rightClicked: false
                    }))
                    break
                } else {
                    this.setState(() => ({
                        leftClicked: true
                    }))
                    break
                }
                
            case 3:
                this.setState(() => ({
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
                        <img src = '/public/images/Minesweeper_0.png' alt = '0'></img>
                    )
                case 1:
                    return (
                        <img src = '/public/images/Minesweeper_1.png' alt = '1'></img>
                    )
                case 2:
                    return (
                        <img src = '/public/images/Minesweeper_2.png' alt = '2'></img>
                    )
                case 3:
                    return (
                        <img src = '/public/images/Minesweeper_3.png' alt = '3'></img>
                    )
                case 4:
                    return (
                        <img src = '/public/images/Minesweeper_4.png' alt = '4'></img>
                    )
                case 5:
                    return (
                        <img src = '/public/images/Minesweeper_5.png' alt = '5'></img>
                    )
                case 6:
                    return (
                        <img src = '/public/images/Minesweeper_6.png' alt = '6'></img>
                    )
                case 7:
                    return (
                        <img src = '/public/images/Minesweeper_7.png' alt = '7'></img>
                    )
                case 8:
                    return (
                        <img src = '/public/images/Minesweeper_8.png' alt = '8'></img>
                    )
                default:
                    return (
                        <img src = '/public/images/Minesweeper_mine.png' alt = 'X'></img>
                    )
            }
        } else if (this.state.rightClicked) {
            return (
                <img src = '/public/images/Minesweeper_flag.png' alt = 'F' onMouseDown={(e) => this.boxClick(this.state, event.which)}></img>
            )  
        } else {
            return (
                //id is the "number" of the box. First row starts at 0, second row at 9, third row at 18, etc. 
                //<button className="box" id={this.props.mineID} onClick={e => this.boxClick(this.state)}></button>
                <img src = 'public/images/Minesweeper_unopened_square.png' alt = '' onMouseDown={(e) => this.boxClick(this.state, event.which)}></img>
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
        //For testing purposes
        console.log(mineIDs)
        this.state = {
            mineLocations: mineIDs
        }
    }

    createRow(rowNum) {
        //returns a row of 9 boxes
        let boxRow = []
        for (let i = 0; i < 9; i++) {
            boxRow.push(i)
        }

        return (
            <div className="boxRow">
                {boxRow.map(item => (<Box mineID={9*rowNum + item} mineLocations={this.state.mineLocations}/>))}

            </div>
        )
    }

    render() {
        //returns a 9x9 board of boxes
        let boxTable = []
        for (let i = 0; i < 9; i++) {
            boxTable.push(i)
        }

        return (
            <div className="boxTable">
                {boxTable.map(item => (this.createRow(item)))}
            </div>
        )
    }
}

ReactDOM.render(<Board />, document.getElementById('gameBoard'))