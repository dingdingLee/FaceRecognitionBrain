import React from 'react';

const Rank = ({name, entries}) => {
    return (
        <div>
            <div className='white f3'>
                {'${name}, 당신의 현재 랭크는...'}
            </div>
            <div className='white f1'>
                {entries}
            </div>
        </div>
        

      

    );
}

export default Rank;