"use client";
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Grid, List, ListItem, Card, CardMedia, CardContent, TextField, CardActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const estateTypes = ["Konut", "İş Yeri", "Arsa"];
const estateList = [
  {
    id: 1,
    title: "Güzel Bir Konut",
    type: "Konut",
    image: "https://via.placeholder.com/150",
    description: "3+1, 120m²"
  },
  {
    id: 2,
    title: "Modern İş Yeri",
    type: "İş Yeri",
    image: "https://via.placeholder.com/150",
    description: "4+1, 200m²"
  },
  {
    id: 3,
    title: "Lüks Villa",
    type: "Konut",
    image: "https://via.placeholder.com/150",
    description: "5+1, 350m²"
  },
  {
    id: 4,
    title: "Küçük Ofis",
    type: "İş Yeri",
    image: "https://via.placeholder.com/150",
    description: "2+1, 60m²"
  }
];

function EstateList() {
  const [selectedType, setSelectedType] = useState("");

  const handleTypeClick = (type:string) => {
    setSelectedType(type);
  };

  const filteredEstates = selectedType
    ? estateList.filter((estate) => estate.type === selectedType)
    : estateList;

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Emlak Sitesi
          </Typography>

          {/* Search Field */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Ara..."
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            style={{ marginRight: '16px' }}
          />

          {/* Login Button */}
          <Button color="inherit">Giriş Yap</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {/* Sidebar */}
        <Grid item xs={3}>
          <List>
            {estateTypes.map((type, index) => (
              <ListItem button key={index} onClick={() => handleTypeClick(type)}>
                {type}
              </ListItem>
            ))}
          </List>

          {/* Filtreleme ve Haritada Göster Alanı */}
          {selectedType && (
            <div>
              <Typography variant="h6" style={{ marginBottom: '10px' }}>
                {selectedType} Filtreleme
              </Typography>


              <Button variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                Haritada Göster
              </Button>
              {/* Buraya ek filtreleme bileşenleri eklenebilir */}
            </div>
          )}
        </Grid>

        {/* Estate List - Two Columns */}
        <Grid item xs={9}>
          <Grid container spacing={2}>
            {filteredEstates.map((estate) => (
              <Grid item xs={6} key={estate.id}>
                <Card style={{ marginBottom: '20px' }}>
                  <CardMedia
                    component="img"
                    height="210"
                    image={estate.image}
                    alt={estate.title}
                  />
                  <CardContent>
                    <Typography variant="h5">{estate.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {estate.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Detaylara Git
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default EstateList;
