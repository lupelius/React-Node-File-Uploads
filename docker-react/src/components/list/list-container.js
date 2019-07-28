import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import './list.css';
import Upload from '../upload';
import Search from '../search';

type Props = {
};

type State = {
  files: array<String>,
  searchString: String
};

class List extends Component<Props, State> {
  state: {
    files: array<String>,
    searchString: String
  }

  constructor(props: {}) {
    super(props);
    this.state = {
      files: [],
      searchString: ""
    };
  }

  componentDidMount() {
    this.loadFilesFromServer();
  }

  loadFilesFromServer = (searchString = null) => {
    const req = new XMLHttpRequest();
    // validate searchString
    const url = searchString ? `http://localhost:8000/resources/${searchString}` : "http://localhost:8000/resources";
    req.open("GET", url, true);
    req.onload = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          this.setState({ files: JSON.parse(req.responseText).body });
        } else {
          console.error(req.statusText);
        }
      }
    };
    req.onerror = function () {
      console.error(req.statusText);
    };
    req.setRequestHeader('Accept', 'application/json');
    req.send(null);
  }

  setFiles = files => {
    this.setState({files: files});
  }

  getFiles = () => {
    return this.state.files;
  }

  onSearchInputChange = (event: SyntheticEvent<*>) => {
    if (event.target.value) {
      this.setState({searchString: event.target.value});
      this.loadFilesFromServer(event.target.value);
    } else {
      this.setState({searchString: ""});
      this.loadFilesFromServer();
    }
  }

  deleteFile = (name: String) => {
    const req = new XMLHttpRequest();
    req.open("DELETE", `http://localhost:8000/delete?file=${name}`, true);
    req.onload = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          this.loadFilesFromServer();
        } else {
          console.error(req.message);
        }
      }
    };
    req.onerror = function () {
      console.error(req.statusText);
    };
    req.setRequestHeader('Accept', 'application/json');
    req.send(null);
  }

  render() {
    return (
      <div className="Search">
        <Grid container spacing={10} className="top">
          <Grid item xs={12} sm={6}>
            <Search onSearchInputChange={this.onSearchInputChange} />
            <Grid item xs={12}>
              <Grid item xs={12} sm={6}>
                <div>{`${this.state.files.length} documents`}</div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>{`Total: ${this.state.files.length > 0 ? this.state.files.reduce((previous, file) => {
                    return parseFloat(previous) + parseFloat(file.size);
                }, 0).toFixed(2) : "0"}kb`}</div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Upload reloadList={this.loadFilesFromServer} />
          </Grid>
        </Grid>
        <div className="List">
          <Grid container spacing={10} style={{padding: 24}}>
            {this.state.files.length ? this.state.files.map((file,index) => 
              <Grid key={index} item xs={12} sm={6} lg={4} xl={3} className="FileCard">
                
                    <span className="Filename Mainfiles">{file.name}</span>
           
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <span className="Size">{`${file.size} kb`}</span>
                  </Grid>
                  <Grid item xs={6}>
                    <button
                      className="Button"
                      onClick={() => this.deleteFile(file.name)}
                    >
                      Delete
                    </button>
                  </Grid>
                </Grid>
              </Grid>
            ) : `No Files...`}
          </Grid>
        </div>
      </div>
    );
  };
}

export default List;