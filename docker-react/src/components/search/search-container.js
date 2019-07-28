// @flow

import React from 'react';
import TextField from '@material-ui/core/TextField';
import './search.css';

const Search = React.memo(function MyComponent(props) {
  // Debounce keystrokes to make sure we're not killing the server
  const debounced = (fn,delay) => {
    let timerId;
    // eslint-disable-next-line func-names
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
  }

  // debounced callback to protect the server
  const delayedCallback = debounced(function (event) {
    props.onSearchInputChange(event)
  },300);

  const handleFilter = event => {
    // const filter = target.value;
    event.persist();
    delayedCallback(event);
  }

  /* only rerenders if props change */
  return (
    <div className="Search">
      <TextField style={{padding: 24}}
        id="searchInput"
        placeholder="Search for Files"   
        margin="normal"
        onChange={handleFilter}
      />
    </div>
  );
});

export default Search;