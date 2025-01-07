
// Мапінг статусів
export const statusMapping = {
    CREATED: 'Внесено',
    REGISTERED: 'Зареєстровано',
    IN_PROGRESS: 'Виконується',
    CANCELLED: 'Скасовано',
    FINISHED: 'Виконано'
};

// Функція для визначення класу на основі статусу
export const getStatusClass = (status) => {
    switch (status) {
        case 'Внесено':
            return 'status orange';
        case 'Зареєстровано':
            return 'status yellow';
        case 'Виконується':
            return 'status green';
        case 'Виконано':
            return 'status grey';
        case 'Скасовано':
            return 'status red';
        default:
            return 'status grey';
    }
};

  //Функція для визначення класу на основі статусу
 export const getStatusClassFromDBValue = (status) => {
    switch (status) {
        case 'CREATED':
            return 'status orange';
        case 'REGISTERED':
            return 'status yellow';
        case 'IN_PROGRESS':
            return 'status green';
        case 'CANCELLED':
            return 'status red';
        case 'FINISHED':
            return 'status grey';
        default:
            return 'status grey';
    }
  };

export const statusMappingRoles = {
    ADMIN: 'Адмін',
    HEAD_ADMIN: 'Головний Адмін',
    TEACHER: 'Викладач',
    STUDENT: 'Студ.представник'
};