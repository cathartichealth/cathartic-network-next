import { Card, Button, Flex, Heading, Image, Text } from '@aws-amplify/ui-react';
const CardGrid = ({ items, buttonHandler }) => {
    console.log(items)
    return (
        <div className="grid grid-cols-3 gap-1 md:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
                
                <Card
                    key={product.id} // Assuming each product has a unique ID
                    className="mb-4 rounded-lg overflow-hidden border border-purple-800 "
                >
                    <Flex className="flex-row items-center">
                        <Image
                            alt="Sample Product Image"
                            src={product.imagelink}
                            className="w-1/3 h-40 object-cover object-center rounded-l-lg"
                        />
                        <div className="flex-grow p-4">
                            <Heading level={3} className="text-purple-800 mb-2">{product.name}</Heading>
                            <Text className="mb-2">
                                {product.description}
                            </Text>
                            <Flex className="flex-row items-start mb-2">
                                <Text className="mr-2">
                                    Type: {product.type}
                                </Text>
                                <Text>
                                    Quantity: {product.quantity}
                                </Text>
                            </Flex>
                            <button

                                className="bg-purple-800 text-white font-bold rounded-md focus:bg-purple-800 p-2"
                                onClick={() => buttonHandler(product)}
                            >
                                Request
                            </button>
                        </div>
                    </Flex>
                </Card>
            ))}
        </div>
    );
};

export default CardGrid;
