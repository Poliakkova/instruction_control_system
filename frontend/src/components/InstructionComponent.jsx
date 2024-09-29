import React from 'react'
import {useNavigate} from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

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
          <h5>Назва доручення</h5>
          <p><span className='bold'>Джерело: </span><span>МОН</span></p>

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