import Product from '@/stock/data/interfaces/Product';
import { Box, Center, Flex, Heading, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { FormikValues } from 'formik';
import { scFont } from '@/shared/utils/fonts';


type TicketProps = {
    formikValues: FormikValues
    stockListData: Product[]
    total: number
}

const SalesCreateTicket = React.forwardRef(({ formikValues, stockListData, total }: TicketProps, ref) => {
    return (
        <Box ref={ref} p={2}>
            <Center>
                <Heading>NombreNegocio</Heading>
            </Center>
            <Box display='flex' flexDirection='column' my={3} gap={1} fontSize={19}>
                <small>Dirección:xxxxxxxxxxx/xxxxxxx</small>
                <small>Celular: 9999999999</small>
            </Box>
            <Box my={2} fontSize={19}>
                <small>Detalles de su compra:</small>
            </Box>
            <Box my={4}>
                {
                    formikValues.map((producto: FormikValues, index: number) => (
                        <Flex key={index} gap={2} wrap='nowrap' whiteSpace='nowrap'>

                            <small>
                                {
                                    stockListData
                                        .filter(prod => prod?.id === +producto?.name)
                                        .map(prod => (
                                            <Text key={prod?.id} fontSize={12}>

                                                x{formikValues[index].quantity} -

                                            </Text>
                                        ))
                                }
                            </small>

                            <small>
                                {
                                    stockListData
                                        .filter(prod => prod?.id === +producto?.name)
                                        .map(prod => (
                                            <Text key={prod?.id} fontSize={12}>
                                                {prod?.name}
                                            </Text>
                                        ))
                                }
                            </small>
                            <small>
                                {
                                    stockListData
                                        .filter(prod => prod?.id === +producto?.name)
                                        .map(prod => (
                                            <Text key={prod?.id} fontSize={12}>
                                                ${prod?.sellPrice} {prod?.unit === '(Unidad)' ? 'por unidad' : 'por kilo'}
                                            </Text>
                                        ))
                                }
                            </small>


                            <small>
                                {
                                    stockListData
                                        .filter(prod => prod?.id === +producto?.name)
                                        .map(prod => {
                                            const finalPrice = prod ? (prod?.sellPrice * formikValues[index].quantity).toFixed(2) : null

                                            return (
                                                <Text key={prod?.id} fontSize={11}>
                                                    = ${finalPrice}
                                                </Text>
                                            )
                                        })
                                }
                            </small>
                        </Flex>
                    ))
                }
            </Box>

            <Box textAlign='end' my={4} >
                <Text fontWeight='bold'>Total: ${total.toFixed(2)}</Text>
            </Box>



            <Box fontSize={19} whiteSpace='nowrap'>
                <Text>Muchas gracias por su compra</Text>
            </Box>
        </Box>
    )
})

export default SalesCreateTicket
