import React, { useEffect, useState } from 'react';
import { Space } from 'antd';

import { getStores } from '../app/api';
import StoreCard from './StoreCard';
import styled from 'styled-components';
import InfinitScroll from "react-infinite-scroll-component";
const StyledSpace = styled(Space)`
  width: 100%;
`;
let initial_render = true
export default function (props) {
  const [stores, setStores] = useState([]);
  let [offSet, setOffset] = useState(1);
  const limit = 20;

  useEffect(() => {
    if (initial_render) {
      fetchRandomUsers();
      initial_render = false
    }
  }, []);

  const fetchRandomUsers = () => {
    const data = `limit=${limit}&offset=${offSet}`
    getStores(data)
      .then((response) => {
        setStores(response.data);
      });
  };

  const fetchNextUsers = () => {
    setOffset(limit + offSet)
    const data = `limit=${limit}&offset=${offSet}&${props.str}`
    getStores(data)
      .then((response) => {
        setStores(stores?.concat(response.data));
      });
  };

  return (
    <InfinitScroll
      dataLength={stores?.length}
      next={fetchNextUsers}
      hasMore={true}
      loader={<h4>Loading ... </h4>}
    >
      <StyledSpace direction="vertical" align="center">
        {stores && stores.length > 0 && (
          stores.map((store) => (
            <StoreCard key={store.uuid} {...store} />
          ))
        )
        }
      </StyledSpace>
    </InfinitScroll>
  );
}
