// StockTableRow.js
import React from 'react';
import { Tr, Td, Badge, Text, IconButton, Link, Button } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import formatDatetime from '../../shared/utils/formatDate';
import Product from '../data/interfaces/Product';

interface StockTableRowProps {
    product: Product;
    onDelete: (id: number, name: string) => void;
}


const StockTableRow: React.FC<StockTableRowProps> = ({ product, onDelete }) => {
    return (
        <Tr key={product.id}>
            <Td>
                <Badge fontSize='1em' colorScheme='green'>
                    {product.name}
                </Badge>
            </Td>
            <Td>
                <Text fontSize='1.2rem' textAlign='center'>
                    {product.quantity.toFixed(2)} {product.unit}
                </Text>
            </Td>
            <Td>
                <Text fontSize='1.2rem' textAlign='center'>${product.buyPrice}</Text>
            </Td>
            <Td>
                <Text fontSize='1.2rem' textAlign='center'>${product.sellPrice}</Text>
            </Td>
            <Td>
                <Text fontSize='1.2rem' textAlign='center'>{formatDatetime(product.updatedAt)}</Text>
            </Td>
            <td style={{ textAlign: 'center' }}>
                <Link href={`stock/${product.id.toString()}`} mr='2'>
                    <Button colorScheme='teal'>Añadir</Button>
                </Link>
                <IconButton
                    colorScheme='red'
                    variant="outline"
                    aria-label="open menu"
                    icon={<FiTrash2 />}
                    onClick={() => onDelete(product.id, product.name)}
                />
            </td>
        </Tr>
    );
};

export default StockTableRow;
