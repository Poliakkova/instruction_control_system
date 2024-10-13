import React, {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
import { ReactFlow, Background, Controls, MiniMap, 
         addEdge, applyNodeChanges, applyEdgeChanges,
         Handle, Position, ReactFlowProvider,  useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../css/Instruction.css'
import axios from 'axios';

const InstructionComponent = () => {

  const navigator = useNavigate();

  function createInstruction(){
    navigator('/instructions/new')
  }

  const DiamondNode = ({ data, isSelected }) => (
    <div style={{ /* Обводка */
      display: 'inline-flex',
      backgroundColor: 'black', 
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', /* Створюємо ромб */
      alignItems: 'center',
      justifyContent: 'center',
      border: isSelected ? '5px solid blue' : '1px solid black',
    }}>

      <div style={{ /* Внутрішній блок */
          maxWidth: '150px',
          padding: '25px',
          height: 'auto',
          display: 'flex',
          backgroundColor: '#fffdbd', 
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', /* Створюємо ромб */
          alignContent: 'center',
      }}>
        <Handle type="target" position={Position.Top} style={{ top: '4px', background: 'green'}}/>
        <div style={{ fontSize: '12px', textAlign: 'center'  }}>{data.label}</div>
        <Handle id="source-left"  type="source" position={Position.Left} style={{ left: '5px', background: '#db4f4f'}}/>
        <Handle id="source-right"  type="source" position={Position.Right} style={{ right: '5px', background: '#db4f4f'}}/>

      </div>
    </div>
  );

  const CustomNode = ({ data }) => {
    return (
      <div style={{ padding: 10, border: '1px solid black', borderRadius: 5, fontSize: 12, width: 150, background: '#d7fcfc' }}>
        {/* Контролери на всіх сторонах */}
        <Handle id="target-top" type="target" position={Position.Top} style={{ background: 'green' }} /> {/* Вхід зверху */}
        <Handle id="target-left" type="target" position={Position.Left} style={{ background: 'green' }} /> {/* Вхід зліва */}
        <div style={{textAlign: 'center'}}>{data.label}</div>
        <Handle id="source-right" type="source" position={Position.Right} style={{ background: '#db4f4f' }} /> {/* Вихід справа */}
        <Handle id="source-bottom" type="source" position={Position.Bottom} style={{ background: '#db4f4f' }} /> {/* Вихід знизу */}
      </div>
    );
  };

  const CustomInputNode = ({ data }) => {
    return (
      <div style={{ padding: 10, border: '1px solid black', fontSize: 12, width: 150, backgroundColor: '#bdffcd', borderRadius: '30px' }}>
        <div style={{textAlign: 'center'}}>{data.label}</div>
        <Handle id="source-right" type="source" position={Position.Right}  /> {/* Вихід справа */}
        <Handle id="source-bottom" type="source" position={Position.Bottom}  /> {/* Вихід знизу */}
      </div>
    );
  };

  const CustomOutputNode = ({ data }) => {
    return (
      <div style={{ padding: 10, border: '1px solid black', fontSize: 12, width: 150, backgroundColor: '#ffbdbd', borderRadius: '30px' }}>
        <Handle id="target-top" type="target" position={Position.Top} /> {/* Вхід зверху */}
        <Handle id="target-left" type="target" position={Position.Left}  /> {/* Вхід зліва */}
        <div style={{textAlign: 'center'}}>{data.label}</div>
      </div>
    );
  };

  const nodeTypes = {
    diamond: DiamondNode, // Реєструєму новий тип
    custom: CustomNode,
    customInput: CustomInputNode,
    customOutput: CustomOutputNode
  };

  const initialNodes = [ //початкові ноди
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Початок' }, type: 'customInput' },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'Кінець' }, type: 'customOutput' }
  ];
  
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'default', label: 'Виконати', animated: true,
    markerEnd: {
      type: 'arrowclosed', // Тип стрілки
    },
  }]; //початкова грань

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeId, setNodeId] = useState(3); // Лічильник для унікальних ID нових нодів

  const [selectedNode, setSelectedNode] = useState(null); // Для відстеження вибраного нода
  const [selectedEdge, setSelectedEdge] = useState(null); // Для відстеження вибраної грані

  const [nodeLabel, setNodeLabel] = useState(''); // Для збереження нового тексту ноди
  const [nodeColor, setNodeColor] = useState(''); // Для збереження нового кольору
  const [edgeLabel, setEdgeLabel] = useState(''); // Для збереження нового тексту грані

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  
  // Обробка створення нової грані
  const onConnect = (params) => {
    const newEdge = {
      ...params,
      id: `edge-${new Date().getTime()}`, // Унікальний ідентифікатор для нової грані
      label: "↓", // Початковий надпис для грані
      animated: true,
      markerEnd: {
        type: 'arrowclosed', // Тип стрілки
      },
    };
    
    setEdges((eds) => addEdge(newEdge, eds)); // Додаємо нову грань
  };

  // Функція для додавання нового ноду
  const addNode = (type) => {
    // var color = "transparent";
    // if (type == 'custom') {color = '#d7fcfc';}

    const newNode = {
      id: `${nodeId}`,
      position: { x: 200, y: 0  },
      data: { label: `Новий вузол ${nodeId}` },
      type: type,
      // style: {backgroundColor: color}
    };

    setNodes((nds) => [...nds, newNode]); // Додаємо новий нод
    setNodeId((id) => id + 1); // Збільшуємо лічильник ID
  };

  // Функція для скругленого нового початку
  const addStartNode = () => {
    const newNode = {
      id: `${nodeId}`,
      position: { x: 200, y: 0 },
      data: { label: `Початок` },
      type: 'customInput',
    };

    setNodes((nds) => [...nds, newNode]); // Додаємо новий нод
    setNodeId((id) => id + 1); // Збільшуємо лічильник ID
  };

    // Функція для скругленого нового кінця
    const addEndNode = () => {
      const newNode = {
        id: `${nodeId}`,
        position: { x: 200, y: 0 },
        data: { label: `Кінець` },
        type: 'customOutput',
      };
  
      setNodes((nds) => [...nds, newNode]); // Додаємо новий нод
      setNodeId((id) => id + 1); // Збільшуємо лічильник ID
    };

  // Функція для вибору нода при натисканні
  const onNodeClick = (event, node) => {
    setSelectedNode(node.id); // Вибираємо нод
    setNodeLabel(node.data.label); // Встановлюємо поточний текст у текстове поле
    setNodeColor(node.data.color);
  };

  // Функція для збереження нового тексту ноди
  const handleLabelChange = (event) => {
    setNodeLabel(event.target.value);
  };

  // Функція для збереження нового кольору
  const handleColorChange = (event) => {
    setNodeColor(event.target.value);
    console.log("handle change color " + event.target.value)
  };

  // Функція для підтвердження зміни тексту ноди
  const updateNodeLabel = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode ? { ...node, data: { ...node.data, label: nodeLabel } } : node
      )
    );
    setSelectedNode(null); // Знімаємо вибір після редагування
  };

  // Функція для підтвердження зміни кольору
  const updateNodeColor = () => {
    console.log("NODECOLOR " + nodeColor)
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode ? { ...node, style: { ...node.style, backgroundColor: nodeColor }, } : node
      )
    );
    setSelectedNode(null); // Знімаємо вибір після редагування
  };

  // Функція для збереження нового тексту грані
  const handleEdgeLabelChange = (event) => {
    setEdgeLabel(event.target.value);
  };

  // Обробка кліку по грані
  const onEdgeClick = (event, edge) => {
    console.log("ON CLICK " + edge.id)
    console.log("LABEL " + edge.label)

    setSelectedEdge(edge.id); 
    setEdgeLabel(edge.label); // Отримуємо існуючий текст надпису
  };

  // Функція для оновлення тексту надпису грані
  const updateEdgeLabel = () => {
    console.log("edge label " + edgeLabel);
    console.log("selectedEdge " + selectedEdge);

    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge
          ? { ...edge, label: edgeLabel } // Оновлюємо надпис для вибраної грані
          : edge
      )
    );
    setSelectedEdge(null); // Очищуємо вибрану грань
  };

  //Збереження стану
  const saveGraph = () => {
    const flowData = { nodes, edges };
    localStorage.setItem('flowData', JSON.stringify(flowData)); // Зберігаємо стан у локальне сховище
  };

  const handleSave = () => {
    const flowData = {
        nodes: nodes,
        edges: edges
    };

    console.log("MAP " + JSON.stringify(flowData));

    // axios.post(`/api/instructions/${instructionId}/save-flow`, flowData)
    //   .then(response => {
    //     console.log('Diagram saved successfully!');
    //   })
    //   .catch(error => {
    //     console.error('Error saving diagram:', error);
    //   });
  };


  return (
    <div className="wrapper">
      <div className="sidebar">
          <button onClick={() => createInstruction()}>Створити доручення</button>
          <a className="menu-item" href='/instructions'><i class="bi bi-card-list"></i>Усі</a>
          <a className="menu-item" href='/instructions'><i class="bi bi-archive"></i>Архів</a>
      </div>

      <div className="main-content">
        <div className="instruction">
          <div className="instruction-control">
            <a href='/instructions/edit'><i className="bi bi-pencil-square" style={{ fontSize: '18px'}}></i></a>
            <a href='#'><i className="bi bi-trash3" style={{ fontSize: '18px'}}></i></a>
            {/* <div className="status orange">Назначено</div> */}
            <select class="form-select status orange" id="floatingSelect" aria-label="Choose role">
              <option selected value="Назначено" className='status orange'>Назначено</option>
              <option value="В роботі" >В роботі</option>
              <option value="Очікує затвердження" >Очікує затвердження</option>
              <option value="Затверджено" >Затверджено</option>
            </select>
          </div>

          <div className="uni-name">
            <p>НАЦІОНАЛЬНИЙ ТЕХНІЧНИЙ УНІВЕРСИТЕТ УКРАЇНИ "КИЇВСЬКИЙ ПОЛІТЕХНІЧНИЙ ІНСТИТУТ ІМ.ІГОРЯ СІКОРСЬКОГО"</p>
            <p>Інститут атомної та теплової енергетики</p>
            <p>Кафедра інженерії програмного забезпечення в енергетиці</p>
          </div>

          <br></br>
          <div className="block">
            <p>Протокол №1234-5678 засідання кафедри від 13.09.2024</p>
          </div>

          <br></br>
          <h2>ДОРУЧЕННЯ</h2>

          <br></br>
          <h4>Назва доручення</h4>
          <p><span className='bold'>Джерело: </span><span>МОН</span></p>
          <p><span className='bold'>Тип: </span><span>Науково-методична робота</span></p>

          <br></br>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quia facilis ut ab nobis ipsam, nisi, dolor quibusdam minus consequuntur et assumenda placeat tenetur enim sit soluta quaerat adipisci laboriosam!</p>

          <br></br>
          <p><span className='bold'>Відповідальний:</span><span> КОВАЛЬ О.В.</span></p>
          <br></br>
          <p><span className='bold'>До виконання:</span></p>
          <p><span>Шевченко Т.Г.</span><br></br>
          <span>Рябченко Н.В.</span></p>

          <br></br>
          <p><span className='bold'>Розпочати від: </span><span>16.09.2024</span></p>
          <p><span className='bold'>Виконати до: </span><span>30.09.2024</span></p>
        </div>

        <div className="process-map">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Додайте карту процесів</Accordion.Header>
            <Accordion.Body>
            <button onClick={addStartNode}>Початок<i class="bi bi-square"></i></button> {/* Кнопка для додавання ноду */}
            <button onClick={addEndNode}>Кінець<i class="bi bi-square"></i></button> {/* Кнопка для додавання ноду */}

            <button onClick={()=>addNode('custom')}><i class="bi bi-square"></i></button> {/* Кнопка для додавання ноду */}
            <button onClick={()=>addNode('diamond')}><i class="bi bi-diamond"></i></button> {/* Кнопка для додавання ромба */}

            {/* Інпут для вибору кольору */}
            <div>
              <label htmlFor="colorPicker">Choose node color:</label>
              <input
                id="colorPicker"
                type="color"
                value={nodeColor}
                onChange={handleColorChange}
              />
              <button onClick={updateNodeColor}>Оновити</button>
            </div>

            <div>
              <input
                type="text"
                value={nodeLabel}
                onChange={handleLabelChange}
                placeholder="Введіть нову назву вузла..."
              />
              <button onClick={updateNodeLabel}>Оновити</button>
            </div>

            <div>
              <input
                type="text"
                value={edgeLabel}
                onChange={handleEdgeLabelChange}
                placeholder="Введіть новий надпис грані"
              />
              <button onClick={updateEdgeLabel}>Оновити грань</button>
            </div>

            <div className='map'>
              <ReactFlow nodes={nodes}
                          edges={edges}
                          onNodesChange={onNodesChange}
                          onEdgesChange={onEdgesChange}
                          onNodeClick={onNodeClick} // Додаємо обробник кліків по нодам
                          onEdgeClick={onEdgeClick} // Додаємо обробник кліків по гранях
                          nodeTypes={nodeTypes} 
                          onConnect={onConnect} // Додаємо нові грані
                          fitView
                          snapToGrid={true} snapGrid={[15, 15]}
                          >
                <MiniMap />
                <Background />
                <Controls />
              </ReactFlow>
              <button onClick={handleSave}>Зберегти карту</button>
            </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </div>

        <div className="comments">
          <form className="comment-section">
            <div className="image"><img src="../user_icon.png"></img></div>
            <div className="input-comment-block">
              <span className='name'>Коваль Олександр Васильович</span>
              <textarea type='text' placeholder='Напишіть коментар...'></textarea>
            </div>
            <button className='send-button' type='submit'><i class="bi bi-send"></i></button>
          </form>

          <div className="comment-section">
            <div className="image"><img src="../user_icon.png"></img></div>
            <div className="input-comment-block">
              <div className="name-date-section">
                <span className='name'>Тарасенко Тарас Тарасович</span>
                <span className='datetime'>29.09.2024 12:35</span>
              </div>
              <div className="comment">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo soluta debitis reiciendis ea quo autem placeat dignissimos nobis neque rerum tenetur architecto similique nesciunt esse laborum, ut voluptatum eius iste.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructionComponent