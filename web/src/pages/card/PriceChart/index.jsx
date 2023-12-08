import React, { useCallback, useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { Area } from '@ant-design/plots';

import styles from "./index.module.scss";
import { useHttp } from '../../../hooks/http.hook';
import { formatedDate, getDatesInRange } from '../../../configs/utils';

const PriceChart = () => {
    const { request, loading } = useHttp();
    const product = useSelector(store=>store.product.productData)
    
    const [data, setData] = useState([]);
  
    const fetchData = useCallback(async () => {
        try {
            const data = await request(
                `/api/price/${product._id}`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")}
            );

            const dates = data.map(({date, price})=>({price, date:formatedDate(date)}))
            const priceDynamic=getDatesInRange(new Date(product.date), new Date()).map(item=>{
                const condidate = dates.find(({date})=>date===item)
                if(condidate){
                    return {
                        ...condidate
                    }
                }
                return {
                    date: item,
                    Цена: product.price
                }
            })

            setData(priceDynamic)

        } catch (error) {
            console.log(error);
        }
    },
      [product, request],
    )


    useEffect(() => {
      asyncFetch();
      fetchData()
    }, [fetchData]);
  
    const asyncFetch = () => {
      fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
        .then((response) => response.json())
        .then((json) => setData(json.map(({Date:date, scales})=>({date, [`Цена`]: scales}))))
        .catch((error) => {
          console.log('fetch data failed', error);
        });
    };
    const config = {
      data,
      xField: 'date',
      yField: 'Цена',
      xAxis: {
        tickCount: 0,
      },
      yAxis: {
        tickCount: 0,
      },
      areaStyle: () => {
        return {
          fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        };
      },
    };
  
    return (
        <div className={styles.chart}>
            <Area {...config} />
        </div>
    );
}

export default PriceChart