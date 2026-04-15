import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useCart } from "../context/CartContext";

import {
  Box, Grid, Card, CardMedia, CardContent,
  Typography, Button, Container
} from "@mui/material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    apiFetch("/api/products")
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" mb={4}>Shop Products</Typography>

      <Grid container spacing={3}>
        {products.map(p => (
          <Grid item xs={12} md={4} key={p._id}>
            <Card>
              <CardMedia
                component="img"
                height="250"
                image={`http://localhost:3000${p.image}`}
              />
             
              <CardContent>
                <Typography fontWeight={600}>{p.name}</Typography>
                <Typography color="primary">Ghc {p.price}</Typography>
 <Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}