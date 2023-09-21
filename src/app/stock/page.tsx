import StockList from '@/stock/features/StockList'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default async function StockPage() {

    return (
        <Box>
            <StockList />
        </Box>
    )
}
