'use client'
import { productSchema } from '@/stock/schema/product.schema';
import { Alert, AlertIcon, Badge, Box, Button, Center, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Table, TableContainer, Tbody, Text, Thead, useDisclosure, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md';
import ProductRepository from '../../data/repository/Product.repository';
import Product from '../../data/interfaces/Product';
import Link from 'next/link';
import NotFound from '@/app/not-found';
import { RobotoFont, scFont } from '@/shared/utils/fonts';
import Loading from '@/app/loading';
import StockUpdateConfirmModal from './StockUpdateConfirmModal';

type StockUpdateProp = {
    id: number;
}


export default function StockUpdate({ id }: StockUpdateProp) {

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [prodData, setProdData] = useState<Product>({
        buyPrice: 0,
        date: new Date(),
        unit: '',
        id: id,
        name: '',
        quantity: 0,
        sellPrice: 0,
        warehouseId: 1,
        updatedAt: new Date()
    });
    const [newData, setNewData] = useState<Partial<Product>>()
    const [updatedData, setUpdatedData] = useState<Partial<Product>>();
    const [loader, setLoader] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);



    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: prodData.name,
            unit: prodData.unit,
            quantity: 0,
            buyPrice: 0,
            sellPrice: 0
        },
        onSubmit: (values) => {
            setConfirmModal(false)
            setUpdatedData({})
            setNewData(values)
            async function submitHandler() {
                const prod = prodData

                const data = {
                    name: values.name,
                    unit: values.unit,
                    quantity: (prod.quantity * 1) + (values.quantity * 1), // Se convierte de string a numero con el *1
                    buyPrice: values.buyPrice * 1,
                    sellPrice: values.sellPrice * 1,
                }
                setUpdatedData(data)
                setConfirmModal(true)

            }

            submitHandler()
        },
        validate: (values) => {
            const result = productSchema.safeParse(values);
            if (result.success) return;
            const errors = {}
            result.error.issues.forEach((error) => {
                errors[error.path[0]] = error.message;
            });
            return errors;
        }
    })

    useEffect(() => {
        setError(false);
        setLoader(false);
        async function getData() {
            try {
                setLoader(true)
                const product = await ProductRepository.getById(id);
                if (product.statusCode > 299) setError(true)
                setProdData(product);
                setLoader(false);
            } catch (error) {
                setLoader(false);
                setError(true);
                console.log(error);
            }
        }
        getData();
    }, [])

    async function updateData(): Promise<void> {
        try {
            const update = updatedData ? await ProductRepository.update(id, updatedData) : undefined
            toast({
                title: 'Producto actualizado con éxito',
                description: 'Se ha actualizado el producto exitosamente',
                status: 'success',
                duration: 3500,
                isClosable: true,
                position: 'top-right'
            })

            return update
        } catch (error) {
            console.log('Error en update', error)
        }
    }

    return (
        <>
            {
                loader ? (<Loading />)
                    : error ? (<NotFound />) : (
                        <Box as='section' w='100%'>
                            <Center>
                                <Heading as='h1' my='2rem' display='flex' justifyContent='center' alignItems='center' gap={2}>
                                    Actualizar  <Badge fontSize='1em' colorScheme='green'>
                                        {prodData.name}
                                    </Badge>
                                </Heading>
                            </Center>

                            <Box display='flex' justifyContent='center'>
                                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '55%' }}>

                                    <FormControl my='1rem'>
                                        <FormLabel fontSize='19px'>
                                            Cantidad
                                            <Alert status='info' variant='top-accent' fontSize='14px' display='flex' alignItems='center' gap={2}>
                                                <AlertIcon />
                                                Se sumarán a la cantidad actual, la cual es de:
                                                <Badge fontSize='1.3em' colorScheme='green'>
                                                    {prodData.quantity} {prodData.unit}
                                                </Badge>
                                            </Alert>
                                        </FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                placeholder={`Ingresa la cantidad`}
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



                                    <FormControl my='0.5rem'>
                                        <FormLabel fontSize='19px'>
                                            Precio compra
                                            <Alert status='info' variant='top-accent' fontSize='14px' display='flex' alignItems='center' gap={2}>
                                                <AlertIcon />
                                                Se reemplazará por el precio actual, el cual es:
                                                <Badge fontSize='1.3em' colorScheme='green'>
                                                    {prodData.buyPrice}$
                                                </Badge>
                                            </Alert>
                                        </FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                placeholder={`Ingresa el precio de compra`}
                                                name='buyPrice'
                                                value={+formik.values.buyPrice}
                                                onChange={formik.handleChange}
                                                bg='gray.700'
                                                fontSize='20px'
                                                color='white' />
                                        </NumberInput>

                                        {
                                            (formik.errors.buyPrice != undefined) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.buyPrice}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>



                                    <FormControl my='0.5rem'>
                                        <FormLabel
                                            fontSize='19px'>
                                            Precio venta
                                            <Alert status='info' variant='top-accent' fontSize='14px' display='flex' alignItems='center' gap={2}>
                                                <AlertIcon />
                                                Se reemplazará por el precio actual, el cual es:
                                                <Badge fontSize='1.3em' colorScheme='green'>
                                                    {prodData.sellPrice}$
                                                </Badge>
                                            </Alert>
                                        </FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                placeholder={`Ingresa el precio de venta`}
                                                name='sellPrice'
                                                value={formik.values.sellPrice}
                                                onChange={formik.handleChange}
                                                bg='gray.700'
                                                fontSize='20px'
                                                color='white' />
                                        </NumberInput>

                                        {
                                            (formik.errors.sellPrice != undefined) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.sellPrice}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>



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
                                        Actualizar
                                    </Button>

                                </form>
                            </Box>
                        </Box>
                    )
            }

            {
                updatedData && newData && confirmModal && (
                    <StockUpdateConfirmModal
                        isOpen={isOpen}
                        newData={newData}
                        onClose={onClose}
                        prodData={prodData}
                        updatedData={updatedData}
                        updateData={updateData}
                    />
                )
            }

        </>
    )
}
