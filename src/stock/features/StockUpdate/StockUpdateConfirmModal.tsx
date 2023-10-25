import { RobotoFont, scFont } from "@/shared/utils/fonts"
import Product from "@/stock/data/interfaces/Product"
import { Badge, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Text, Thead } from "@chakra-ui/react"
import Link from "next/link"


interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    newData: Partial<Product>
    prodData: Product
    updatedData: Partial<Product>
    updateData: () => void
}

const StockUpdateConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, newData, onClose, prodData, updateData, updatedData }) => {

    return (
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
    )
}


export default StockUpdateConfirmModal