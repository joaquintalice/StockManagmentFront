'use client'
import Product from '@/stock/data/interfaces/Product'
import productNames from '@/stock/data/productNames/NameArray'
import ProductRepository from '@/stock/data/repository/Product.repository'
import { Alert, AlertIcon, Box, Button, Center, FormControl, FormLabel, Heading, NumberInput, NumberInputField, Select, Stat, StatHelpText, StatLabel, StatNumber, useDisclosure } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import { SalesSchema } from '../schema/sales.schema'


export default function SalesList() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [stockListData, setStockListData] = useState<Partial<Product[]>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: 0,
        },
        onSubmit: (values) => {
            console.log(values)
            async function submitHandler() {

            }

            submitHandler()
        },
        validate: (values) => {
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

        async function getData() {
            const stockData = await ProductRepository.getAll();
            setStockListData(stockData)
            console.log(stockData)
        }

        getData()
    }, [])



    return (
        <>
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder='Selecciona el producto'
                                bg='green.300'
                                fontSize='20px'>
                                {
                                    stockListData.map((item, index) => (
                                        <option key={index}>{item?.name}</option>
                                    ))
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

                        <Stat>
                            <StatLabel>TOTAL</StatLabel>
                            <StatNumber>$ 0.00</StatNumber>
                            <StatHelpText></StatHelpText>
                        </Stat>

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
        </>
    )
}
