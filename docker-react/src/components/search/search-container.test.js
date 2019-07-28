// search-container.test.js
import React from 'react';
import TextField from '@material-ui/core/TextField';
import renderer from 'react-test-renderer';

test('Component that fires onChange event, and matches snapshot', () => {
  const handleFilter = event => {};
  const component = renderer.create(
    <div className="Search">
      <TextField style={{padding: 24}}
        id="searchInput"
        placeholder="Search for Files"   
        margin="normal"
        onChange={handleFilter}
      />
    </div>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});