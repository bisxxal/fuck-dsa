 
import {  Trash, UserCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface Props {
  id: string;
  onDelete: (id: string) => void;
  onUpdate: (queueId:string , userId :string , barberId:string ) => void;
  isOpen: boolean;
  onOpen: (id: string) => void;
  border?: string;
  barberId: string;
  userId: string;
  children: React.ReactNode;
  setRef: (id: string, ref: HTMLDivElement | null) => void;
}

const SwipeRevealActions: React.FC<Props> = ({
  id,
  userId,
  onDelete,
  onUpdate,
  barberId,
  isOpen,
  onOpen,
  setRef,
  children,
  border
}) => {
  const maxSwipe = 70;
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      if (deltaX < 0) setTranslateX(Math.max(deltaX, -maxSwipe));
      else setTranslateX(Math.min(deltaX, maxSwipe));
    },
    onSwiped: ({ deltaX }) => {
      if (deltaX <= -50) {
        onOpen(id);
        setTranslateX(-maxSwipe);
      } else if (deltaX >= 50) {
        onOpen(id);
        setTranslateX(maxSwipe);
      } else {
        setTranslateX(0);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  useEffect(() => {
    if (!isOpen) setTranslateX(0);
  }, [isOpen]);

  useEffect(() => {
    setRef(id, containerRef.current);
    return () => setRef(id, null);
  }, [id, setRef]);

  const handleDelete = () => {
    onDelete(id);
    setTranslateX(0);
  };

  const handleUpdate = () => {
    onUpdate(id, userId,barberId);
    setTranslateX(0);
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden mb-3">
      <div className="absolute inset-0 flex items-center justify-between">
       
        <button
          onClick={handleUpdate}
          className={` bg-gradient-to-l  from-blue-600 to-blue-500 cursor-pointer text-white px-4 flex items-center w-[90px] h-full py-2 -pr-5 ${border} `}
        >
       <UserCheck />
        </button>

         <button
          onClick={handleDelete}
          className={` bg-gradient-to-r from-red-400 to-red-600 cursor-pointer text-white px-4 flex items-center justify-end  py-2 w-[90px] h-full ${border}  `}
        >
          <Trash  />
        </button>
      </div>
      <div
        {...handlers}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: 'transform 0.2s ease-out',
        }}
        className={`"relative z-1   overflow-hidden ${border} `}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeRevealActions;
