'use client'
import { Alert, AlertIcon, Text, Box, Button, Center, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, useDisclosure, useToast, TableContainer, Table, Thead, Tbody, Badge, AlertTitle, AlertDescription, Input } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import Link from 'next/link';

import { useFormik } from 'formik';

import { productSchema } from '../../schema/product.schema';
import CreateProduct from '../../data/interfaces/CreateProduct';
import ProductRepository from '@/stock/data/repository/Product.repository';
import Product from '../../data/interfaces/Product';
import Units from '../../data/productNames/UnitsArray';


import { RobotoFont } from '@/shared/utils/fonts';
import Loading from '@/app/loading';
import StockCreateUpdateModal from './StockCreateTableModal';
import StockCreateRedirectModal from './StockCreateRedirectModal';

export default function StockCreate() {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const [updatedProd, setUpdatedProd] = useState<Partial<Product>>();
    const [prodId, setProdId] = useState<number>();
    const [oldProd, setOldProd] = useState<Product>()
    const [newProd, setNewProd] = useState<CreateProduct>()

    const [updateModal, setUpdateModal] = useState<boolean>(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)


    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: 0,
            unit: '',
            buyPrice: 0,
            sellPrice: 0
        },
        onSubmit: (values) => {
            setError(false);
            setCreateModal(false)
            setUpdateModal(false)
            async function submitHandler() {

                const data = {
                    name: values.name,
                    unit: values.unit,
                    quantity: +values.quantity * 1, // Se convierte de string a numero con el *1
                    buyPrice: values.buyPrice * 1,
                    sellPrice: values.sellPrice * 1
                }

                const create = await ProductRepository.create(data);

                if (create.statusCode === 422) {
                    setError(true);
                    return;
                }
                if (create.statusCode === 409) {

                    const prod = await ProductRepository.getByName(data.name);

                    const dataToUpdate = {
                        name: values.name,
                        unit: values.unit,
                        quantity: (prod.quantity * 1) + (+values.quantity * 1), // Se convierte de string a numero con el *1
                        buyPrice: values.buyPrice * 1,
                        sellPrice: values.sellPrice * 1,
                    }


                    setNewProd(values)
                    setOldProd(prod)
                    setProdId(prod.id)
                    setUpdatedProd(dataToUpdate)
                    setUpdateModal(true)
                } else {
                    setCreateModal(true)
                    toast({
                        title: 'Producto creado con éxito',
                        description: 'Se ha creado el producto exitosamente',
                        status: 'success',
                        duration: 3500,
                        isClosable: true,
                        position: 'top-right'
                    })

                }
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

    async function updateData() {
        try {

            const update = (prodId && updatedProd) ? await ProductRepository.update(prodId, updatedProd) : undefined
            if (update) {
                toast({
                    title: 'Producto actualizado con éxito',
                    description: 'Se ha actualizado el producto exitosamente',
                    status: 'success',
                    duration: 3500,
                    isClosable: true,
                    position: 'top-right'
                })
                formik.resetForm();
                formik.setValues({
                    name: '',
                    quantity: 0,
                    unit: '',
                    buyPrice: 0,
                    sellPrice: 0
                });
                onClose()
                return update
            } else {
                toast({
                    title: 'Producto actualizado con sin éxito',
                    description: 'Se no ha podido ser actualizado',
                    status: 'warning',
                    duration: 3500,
                    isClosable: true,
                    position: 'top-right'
                })
                onClose()
            }
        } catch (error) {
            console.log('Error en update', error)
        }
    }

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <>
            {
                loading ? (
                    <Loading />
                ) :
                    error ? (
                        <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>Error interno.</AlertTitle>
                            <AlertDescription> La entidad 'warehouse' debe ser creada antes que los productos.</AlertDescription>
                        </Alert>
                    ) : (
                        <Box as='section' w='100%'>
                            <Center>
                                <Heading as='h1' my='2rem'>
                                    Crear nuevo producto
                                </Heading>
                            </Center>

                            <Box display='flex' justifyContent='center'>
                                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '55%' }}>

                                    <FormControl my='0.5rem'>
                                        <FormLabel fontSize='18px'>Producto</FormLabel>

                                        <Input name='name'
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder='Selecciona el producto'
                                            bg='gray.700'
                                            color='white'
                                            fontSize='20px'>
                                        </Input>


                                        {
                                            (formik.errors.name) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.name}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>

                                    <Box display={{ base: 'flex' }} flexDirection={{ base: 'column', lg: 'row' }} gap={2} w='100%'>
                                        <FormControl my='1rem'>
                                            <FormLabel fontSize='18px'>
                                                Unidad
                                                <Alert status='info' variant='top-accent' fontSize='14px' display='flex' alignItems='center' gap={2}>
                                                    <AlertIcon />
                                                    Unidad mediante la que será almacenado y vendido el producto.
                                                </Alert>
                                            </FormLabel>
                                            <Select
                                                name='unit'
                                                value={formik.values.unit}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder='Selecciona la unidad'
                                                bg='green.300'
                                                fontSize='20px'>
                                                {
                                                    Units.map((item, index) => (
                                                        <option key={index}>{item}</option>
                                                    ))
                                                }
                                            </Select>

                                            {
                                                (formik.errors.unit) ? (
                                                    <Alert status='error' variant='left-accent' mt='5px'>
                                                        <AlertIcon />
                                                        {formik.errors.unit}
                                                    </Alert>
                                                ) : (<></>)
                                            }
                                        </FormControl>

                                        <FormControl my='1rem'>
                                            <FormLabel fontSize='18px'>Cantidad
                                                <Alert status='info' variant='top-accent' fontSize='14px' display='flex' alignItems='center' gap={2}>
                                                    <AlertIcon />
                                                    Ingrese la cantidad respetando la unidad asignada previamente.
                                                </Alert>
                                            </FormLabel>
                                            <NumberInput>
                                                <Input
                                                    type='number'
                                                    name="quantity"
                                                    value={formik.values.quantity ? formik.values.quantity : ''}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    bg='gray.700' fontSize='20px' color='white'
                                                />
                                            </NumberInput>

                                            {
                                                (formik.errors.quantity) ? (
                                                    <Alert status='error' variant='left-accent' mt='5px'>
                                                        <AlertIcon />
                                                        {formik.errors.quantity}
                                                    </Alert>
                                                ) : (<></>)
                                            }
                                        </FormControl>
                                    </Box>

                                    <FormControl my='0.5rem'>
                                        <FormLabel fontSize='18px'>Precio compra</FormLabel>
                                        <NumberInput>
                                            <Input
                                                type='number'
                                                name='buyPrice'
                                                value={formik.values.buyPrice ? +formik.values.buyPrice : ''}
                                                onChange={formik.handleChange}
                                                bg='gray.700'
                                                fontSize='20px'
                                                color='white' />
                                        </NumberInput>

                                        {
                                            (formik.errors.buyPrice) ? (
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
                                            Precio venta</FormLabel>
                                        <NumberInput>
                                            <Input
                                                type='number'
                                                name='sellPrice'
                                                value={formik.values.sellPrice ? formik.values.sellPrice : ''}
                                                onChange={formik.handleChange}
                                                bg='gray.700'
                                                fontSize='20px'
                                                color='white' />
                                        </NumberInput>

                                        {
                                            (formik.errors.sellPrice) ? (
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
                                        Crear
                                    </Button>

                                </form>
                            </Box>

                        </Box>
                    )
            }

            {
                updateModal && oldProd && newProd && updatedProd && (
                    <StockCreateUpdateModal
                        isOpen={isOpen}
                        onClose={onClose}
                        newProd={newProd}
                        oldProd={oldProd}
                        updatedProd={updatedProd}
                        onConfirm={updateData}
                        resetForm={() => formik.resetForm()}
                        setUpdateModal={setUpdateModal}
                    />
                )
            }

            {
                createModal &&
                <StockCreateRedirectModal
                    isOpen={isOpen}
                    onClose={onClose}
                    resetForm={() => formik.resetForm()}
                    setCreateModal={setCreateModal}
                />
            }

        </>
    )
}
