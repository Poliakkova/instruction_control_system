import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const CreateInstructionComponent = () => {

  const [title, setTitle] = useState('')
  const [headSurname, setHeadSurname] = useState('')
  const [headName, setHeadName] = useState('')
  const [headPatronymic, setHeadPatronymic] = useState('')
  const [headControlSurname, setHeadControlSurname] = useState('')
  const [headControlName, setHeadControlName] = useState('')
  const [headControlPatronymic, setHeadControlPatronymic] = useState('')
  const [status, setStatus] = useState('')
  const [sourceOfInstruction, setSourceOfInstruction] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [text, setText] = useState('')
  const [startTime, setStartTime] = useState('')
  const [expTime, setExpTime] = useState('')

  function newInstruction(e) {
    e.preventDefault();

    const instruction = {title, headSurname, headName, headPatronymic, headControlSurname, headControlName, headControlPatronymic,
                          status, sourceOfInstruction, shortDescription, fullDescription, text, startTime, expTime}
    console.log(instruction)
  }

  return (
    <div className='wrapper'>
        <div className="sidebar">
            <button onClick={() => createInstruction()}>Створити доручення</button>
            <a className="menu-item" href='/instructions'><i class="bi bi-card-list"></i>Усі</a>
            <a className="menu-item" href='/instructions'><i class="bi bi-archive"></i>Архів</a>
        </div>
 
        <div className="main-content">
            <h2 className='text-center mb-3'>Створіть доручення</h2>
            <div className="content">
            <form>
                <div class="form-floating">
                    <input type="text" class="form-control" id="floatingInput1" placeholder="Протокол засідання кафедри №"/>
                    <label for="floatingInput1">Протокол засідання кафедри №</label>
                </div>

                <div class="form-floating">
                    <input type="date" class="form-control" id="floatingInput2" placeholder="Дата видачі доручення"/>
                    <label for="floatingInput2">Дата видачі доручення</label>
                </div>

                <div class="form-floating">
                    <input type="text" class="form-control" id="floatingInput3" placeholder="Назва доручення"/>
                    <label for="floatingInput3">Назва доручення</label>
                </div>

                <div class="form-floating">
                    <input type="text" class="form-control" id="floatingInput4" placeholder="Звідки отримали доручення"/>
                    <label for="floatingInput4">Звідки отримали доручення</label>
                </div>

                <div class="form-floating">
                    <textarea type="text" class="form-control" id="floatingInput5" placeholder="Текст доручення"/>
                    <label for="floatingInput5">Текст доручення</label>
                </div>

                <div class="form-floating">
                    <select class="form-select" id="floatingSelect" aria-label="Choose head">
                    <option selected>Оберіть відповідального</option>
                    <option value="Іванов">Іванов</option>
                    <option value="Петренко">Петренко</option>
                    <option value="Семенков">Семенков</option>
                    </select>
                    <label for="floatingSelect">Оберіть відповідального</label>
                </div>

                <div class="form-floating">
                    <select class="form-select" id="floatingSelect" aria-label="Choose head">
                    <option selected>Оберіть виконавців</option>
                    <option value="Іванов">Іванов</option>
                    <option value="Петренко">Петренко</option>
                    <option value="Семенков">Семенков</option>
                    </select>
                    <label for="floatingSelect">Оберіть виконавців</label>
                </div>

                <div class="form-floating">
                    <input type="date" class="form-control" id="floatingInput6" placeholder="Дата початку виконання"/>
                    <label for="floatingInput6">Дата початку виконання</label>
                </div>

                <div class="form-floating">
                    <input type="date" class="form-control" id="floatingInput7" placeholder="Дата дедлайну"/>
                    <label for="floatingInput7">Дата дедлайну</label>
                </div>

                <button className='add-user-button mt-3 mb-3' onClick={() => addUser()}>Зберегти доручення</button>
                </form>


{/* 
                <form>
                <div className="form-group mb-2">
                    <label className='form-label'>Назва</label>
                    <input type='text' placeholder='Введіть значення...' name='title' value={title} 
                    className='form-control' onChange={(e) => setTitle(e.target.value)}></input>

                    <div className="head-group row">
                    <div className="col">
                        <label className='form-label'>Прізвище голови</label>
                        <input type='text' placeholder='Введіть значення...' name='headSurname' value={headSurname} 
                        className='form-control' onChange={(e) => setHeadSurname(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>Імя голови</label>
                        <input type='text' placeholder='Введіть значення...' name='headName' value={headName} 
                        className='form-control' onChange={(e) => setHeadName(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>По-батькові голови</label>
                        <input type='text' placeholder='Введіть значення...' name='headPatronymic' value={headPatronymic} 
                        className='form-control' onChange={(e) => setHeadPatronymic(e.target.value)}></input>
                    </div>
                    </div>

                    <div className="head-control-group row">
                    <div className="col">
                        <label className='form-label'>Прізвище голови відділу</label>
                        <input type='text' placeholder='Введіть значення...' name='headControlSurname' value={headControlSurname} 
                        className='form-control' onChange={(e) => setHeadControlSurname(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>Імя голови відділу</label>
                        <input type='text' placeholder='Введіть значення...' name='headControlName' value={headControlName} 
                        className='form-control' onChange={(e) => setHeadControlName(e.target.value)}></input>
                    </div>

                    <div className="col">
                    <label className='form-label'>По-батькові голови відділу</label>
                    <input type='text' placeholder='Введіть значення...' name='headControlPatronymic' value={headControlPatronymic} 
                        className='form-control' onChange={(e) => setHeadControlPatronymic(e.target.value)}></input>
                    </div>
                    </div>

                    <label className='form-label'>Організація</label>
                    <input type='text' placeholder='Введіть значення...' name='sourceOfInstruction' value={sourceOfInstruction} 
                    className='form-control' onChange={(e) => setSourceOfInstruction(e.target.value)}></input>

                    <label className='form-label'>Короткий опис</label>
                    <input type='text' placeholder='Введіть значення...' name='shortDescription' value={shortDescription} 
                    className='form-control' onChange={(e) => setShortDescription(e.target.value)}></input>

                    <label className='form-label'>Повний опис</label>
                    <input type='text' placeholder='Введіть значення...' name='fullDescription' value={fullDescription} 
                    className='form-control' onChange={(e) => setFullDescription(e.target.value)}></input>

                    <label className='form-label'>Текст</label>
                    <textarea type='text' placeholder='Введіть значення...' name='text' value={text} 
                    className='form-control' onChange={(e) => setText(e.target.value)}></textarea>

                    <div className="row">
                    <div className="col">
                        <label className='form-label'>Дата створення</label>
                        <input type='date' placeholder='Введіть значення...' name='startTime' value={startTime} 
                        className='form-control' onChange={(e) => setStartTime(e.target.value)}></input>
                    </div>

                    <div className="col">
                        <label className='form-label'>Дедлайн</label>
                        <input type='date' placeholder='Введіть значення...' name='expTime' value={expTime} 
                        className='form-control date' onChange={(e) => setExpTime(e.target.value)}></input>
                    </div>
                    </div>
                </div>

                <button className='btn btn-success' onClick={newInstruction}>Зберегти</button>
                </form> */}
            </div>
        </div>
    </div>
  )
}

export default CreateInstructionComponent