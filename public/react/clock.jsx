function showTime() {
    const newTimeValue = (
        <div>
            <p>{new Date().toLocaleTimeString()}</p>
        </div>
    )
    ReactDOM.render(newTimeValue, document.getElementById("clockDiv"));
}
showTime()
setInterval(showTime, 1000)