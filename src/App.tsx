import React, { useState } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Button, Slider, Stack } from '@mui/material';
import data from './data.json';
import InfiniteScroll from "react-infinite-scroll-component";

const unikaPersonalities = [
  'foodies',
  'gamer',
  'lifestylist',
  'sportier',
  'spiritual',
  'adventurer',
  'gardener',
  'artistic sole',
  'family centric',
  'learner',
  'cooker',
  'spoiled brat',
  'traveler',
  'animal lover',
  'diy',
  'home decorator',
  'wellness enthusiastic',
  'environmentalist',
  'chocolate lover',
  'music digger',
  'book worm',
  'fashionista',
  'entertainment ruler',
  'sophisticated drinker'
];

function App() {
  const loaderIndexJump = 100;
  const [filterdData, setFilterdData] = useState<any | null>([]);
  const [tempData, setTempData] = useState<any | null>([]);
  const [hasMore, setHasMore] = useState(true);
  const [persona, setPersona] = useState<any | null>(null);
  const [minPrice, setMinPirce] = useState(0);
  const [productLoaderIndex, setProductLoaderIndex] = useState(loaderIndexJump);
  const [maxPrice, setMaxPirce] = useState(1000);
  const [value1, setValue1] = React.useState<number[]>([0, 1000]);




  const marks = [
    {
      value: 0,
      label: '0₪',
    },
    {
      value: 1000,
      label: '1,000₪',
    },
  ];

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    setMinPirce(newValue[0]);
    setMaxPirce(newValue[1]);
    setValue1(newValue);
  };

  function valuetext(value: number) {
    return `${value}°C`;
  }

  function click() {
    setTempData([]);
    setHasMore(true)
    setProductLoaderIndex(0)
    let d = data.filter((product) => product.persona.indexOf(persona) > -1 && product.price.total > minPrice && product.price.total < maxPrice);
    setTempData(d);
    setFilterdData(d.slice(0, productLoaderIndex));
    setProductLoaderIndex(productLoaderIndex + loaderIndexJump)
  }

  function handleChange() {
    console.log('change');
  }

  function getImageUrl(url: string) {
    return url?.startsWith('https://') ? url : `https://${url}`
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className='unika-wrapper flex-row'>
        <Stack className='unika-inner-wrapper'>
          <p>Choose personality</p>
          <Autocomplete
            onChange={(event, value) => { setPersona(value?.label) }}
            disablePortal
            id="combo-box-demo"
            options={unikaPersonalities.map((personality, index) => ({ 'label': personality, 'id': index }))}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Personality" />}
          />
        </Stack>

        <Stack className='unika-inner-wrapper'>
          <p>Set minimum and maximum price</p>
          <Box sx={{ width: 300 }}>
            <Slider
              getAriaLabel={() => 'Minimum distance'}
              value={value1}
              onChange={handleChange1}
              valueLabelDisplay="auto"
              disableSwap
              marks={marks}
              min={0}
              max={1000}
            />
          </Box>
        </Stack>
        <Button variant="contained" onClick={click}>search</Button>
      </div>
      <div>
        <b>Amount of items {tempData.length} | min price: {minPrice} | max price: {maxPrice}</b>
      </div>
      <hr />
      <div>
        <InfiniteScroll
          dataLength={filterdData.length}
          loader={<h4>Loading...</h4>}
          hasMore={hasMore}
          style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}
          next={() => {
            if (productLoaderIndex >= tempData.length) {
              setHasMore(false);
              return;
            }
            setFilterdData(tempData.slice(0, productLoaderIndex + loaderIndexJump));
            setProductLoaderIndex(productLoaderIndex + loaderIndexJump)
          }}
        >
          {filterdData.map((value: any) => (
            <div key={value.id} className='product-display'>
              <div className='product-display-name'>{value?.name}</div>
              {/* <div className='product-display-name'>{value?.description.en}</div> */}
              <div className='product-display-price'>Price: {value?.price?.total}</div>
              <div className='product-display-price'>Venue: {value?.venueName}</div>
              <hr />
              <img src={getImageUrl(value.image[0])} height="150" width="150" />
            </div>
          ))}
        </InfiniteScroll>
      </div>
      <div className='product-display-wrapper'>
        {filterdData.map((value: any) => (
          <div key={value.id} className='product-display'>
            <div className='product-display-name'><b>ID: {value?.id}</b></div>
            <div className='product-display-name'><b>{value?.name}</b></div>
            {/* <div className='product-display-name'>{value?.description.en}</div> */}
            <div className='product-display-price'><b>Price: {value?.price?.total}</b></div>
            <div className='product-display-price'><b>Venue: {value?.venueName}</b></div>
            <hr />
            <img src={getImageUrl(value.image[0])} height="150" width="150" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
