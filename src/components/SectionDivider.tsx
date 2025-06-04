import { Box } from '@chakra-ui/react';

export default function SectionDivider({ flip = false, color = '#fff' }) {
  return (
    <Box as="span" display="block" lineHeight={0} aria-hidden="true">
      <svg
        width="100%"
        height="60"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: flip ? 'scaleY(-1)' : undefined }}
      >
        <path
          d="M0 0h1440v30c-120 20-360 40-720 40S120 50 0 30V0z"
          fill={color}
        />
      </svg>
    </Box>
  );
} 