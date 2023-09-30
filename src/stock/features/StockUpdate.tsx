'use client'
import { productSchema } from '@/stock/schema/product.schema';
import { Alert, AlertIcon, Box, Button, Center, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md';
import ProductRepository from '../data/repository/Product.repository';
import Product from '../data/interfaces/Product';
import Link from 'next/link';
import NotFound from '@/app/not-found';

type StockUpdateProp = {
    id: any;
}

export default function StockUpdate({ id }: StockUpdateProp) {

    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [prodData, setProdData] = useState<Product>({
        buyPrice: 0,
        date: '',
        id: id,
        name: '',
        quantity: 0,
        sellPrice: 0,
        warehouseId: 1,
        updatedAt: '',
    });
    const [updatedData, setUpdatedData] = useState<Partial<Product>>({});
    const [loader, setLoader] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: prodData.name,
            quantity: 0,
            buyPrice: 0,
            sellPrice: 0
        },
        onSubmit: (values) => {
            setConfirmModal(false)
            setUpdatedData({})
            async function submitHandler() {
                const prod = prodData

                const data = {
                    name: values.name,
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

    async function updateData() {
        try {
            const update = await ProductRepository.update(id, updatedData);
            toast({
                title: 'Producto actualizado con éxito',
                description: 'Se ha actualizado el producto exitosamente',
                status: 'success',
                duration: 3500,
                isClosable: true,
                position: 'top-right'
            })
            console.log(update)
            return update
        } catch (error) {
            console.log('Error en update', error)
        }
    }

    return (
        <>
            {
                loader ? (<>Loading...</>)
                    : error ? (<NotFound />) : (
                        <Box as='section' w='100%'>
                            <Center>
                                <Heading as='h1' my='2rem'>
                                    Actualizar {prodData.name}
                                </Heading>
                            </Center>

                            <Box display='flex' justifyContent='center'>
                                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '55%' }}>

                                    <FormControl my='1rem'>
                                        <FormLabel fontSize='18px'>Kilos (Se suma a la cantidad existente)</FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                placeholder={`Cantidad actual: ${prodData.quantity}`}
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
                                        <FormLabel fontSize='18px'>Precio compra (Se reemplaza por el precio anterior)</FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                placeholder={`Precio de compra actual: ${prodData.buyPrice}`}
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
                                            fontFamily=''
                                            fontSize='18px'>
                                            Precio venta
                                            (Se reemplaza por el precio anterior)
                                        </FormLabel>
                                        <NumberInput>
                                            <NumberInputField
                                                placeholder={`Precio de venta actual: ${prodData.sellPrice}`}
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
                confirmModal ? (<>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Actualizar {updatedData.name}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text fontSize='20px'>Verifica el resultado final</Text>
                                <Text>Cantidad: {updatedData.quantity}</Text>
                                <Text>Precio de compra: {updatedData.buyPrice}</Text>
                                <Text>Precio de venta: {updatedData.sellPrice}</Text>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='red' mr={3} onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Link href='/stock'>
                                    <Button colorScheme='green' onClick={updateData}>
                                        Confirmar
                                    </Button>
                                </Link>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>) : (<></>)
            }

        </>
    )
}
