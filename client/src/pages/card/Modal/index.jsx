/* eslint-disable react/prop-types */
import { Badge, Button, Form, Modal, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import NumericInput from '../../../components/NumericInput';
import { HappyProvider } from '@ant-design/happy-work-theme';

import "./index.css";
import { useHttp } from '../../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { changeItemeBusket } from '../../../store/busket/actions';
import { prop, propOr } from 'ramda';

const layout = {
    labelCol: { span: 5 },
};

const Modal_ = ({
    isOpen, 
    data: productData,
    handleOk,
    productId,
    onCloseModal,
}) => {
    const { request } = useHttp();
    const dispatch = useDispatch()
    const initialData = useMemo(() => [
        {
            index: `productId_1`,
            size: prop(0,propOr([],"sizes", productData)),
            color:  prop(0,propOr([],"colors", productData)),
            count: 1,
        }
    ], [productData])

    const [data, setData] = useState(()=>initialData)
    const busketRerender = useSelector(store=>store.busket.rerender)

    useEffect(() => {
        if(isOpen){
            setData(initialData)
        }
    }, [initialData, isOpen]);

    const addInpute = () => setData(state=>[
        ...state,
        {
            ...initialData[0],
            index: `${productId}_${data.length+1}`,
        }
    ])

    const changeState = ({ type, value, id }) => {
        setData(state=>state.map(item=>{
            if(item.index === id){
                return ({
                   ...item,
                    [type]:value
                })
            }
            return item
        }))
    }

    const confirm = async () => {
        try {
            await request(
                `/api/busket/add`, 
                'POST',
                {
                    data: data.map(item=>({
                        ...item,
                        image: productData.image[0],
                        name: productData.name,
                        price: productData.price,
                        product: productId 
                    })),
                    product: productId
                },
                {Authorization: localStorage.getItem("token")}
            );
                
            setTimeout(() => {
                dispatch(changeItemeBusket(busketRerender + 1))
            }, 1);
        } catch (error) {
            console.log(error);
        }
        handleOk()
    }

    const FormBox = () => (
        <div className="card_modal_inptes_cards" >
            {data.map((item, i)=>(
                <Badge.Ribbon 
                    text={i+1}
                    key={item.index}
                >
                    <div 
                        className="card_modal_inptes_cards_box"
                    >
                        <Form
                            {...layout}
                            initialValues={{...data[0]}}
                            size='large'
                            name={`product_page_add_modal_${i+1}`}
                            style={{ maxWidth: 600 }}
                        >
                            <Form.Item name="size" label="Размер">
                                <Select
                                    options={
                                        propOr([],"sizes", productData).map(item=>({
                                            label: item,
                                            value: item,
                                        }))
                                    }
                                    onChange={(_, e)=>changeState({type:"size", value: prop("value", e) , id: item.index})}
                                />
                            </Form.Item>
                            <Form.Item name="color" label="Цвет">
                                <Select
                                    options={
                                        propOr([],"colors", productData).map(item=>({
                                            label: item,
                                            value: item,
                                        }))
                                    }
                                    onChange={(_, e)=>changeState({type:"color", value:e.value, id: item.index})}
                                />
                            </Form.Item>
                            <Form.Item name="count" style={{margin:0}} label="Количество">
                                <NumericInput
                                    value={item.count}
                                    placeholder="Количество"
                                    onChange={(e)=>changeState({type:"count", value:e, id: item.index})}
                                    afix="шт."
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </Badge.Ribbon>
            ))}
        </div>
    )

    return (
        <Modal
            open={isOpen}
            title={`Торав: ${productId}`}
            onCancel={onCloseModal}
            footer={[]}
        >
            <FormBox />
            <div className='card_modal_add_inptes_cards_box'>
                {/* <Button onClick={addInpute}>Добавить еще заказ</Button> */}
                <div className='card_modal_cards_actions'>
                    <Button key="back" onClick={onCloseModal}>
                      Отмена
                    </Button>
                    <HappyProvider>
                        <Button 
                          key="submit" 
                          type="primary" 
                          onClick={confirm}
                        >
                          Добавить
                        </Button>
                    </HappyProvider>
                </div>
            </div>
        </Modal>
    )
}

export default Modal_