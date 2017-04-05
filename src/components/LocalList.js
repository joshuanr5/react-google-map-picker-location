import React from 'react';
import Local from './Local';

const LocalList = ({ locals, onShowClick }) => {
    return(
        <ul>
            {locals.map((local, index) => {
                return(
                    <Local key={local.id} local={local} onShowClick={onShowClick.bind(null, local)}/>
                )
            } )}
        </ul>
    )
    
}

export default LocalList;
