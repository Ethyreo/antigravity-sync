import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [filters, setFilters] = useState({
        floor: 'all',
        unit: 'all',
        elec: 'all',
        water: 'all'
    });

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({ floor: 'all', unit: 'all', elec: 'all', water: 'all' });
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
