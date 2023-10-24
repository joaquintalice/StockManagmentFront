'use client'
import { Input } from '@chakra-ui/react'
import React, { useState } from 'react'

interface SharedStateProps {
    searchBarValue: string
    setSearchBarValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function StockSearchbar({ searchBarValue, setSearchBarValue }: SharedStateProps) {

    function handleSearchbarInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchBarValue(event.target.value);
    }

    return (
        <div>

            <Input
                width='auto'
                type="text"
                background='green.200'
                color='white'
                value={searchBarValue}
                placeholder="Busca por nombre"
                onChange={handleSearchbarInputChange}
            />

        </div>
    )
}


