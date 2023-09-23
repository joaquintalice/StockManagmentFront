'use client'
import { Text, Alert, AlertIcon, Box, Button, Center, FormControl, FormLabel, Heading, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select } from '@chakra-ui/react'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import ProductRepository from '@/stock/data/repository/Product.repository';
import CreateProduct from "@/stock/data/interfaces/CreateProduct";
import productNames from '@/stock/data/productNames/NameArray';
import { Field, Form, Formik, useFormik } from 'formik';
import { productSchema } from '../schema/product.schema';

export default function AddForm() {
    const [formData, setFormData] = useState<CreateProduct>({});
    const [submitAlert, setSubmitAlert] = useState<Boolean>(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: 0,
            buyPrice: 0,
            sellPrice: 0
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values))
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

    async function submitHandler(e: FormEvent) {
        e.preventDefault();
        const data = await ProductRepository.create(formData);
        setSubmitAlert(true)
        setTimeout(() => {
            setSubmitAlert(false)
        }, 3000);

        return data
    }

    // Create handler functions for each input field
    const handleProductNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedProductName = e.target.value;
        setFormData({ ...formData, name: selectedProductName });
        console.log(selectedProductName);
    };

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const quantityValue = parseFloat(e.target.value);
        setFormData({ ...formData, quantity: quantityValue });
        console.log(quantityValue);
    };

    const handleBuyPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const buyPriceValue = parseFloat(e.target.value);
        setFormData({ ...formData, buyPrice: buyPriceValue });
        console.log(buyPriceValue);
    };

    const handleSellPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const sellPriceValue = parseFloat(e.target.value);
        setFormData({ ...formData, sellPrice: sellPriceValue });
        console.log(sellPriceValue);
    };

    return (
        <Box as='section' w='100%'>
            <Center>
                <Heading as='h1' my='2rem'>
                    Registrar nuevo producto
                </Heading>
            </Center>

            <Box display='flex' justifyContent='center' alignItems='center' as='section'>

                {/* <Formik initialValues={{
                    name: '',
                    quantity: 0,
                    buyPrice: 0,
                    sellPrice: 0
                }}
                    onSubmit={submit}
                    validationSchema={productSchema}>

                    <Form>
                        <Field name='name' as='select'>
                            <option>-Seleccionar producto-</option>
                            <option>Puerro</option>
                            <option>Acelga</option>
                            <option>Morrón</option>
                            <option>Papa</option>
                        </Field>
                        <Field name='quantity' type='number' placeholder='je' />
                        <Field name='buyPrice' type='number' />
                        <Field name='sellPrice' type='number' />
                        <button type='submit'>boton</button>
                    </Form>

                </Formik> */}

                <form onSubmit={formik.handleSubmit}>
                    <FormControl my='15px'>
                        <FormLabel>Producto</FormLabel>
                        <Select name='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Selecciona el producto' bg='green.300'>
                            {
                                productNames.map((item, index) => (
                                    <option key={index}>{item}</option>
                                ))
                            }
                        </Select>
                        <Text bg='red.300'>{formik.errors.name}</Text>
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
                        <Text bg='red.300'>{formik.errors.quantity}</Text>
                    </FormControl>

                    <FormControl my='15px'>
                        <FormLabel>Precio compra</FormLabel>
                        <NumberInput>
                            <NumberInputField name='buyPrice' value={+formik.values.buyPrice} onChange={formik.handleChange} />
                        </NumberInput>
                        <Text bg='red.300'>{formik.errors.buyPrice}</Text>
                    </FormControl>

                    <FormControl my='15px'>
                        <FormLabel>Precio venta</FormLabel>
                        <NumberInput>
                            <NumberInputField name='sellPrice' value={formik.values.sellPrice} onChange={formik.handleChange} />
                        </NumberInput>
                        <Text bg='red.300'>{formik.errors.sellPrice}</Text>
                    </FormControl>

                    <Button
                        mt={4}
                        color='black'
                        _hover={{
                            bg: 'green.500',
                            color: 'white'
                        }}
                        bg='green.300'
                        type='submit'
                        leftIcon={<MdOutlinePostAdd />}
                    >
                        Registrar producto
                    </Button>
                    {
                        submitAlert ? (
                            <Alert status='success' variant='left-accent' my='2rem'>
                                <AlertIcon />
                                Producto registrado exitosamente
                            </Alert>
                        ) : (<></>)
                    }
                </form>
            </Box>
        </Box>
    )
}
