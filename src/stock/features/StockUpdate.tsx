'use client'
import { productSchema } from '@/stock/schema/product.schema';
import { Alert, AlertIcon, Badge, Box, Button, Center, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Table, TableContainer, Tbody, Text, Thead, useDisclosure, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md';
import ProductRepository from '../data/repository/Product.repository';
import Product from '../data/interfaces/Product';
import Link from 'next/link';
import NotFound from '@/app/not-found';
import { RobotoFont, scFont } from '@/shared/utils/fonts';
import Loading from '@/app/loading';

type StockUpdateProp = {
    id: number;
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
    });
    const [newData, setNewData] = useState<Partial<Product>>({})
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
            setNewData(values)
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
                                            Kilos
                                            <Alert status='info' variant='top-accent' fontSize='14px' display='flex' alignItems='center' gap={2}>
                                                <AlertIcon />
                                                Se sumarán a la cantidad actual, la cual es de:
                                                <Badge fontSize='1.3em' colorScheme='green'>
                                                    {prodData.quantity} Kilos
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
                confirmModal ? (<>
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                        size='xl'
                        motionPreset='slideInBottom'>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader className={RobotoFont.className} display='flex' justifyContent='center' alignItems='center' gap={2}>
                                Actualizar
                                <Badge fontSize='1em' colorScheme='green'>
                                    {updatedData.name}
                                </Badge>
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text fontSize='17px' textAlign='center' className={RobotoFont.className}>Corrobora los cambios</Text>
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
                                                        {prodData.quantity}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {prodData.buyPrice}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {prodData.sellPrice}
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Text textAlign='center'>Ingreso</Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {newData.quantity}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {newData.buyPrice}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center'>
                                                        {newData.sellPrice}
                                                    </Text>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>Resultado</Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>
                                                        {(updatedData.quantity)?.toFixed(2)}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>
                                                        {updatedData.buyPrice}
                                                    </Text>
                                                </td>
                                                <td>
                                                    <Text textAlign='center' bg='green.300'>
                                                        {updatedData.sellPrice}
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
