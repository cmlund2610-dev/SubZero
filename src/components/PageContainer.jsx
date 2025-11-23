/**
 * PageContainer - Consistent outer layout wrapper for page content.
 *
 * Provides max width, horizontal centering, padding, and responsive behavior.
 * Keeps pages visually aligned without repeating layout styles.
 */

import React from 'react';
import { Box } from '@mui/joy';

const PageContainer = ({
	children,
	sx = {},
	scroll = false,
	...rest
}) => {
	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 'none', // Remove maxWidth constraints
				px: { xs: 2, md: 3 },
				py: { xs: 2, md: 3 },
				...(scroll
					? {
						overflowY: 'auto',
						WebkitOverflowScrolling: 'touch',
						height: '100%',
					}
					: {}),
				...sx,
			}}
			{...rest}
		>
			{children}
		</Box>
	);
};

export default PageContainer;
