import React, { useEffect, useState } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { Box, Slider, Stack } from '@mui/material';
import InfiniteScroll from "react-infinite-scroll-component";

const MIN_PRICE = 0;
const MAX_PRICE = 1000;

const unikaVenues = [
  'gaya-game',
  'pulp-shop',
  'storyonline',
  // 'takeanap',
  '4chef',
  'spicehaus',
  'delicatessen',
  'sunshine',
  // 'terminalx',
  'steimatzky',
  'cookshop',
];

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
  const loaderIndexJump = 35;
  const [filterdData, setFilterdData] = useState<any | null>([]);
  const [tempData, setTempData] = useState<any | null>([]);
  const [data, setData] = useState<any | null>([]);
  const [hasMore, setHasMore] = useState(true);
  const [persona, setPersona] = useState<any | null>(null);
  const [venue, setVenue] = useState<any | null>(null);
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPirce] = useState(MAX_PRICE);
  const [productLoaderIndex, setProductLoaderIndex] = useState(loaderIndexJump);
  const [value1, setValue1] = React.useState<number[]>([MIN_PRICE, MAX_PRICE]);


  useEffect(() => {
    getData();
  }, [])

  const getData = () => {
    fetch('data.json'
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setData(data);
      });
  }


  const marks = [
    {
      value: MIN_PRICE,
      label: '0₪',
    },
    {
      value: MAX_PRICE,
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

    setMinPrice(newValue[0]);
    setMaxPirce(newValue[1]);
    setValue1(newValue);
  };

  function search() {
    setTempData([]);
    setHasMore(true)
    setProductLoaderIndex(0)
    let d = data.filter((product: any) =>
      (!persona || product.persona.indexOf(persona) > -1) &&
      (!venue || product.venueName == venue) &&
      product.price.total > minPrice &&
      product.price.total < maxPrice
    );
    setTempData(d);
    setFilterdData(d.slice(0, productLoaderIndex));
    setProductLoaderIndex(productLoaderIndex + loaderIndexJump)
  }

  function clear() {
    setTempData([]);
    setHasMore(true)
    setProductLoaderIndex(0)
    setFilterdData([]);
    setMinPrice(MIN_PRICE);
    setMaxPirce(MAX_PRICE);
    setPersona(null);
    setVenue(null);
  }

  function getImageUrl(url: string) {
    return (url?.startsWith('https://') || url?.startsWith('http://')) ? url : `https://${url}`
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className='unika-wrapper flex-row'>
        <Stack className='unika-inner-wrapper'>
          <p>Choose personality</p>
          <Autocomplete
            onChange={(event: any, value: any) => { setPersona(value?.label) }}
            disablePortal
            id="combo-box-demo"
            options={unikaPersonalities.map((personality, index) => ({ 'label': personality, 'id': index }))}
            sx={{ width: 300 }}
            renderInput={(params: any) => <TextField {...params} label="Personality" />}
          />
        </Stack>
        <Stack className='unika-inner-wrapper'>
          <p>Choose venue</p>
          <Autocomplete
            onChange={(event: any, value: any) => { setVenue(value?.label) }}
            disablePortal
            id="combo-box-demo"
            options={unikaVenues.map((venue, index) => ({ 'label': venue, 'id': index }))}
            sx={{ width: 300 }}
            renderInput={(params: any) => <TextField {...params} label="Venue" />}
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
        <span style={{ marginRight: '15px' }}>
          <Button variant="outlined" onClick={clear}>clear</Button>
        </span>
        <Button variant="contained" onClick={search}>search</Button>
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
              <div className='product-display-name'><b>ID: {value?.id}</b></div>
              <div className='product-display-name'><b>{value?.name}</b></div>
              {/* <div className='product-display-name'>Categories:
                <div>{value?.categories[0]}</div>
                <div>{value?.categories[1]}</div> */}
              {/* </div> */}
              <div className='product-display-price'><b>Price: {value?.price?.total}₪</b></div>
              <hr />
              <div className='product-display-price'><b>Venue: {value?.venueName}</b></div>
              <hr />
              <div className='product-display-price'><b>Categories:</b>
                <span>{value?.categories[0]["key"]}:  {value?.categories[0]["percentage"]}%</span>
              </div>
              <hr />
              <img src={getImageUrl(value.image[0])} height="150" width="150" />
            </div>
          ))}
        </InfiniteScroll>
      </div >
    </div >
  );
}

export default App;
