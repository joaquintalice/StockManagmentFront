import React from 'react'
import AddForm from '@/add/features/AddForm'
import { Box, Center, Heading } from '@chakra-ui/react'

export default function AddPage() {
    return (
        <Box display='flex' justifyContent='center' >
            <Center as='section' maxW='70%' flexDirection='column'>
                <Heading as='h1' my='2rem'>
                    Registrar nuevo producto
                </Heading>

                <AddForm />
            </Center>
        </Box>
    )
}
