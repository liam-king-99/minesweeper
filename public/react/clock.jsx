class Clock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            hiddenTime: false
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState(state => ({
            hiddenTime: !state.hiddenTime
        }))
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.showTime(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    showTime() {
        this.setState({
            date: new Date()
        })
    }

    render() {
            if (this.state.hiddenTime) {
                return (
                    <div>
                        <button onClick = {this.handleClick}>Show Time</button>
                    </div>
                )
            } else {
                return (
                    <div>
                        <button onClick = {this.handleClick}>Hide Time</button>
                        <p>{this.state.date.toLocaleTimeString()}</p>
                    </div>
                )
            }
    }
}

ReactDOM.render(<Clock />, document.getElementById("clockDiv"))
