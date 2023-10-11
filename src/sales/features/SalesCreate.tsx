'use client'
import Product from '@/stock/data/interfaces/Product'
import ProductRepository from '@/stock/data/repository/Product.repository'
import { Alert, AlertIcon, Badge, Box, Button, Center, Flex, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Stat, StatHelpText, StatLabel, StatNumber, Table, TableContainer, Tbody, Text, Thead, useDisclosure } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import { SalesSchema } from '../schema/sales.schema'
import { RobotoFont, scFont } from '@/shared/utils/fonts'



export default function SalesCreate() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState<boolean>(true)

    const [stockListData, setStockListData] = useState<Partial<Product[]>>([]);
    const [currentProdID, setCurrentProdID] = useState<number>(); // En el onchange toma el id del producto seleccionado
    const [currentProdData, setCurrentProdData] = useState<Product>({}); // Guarda la data del producto en cuestión fetcheada gracias al ID obtenido previamente
    const [total, setTotal] = useState<number>();

    const [confirmSaleModal, setConfirmSaleModal] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: 0,
        },
        onSubmit: (values) => {
            setConfirmSaleModal(false)
            const data = {
                name: currentProdData.name,
                quantity: values.quantity
            }

            const total = currentProdData.sellPrice * values.quantity
            console.log(total)
            setTotal(total)
            console.log(data)
            setConfirmSaleModal(true)

        },
        validate: (values) => {
            setConfirmSaleModal(false)
            const result = SalesSchema.safeParse(values);
            if (result.success) return;
            const errors = {}
            result.error.issues.forEach((error) => {
                errors[error.path[0]] = error.message;
            });
            return errors;
        },
    })

    useEffect(() => {
        async function getStockListData() {
            try {
                const stockData = await ProductRepository.getAll();
                setLoading(false)
                setStockListData(stockData)
                console.log(stockData)
            } catch (error) {
                console.log(error)
            }
        }

        getStockListData()
    }, [])

    useEffect(() => {
        console.log(currentProdID)
        setCurrentProdID(0)
        async function getCurrentProd() {
            try {
                if (currentProdID) {
                    const currentProd = await ProductRepository.getById(+currentProdID);
                    setCurrentProdData(currentProd)
                    console.log('ja')
                    return currentProd
                }
            } catch (error) {
                console.log(error)
            }
        }
        getCurrentProd()
    }, [currentProdID])


    return (
        <>
            {
                loading ? (<>Cargando...</>) :
                    (
                        <Box as='section' w='100%'>
                            <Center>
                                <Heading as='h1' my='2rem'>
                                    Generar venta
                                </Heading>
                            </Center>

                            <Box display='flex' justifyContent='center'>
                                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '55%' }}>

                                    <FormControl my='0.5rem'>
                                        <FormLabel fontSize='18px'>Producto</FormLabel>
                                        <Select
                                            name='name'
                                            value={formik.values.name}
                                            onChange={(e) => {
                                                formik.handleChange(e)
                                                setCurrentProdID(+(e.target.value))
                                            }}
                                            onBlur={formik.handleBlur}
                                            placeholder='Selecciona el producto'
                                            bg='green.300'
                                            fontSize='20px'>
                                            {
                                                stockListData.map((item) => {

                                                    return (
                                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                    )
                                                }
                                                )
                                            }
                                        </Select>

                                        {
                                            (formik.errors.name != undefined) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.name}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>



                                    <FormControl my='1rem'>
                                        <FormLabel fontSize='18px'>Kilos</FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                name="quantity"
                                                value={formik.values.quantity}
                                                onChange={formik.handleChange}
                                                bg='gray.700' fontSize='20px' color='white'
                                            />
                                        </NumberInput>

                                        {
                                            (formik.errors.quantity != undefined) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.quantity}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>

                                    {
                                        currentProdData.id ? (
                                            <>
                                                <Flex gap={132}>
                                                    <Stat>
                                                        <StatLabel>P.compra</StatLabel>
                                                        <StatNumber>${currentProdData.buyPrice}</StatNumber>
                                                    </Stat>


                                                    <Stat>
                                                        <StatLabel>P.venta</StatLabel>
                                                        <StatNumber>${currentProdData.sellPrice}</StatNumber>
                                                    </Stat>
                                                </Flex>

                                            </>
                                        ) : (<></>)
                                    }


                                    <Button
                                        my={4}
                                        color='white'
                                        _hover={{
                                            bg: 'green.500',
                                            color: 'white'
                                        }}
                                        bg='green.300'
                                        type='submit'
                                        fontSize='16px'
                                        leftIcon={<MdOutlinePostAdd />}
                                        onClick={onOpen}
                                    >
                                        Confirmar
                                    </Button>

                                </form>
                            </Box>
                        </Box>
                    )
            }

            {
                confirmSaleModal ? (<>
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                        size='xl'
                        motionPreset='slideInBottom'>
                        <ModalOverlay />
                        <ModalContent >
                            <ModalHeader className={RobotoFont.className} textAlign='center'>
                                Confirma la venta de
                                <Badge fontSize='1em' colorScheme='green'>
                                    {currentProdData.name}
                                </Badge>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>

                                <TableContainer className={scFont.className} mt='1.2rem'>
                                    <Table>
                                        <Thead>
                                            <tr>
                                                <th>
                                                    <Text>
                                                        Cantidad
                                                    </Text>
                                                </th>
                                                <th>
                                                    <Text>
                                                        Precio de venta
                                                    </Text>
                                                </th>
                                                <th>
                                                    <Text>
                                                        Total
                                                    </Text>
                                                </th>
                                            </tr>
                                        </Thead>
                                        <Tbody>
                                            <tr>
                                                <td>
                                                    <Text textAlign='center'>{formik.values.quantity} Kilos</Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>${currentProdData.sellPrice}</Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>${total.toFixed(2)}</Text>
                                                </td>
                                            </tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='red' mr={3} onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button colorScheme='green'>
                                    Confirmar
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal >
                </>) : (<></>)
            }
        </>
    )
}
