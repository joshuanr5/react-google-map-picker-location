import React from 'react';

const Local = ({ local }) => {
  const { id, address, lat, lng, key } = local;
  return (
    <li>
      <strong>Local {id}: </strong>
      <ul>
        <li><strong>Address:</strong>{` ${address}`}</li>
        <li><strong>lng:</strong>{` ${lng}`}</li>
        <li><strong>Lat:</strong>{` ${lat}`}</li>
        <button>Show in map</button>
      </ul>
      <hr/>
    </li>
  )
}

export default Local;