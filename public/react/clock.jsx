function showTime() {
    const newTimeValue = (
        <div>
            <p>{new Date().toLocaleString()}</p>
        </div>
    )
    ReactDOM.render(newTimeValue, document.getElementById("clockDiv"));
}
showTime()
setInterval(showTime, 1000)