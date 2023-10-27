import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";

import { getHomeProducts } from "../../store/product/actions";
import { useHttp } from "../../hooks/http.hook";

import { noneImage } from "../../configs/utils";

import "./index.css";
import Modal from "../card/Modal";
import { propOr, trim } from "ramda";

const { Meta } = Card;

const arrayLoadingCards=[1,2,3,4,5,6,7,8,9,10]

const Home = () => {
    const navigate = useNavigate()
    const { request } = useHttp();
    const dispatch=useDispatch()

    const {search} = useLocation()
    const searchParam = Object.fromEntries(new URLSearchParams(search).entries())

    
    const { isLoading: isLoadingStore, data }=useSelector(store => store.product.homeProducts )
    const { isLoading: searching, data:searchData }=useSelector(store => store.product.search )
    
    const [hover, setHover] = useState(null);
    const [params, setParams] = useState({
        decs: false,
        modal: false,
        buy: {}
    })

    const [isLoadingState, setIsLoadingState] = useState(false)

    const fetchData = useCallback(async () => {
            try {
                setIsLoadingState(true)
                const data = await request(
                    '/api/products', 
                    'GET',
                    null,   
                    {Authorization: localStorage.getItem("token")}
                );
                dispatch(getHomeProducts(data))
            } catch (error) {
                console.log(error);
            }
            setIsLoadingState(false)
        },
      [dispatch, request],
    )

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    const isLoading = isLoadingStore || isLoadingState ||searching

    const onOpenModal = (id) => {
        setParams(state=>({ 
            ...state, 
            modal: true,
            buy: data.find(({_id})=>_id === id)
        }))
    }

    const handleOk = () => setParams({
        decs: false,
        modal: false,
        buy: {}
    })

    const onCloseModal = ()=>{
        setParams({ 
            decs: false,
            modal: false,
            buy: {}
        })
    }

    return (
        <div>
            <div className="home_page_cards_box">
                {
                isLoading
                    ? arrayLoadingCards.map((item)=><Card
                        loading={true}
                            key={item}
                            style={{ width: 240 }}
                        >
                          <Meta title={item} description={item} />
                        </Card>
                    )
                    : (trim(propOr("", "search", searchParam))?searchData:data).map(({_id:id, owner, count,price, name, image})=>(
                        <Card
                            key={id}
                            hoverable
                            style={{ width: 240 }}
                            onMouseEnter={()=>owner!==JSON.parse(localStorage.getItem("user")).id&&setHover(id)}
                            onMouseLeave={()=>setHover(null)}
                            cover={
                                <img 
                                    onClick={()=>navigate(`/card/${id}`)}
                                    alt="Image" 
                                    style={{
                                        height: "280px"
                                    }}
                                    src={image?.[0]
                                        ?image?.[0]
                                        : noneImage
                                    } 
                                />
                            }
                            
                        >
                          <Meta 
                            title={<span onClick={()=>navigate(`/card/${id}`)}>{name}</span>} 
                            description={
                                <div style={{display:"grid", gridGap:"1rem"}}>
                                    <div className="products_card_params">
                                            <div>
                                                {price} сом
                                            </div>
                                            /
                                            <div>
                                                {count} шт.
                                            </div>
                                    </div>
                                    {hover===id&&<Button onClick={()=>onOpenModal(id)} type="primary">Добавить в корзину</Button>}
                                </div>
                            } 
                           />
                        </Card>
                    ))
                }
                </div>
                <Modal
                    isOpen={params.modal} 
                    productId={params.buy._id}
                    handleOk={handleOk}
                    onCloseModal={onCloseModal}
                    data={params.buy}
                />
        </div>
    )
}

export default Home