import React from 'react';

const Rank = ({ name, entries }) => {
    console.log('/'+name+entries)
  return (
    <div>
      <div className='white f3'>
        {`${name}, 당신의 이미지 인식 횟수는...!`}
      </div>
      <div className='white f1'>
        {entries}
      </div>
    </div>
  );
}

export default Rank;