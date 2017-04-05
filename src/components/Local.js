import React from 'react';

const Local = ({ local, onShowClick }) => {
  const { id, address, lat, lng } = local;
  return (
    <li>
      <strong>Local {id}: </strong>
      <ul>
        <li><strong>Address:</strong>{` ${address}`}</li>
        <li><strong>Lat:</strong>{` ${lat}`}</li>
        <li><strong>lng:</strong>{` ${lng}`}</li>
        <button onClick={onShowClick}>Show in map</button>
      </ul>
      <hr/>
    </li>
  )
}

export default Local;