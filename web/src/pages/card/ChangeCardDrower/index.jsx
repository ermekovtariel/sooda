import { Button, Drawer, Input, Select } from "antd"
import NumericInput from "../../../components/NumericInput"
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../../hooks/http.hook";
import { getOneCard } from "../../../store/product/actions";
import PT from "prop-types";
import { prop } from "ramda";

const { TextArea } = Input;

const ChangeCardDrower = ({isOpen, onCloseDrower}) => {
    const { request } = useHttp();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const product = useSelector(store=>store.product.productData)
    const categories = useSelector(store=>store.categories.categoryChilds)

    const [form, setForm] = useState({
        name: product.name,
        price: product.price,
        count: product.count,
        description: product.description,
        category: product.category,
        colors: product.colors,
        sizes: product.sizes,
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
            category: product.category,
            colors: product.colors,
            sizes: product.sizes,
        }))
    }, [product]);
    
    const changeble = useMemo(() => 
        ["count", "name", "price", "category", "description"]
            .some(key=>form[key]!==product[key])
    , [product, form])

    const onPatch = async () => {
        try {
            setIsLoading(true)
            const changedData = await request(
                `/api/products/${product._id}`, 
                'POST',
                {...form},
                {Authorization: localStorage.getItem("token")}
            );

            if(form.price!==product.price){
                const changedData = await request(
                    `/api/price/change-price/`, 
                    'POST',
                    {
                        product:product._id,
                        price: form.price,
                    },
                    {Authorization: localStorage.getItem("token")}
                );
                console.log(changedData);
            }
            

            dispatch(getOneCard(changedData))
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
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
                <Select
                    defaultValue={prop("value", prop("category", form))}
                    onChange={(_, {id, key, value, label})=>setForm(state=>({
                      ...state, 
                      category: {id, key, value, label}
                    }))}
                    options={
                        categories.map(({name, _id:id})=>({
                          key: id,
                          id: id,
                          value: name,
                          label: name,
                      }))
                    }
                />
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
                    loading={isLoading}
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