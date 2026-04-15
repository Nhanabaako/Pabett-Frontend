import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">🛒 Your Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* CART ITEMS */}
        <Stack spacing={2}>
          {cart.length === 0 ? (
            <Typography>No items in cart</Typography>
          ) : (
            cart.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography color="primary">Ghc {item.price}</Typography>
                </Box>

                <Button
                  size="small"
                  color="error"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </Button>
              </Box>
            ))
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* TOTAL */}
        <Typography fontWeight={700}>Total: Ghc {total}</Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!cart.length}
        >
          Checkout
        </Button>

        <Button
          fullWidth
          color="error"
          sx={{ mt: 1 }}
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </Box>
    </Drawer>
  );
}