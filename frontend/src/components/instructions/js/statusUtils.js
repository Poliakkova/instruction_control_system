
// Мапінг статусів
export const statusMapping = {
    CREATED: 'Назначено',
    CONFIRMATION: 'Очікує затвердження',
    IN_PROGRESS: 'В роботі',
    CANCELLED: 'Скасовано',
    FINISHED: 'Виконано',
};

// Функція для визначення класу на основі статусу
export const getStatusClass = (status) => {
    switch (status) {
        case 'Назначено':
            return 'status orange';
        case 'В роботі':
            return 'status yellow';
        case 'Очікує затвердження':
            return 'status green';
        case 'Виконано':
            return 'status grey';
        default:
            return 'status grey';
    }
};

export const statusMappingRoles = {
    ADMIN: 'Адмін',
    TEACHER: 'Викладач',
    STUDENT: 'Студ.представник'
};