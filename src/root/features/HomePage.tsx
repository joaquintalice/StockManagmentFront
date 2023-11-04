import React from 'react'
import { HomeCard } from './HomeCard'
import { Box, Grid, GridItem, Img } from '@chakra-ui/react'

export const HomePage = () => {
    return (
        <Grid display='grid'
            gridTemplateColumns={{ base: 'repeat(1, 1fr)', xl: 'repeat(2, 1fr)' }}
            gap={5}
            px={{ base: '10px', xl: '20px' }}
            mb={10}
        >

            <GridItem gridRowStart='span 2' gridColumnStart='1' >
                <Box background={'blue'} h={'100%'} >
                    <Img src='/assets/HomePageAssets/homePageContentBanner.jpg' h={'100%'} w={'100%'} objectFit="cover" />
                </Box>
            </GridItem>

            <GridItem gridColumnStart={{ base: 1, lg: 2 }}>
                <HomeCard
                    image='/assets/HomePageAssets/stockImg.jpg'
                    heading='Stock'
                    description='Aquí podrás ver stock actual y manipular el mismo.'
                    buttonColorScheme='whatsapp'
                    buttonText='Ir hacia la página'
                    btnHref='/stock'
                />
            </GridItem>

            <GridItem gridColumnStart={{ base: 1, lg: 2 }} >
                <HomeCard
                    image='/assets/HomePageAssets/salesImg.jpg'
                    heading='Ventas'
                    description='Aquí podrás ver el registro de ventas y realizar nuevas.'
                    buttonColorScheme='whatsapp'
                    buttonText='Ir hacia la página'
                    btnHref='/sales'
                />
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 2 }}>
                <HomeCard
                    image='/assets/HomePageAssets/cashboxImg.jpg'
                    heading='Caja'
                    description='Aquí podrás ver el total actual de la caja, ver el registro de 
                    días anteriores y cerrar el día actual.'
                    buttonColorScheme='whatsapp'
                    buttonText='Ir hacia la página'
                    btnHref='/sales'
                />
            </GridItem>

        </Grid >

    )
}
