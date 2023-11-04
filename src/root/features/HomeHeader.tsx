import { Center, Heading, Text } from '@chakra-ui/react'
import React from 'react'

export const HomeHeader = () => {
    return (
        <Center
            w={'full'}
            h={'25vh'}
            backgroundPosition='center'
            backgroundImage={'/assets/HomePageAssets/homePageBanner.jpg'}
        >
            <Heading
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                lineHeight={'110%'}
                display='flex'
                gap={4}
                my={5}
                color='white'
            >
                Control de
                <Text fontWeight='extrabold' as={'span'} color={'green.300'}>
                    STOCK
                </Text>
            </Heading>
        </Center>
    )
}
