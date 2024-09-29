import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/AddUser.css'

const EditUserComponent = () => {

  function navigateCreateUser(){
    navigator('/users/new')
  }

    return (
      <div className='wrapper'>
        <div className="sidebar">
          <button onClick={() => navigateCreateUser()}>Додати користувача</button>
        </div>

      <div className="main-content">
        <h2 className='text-center mb-3 text-bold'>Редагуйте користувача</h2>

        <div className="content">
        <form>
          <div class="form-floating mb-3 mt-3">
            <select class="form-select" id="floatingSelect" aria-label="Choose role">
              <option selected>Оберіть роль користувача</option>
              <option value="Адмін">Адмін</option>
              <option value="Студ.представник">Студ.представник</option>
              <option value="Викладач">Викладач</option>
            </select>
            <label for="floatingSelect">Оберіть роль користувача</label>
          </div>

          <div class="form-floating">
            <input type="text" class="form-control" id="floatingInput1" placeholder="Прізвище"/>
            <label for="floatingInput1">Прізвище</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="floatingInput2" placeholder="Ім'я"/>
            <label for="floatingInput2">Ім'я</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="floatingInput3" placeholder="По-батькові"/>
            <label for="floatingInput3">По-батькові</label>
          </div>

          <div class="form-floating mt-3">
            <input type="email" class="form-control" id="floatingInput4" placeholder="Пошта"/>
            <label for="floatingInput4">Пошта</label>
          </div>

          <button className='add-user-button mt-3 mb-3' onClick={() => addUser()}>Редагувати користувача</button>
        </form>
      </div>
      </div>
      </div>
  )
}

export default EditUserComponent