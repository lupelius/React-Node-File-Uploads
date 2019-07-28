import React, { PureComponent } from 'react'
import './progress.css'

type Props = {
  progress: Number
};

class Progress extends PureComponent<Props> {
  render() {
    return (
      <div className="ProgressBar">
        <div
          className="Progress"
          style={{ width: `${this.props.progress}%` }}
        />
      </div>
    )
  }
}

export default Progress