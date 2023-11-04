'use client'
import { Box, Input } from '@chakra-ui/react'
import React from 'react'

interface SharedStateProps {
    searchBarValue: string
    setSearchBarValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function StockSearchbar({ searchBarValue, setSearchBarValue }: SharedStateProps) {

    function handleSearchbarInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchBarValue(event.target.value);
    }

    return (
        <Box mx={15}>

            <Input
                width='auto'
                type="text"
                background='green.200'
                color='white'
                value={searchBarValue}
                placeholder="Busca por nombre"
                onChange={handleSearchbarInputChange}
            />

        </Box>
    )
}


