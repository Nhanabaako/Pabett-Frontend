import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Zoom,
  Fab,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Styled button with glow effect
const GlowButton = styled(Button)(({ theme }) => ({
  '&:hover': {
    boxShadow: `0 0 15px ${theme.palette.success.main}`,
  },
  transition: 'box-shadow 0.3s ease',
  animation: 'pulse-glow 2s infinite',
  '@keyframes pulse-glow': {
    '0%': { boxShadow: '0 0 0 0 rgba(0, 182, 173, 0.6)' },
    '70%': { boxShadow: '0 0 0 10px rgba(0, 182, 173, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(0, 182, 173, 0)' },
  },
}));

const HoverMenuIcon = styled(MenuIcon)({
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'rotate(90deg)',
  },
});

const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  textDecoration: 'none',
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: 44,
  width: 'auto',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    height: 36,
  },
}));

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/Gallery', label: 'Gallery' },
  { path: '/Product', label: 'Products' },
  { path: '/Services', label: 'Services' },
  { path: '/About', label: 'About' },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <>
      <AppBar
        position="sticky"
        component={motion.div}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        elevation={scrolled ? 6 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(18, 28, 51, 0.95)' : 'rgba(44, 62, 100, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
          fontFamily: '"Poppins", sans-serif',
          transition: 'all 0.4s ease-in-out',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            py: 1,
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Logo */}
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <LogoContainer>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <LogoImage src="/images/pabet.png" alt="Pabett Beauty" />
              </motion.div>
            </LogoContainer>
          </NavLink>

          {/* Nav Links */}
          {!isMobile && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              sx={{ display: 'flex', gap: 2 }}
            >
              {navLinks.map(({ path, label }) => (
                <Button
                  key={path}
                  component={NavLink}
                  to={path}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    fontFamily: '"Poppins", sans-serif',
                    position: 'relative',
                    textTransform: 'none',
                    px: 2,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#00B6AD',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover::after, &.active::after': {
                      transform: 'scaleX(1)',
                    },
                    '&.active': {
                      color: '#00B6AD',
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Side Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && (
              <>
                {/* WhatsApp Button */}
                <Box component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <GlowButton
                    variant="contained"
                    color="success"
                    href="https://wa.me/233571901526"
                    target="_blank"
                    startIcon={<WhatsAppIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: '"Poppins", sans-serif',
                      borderRadius: '50px',
                      px: 3,
                      backgroundColor: '#25d366',
                      '&:hover': {
                        backgroundColor: '#1ebf5b',
                      },
                    }}
                  >
                    WhatsApp
                  </GlowButton>
                </Box>

                {/* Admin Login Button */}
                <Button
                  variant="outlined"
                  onClick={handleAdminLogin}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'white',
                      color: '#00B6AD',
                    },
                  }}
                >
                  Login
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton color="inherit" onClick={handleMenu}>
                  <HoverMenuIcon fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: { mt: 1.5, minWidth: '200px', borderRadius: 2, p: 1 },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  component={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {navLinks.map(({ path, label }) => (
                    <MenuItem
                      key={path}
                      component={NavLink}
                      to={path}
                      onClick={handleClose}
                      sx={{
                        py: 1.5,
                        fontFamily: '"Poppins", sans-serif',
                        '&.active': { color: '#00B6AD', fontWeight: 'bold' },
                      }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    component="a"
                    href="https://wa.me/233571901526"
                    target="_blank"
                    sx={{ color: '#00B6AD', fontWeight: 'bold', fontFamily: '"Poppins", sans-serif' }}
                  >
                    <WhatsAppIcon sx={{ mr: 1 }} />
                    Contact Us
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/admin/login');
                    }}
                    sx={{ color: '#00B6AD', fontWeight: 'bold', fontFamily: '"Poppins", sans-serif' }}
                  >
                    Admin Login
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Floating WhatsApp Button for Mobile */}
      {isMobile && (
        <Zoom in={true}>
          <Fab
            component={motion.a}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://wa.me/233571901526"
            target="_blank"
            color="success"
            size="medium"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1300,
              backgroundColor: '#00B6AD',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: '#009c94',
              },
            }}
          >
            <WhatsAppIcon />
          </Fab>
        </Zoom>
      )}
    </>
  );
}
