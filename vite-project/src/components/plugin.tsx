import React, { useEffect, useMemo } from 'react';
import { createStore, createEffect } from 'effector';
import { useStore } from 'effector-react';

interface Item {
  position: string;
  className: string;
}

const activePositions = createStore<string[]>([]);

const fetchPositionsFx = createEffect<void, string[]>(async () => {
  const response = await fetch('https://myfailemtions.npkn.net/b944ff/');
  const returnedData = await response.json();
  activePositions.setState(returnedData);
  return returnedData;
});

const sendActivePositionsFx = createEffect<string[], void>(async (positions) => {
  await fetch('https://myfailemtions.npkn.net/b944ff/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(positions),
  });
});

const CarComponent: React.FC = () => {
  
  const activePositionsData = useStore(activePositions);

  useEffect(() => {
    fetchPositionsFx();
  }, []);

  const onPositionChange = (position: string[]) =>   activePositions.setState(position);

  const onComplete = (position: string) => {
    // Toggle position's active status
    const newActivePositions = activePositionsData.includes(position)
      ? activePositionsData.filter((pos) => pos !== position)
      : [...activePositionsData, position];

    // Update active positions in the store and send to API
    onPositionChange(newActivePositions);
    sendActivePositionsFx(newActivePositions);
  };

  const items: Item[] = useMemo(() => [
    {
        position: 'A1',
        className: 'part front-light-right '
    },
    {
        position: 'A2',
        className: 'part front-right-door'
    },
    {
        position: 'A3',
        className: 'part back-right-door'
    },
    {
        position: 'A4',
        className: 'part back-light-right'
    },
    {
        position: 'B1',
        className: 'part front'
    },
    {
        position: 'B2',
        className: 'part hood'
    },
    {
        position: 'B3',
        className: 'part roof'
    },
    {
        position: 'B4',
        className: 'part tailgate'
    },
    {
        position: 'B5',
        className: 'part back'
    },
    {
        position: 'C1',
        className: 'part front-light-left'
    },
    {
        position: 'C2',
        className: 'part front-left-door'
    },
    {
        position: 'C3',
        className: 'part back-left-door'
    },
    {
        position: 'C4',
        className: 'part back-light-left'
    }
  ], []);

  return (
    <div>
      <div className="car-container">
        {items.map(({position, className}) => (
          <div
            key={position}
            className={`${className} Dot ${activePositionsData?.includes(position) ? 'Active' : ''}`}
            onClick={() => onComplete(position)}
          >
            <div className='position-items'>
              {position}
            </div>
          </div>
        ))}
      </div>
      <button className="apply-btn" >
        Complete
      </button>
    </div>
  );
};

export default CarComponent;
