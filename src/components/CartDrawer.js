import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">🛒 Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Items */}
        {cart.length === 0 ? (
          <Typography>No items in cart</Typography>
        ) : (
          cart.map(item => (
            <Box key={item._id} mb={2}>
              <Typography fontWeight={600}>{item.name}</Typography>
              <Typography>Ghc {item.price}</Typography>

              <Button
                size="small"
                color="error"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </Button>
            </Box>
          ))
        )}

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Typography fontWeight={700}>
          Total: Ghc {total}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
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