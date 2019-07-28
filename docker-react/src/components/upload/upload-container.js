// @flow

import React, { Component } from 'react';
import './upload.css';
// import './upload-view';
import Dropzone from './dropzone';
import Progress from './progress';

type Props = {
  reloadList: () => void
};

type State = {
  files: array,
  uploading: bool,
  uploadProgress: Object<string>,
  successfullUploaded: bool
};

class Upload extends Component<Props, State> {
  state: {
    files: array,
    uploading: bool,
    uploadProgress: Object<string>,
    successfullUploaded: bool
  }

  constructor(props: {
    reloadList: () => void
  }) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  onFilesAdded = (files: Array<File>) => {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  renderProgress = file => {
    const uploadProgress = this.state.uploadProgress[file.name];
    
    return (
      (this.state.uploading || this.state.successfullUploaded) && <div className="ProgressWrapper">
        <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
        <img
          className="CheckIcon"
          alt="done"
          src="check.svg"
          style={{
            opacity:
              uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
          }}
          width="12px"
        />
      </div>
    );
    
  }

  sendRequest = file => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
    
      req.upload.addEventListener("progress", (event: SyntheticEvent<*>) => {
       if (event.lengthComputable) {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = {
         state: "pending",
         percentage: (event.loaded / event.total) * 100
        };
        this.setState({ uploadProgress: copy });
       }
      });
       
      req.upload.addEventListener("load", (event:SyntheticEvent<*>) => {
       const copy = { ...this.state.uploadProgress };
       copy[file.name] = { state: "done", percentage: 100 };
       this.setState({ uploadProgress: copy });
       resolve(req.response);
      });
       
      req.upload.addEventListener("error", (event:SyntheticEvent<*>) => {
       const copy = { ...this.state.uploadProgress };
       copy[file.name] = { state: "error", percentage: 0 };
       this.setState({ uploadProgress: copy });
       alert(JSON.stringify(req.response));
       reject(req.response);
      });
    
      const formData = new FormData();
      formData.append("file", file, file.name);
    
      req.open("POST", "http://localhost:8000/upload");
      req.setRequestHeader('Accept', 'application/json');
      req.send(formData);
     });
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    this.state.files.forEach(file => {
      promises.push(this.sendRequest(file));
    });
    try {
      await Promise.all(promises).then(() =>
        this.props.reloadList()
      );
      
      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  renderActions = () => {
    return (
      <>
        {
          this.state.successfullUploaded ? (
            <button
              onClick={() =>
                this.setState({ files: [], successfullUploaded: false })
              }
            >
              Clear
            </button>
          ) : (
            <button
              disabled={this.state.files.length < 1 || this.state.uploading}
              onClick={this.uploadFiles}
            >
              Upload
            </button>
          )
        }
      </>
    );
  }

  render() {
    return (
      <div className="Upload">
        <span className="Title">Click/Drop to Upload Files</span>
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.state.files.map(file => 
              <div key={file.name} className="Row">
                <span className="Filename">{file.name}</span>
                {this.renderProgress(file)}
              </div>
            )}
          </div>
        </div>
        <div className="Actions">{this.renderActions()}</div>
      </div>
    );
  };
}

export default Upload;