'use client';

import React from 'react';
import Button from './Button';
import '@/components/MainBar.css';
import { FaArrowRightLong } from 'react-icons/fa6';
import useItemSelectionStore from '@/stores/shapeSelectionStore';
import { useShallow } from 'zustand/shallow';
import { LuMousePointerClick } from 'react-icons/lu';

function MainBar() {
  const { selectedItem, selectItem } = useItemSelectionStore(
    useShallow((state) => ({
      selectedItem: state.selectedItem,
      selectItem: state.selectItem,
    }))
  );

  return (
    <div
      className={'mainbar flex flex-1'}
      style={{ fontSize: 'clamp(15px, 2vw, 20px)' }}
    >
      <Button
        onClick={() => selectItem('Pointer')}
        className={`${selectedItem === 'Pointer' ? 'active' : ''}`}
      >
        <LuMousePointerClick size={'16'} />
      </Button>
      <Button
        onClick={() => selectItem('Circle')}
        className={selectedItem === 'Circle' ? 'active' : ''}
      >
        <div
          className={`w-4 h-4 border-[hsl(0,0%,100%)] rounded-full border-[2px]`}
        ></div>
      </Button>
      <Button
        onClick={() => selectItem('Square')}
        className={selectedItem === 'Square' ? 'active' : ''}
      >
        <div
          className={`w-4 h-4 border-[hsl(0,0%,100%)] rounded-[2px] border-[2px]`}
        ></div>
      </Button>
      <Button
        onClick={() => selectItem('Arrow')}
        className={selectedItem === 'Arrow' ? 'active' : ''}
      >
        <FaArrowRightLong size={16} />
      </Button>
    </div>
  );
}

export default MainBar;
