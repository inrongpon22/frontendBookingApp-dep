import { Box, Typography } from '@mui/material'

const Forbidden = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: "#eeee",
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        403
      </Typography>
    </Box>
  )
}

export default Forbidden