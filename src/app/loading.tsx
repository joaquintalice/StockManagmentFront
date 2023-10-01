import { Center, Spinner } from '@chakra-ui/react'
import React from 'react'

export default function Loading() {
    return (
        <>
            <Center mt='5rem'><Spinner color='red.500' size='lg' /></Center>
        </>
    )
}
