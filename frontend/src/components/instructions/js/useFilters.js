import { useState, useEffect } from 'react';

const useFilters = (instructions, statusMapping) => {
    const availableTypes = ["Науково-методична робота", "Навчально-виховна робота", "Профорієнтаційна робота", "Навчально-організаційна робота"];
    const availableStatuses = ["Внесено", "Зареєстровано", "Виконується", "Виконано", "Скасовано"];

    const [filters, setFilters] = useState({
        startTimeFrom: '',
        startTimeTo: '',
        expTimeFrom: '',
        expTimeTo: '',
        type: [],
        status: [],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInstructions, setFilteredInstructions] = useState(instructions);

    // Основна функція для застосування фільтрів і пошуку
    const applyFiltersAndSearch = () => {
        let filtered = instructions;

        // Фільтрація за діапазоном дат
        if (filters.startTimeFrom) {
            filtered = filtered.filter(instruction => new Date(instruction.startTime) >= new Date(filters.startTimeFrom));
        }
        if (filters.startTimeTo) {
            filtered = filtered.filter(instruction => new Date(instruction.startTime) <= new Date(filters.startTimeTo));
        }
        if (filters.expTimeFrom) {
            filtered = filtered.filter(instruction => new Date(instruction.expTime) >= new Date(filters.expTimeFrom));
        }
        if (filters.expTimeTo) {
            filtered = filtered.filter(instruction => new Date(instruction.expTime) <= new Date(filters.expTimeTo));
        }

        // Фільтрація за типом
        if (filters.type.length > 0) {
            filtered = filtered.filter(instruction => filters.type.includes(instruction.type));
        }

        // Фільтрація за статусом
        if (filters.status.length > 0) {
            filtered = filtered.filter(instruction => filters.status.includes(statusMapping[instruction.status]));
        }

        // Застосування пошукового терміну
        const searchWords = searchTerm.toLowerCase().trim();
        if (searchWords) {
            filtered = filtered.filter((item) => {
                let includeUser = false;
                item.users.forEach((user) => {
                    if (user.userSurname.toLowerCase().includes(searchWords) ||
                        user.userName.toLowerCase().includes(searchWords) ||
                        user.userPatronymic.toLowerCase().includes(searchWords)) {
                        includeUser = true;
                    }
                });

                return (
                    item.sourceOfInstruction.toLowerCase().includes(searchWords) ||
                    item.protocol.toLowerCase().includes(searchWords) ||
                    item.type.toLowerCase().includes(searchWords) ||
                    item.title.toLowerCase().includes(searchWords) ||
                    item.shortDescription.toLowerCase().includes(searchWords) ||
                    item.code.toLowerCase().includes(searchWords) ||
                    includeUser ||
                    new Date(item.startTime).toLocaleDateString().toLowerCase().includes(searchWords) ||
                    new Date(item.expTime).toLocaleDateString().toLowerCase().includes(searchWords) ||
                    statusMapping[item.status].toLowerCase().includes(searchWords)
                );
            });
        }

        setFilteredInstructions(filtered);
    };

    // Автоматичне застосування фільтрів при зміні фільтрів, пошуку або інструкцій
    useEffect(() => {
        applyFiltersAndSearch();
    }, [filters, searchTerm, instructions]);

    // Обробник зміни пошукового терміну
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Обробник зміни фільтрів (дати)
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    // Обробник для чекбоксів (типи та статуси)
    const handleCheckboxChange = (event, type) => {
        const { name, checked } = event.target;
        setFilters((prevFilters) => {
            const updatedArray = checked
                ? [...prevFilters[name], type]
                : prevFilters[name].filter((item) => item !== type);

            return { ...prevFilters, [name]: updatedArray };
        });
    };

    return {
        filteredInstructions,
        filters,
        searchTerm,
        availableTypes,
        availableStatuses,
        handleFilterChange,
        handleCheckboxChange,
        handleSearchChange,
    };
};

export default useFilters;
