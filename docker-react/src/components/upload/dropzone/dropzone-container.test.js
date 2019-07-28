// search-container.test.js
import React from 'react';
import renderer from 'react-test-renderer';

test('Dropzone matches snapshot', () => {
  const openFileDialog = event => {};
  const onDragOver = event => {};
  const onDragLeave = event => {};
  const onDrop = event => {};
  const disable = event => {};
  const onFilesAdded = event => {};
  const component = renderer.create(
    <div 
      className="Dropzone"
      onClick={openFileDialog}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ cursor: disable ? "default" : "pointer" }}
    >
      <img
        alt="upload"
        className="Icon"
        src="upload.svg"
      />
      <input
        className="FileInput"
        type="file"
        multiple
        onChange={onFilesAdded}
      />
      <span>Drop</span>
    </div>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});