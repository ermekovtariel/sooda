import "./index.css";

import { DeleteOutlined, DollarOutlined, EditFilled, FullscreenOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Form, Modal, Result, Select, Tooltip, Typography } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeParams, getBuskets } from "../../store/busket/actions";
import { useHttp } from "../../hooks/http.hook";
import { isEmpty, prop, propOr, trim } from "ramda";
import { noneImage } from "../../configs/utils";
import { useState } from "react";
import NumericInput from "../../components/NumericInput";
import { colors, sizes } from "../../configs/params";
import { HappyProvider } from "@ant-design/happy-work-theme";

const { Meta } = Card;
const { Title } = Typography;

const layout = {
    labelCol: { span: 5 },
};


const Busket=()=> {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { request } = useHttp();

    const [params, setParams] = useState({
        id: null,
        color: null,
        size: null,
        count: 0,
        modal: false
    })

    const { data = [], count} = useSelector(store=> store.busket)
    const [product, setProduct] = useState({})
    
    const onDelete = async(id)=>{
        try {
            await request(
                `/api/busket/${id}`, 
                'DELETE',
                null,   
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(getBuskets(data.filter(({_id})=>_id!==id), count))
        } catch (error) {
            console.log(error);
        }
    }

    const onPatch = async () => {
        try {
            const changedData = await request(
                `/api/busket/${params.id}`, 
                'POST',
                {
                    color: params.color,
                    size: params.size,
                    count: params.count,
                },
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(changeParams(data.map(item=>{
                if(item._id === changedData._id){
                    return changedData
                }
                return item
            })))
        } catch (error) {
            console.log(error);
        }
    }

    const openModal = async ({id, product, count, color, size}) => {
        try {
            setParams( state => ({
                ...state,
                modal: true,
                id,
                count,
                color,
                size
            }))
            const data = await request(
                `/api/products/${product}`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")}
            );    
            setProduct(data);
        } catch (error) {
            console.log(error);
        }
        
    }

    const closeModal = () => setParams( state => ({
        ...state,
        id: null, 
        color: null,
        size: null,
        count: 1,
        modal: false,
    }))

    const changeState = ({ type, value }) => setParams( state => ({
        ...state,
        [type]: value
    }))

    return  isEmpty(data)?(
    <Result
        status="404"
        title="Пусто"
        subTitle="У вас нет в корзине продуктов..."
        extra={<Button onClick={()=>navigate("/home")} type="primary">Перейти на главную страницу</Button>}
    />
    )
    :(
        <div>
            <Title 
                style={{
                    margin: "0 0 1rem 0"
                }}
            >
                Корзина
            </Title>
            <div className="busket_cards">
                {data.map(({
                    _id, 
                    product, 
                    count, 
                    color, 
                    size, 
                    price=0,
                    name="",
                    image="" 
                })=>(
                    <div key={_id}>
                        <Badge 
                            size="large" 
                            count={
                                <Tooltip 
                                    title={"Изменить параметры заказа"}
                                    key="open"
                                >
                                    <EditFilled
                                        onClick={()=>openModal({
                                            id: _id,
                                            product,
                                            count, 
                                            color, 
                                            size,
                                        })}
                                        className="busket_card_edit" 
                                    />
                                </Tooltip>
                            }
                        >
                            <Card
                                style={{ width: 300 }}
                                cover={
                                    <img
                                      alt="Image"
                                      src={
                                        trim(image) === ""
                                            ? noneImage
                                            : image
                                      }
                                    />
                                }
                                actions={[
                                    <Tooltip 
                                        title={"Удалить карту"}
                                        key="open"
                                    >
                                        <DeleteOutlined
                                            key="delete" 
                                            onClick={()=>onDelete(_id)}
                                            className="busket_card_actions"
                                        />
                                     </Tooltip>,
                                     <Tooltip 
                                        title={"Перейти на страницу карты"}
                                        key="open"
                                    >
                                        <FullscreenOutlined
                                            onClick={()=>navigate(`/card/${product}`)} 
                                            className="busket_card_actions"
                                        />
                                    </Tooltip>,
                                    <Tooltip 
                                        title={"Оплата за товар"}
                                        key="pay"
                                    >
                                        <DollarOutlined 
                                            className="busket_card_actions"
                                        />
                                    </Tooltip>,
                                ]}
                            >
                                <Meta
                                    title={<span className="busket_item_title" onClick={()=>navigate(`/card/${product}`)} >{name}</span>}
                                    description={
                                        <div className="busket_item_options">
                                            <div>Размер: {size}</div>
                                            <div>Цвет: {color}</div>
                                            <div>Цена: {price} cом</div>
                                            <div>Кол-во: {count} шт.</div>
                                            <div></div>
                                            <div>К оплате: {count * price} cом</div>
                                        </div>
                                    }
                                />
                            </Card>
                        </Badge>
                    </div>
                ))}
            </div>
            
            {params.modal && <Modal
                open={params.modal}
                title={`Заказ #${params.id}`}
                onCancel={closeModal}
                footer={[]}
            >
                <Form
                    {...layout}
                    initialValues={{
                        size: prop("size", data.find(({_id})=>_id===params.id)),
                        color:  prop("color", data.find(({_id})=>_id===params.id)),
                        count: params.count
                    }}
                    size='large'
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="size" label="Размер">
                        <Select
                            options={
                                propOr([], "sizes",  product).map(item=>({
                                    label: item,
                                    value: item,
                                }))
                            }
                            onChange={(_, e)=> changeState({ type: "size", value: e.value })}
                        />
                    </Form.Item>
                    <Form.Item name="color" label="Цвет">
                        <Select
                            options={
                                propOr([], "colors",  product).map(item=>({
                                    label: item,
                                    value: item,
                                }))
                            }
                            onChange={(_, e)=> changeState({ type: "color", value: e.value })}
                        />
                    </Form.Item>
                    <Form.Item name="count" style={{margin:0}} label="Количество">
                        <NumericInput
                            value={params.count}
                            placeholder="Количество"
                            onChange={(e)=> changeState({ type: "count", value: e })}
                            afix="шт."
                        />
                    </Form.Item>
                </Form>
                <div className='card_modal_add_inptes_cards_box'>
                    <div className='card_modal_cards_actions'>
                        <Button key="back" onClick={closeModal}>
                          Отмена
                        </Button>
                        <HappyProvider>
                            <Button 
                              key="submit" 
                              type="primary" 
                              onClick={onPatch}
                            >
                              Изменить
                            </Button>
                        </HappyProvider>
                    </div>
                </div>
            </Modal>}
        </div>
    )
}

export default Busket