import { RobotoFont } from '@/shared/utils/fonts'
import { Alert, AlertIcon, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tag, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { cashboxSchema } from '../schema/cashbox.schema';
import { useFormik } from 'formik';
import CashboxRepository from '../data/repository/CashboxRepository';
import CashboxHistoryRepository from '../data/repository/CashboxHistoryRepository';


interface CashBoxCloseDayProps {
    total: number
}

export const CashboxCloseDay: React.FC<CashBoxCloseDayProps> = ({ total, cashboxIsClosed, setCashboxIsClosed }) => {

    const toast = useToast()
    const closeCBModalDisclosure = useDisclosure()
    const confirmCBModalDisclosure = useDisclosure()
    const [amount, setAmount] = useState<number>(0);

    const formik = useFormik({
        initialValues: {
            amount: 0
        },
        onSubmit: (values) => {
            setAmount(+values.amount)
            closeCBModalDisclosure.onClose()
            confirmCBModalDisclosure.onOpen()
        },
        validate: (values) => {
            const result = cashboxSchema.safeParse(values);
            if (result.success) return;
            const errors = {}
            result.error.issues.forEach((error) => {
                errors[error.path[0]] = error.message;
            });
            return errors;
        }
    })

    async function updateCashbox() {
        await CashboxHistoryRepository.insert({ total })
        const update = await CashboxRepository.update(1, { amount })
        if (update) {
            toast({
                position: 'top-right',
                title: 'La caja ha sido actualizada',
                description: "Caja actualizada exitosamente",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
        confirmCBModalDisclosure.onClose()
    }

    return (
        <>
            <Button colorScheme='red' onClick={() => closeCBModalDisclosure.onOpen()}>Cerrar la caja</Button>

            {
                <Modal
                    isOpen={closeCBModalDisclosure.isOpen}
                    onClose={() => closeCBModalDisclosure.onClose()}
                    isCentered
                    size='xl'
                    motionPreset='slideInBottom'
                >
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader className={RobotoFont.className} textAlign='center'>
                            Cerrar la caja del día.
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>

                            <form
                                onSubmit={formik.handleSubmit}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                }}
                            >
                                <FormControl my='0.5rem'>
                                    <FormLabel fontSize='18px'>Monto inicial de la caja</FormLabel>

                                    <Input name='amount'
                                        value={formik.values.amount}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder='Selecciona el monto inicial de la caja.'
                                        bg='gray.700'
                                        color='white'
                                        fontSize='20px'>
                                    </Input>


                                    {
                                        (formik.errors.amount) ? (
                                            <Alert status='error' variant='left-accent' mt='5px'>
                                                <AlertIcon />
                                                {formik.errors.amount}
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
                                    onClick={() => { }}
                                >
                                    Cerrar la caja
                                </Button>

                            </form>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='red' onClick={() => { closeCBModalDisclosure.onClose(); }}>
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal >
            }

            {
                <Modal
                    isOpen={confirmCBModalDisclosure.isOpen}
                    onClose={() => confirmCBModalDisclosure.onClose()}
                    isCentered
                    size='xl'
                    motionPreset='slideInBottom'
                >
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader className={RobotoFont.className} textAlign='center'>
                            Confirmar la nueva caja
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text display={'flex'} alignItems='center' gap={2}>
                                La caja del día empezará en
                                <Tag
                                    colorScheme='whatsapp'
                                    fontSize={23}

                                >
                                    {amount}
                                </Tag>

                            </Text>
                            <Text textAlign='center' mt={5} >¿Es correcto?</Text>

                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={() => confirmCBModalDisclosure.onClose()}>
                                No
                            </Button>
                            <Button colorScheme='green' onClick={() => updateCashbox()}>
                                Si
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal >
            }
        </>
    )
}
