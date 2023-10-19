'use client'
import { Alert, AlertIcon, Text, Box, Button, Center, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, useDisclosure, useToast, TableContainer, Table, Thead, Tbody, Badge, AlertTitle, AlertDescription, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import ProductRepository from '@/stock/data/repository/Product.repository';


import productNames from '@/stock/data/productNames/NameArray';
import { useFormik } from 'formik';
import { productSchema } from '../schema/product.schema';

import Link from 'next/link';
import Product from '../data/interfaces/Product';
import { RobotoFont, scFont } from '@/shared/utils/fonts';
import CreateProduct from '../data/interfaces/CreateProduct';
import Units from '../data/productNames/UnitsArray';
import Loading from '@/app/loading';
import { useEffect } from 'react';

export default function StockCreate() {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [updatedProd, setUpdatedProd] = useState<CreateProduct>({});
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [prodId, setProdId] = useState<number>();
    const [oldProd, setOldProd] = useState<Product>({})
    const [newProd, setNewProd] = useState<Partial<Product>>({})
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
            setUpdatedProd({})
            setError(false);
            setCreateModal(false)
            setConfirmModal(false)

            async function submitHandler() {
                const dinamicQuantity = values.unit === 'DOC' ? +values.quantity * 12 : +values.quantity
                const dinamicUnit = values.unit === 'DOC' ? 'Unidades' : values.unit

                console.log(dinamicQuantity)
                console.log(dinamicUnit)

                const data = {
                    name: values.name,
                    unit: dinamicUnit,
                    quantity: dinamicQuantity * 1, // Se convierte de string a numero con el *1
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
                        unit: dinamicUnit,
                        quantity: (prod.quantity * 1) + (dinamicQuantity * 1), // Se convierte de string a numero con el *1
                        buyPrice: values.buyPrice * 1,
                        sellPrice: values.sellPrice * 1,
                    }

                    setNewProd(values)
                    setOldProd(prod)
                    setProdId(prod.id)
                    setUpdatedProd(dataToUpdate)
                    setConfirmModal(true)
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
            const update = await ProductRepository.update(prodId, updatedProd)
            toast({
                title: 'Producto actualizado con éxito',
                description: 'Se ha actualizado el producto exitosamente',
                status: 'success',
                duration: 3500,
                isClosable: true,
                position: 'top-right'
            })
            onClose()
            return update
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
                loading ? (<Loading />) : error ? (
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
                                    <Select
                                        name='name'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder='Selecciona el producto'
                                        bg='green.300'
                                        fontSize='20px'>
                                        {
                                            productNames.map((item, index) => (
                                                <option key={index}>{item}</option>
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


                                <Box display={{ base: 'flex' }} flexDirection={{ base: 'column', lg: 'row' }} gap={2} w='100%'>
                                    <FormControl my='1rem'>
                                        <FormLabel fontSize='18px'>Cantidad</FormLabel>
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


                                    <FormControl my='1rem'>
                                        <FormLabel fontSize='18px'>Unidad</FormLabel>
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
                                            (formik.errors.unit != undefined) ? (
                                                <Alert status='error' variant='left-accent' mt='5px'>
                                                    <AlertIcon />
                                                    {formik.errors.unit}
                                                </Alert>
                                            ) : (<></>)
                                        }
                                    </FormControl>
                                </Box>




                                <FormControl my='0.5rem'>
                                    <FormLabel fontSize='18px'>Precio compra</FormLabel>
                                    <NumberInput>
                                        <NumberInputField
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
                                        Precio venta</FormLabel>
                                    <NumberInput>
                                        <NumberInputField
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
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                        size='xl'
                        motionPreset='slideInBottom'>
                        <ModalOverlay />
                        <ModalContent >
                            <ModalHeader className={RobotoFont.className} textAlign='center'>
                                El producto
                                <Badge fontSize='1em' colorScheme='green'>
                                    {oldProd.name}
                                </Badge>
                                ya se encuentra en stock.
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text fontSize='17px' textAlign='center' className={RobotoFont.className}>¿Deseas actualizarlo?</Text>
                                <Text fontSize='17px' textAlign='center' className={RobotoFont.className} mt='1rem'>Confirma o cancela la actualización</Text>
                                <TableContainer className={scFont.className} mt='1.2rem'>
                                    <Table>
                                        <Thead>
                                            <tr>
                                                <th>
                                                    <Text>
                                                        Stock
                                                    </Text>
                                                </th>
                                                <th>
                                                    <Text>
                                                        Cantidad
                                                    </Text>
                                                </th>
                                                <th>
                                                    <Text>
                                                        Precio de compra
                                                    </Text>
                                                </th>
                                                <th>
                                                    <Text>
                                                        Precio de venta
                                                    </Text>
                                                </th>
                                            </tr>
                                        </Thead>
                                        <Tbody>
                                            <tr>
                                                <td>
                                                    <Text textAlign='center'>Actual</Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {oldProd.quantity}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {oldProd.buyPrice}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {oldProd.sellPrice}
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Text textAlign='center'>Ingreso</Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {newProd.quantity}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {newProd.buyPrice}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {newProd.sellPrice}
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>Resultado</Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>
                                                        {updatedProd.quantity}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>
                                                        {updatedProd.buyPrice}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>
                                                        {updatedProd.sellPrice}
                                                    </Text>
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
                                <Link href='/stock'>
                                    <Button colorScheme='green' mr={3} onClick={updateData}>
                                        Confirmar y salir
                                    </Button>
                                </Link>
                                <Button colorScheme='green' onClick={updateData}>
                                    Confirmar y mantenerse
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal >
                </>) : (<></>)
            }

            {
                createModal ? (<>
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                        size='xl'
                        motionPreset='slideInBottom'>
                        <ModalOverlay />
                        <ModalContent >
                            <ModalHeader className={RobotoFont.className} textAlign='center'>
                                Producto creado exitosamente
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text fontSize='17px' textAlign='center' className={RobotoFont.className} mb='1rem'>¿Deseas crear otro producto?</Text>
                                <Text>
                                    Presiona
                                    <Badge fontSize='1em' colorScheme='green'>
                                        si
                                    </Badge> para mantenerte en esta página
                                </Text>
                                <Text>
                                    Presiona <Badge fontSize='1em' colorScheme='red'>
                                        no
                                    </Badge> para salir hacia la tabla de stock
                                </Text>


                            </ModalBody>

                            <ModalFooter>
                                <Link href='/stock'>
                                    <Button colorScheme='red' mr={3} onClick={onClose}>
                                        NO
                                    </Button>
                                </Link>
                                <Button colorScheme='green' onClick={() => {
                                    onClose()
                                    window.location.reload()
                                }}>
                                    SI
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal >
                </>) : (<></>)
            }

        </>
    )
}
