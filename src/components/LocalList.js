import React from 'react';
import Local from './Local';

const LocalList = ({ locals }) => {

    return(
        <ul>
            {locals.map((local, index) => {
                return(
                    <Local key={index} local={local}/>
                )
            } )}
        </ul>
    )
    
}

export default LocalList;
