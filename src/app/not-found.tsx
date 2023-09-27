import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
    return (
        <Flex mt='17%' alignItems='center' flexDirection='column'>
            <Heading>Error 404</Heading>
            <Text my='2rem'>No se pudo encontrar el recurso solicitado.</Text>
            <Link href="/">
                <Button colorScheme='red'>
                    Volver al inicio
                </Button>
            </Link>
        </Flex>
    )
}
