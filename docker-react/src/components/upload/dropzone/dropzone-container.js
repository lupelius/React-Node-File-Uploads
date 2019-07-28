import React, { Component } from 'react';
import './dropzone.css';

type Props = {
  disabled: bool,
  onFilesAdded: any
};

type State = {
  highlight: bool
};

class Dropzone extends Component<Props, State> {
  state: {
    highlight: bool
  }

  constructor(props: {
    disabled: bool,
    onFilesAdded: any
  }) {
    super(props);
    this.fileInputRef = React.createRef();
  }

  openFileDialog = () => {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

  onFilesAdded = (event:SyntheticEvent<*>) => {
    if (this.props.disabled) return;
    const files = event.target.files;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
  }

  onDragOver = (event:SyntheticEvent<*>) => {
    event.preventDefault();
  
    if (this.props.disabled) return;
  
    this.setState({ hightlight: true });
  }

  onDragLeave = () => {
    this.setState({ hightlight: false });
  }

  onDrop = (event:SyntheticEvent<*>) => {
    event.preventDefault();
  
    if (this.props.disabled) return;
  
    const files = event.dataTransfer.files;
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files);
      this.props.onFilesAdded(array);
    }
    this.setState({ hightlight: false });
  }

  fileListToArray = list => {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  }

  render() {
    return (
      <div 
        className="Dropzone"
        onClick={this.openFileDialog}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        style={{ cursor: this.props.disabled ? "default" : "pointer" }}
      >
        <img
          alt="upload"
          className="Icon"
          src="upload.svg"
        />
        <input
          ref={this.fileInputRef}
          className="FileInput"
          type="file"
          multiple
          onChange={this.onFilesAdded}
        />
        <span>Drop</span>
      </div>
    );
  }
}
export default Dropzone;