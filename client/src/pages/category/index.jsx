import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { useLocation, useNavigate } from "react-router-dom";
import { categoryProductsLoading, getCategoryProducts } from "../../store/product/actions";
import { Button, Card } from "antd";
import { noneImage } from "../../configs/utils";
import Modal from "../card/Modal";
import { prop } from "ramda";

const { Meta } = Card;

const Category=()=> {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { request } = useHttp();
  const {pathname} = useLocation()

  const { data: { products } } = useSelector( store => store.product.category )

  const [hover, setHover] = useState(null);
  const [params, setParams] = useState({
    decs: false,
    modal: false,
    buy: {}
  })


  const fetchData = useCallback(async () => {
    try {
      
        dispatch(categoryProductsLoading(true))
        const data = await request(
            `/api/categories/category/${prop(2, pathname.split("/"))}`, 
            'GET',
            null,   
            {Authorization: localStorage.getItem("token")}
        );
        dispatch(getCategoryProducts(data))
    } catch (error) {
        console.log(error);
    }
    dispatch(categoryProductsLoading(false))
  },
    [dispatch, pathname, request],
  )

  const onOpenModal = () => {
    setParams(state=>({ 
        ...state, 
        modal: true,
        buy: products.find(({_id})=> _id !== hover )
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

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  return (
    <div style={{display:"flex", flexWrap:"wrap", gridGap:"1rem"}}>
      {
        products.map(({_id:id, owner, count,price, name, image})=>(
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
                      {hover===id&&<Button onClick={onOpenModal} type="primary">Добавить в корзину</Button>}
                  </div>
              } 
             />
          </Card>
        ))
      }
      <Modal
          isOpen={params.modal} 
          productId={hover}
          handleOk={handleOk}
          onCloseModal={onCloseModal}
          data={params.buy}
      />
    </div>
  )
}

export default Category