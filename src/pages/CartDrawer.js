import {
  Drawer, Box, Typography, IconButton,
  Button, TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQty } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const checkout = () => {
    const message = cart.map(
      i => `${i.name} x${i.qty} - Ghc ${i.price}`
    ).join("%0A");

    window.open(`https://wa.me/233571901526?text=${message}`);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Cart</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {cart.map(item => (
          <Box key={item._id} mt={2}>
            <Typography>{item.name}</Typography>

            <TextField
              type="number"
              size="small"
              value={item.qty}
              onChange={(e) =>
                updateQty(item._id, Number(e.target.value))
              }
            />

            <Button color="error" onClick={() => removeFromCart(item._id)}>
              Remove
            </Button>
          </Box>
        ))}

        <Typography mt={3}>Total: Ghc {total}</Typography>

        <Button fullWidth variant="contained" onClick={checkout}>
          Checkout via WhatsApp
        </Button>
      </Box>
    </Drawer>
  );
}