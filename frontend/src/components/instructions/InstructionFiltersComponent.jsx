// FiltersComponent.js
import React from 'react';
import { Dropdown } from 'react-bootstrap';

const InstructionFiltersComponent = ({
    handleFilterChange,
    handleCheckboxChange,
    availableTypes,
    availableStatuses,
    searchTerm,
    handleSearchChange,
}) => {
    return (
        <div className="filters">
            <Dropdown>
                <Dropdown.Toggle className="filters-button" id="dropdown-basic">
                    Фільтри
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: 340, boxShadow: '10px 5px 20px #e1eaf0' }}>
                    <div className="px-3">
                        <span className="d-block" style={{ color: '#3782e2' }}>Дата створення</span>
                        <label>
                            з: <input className="filter-input" type="date" name="makingTimeFrom" onChange={handleFilterChange} />
                        </label>
                        <label>
                            до: <input className="filter-input" type="date" name="makingTimeTo" onChange={handleFilterChange} />
                        </label>
                        <br />
                        <span className="d-block mt-2" style={{ color: '#3782e2' }}>Дата початку</span>
                        <label>
                            з: <input className="filter-input" type="date" name="startTimeFrom" onChange={handleFilterChange} />
                        </label>
                        <label>
                            до: <input className="filter-input" type="date" name="startTimeTo" onChange={handleFilterChange} />
                        </label>
                        <br />
                        <span className="d-block mt-2" style={{ color: '#3782e2' }}>Дедлайн</span>
                        <label>
                            з: <input className="filter-input" type="date" name="expTimeFrom" onChange={handleFilterChange} />
                        </label>
                        <label>
                            до: <input className="filter-input" type="date" name="expTimeTo" onChange={handleFilterChange} />
                        </label>
                        <br />
                        {/* Фільтри типів */}
                        <div className="mt-2">
                            <label style={{ color: '#3782e2' }}>Тип:</label>
                            {availableTypes.map((type) => (
                                <div key={type}>
                                    <input
                                        type="checkbox"
                                        name="type"
                                        value={type}
                                        onChange={(e) => handleCheckboxChange(e, type)}
                                    />
                                    <label htmlFor="type">{type}</label>
                                </div>
                            ))}
                        </div>

                        {/* Фільтри статусів */}
                        <div className="mt-2">
                            <label style={{ color: '#3782e2' }}>Статус:</label>
                            {availableStatuses.map((status) => (
                                <div key={status}>
                                    <input
                                        type="checkbox"
                                        name="status"
                                        value={status}
                                        onChange={(e) => handleCheckboxChange(e, status)}
                                    />
                                    <label htmlFor="status">{status}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>

            <input
                type="text"
                placeholder="Пошук за ключовими словами..."
                className="input-search"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default InstructionFiltersComponent;
