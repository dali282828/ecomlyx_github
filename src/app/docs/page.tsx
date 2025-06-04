'use client';

import dynamic from 'next/dynamic';
import { Box, Heading, Text } from '@chakra-ui/react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => <Box p={8}><Text>Loading API Documentation...</Text></Box>
});

export default function ApiDocsPage() {
  return (
    <Box p={8}>
      <Heading mb={4}>API Documentation</Heading>
      <Text mb={6} color="gray.600">
        Interactive API documentation for the Business Website Builder platform.
      </Text>
      
      <SwaggerUI
        url="/api/docs"
        deepLinking={true}
        displayOperationId={false}
        defaultModelsExpandDepth={1}
        defaultModelExpandDepth={1}
        defaultModelRendering="example"
        displayRequestDuration={true}
        docExpansion="none"
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
        tryItOutEnabled={true}
      />
    </Box>
  );
} 