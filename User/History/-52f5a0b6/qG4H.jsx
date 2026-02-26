import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [filters, setFilters] = useState({
        floor: [],
        unit: [],
        elec: [],
        water: []
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({ floor: [], unit: [], elec: [], water: [] });
    };

    return (
        <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    return useContext(FilterContext);
}
