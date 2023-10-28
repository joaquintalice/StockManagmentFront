import { RobotoFont, scFont } from '@/shared/utils/fonts'
import Product from '@/stock/data/interfaces/Product'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tag, Tbody, Td, Text, Thead } from '@chakra-ui/react'
import React from 'react'

type FormikValues = {
    name: string
    quantity: number
}

interface confirmModalProps {
    isOpen: boolean
    onClose: () => void
    formikValues: FormikValues[]
    stockListData: Product[]
    total: number
    handleSaleFunction: () => void
}

const SalesCreateConfirmModal: React.FC<confirmModalProps> = ({ formikValues, handleSaleFunction, isOpen, onClose, stockListData, total }) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose()}
            isCentered
            size='4xl'
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent >
                <ModalHeader className={RobotoFont.className} textAlign='center'>
                    Confirma la venta
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <TableContainer className={scFont.className} mt='1.2rem'>
                        <Table>
                            <Thead>
                                <tr>
                                    <th>
                                        <Text>
                                            Producto
                                        </Text>
                                    </th>
                                    <th>
                                        <Text>
                                            Cantidad
                                        </Text>
                                    </th>
                                    <th>
                                        <Text>
                                            Precio de venta
                                        </Text>
                                    </th>
                                    <th>
                                        <Text>
                                            Total
                                        </Text>
                                    </th>
                                </tr>
                            </Thead>
                            <Tbody>
                                {
                                    formikValues.map((producto, index) => (
                                        <tr key={index}>
                                            <Td textAlign='center' fontSize={18}>
                                                {
                                                    stockListData
                                                        .filter(prod => prod?.id === +producto?.name)
                                                        .map(prod => (
                                                            <Text key={prod?.id} >
                                                                <Tag colorScheme='green' >
                                                                    {prod?.name}
                                                                </Tag>
                                                            </Text>
                                                        ))
                                                }
                                            </Td>
                                            <Td textAlign='center'>
                                                {
                                                    stockListData
                                                        .filter(prod => prod?.id === +producto?.name)
                                                        .map(prod => (
                                                            <Text key={prod?.id} >
                                                                <Tag colorScheme='green' >
                                                                    {formikValues[index].quantity} {prod?.unit}
                                                                </Tag>
                                                            </Text>
                                                        ))
                                                }
                                            </Td>
                                            <Td textAlign='center'>
                                                {
                                                    stockListData
                                                        .filter(prod => prod?.id === +producto?.name)
                                                        .map(prod => (
                                                            <Text key={prod?.id}>
                                                                ${prod?.sellPrice} por {prod?.unit.toLocaleLowerCase()}
                                                            </Text>
                                                        ))
                                                }
                                            </Td>
                                            <Td textAlign='center'>
                                                {
                                                    stockListData
                                                        .filter(prod => prod?.id === +producto?.name)
                                                        .map(prod => {
                                                            const finalPrice = prod ? (prod?.sellPrice * formikValues[index].quantity).toFixed(2) : null

                                                            return (
                                                                <small key={prod?.id}>
                                                                    ${finalPrice}
                                                                </small>
                                                            )
                                                        })
                                                }
                                            </Td>
                                        </tr>
                                    ))
                                }
                                {
                                    <tr>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td fontSize={20} fontWeight='bold' textAlign='center'>${total.toFixed(2)}</Td>
                                    </tr>

                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={() => onClose()}>
                        Cancelar
                    </Button>
                    <Button colorScheme='green' onClick={() => handleSaleFunction()}>
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SalesCreateConfirmModal