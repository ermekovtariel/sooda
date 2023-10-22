import { Button, Drawer, Input } from "antd"
import NumericInput from "../../../components/NumericInput"
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../../hooks/http.hook";
import { getOneCard } from "../../../store/product/actions";
import PT from "prop-types";

const { TextArea } = Input;

const ChangeCardDrower = ({isOpen, onCloseDrower}) => {

    const { request } = useHttp();
    const dispatch = useDispatch()

    const product = useSelector(store=>store.product.productData)

    const [form, setForm] = useState({
        name: product.name,
        price: product.price,
        count: product.count,
        description: product.description,
    })

    const setNameValue=({target})=>setForm(state=>({...state, name:target.value}))
    const setPriceValue=(price)=>setForm(state=>({...state, price: Number(price)}))
    const setCountValue=(count)=>setForm(state=>({...state, count: Number(count)}))
    const setDescriptionValue=({target})=>setForm(state=>({...state, description:target.value}))

    useEffect(() => {
        setForm(state=>({
            ...state,
            name: product.name,
            price: product.price,
            count: product.count,
            description: product.description,
        }))
        
    }, [product]);
    
    const changeble=useMemo(() => 
        ["count", "name", "price", "description"]
            .some(key=>form[key]!==product[key])
    , [product, form])

    const onPatch = async () => {
        try {
            const changedData = await request(
                `/api/products/${product._id}`, 
                'POST',
                {...form},
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(getOneCard(changedData))
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Drawer
            title="Изменить продукт" 
            placement="right" 
            onClose={onCloseDrower} 
            open={isOpen}
        >
            <div className="products_drower_add_form">
                <Input
                    size="large" 
                    value={form.name}
                    onChange={setNameValue}
                    placeholder="Наименовение" 
                />
                <NumericInput
                    value={form.price}
                    placeholder="Цена" 
                    onChange={setPriceValue}
                    afix="сом"
                />
                <NumericInput
                    value={form.count}
                    placeholder="Количество" 
                    onChange={setCountValue}
                />
                {/* <Select
                    defaultValue={prop("name", prop(0, categories))}
                    onChange={(_, {id, value, label})=>setForm(state=>({
                      ...state, 
                      category: {id, value, label}
                    }))}
                    options={
                      categories.map(({name, _id:id})=>({
                          key: id,
                          id: id,
                          value: name,
                          label: name,
                      }))
                    }
                /> */}
                <TextArea
                  placeholder="Описание..."
                  autoSize={{ maxRows: 6 }}
                  value={form.description}
                  onChange={setDescriptionValue}
                />
                <Button
                    type="primary" 
                    disabled={!changeble}
                    onClick={onPatch}
                >
                    Изменить
                </Button>
            </div>
          
        </Drawer>
    )
}

ChangeCardDrower.propTypes = {
    isOpen: PT.bool, 
    onCloseDrower: PT.func
}

export default ChangeCardDrower