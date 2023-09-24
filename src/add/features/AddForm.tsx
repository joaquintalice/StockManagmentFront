'use client'
import { Text, Alert, AlertIcon, Box, Button, FormControl, FormLabel, NumberInput, NumberInputField, Select, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import ProductRepository from '@/stock/data/repository/Product.repository';

import productNames from '@/stock/data/productNames/NameArray';
import { useFormik } from 'formik';
import { productSchema } from '../schema/product.schema';

export default function AddForm() {

    const toast = useToast()
    const [submitAlert, setSubmitAlert] = useState<Boolean>(false);
    const [errorAlert, setErrorAlert] = useState<Boolean>(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: 0,
            buyPrice: 0,
            sellPrice: 0
        },
        onSubmit: (values) => {

            async function submitHandler() {
                setSubmitAlert(false)
                const data = {
                    name: values.name,
                    quantity: values.quantity * 1,
                    buyPrice: values.buyPrice * 1,
                    sellPrice: values.sellPrice * 1
                }
                const createProd = await ProductRepository.create(data);
                if (createProd.statusCode === 409) {
                    const prodById = await ProductRepository.getById(data.name);
                    console.log(prodById)
                    const updateProd = {
                        quantity: (data.quantity + prodById.quantity),
                        buyPrice: (data.buyPrice),
                        sellPrice: (data.sellPrice)
                    }
                    const updatedProduct = await ProductRepository.update(prodById.id, updateProd);
                    console.log('Data updateada finalmente', updatedProduct)
                } else {
                    setSubmitAlert(true)
                }
                console.log({ dbResponse: createProd })

                setTimeout(() => {
                    setErrorAlert(false)
                    setSubmitAlert(false)
                }, 3000);
                console.log(data)

            }
            submitHandler()

        },
        validate: (values) => {
            const result = productSchema.safeParse(values);
            if (result.success) return;
            console.log(result.error.issues)
            const errors = {}
            result.error.issues.forEach((error) => {
                errors[error.path[0]] = error.message;
            })
            return errors;
        }
    })

    return (
        <Box as='section' w='100%'>

            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <FormControl my='15px'>
                    <FormLabel>Producto</FormLabel>
                    <Select name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Selecciona el producto' bg='green.300'>
                        {
                            productNames.map((item, index) => (
                                <option key={index}>{item}</option>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl my='15px'>
                    <FormLabel>Kilos</FormLabel>
                    <NumberInput>
                        <NumberInputField
                            name="quantity"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                        />
                    </NumberInput>
                </FormControl>

                <FormControl my='15px'>
                    <FormLabel>Precio compra</FormLabel>
                    <NumberInput>
                        <NumberInputField name='buyPrice' value={+formik.values.buyPrice} onChange={formik.handleChange} />
                    </NumberInput>
                </FormControl>

                <FormControl my='15px'>
                    <FormLabel>Precio venta</FormLabel>
                    <NumberInput>
                        <NumberInputField name='sellPrice' value={formik.values.sellPrice} onChange={formik.handleChange} />
                    </NumberInput>
                </FormControl>

                <Button
                    mt={4}
                    w='60%'
                    color='black'
                    _hover={{
                        bg: 'green.500',
                        color: 'white'
                    }}
                    bg='green.300'
                    type='submit'
                >
                    <MdOutlinePostAdd />
                </Button>

                {
                    errorAlert ? (
                        toast({
                            title: 'Error al enviar el formulario',
                            description: 'Este producto ya se encuentra en el stock. Modifícalo si deseas actualizarlo.',
                            status: 'error',
                            duration: 3500,
                            isClosable: true,
                            position: 'top-right'
                        })) : (<></>)
                }
                {
                    submitAlert ? (
                        toast({
                            title: 'Producto registrado con éxito.',
                            description: 'Se ha registrado un nuevo producto al stock.',
                            status: 'success',
                            duration: 3500,
                            isClosable: true,
                            position: 'top-right'
                        })
                    ) : (<></>)
                }
            </form>

            {
                (formik.errors.name != undefined) ? (
                    <Alert status='error' mt='5px'>
                        <AlertIcon />
                        {formik.errors.name}
                    </Alert>
                ) : (<></>)
            }

            {
                (formik.errors.quantity != undefined) ? (
                    <Alert status='error' mt='5px'>
                        <AlertIcon />
                        {formik.errors.quantity}
                    </Alert>
                ) : (<></>)
            }

            {
                (formik.errors.buyPrice != undefined) ? (
                    <Alert status='error' mt='5px'>
                        <AlertIcon />
                        {formik.errors.buyPrice}
                    </Alert>
                ) : (<></>)
            }

            {
                (formik.errors.sellPrice != undefined) ? (
                    <Alert status='error' mt='5px'>
                        <AlertIcon />
                        {formik.errors.sellPrice}
                    </Alert>
                ) : (<></>)
            }


        </Box>
    )
}
