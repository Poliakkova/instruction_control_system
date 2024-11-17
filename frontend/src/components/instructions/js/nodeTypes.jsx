import React from 'react';
import { Handle, Position } from '@xyflow/react';

export const DiamondNode = ({ data, isSelected }) => (
    <div style={{
        display: 'inline-flex',
        backgroundColor: 'black',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        alignItems: 'center',
        justifyContent: 'center',
        border: isSelected ? '5px solid blue' : '1px solid black',
    }}>
        <div style={{
            maxWidth: '150px',
            padding: '25px',
            backgroundColor: '#fffdbd',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            display: 'flex',
            alignContent: 'center',
        }}>
            <Handle type="target" position={Position.Top} style={{ top: '4px', background: 'green' }} />
            <div style={{ fontSize: '12px', textAlign: 'center' }}>{data.label}</div>
            <Handle id="source-left" type="source" position={Position.Left} style={{ left: '5px', background: '#db4f4f' }} />
            <Handle id="source-right" type="source" position={Position.Right} style={{ right: '5px', background: '#db4f4f' }} />
        </div>
    </div>
);

export const PrepareNode = ({ data, isSelected }) => (
    <div style={{
        display: 'inline-flex',
        backgroundColor: 'black',
        clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
        alignItems: 'center',
        justifyContent: 'center',
        border: isSelected ? '5px solid blue' : '1px solid black',
    }}>
        <div style={{
            maxWidth: '150px',
            padding: '10px 25px',
            backgroundColor: '#ffe3c2',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
            display: 'flex',
            alignContent: 'center',
        }}>
            <Handle type="target" position={Position.Top} style={{ top: '4px', background: 'green' }} />
            <div style={{ fontSize: '12px', textAlign: 'center' }}>{data.label}</div>
            <Handle id="source-left" type="source" position={Position.Left} style={{ left: '5px', background: '#db4f4f' }} />
            <Handle id="source-right" type="source" position={Position.Right} style={{ right: '5px', background: '#db4f4f' }} />
        </div>
    </div>
);

export const DocumentNode = ({ data, isSelected }) => (
    <div style={{
        display: 'inline-flex',
        backgroundColor: '#e4c2ff',
        border: isSelected ? '5px solid blue' : '1px solid black',
        borderRadius: '0 0 50% 50%',
        padding: '10px 10px 20px 10px',
        maxWidth: '150px',
        height: 'auto',
    }}>
        <Handle type="target" position={Position.Top} style={{ background: 'green' }} />
        <div style={{ fontSize: '12px', textAlign: 'center' }}>{data.label}</div>
        <Handle id="source-left" type="source" position={Position.Left} style={{ background: '#db4f4f' }} />
        <Handle id="source-right" type="source" position={Position.Right} style={{ background: '#db4f4f' }} />
    </div>
);

export const ParallelogramNode = ({ data, isSelected }) => (
    <div style={{
        display: 'inline-flex',
        backgroundColor: '#c2c2ff',
        border: isSelected ? '5px solid blue' : '1px solid black',
        padding: '10px',
        maxWidth: '150px',
        transform: 'skew(-20deg)',
    }}>
        <Handle type="target" position={Position.Top} style={{ background: 'green' }} />
        <div style={{ fontSize: '12px', textAlign: 'center', transform: 'skew(20deg)' }}>{data.label}</div>
        <Handle id="source-left" type="source" position={Position.Left} style={{ background: '#db4f4f' }} />
        <Handle id="source-right" type="source" position={Position.Right} style={{ background: '#db4f4f' }} />
    </div>
);

export const StickyNoteNode = ({ data, isSelected }) => (
    <div style={{
      width: '150px',
      height: 'auto',
      backgroundColor: '#ffeb3b',  // Колір липкої нотатки
      border: isSelected ? '5px solid blue' : '1px solid black',
      padding: '15px',
      fontSize: '12px',
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '3px 3px 10px rgba(0,0,0,0.2)',  // Додаємо тінь для об'єму
    }}>
  
      <div style={{ position: 'relative', zIndex: 1 }}>
        {data.label} {/* Виведення тексту */}
      </div>
    </div>
);  

export const CustomNode = ({ data }) => {
    return (
        <div style={{ padding: 10, border: '1px solid black', borderRadius: 5, fontSize: 12, width: 150, background: '#d7fcfc' }}>
        {/* Контролери на всіх сторонах */}
        <Handle id="target-top" type="target" position={Position.Top} style={{ background: 'green' }} /> {/* Вхід зверху */}
        <Handle id="target-left" type="target" position={Position.Left} style={{ background: 'green' }} /> {/* Вхід зліва */}
        <div style={{textAlign: 'center'}}>{data.label}</div>
        <Handle id="source-right" type="source" position={Position.Right} style={{ background: '#db4f4f' }} /> {/* Вихід справа */}
        <Handle id="source-bottom" type="source" position={Position.Bottom} style={{ background: '#db4f4f' }} /> {/* Вихід знизу */}
        </div>
    )
};

export const CustomInputNode = ({ data }) => {
    return(
        <div style={{ padding: 10, border: '1px solid black', fontSize: 12, width: 150, backgroundColor: '#bdffcd', borderRadius: '30px' }}>
        <div style={{textAlign: 'center'}}>{data.label}</div>
        <Handle id="source-right" type="source" position={Position.Right}  /> {/* Вихід справа */}
        <Handle id="source-bottom" type="source" position={Position.Bottom}  /> {/* Вихід знизу */}
        </div>
    )
};

export const CustomOutputNode = ({ data }) => {
    return(
      <div style={{ padding: 10, border: '1px solid black', fontSize: 12, width: 150, backgroundColor: '#ffbdbd', borderRadius: '30px' }}>
        <Handle id="target-top" type="target" position={Position.Top} /> {/* Вхід зверху */}
        <Handle id="target-left" type="target" position={Position.Left}  /> {/* Вхід зліва */}
        <div style={{textAlign: 'center'}}>{data.label}</div>
      </div>
    )
};


export const nodeTypes = {
    diamond: DiamondNode, // Реєструєму новий тип
    custom: CustomNode,
    customInput: CustomInputNode,
    customOutput: CustomOutputNode,
    document: DocumentNode,
    prepare: PrepareNode,
    parallel: ParallelogramNode,
    sticky: StickyNoteNode
};

export default nodeTypes;
