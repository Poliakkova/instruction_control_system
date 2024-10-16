import axios from "axios";

const REST_API_GET_USERS_URL = "http://localhost:8090/users/all";

export const listUsers = async () => {
    return axios.get(REST_API_GET_USERS_URL);
}

export const addUser = async (user, navigator) => {
    console.log(JSON.stringify(user));

    const response = await fetch('http://localhost:8090/users/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
        });
      
    if (response.ok) {
        alert('Користувач успішно створений');
        navigator('/users');
    } else {
        alert('Помилка при створенні користувача. Перевірте дані');
    }
}

export const updateUser = async (user, navigator) => {
    console.log("updateUser - userJSON " + JSON.stringify(user));

    const response = await fetch('http://localhost:8090/users/update', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (response.ok) {
        alert('Користувач успішно оновлений');
        navigator('/users'); // Перенаправляємо користувача на сторінку зі списком користувачів
    } else {
        alert('Помилка при оновленні користувача. Перевірте дані');
    }
};

export const deleteUser = async (userLogin, navigator) => {
    console.log("userLogin - login " + userLogin);

    const response = await fetch(`http://localhost:8090/users/delete/{userLogin}?userLogin=${userLogin}`, {
        method: 'POST',
    });

    if (response.ok) {
        alert('Користувач успішно видалений');
        navigator('/users'); // Перенаправляємо користувача на сторінку зі списком користувачів
    } else {
        alert('Помилка при видаленні користувача');
    }
  };