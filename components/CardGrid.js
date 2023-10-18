import React from 'react';
import { Grid, Card, Button, Flex, Heading, Image, Text, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const CardGrid = ({ items, buttonHandler }) => {
    // Divide the items into rows with three cards each
    const rows = [];
    for (let i = 0; i < items.length; i += 3) {
      const rowItems = items.slice(i, i + 3);
      rows.push(rowItems);
    }

    const { tokens } = useTheme();
  
    return (
      <Flex
        marginTop="1rem"
        gap="1rem"
        direction="column"
      >
        {rows.map((row, rowIndex) => (
          <Flex
            key={rowIndex}
            direction="row"

          >
            {row.map((product) => (
                <Card 
                    variation="elevated"
                    style={{
                        width: '33%',
                        borderRadius: 400
                    }}
                    borderRadius={tokens.radii.large}
                >
                    <Flex
                        direction={{ base: 'column', large: 'row' }}
                        alignItems="center"
                    >
                        <Image
                            alt="Sample Product Image"
                            src="https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987"
                            width="25%"
                            marginRight="5%"
                            borderRadius={tokens.radii.large}
                        />
                 
                        <Flex direction="column" alignItems="flex-start">
                            <Heading level={3} color="#301934">{product.name}</Heading>
                            <Text>
                                {product.description}
                            </Text>
                            <Flex direction="row" alignItems="flex-start">
                                <Text>
                                    Quantity: {product.quantity}
                                </Text>
                                {product.type && 
                                    <Text>
                                        Type: {product.type}
                                    </Text>
                                }
                            </Flex>
                        
                            <Button
                                variation="primary"
                                borderRadius={tokens.radii.medium}
                                onClick={() => buttonHandler(product)}
                            >
                                Request
                            </Button>
                        </Flex>
                    </Flex>
                </Card>
            ))}
          </Flex>
        ))}
      </Flex>
    );
};
  
export default CardGrid;