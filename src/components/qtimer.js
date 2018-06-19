import React from "react";


const Qtimer = props => (
    <div className="card-outline-secondary" style={{width: '20%', display: 'inline-block', float: 'right'}}>
        <span className="stopwatch-time">{Math.floor(props.timer / 1000)}</span>

    </div>
);

export default Qtimer;