import React from 'react'
import './Progress.css'

export default class Progress extends React.PureComponent {

    formatNumber(value) {
        return parseFloat(value).toFixed(2)
    }

    render() {
        return (
            <div className="progressBar">
                <div
                    className="progress"
                    style={{ width: this.props.progress + '%' }}
                />
                {(this.props.state !== "done") ? (
                    <div className="progressPercent">
                        {this.formatNumber(this.props.progress)}%
                    </div>
                ) : null}
            </div>
        )
    }
}