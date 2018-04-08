import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./hello.css";
import moment from "moment";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const className = (i, selected, prefix) => {
  const { startSelected, endSelected } = selected;
  if (isNaN(startSelected) || startSelected === null) return prefix;

  if (endSelected === null) {
    return prefix + (i === startSelected ? " selected" : "");
  }

  return prefix + (i >= startSelected && i <= endSelected ? " selected" : "");
};

const name = i => {
  if (i > 12) {
    return (
      <span>
        {i - 12}
        <small> pm</small>
      </span>
    );
  }
  return (
    <span>
      {i}
      <small> am</small>
    </span>
  );
};

const drawRow = (selected, onHover, onClick) => {
  let els = [];
  for (let i = 0; i <= 23; i++) {
    els.push(
      <div key={"hour-" + i} className={"hour"}>
        <div className="name">{name(i)}</div>
        <div className="minutes">
          <div
            onClick={onClick(i, 0)}
            className={className(i, selected, "startHour")}
          />
          <div
            onClick={onClick(i, 0.15)}
            className={className(i + 0.15, selected, "mins")}
          >
            15
          </div>
          <div
            onClick={onClick(i, 0.3)}
            className={className(i + 0.3, selected, "mins")}
          >
            30
          </div>
          <div
            onClick={onClick(i, 0.45)}
            className={className(i + 0.45, selected, "mins")}
          >
            45
          </div>
          <div
            onClick={onClick(i + 1, 0)}
            className={className(i+.60, selected, "endHour")}
          />
        </div>
      </div>
    );
  }

  return els;
};

class App extends React.Component {
  state = {
    startSelected: null,
    endSelected: null,
    lastClick: null,
    start: null,
    end: null,
    hoverSelected: null
  };
  onHover = i => () => {
    this.setState({ hoverSelected: i });
  };
  onClick = (hr, min) => e => {
    e.stopPropagation();

    let action;
    let dt = moment().hour(hr);
    dt.minutes(min * 100);
    const i = hr + min;

    if (this.state.lastClick !== "start") action = "start";

    if (action === "start") {
      this.setState({
        startSelected: i,
        endSelected: null,
        lastClick: "start",
        start: dt
      });
    } else {
      this.setState({ endSelected: i, lastClick: "end", end: dt });
    }
  };
  componentDidMount() {
    this.refs.container.scrollLeft = 400;
  }
  render() {
    const { startSelected, endSelected, hoverSelected } = this.state;
    return (
      <div style={styles}>
        {this.state.start !== null && (
          <h3>Start: {this.state.start.format("h:mm a")}</h3>
        )}
        {this.state.end !== null && (
          <h3>End: {this.state.end.format("h:mm a")}</h3>
        )}
        <div className="timeSelector-container" ref="container">
          <div className="timeSelector">
            {drawRow(
              { startSelected, endSelected, hoverSelected },
              this.onHover,
              this.onClick
            )}
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
