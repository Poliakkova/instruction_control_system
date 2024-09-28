import React from 'react'
import {useNavigate} from 'react-router-dom'
import '../css/Instruction.css'

const InstructionComponent = () => {

  const navigator = useNavigate();

  function createInstruction(){
    navigator('/instructions/new')
  }

  return (
    <div className="wrapper">
      <div className="sidebar">
          <button onClick={() => createInstruction()}>Створити доручення</button>
          <a className="menu-item" href='/instructions'>Усі</a>
          <div className="menu-item">Архів</div>
      </div>

      <div className="main-content">
        <div className="instruction">
          <div className="status orange">Назначено</div>

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
          <h5>Назва доручення</h5>
          <p><span className='bold'>Джерело: </span><span>МОН</span></p>

          <br></br>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quia facilis ut ab nobis ipsam, nisi, dolor quibusdam minus consequuntur et assumenda placeat tenetur enim sit soluta quaerat adipisci laboriosam!</p>

          <br></br>
          <p><span className='bold'>Відповідальний:</span><span> КОВАЛЬ В.В.</span></p>
          <br></br>
          <p><span className='bold'>До виконання:</span></p>
          <p><span>Шевченко Т.Г.</span><br></br>
          <span>Рябченко Н.В.</span></p>

          <br></br>
          <p><span className='bold'>Розпочати від: </span><span>16.09.2024</span></p>
          <p><span className='bold'>Виконати до: </span><span>30.09.2024</span></p>
        </div>
      </div>
    </div>
  )
}

export default InstructionComponent