'use client'
import { Alert, AlertIcon, Box, Button, Center, FormControl, FormLabel, Heading, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select } from '@chakra-ui/react'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { MdOutlinePostAdd } from 'react-icons/md'
import ProductRepository from '@/stock/data/repository/Product.repository';
import CreateProduct from "@/stock/data/interfaces/CreateProduct";
import productNames from '@/stock/data/productNames/NameArray';

export default function AddForm() {
    const [formData, setFormData] = useState<CreateProduct>({});
    const [sendedData, setSendedData] = useState<Boolean>(false);


    async function submitHandler(e: FormEvent) {
        e.preventDefault();
        const data = await ProductRepository.create(formData);
        setSendedData(true)
        setTimeout(() => {
            setSendedData(false)
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

                <form onSubmit={submitHandler}>
                    <FormControl my='15px'>
                        <FormLabel>Producto</FormLabel>
                        <Select value={formData.name} onChange={handleProductNameChange} placeholder='Selecciona el producto' bg='green.300'>
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
                                value={formData.quantity}
                                onChange={handleQuantityChange}
                            />
                        </NumberInput>
                    </FormControl>

                    <FormControl my='15px'>
                        <FormLabel>Precio compra</FormLabel>
                        <NumberInput>
                            <NumberInputField value={formData.buyPrice} onChange={handleBuyPriceChange} />
                        </NumberInput>
                    </FormControl>

                    <FormControl my='15px'>
                        <FormLabel>Precio venta</FormLabel>
                        <NumberInput>
                            <NumberInputField value={formData.sellPrice} onChange={handleSellPriceChange} />
                        </NumberInput>
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
                        sendedData ? (
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
