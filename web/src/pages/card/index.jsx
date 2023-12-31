import { HappyProvider } from '@ant-design/happy-work-theme';
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Image, Skeleton, Typography } from "antd";
import { isEmpty, isNil, length, prop, propOr } from "ramda";

import { useHttp } from "../../hooks/http.hook";
import { getOneCard } from "../../store/product/actions";
import ChangeCardDrower from './ChangeCardDrower';
import { defaultText, formatedDate, noneImage } from "../../configs/utils";
import Modal from './Modal';

import "./index.css";
import styles from "./index.module.scss";
import PriceChart from './PriceChart';


const CardPage = () => {
    const { productId } = useParams()
    const { request, loading } = useHttp();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const product = useSelector(store=>store.product.productData)
    const userId = useSelector(store => store.auth.user?.id)

    const [drowerIsOpen, setDrowerIsOpen] = useState(false);

    const [params, setParams] = useState({
        decs: false,
        modal: false,
        buy: {}
    })


    const fetchData = useCallback(async () => {
        try {
            const data = await request(
                `/api/products/${productId}`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(getOneCard(data))
        } catch (error) {
            console.log(error);
        }
    },
      [dispatch, productId, request],
    )

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    const onOpenDesc = () => setParams(state=>({ ...state, decs: !state.decs }))

    const onOpenModal = () => {
        setParams(state=>({ 
            ...state, 
            modal: true,
            buy: product
        }))
    }

    const onCloseModal = () => setParams(state=>({ ...state, modal: false }))

    const handleOk = () => setParams(state=>({ ...state, modal: false }))

    const onDrowerOpen = () => setDrowerIsOpen(true)
    
    return (
        <div>
            <div className={styles.articuleName}>
                {loading 
                    ? <Skeleton.Input 
                        active={true}  
                        block={"true"} 
                        style={{height:50}}
                    />
                    : <Typography.Title 
                        level={1} 
                        style={{ margin: 0 }}
                    >
                      {product.name}
                    </Typography.Title>
                }
            </div>
            <div className="card_box">
                <div className="card_box_image_block">
                    <Image.PreviewGroup
                      items={propOr([],  "image", product).filter(item=>!isNil(item))}
                    >
                        {
                          loading
                                ? <Skeleton.Image
                                    style={{
                                        width: 400, 
                                        height: 400,
                                        // border: "1px solid #1677ff",
                                        borderRadius: 8
                                    }}
                                    active={true}
                                 />
                                : <Image
                                    width={350}
                                    height={400}
                                    style={{
                                        // border: "1px solid #1677ff",
                                        borderRadius: 8
                                    }}
                                    src={
                                        isEmpty(propOr([], "image", product).filter(item=>!isNil(item)))
                                            ? noneImage
                                            : product.image[0]
                                    }
                                 />
                        }
                    </Image.PreviewGroup>
                    <HappyProvider>
                        {loading
                            ? null
                            : product.owner === userId
                                ? <Button onClick={onDrowerOpen} type="primary">Изменить продукт</Button>
                                : <Button onClick={onOpenModal} type="primary">Добавить в корзину</Button>
                        }
                    </HappyProvider>
                </div>
                <div className="card_titles">
               
                
                {loading 
                    ? <Skeleton.Input 
                        active={true}  
                        block={"true"} 
                        style={{height:50}}
                    />
                    : <Typography.Title 
                        level={5} 
                        style={{ margin: 0 }}
                    >
                      <span className="card_titles_label">Дата создания:</span> {formatedDate(product.date)}
                    </Typography.Title>
                }
                {loading 
                    ? <Skeleton.Input 
                        active={true}  
                        block={"true"} 
                        style={{height:50}}
                    />
                    : <Typography.Title 
                        level={5} 
                        style={{ margin: 0 }}
                        className='card_category'
                        onClick={()=> navigate(`/category/${product?.category?.id}`)}
                    >
                      <span className="card_titles_label">Категория:</span>  <span className={styles.category}>{product?.category?.value}</span>
                    </Typography.Title>
                }
                {loading 
                    ? <Skeleton.Input 
                        active={true}  
                        block={"true"} 
                        style={{height:50}}
                    />
                    : <Typography.Title 
                        level={5} 
                        style={{ margin: 0 }}
                    >
                      <span className="card_titles_label">Количество:</span> {product.count} шт.
                    </Typography.Title>
                }

                {loading
                    ? <Skeleton.Input 
                        active={true}  
                        block={"true"} 
                        style={{height:50}}
                    />
                    :  length(propOr([], "sizes", product))===0?null: <Typography.Title 
                        level={5} 
                        style={{ 
                            margin: 0, 
                            display:"flex", 
                            gridGap: "4px",
                            alignItems: "center"
                        }}
                    >
                        <span className="card_titles_label_sizes">
                            Размеры:
                        </span> 
                        <span className='sizes_cards'>
                        <table>
                          <tr>
                          {product.sizes.map(size=>(
                                <th 
                                    key={size}
                                    className={styles.cardsSize}
                                >
                                    {size}
                                </th>
                            ))}
                          </tr>
                        </table>
                            
                        </span>
                    </Typography.Title>
                }
                {loading
                    ? <Skeleton.Input 
                        active={true}  
                        block={"true"} 
                        style={{height:50}}
                    />
                    :  length(propOr([], "colors", product))===0?null: <Typography.Title 
                        level={5} 
                        style={{ 
                            margin: 0, 
                            display:"flex", 
                            gridGap: "4px",
                            alignItems: "center"
                        }}
                    >
                      <span 
                        className="card_titles_label_sizes"
                    >
                        Цвета:
                    </span> 
                        <span className='sizes_cards'>
                            {product.colors.map(color=>(
                                <div 
                                    className='size_card'  
                                    key={color}
                                >
                                    {defaultText(color)}
                                </div>
                            ))}
                      </span>
                    </Typography.Title>
                }

                {loading
                    ? <Skeleton.Input 
                        active={true}  
                        block={"true"} 
                        style={{height:50}}
                    />
                    : <Typography.Title 
                        level={5} 
                        style={{ margin: 0 }}
                    >
                        <span 
                            className="card_titles_label"
                        >
                            Описание: 
                        </span> 
                        {params.decs 
                            && product.description.length > 500 
                                ? product.description 
                                : product.description.slice(0, 500) 
                                    + (product.description.length > 500 ? '...' : "")
                        }
                            {product.description.length > 500 && 
                                <a href='#header'>
                                    <p 
                                        onClick={onOpenDesc}
                                        className="decs_open_button"
                                    > 
                                        {params.decs ? "Свернуть описание": "Развернуть описание"} 
                                    </p>
                                </a>
                            }
                    </Typography.Title>
                }
                </div>
                <div className={styles.priceChartBlock}>
                    <div className={styles.price}>
                        {loading 
                            ? <Skeleton.Input 
                                active={true}  
                                block={"true"} 
                                style={{height:50}}
                            />
                            : <Typography.Title 
                                level={5} 
                                style={{ margin: 0 }}
                            >
                              <span className="card_titles_label"></span> {product.price} сом
                            </Typography.Title>
                        }
                    </div>
                    <PriceChart />
                   {prop("name", prop("container", product))&& <Link 
                        to={
                            `/container/${
                                prop("id", prop("container", product))
                            }/${
                                prop("name", prop("container", product))
                            }/products`
                        } 
                        className={styles.brand}
                    >
                        <b>
                            {propOr(null, "name", prop("container", product))}
                        </b>
                    </Link>}
                
                </div>
                <Modal 
                    isOpen={params.modal} 
                    productId={productId}
                    handleOk={handleOk}
                    onCloseModal={onCloseModal}
                    data={params.buy}
                />

            </div>
                <div className="card_page_content">
                    Some Data
                </div>
            <ChangeCardDrower
                isOpen={drowerIsOpen}
                onCloseDrower={()=>setDrowerIsOpen(false)}
            />
        </div>
    )
}

export default CardPage