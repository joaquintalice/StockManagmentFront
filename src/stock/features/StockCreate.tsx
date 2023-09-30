'use client'
import { Alert, AlertIcon, Text, Box, Button, Center, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import ProductRepository from '@/stock/data/repository/Product.repository';


import productNames from '@/stock/data/productNames/NameArray';
import { useFormik } from 'formik';
import { productSchema } from '../schema/product.schema';

import Link from 'next/link';


export default function StockCreate() {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [errorModal, setErrorModal] = useState<boolean>(false);
    const [prodId, setProdId] = useState<number>();
    const [prodName, setProdName] = useState<string>();

    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: 0,
            buyPrice: 0,
            sellPrice: 0
        },
        onSubmit: (values) => {
            setErrorModal(false)
            async function submitHandler() {

                const data = {
                    name: values.name,
                    quantity: values.quantity * 1, // Se convierte de string a numero con el *1
                    buyPrice: values.buyPrice * 1,
                    sellPrice: values.sellPrice * 1
                }

                const create = await ProductRepository.create(data);

                if (create.statusCode === 409) {
                    const prodById = await ProductRepository.getByName(data.name);

                    setProdId(prodById.id);
                    setProdName(prodById.name);
                    setErrorModal(true);
                    return;
                } else {
                    toast({
                        title: 'Stock actualizado con éxito',
                        description: 'Se ha actualizado el stock exitosamente',
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

    return (
        <>
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

            {
                errorModal ? (<>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay
                        />
                        <ModalContent>
                            <ModalHeader>Producto "{prodName}" ya existente en stock</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text>
                                    Este producto ya se encuentra registrado en el stock. <br />
                                    ¿Deseas modificar el producto existente?
                                </Text>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='red' mr={3} onClick={onClose}>
                                    Cerrar
                                </Button>
                                <Link href={`/stock/${prodId}`}>
                                    <Button colorScheme='green' >Editar</Button>
                                </Link>
                            </ModalFooter>
                        </ModalContent >
                    </Modal >
                </>) : (<></>)
            }

        </>
    )
}
