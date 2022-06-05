import React from 'react';
import { Center, ChakraProvider, Heading, theme } from '@chakra-ui/react'
import Canvas from './Canvas';

const App: React.FC = () => {
    return (
        <ChakraProvider theme={theme} resetCSS>
           <Center color='purple.800' marginBottom='2em'><Heading size="lg"> <u>Triangle Palette</u> </Heading></Center>
           <Canvas width={640} height={480} />
        </ChakraProvider>
       )
};

export default App;