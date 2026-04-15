import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

export default function Dashboard() {
  const stats = [
    { title: "Total Products", value: 12 },
    { title: "Gallery Images", value: 45 },
    { title: "Orders", value: 8 },
    { title: "Revenue", value: "Ghc 2,300" },
  ];

  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={3}>
        📊 Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 2,
              }}
            >
              <Typography color="textSecondary">
                {item.title}
              </Typography>

              <Typography variant="h5" fontWeight={700}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}