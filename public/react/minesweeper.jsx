class Box extends React.Component {
    constructor(props) {
        super(props)
        let mineID = this.props.mineID
        let mineLocations = this.props.mineLocations
        let value = 0
        if (!mineLocations.includes(this.props.mineID)) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    //if the box is the rightmost box of a row, only its 5 neighbors are considered
                    if (mineID % 9 !== 8 || mineID % 9 === 8 && j < 1) {
                        let neighborID = mineID + (9*i + j)
                        if (mineLocations.includes(neighborID)) value++
                    }
                }
            }

            //set state of a box that does not hold a mine
            this.state = {
                isMine: false,
                value: value
            }
        } else {
            //set state of a box that does hold a mine
            this.state = {
                isMine: true,
                value: null
            }
        }

        
    }


    boxClick(e) {
        console.log(e.isMine)
        if (e.isMine) {
            console.log("It's a mine")
            alert("Mine")
        } else {
            console.log("All good")
            alert(e.value)
        }
    }

    render() {
        //id is the "number" of the box. First row starts at 0, second row at 9, third row at 18, etc. 
        return (
        <button className="box" id={this.props.mineID} onClick={e => this.boxClick(this.state)}></button>
        )
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