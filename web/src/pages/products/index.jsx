import { Button, Card, Drawer, Image, Input, Modal, Result, Select, Spin, Upload } from "antd"
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { filter, includes, isEmpty, prop } from "ramda";

import { addOwnProduct, deleteOwnProduct, getOwnProducts } from "../../store/product/actions";
import { useHttp } from "../../hooks/http.hook";

import NumericInput from "../../components/NumericInput";

import { getBase64, noneImage } from "../../configs/utils";

import "./index.css";
import { getProductCategories } from "../../store/category/actions";

const { TextArea } = Input;
const { Meta } = Card;
const arrayLoadingCards=[1,2,3,4,5,6,7,8,9,10]
const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

const Products = () => {
    const navigate = useNavigate()
    const { request } = useHttp();
    const {id:containerId}=useParams()
    const dispatch = useDispatch()

    const products = useSelector(store=>store.product.ownProducts.data)
    const categories = useSelector(store=>store.categories.productCategories)

    const [isLoading, setisLoading] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    // const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name:"",
        price: null,
        container:containerId, 
        count: null,
        description: "",
        isOpen: false,
        colors: [],
        sizes: [],
        category:null
    })
    

    const resetData=()=>{
        setForm({
            name:"",
            price: null,
            container:containerId, 
            count: null,
            description: "",
            isOpen: false,
        })
        setPreviewOpen(false)
        setPreviewImage("")
        setPreviewTitle('')
        setFileList([])
    }

    const onDrowerOpen=()=>setForm(state=>({...state, isOpen:true}))
    const onDrowerClose=()=>{
        setForm(state=>({...state, isOpen:false}))
        resetData()
    }
    const setNameValue=({target})=>setForm(state=>({...state, name:target.value}))
    const setPriceValue=(price)=>setForm(state=>({...state, price}))
    const setCountValue=(count)=>setForm(state=>({...state, count}))
    const setDescriptionValue=({target})=>setForm(state=>({...state, description:target.value}))

    const handleCancel = () => setPreviewOpen(false);
    // const handlePreview = async (file) => {
    //   if (!file.url && !file.preview) {
    //     file.preview = await getBase64(file.originFileObj);
    //   }
    //   setPreviewImage(file.url || file.preview);
    //   setPreviewOpen(true);
    //   setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    // };
    // const handleChange = ({ fileList: newFileList }) => {
    //     setFileList(
            
    //         )
    // }

    const fetchProducts = useCallback(async () => {
        try {
            setisLoading(true)
            const categories = await request(
                `/api/categories/product-create-halper`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")},
            );
            setForm(state=>({
                ...state,
                category: {
                    key: prop("_id", prop(0, categories)),
                    id: prop("_id", prop(0, categories)),
                    value: prop("name", prop(0, categories)),
                    label: prop("name", prop(0, categories)),
                }
            }))
            dispatch(getProductCategories(categories))
            const data = await request(
                `/api/products/?container=${containerId}`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")},
            );
            
            dispatch(getOwnProducts(data))
        } catch (error) {
            console.log(error);
        }
        setisLoading(false)
    }, [containerId, dispatch, request])

    const addProduct = async () => {
        try {
            setisLoading(true)
            const {product}=await request(
                '/api/products/add', 
                'POST',
                {   
                    ...form,
                    image: fileList
                },   
                {Authorization: localStorage.getItem("token")}
            )
            dispatch(addOwnProduct(product))
        } catch (error) {
            console.log(error);
        }
        // resetData()
        setisLoading(false)
    }

    const onDeleteProduct = async (id) => {
        try {
            setisLoading(true)
            await request(
                `/api/products/${id}`, 
                'DELETE',
                null,   
                {Authorization: localStorage.getItem("token")}
            )
            dispatch(deleteOwnProduct(products.filter(({_id})=>_id!==id)))
        } catch (error) {
            console.log(error);
        }
        setisLoading(false)
    }

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <div>
            {(!isLoading && isEmpty(products))
            ? <Result
                status="404"
                title="Пусто"
                subTitle="У вас нет товаров"
                extra={<Button onClick={onDrowerOpen} type="primary">Добавить товар</Button>}
              />
            : <div className="products_box">
                <div className="products_box_actions">
                    <Button onClick={onDrowerOpen}>
                        Добавить продукт
                    </Button>
                </div>
                <div className="products_box_items">
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
                    : products.map(({_id:id, count, name, image, price})=>(
                        <Card
                            key={id}
                            hoverable
                            style={{ width: 240 }}
                            cover={
                                <img 
                                    alt="Image" 
                                    style={{
                                        height: "280px"
                                    }}
                                    onClick={()=>navigate(`/card/${id}`)}
                                    src={
                                        prop(0, image) 
                                            ? image[0]
                                            : noneImage
                                    } 
                                />
                            }
                            actions={[
                                <DeleteOutlined onClick={()=>onDeleteProduct(id)} key="setting" />,
                              ]}
                            
                        >
                            <Meta 
                                title={name}  
                                description={
                                    <div className="products_card_params">
                                        <div>
                                            {price} сом
                                        </div>
                                        /
                                        <div>
                                            {count} шт.
                                        </div>
                                    </div>
                                } 
                            />
                        </Card>
                    ))
                }
                </div>
            </div>}


            <Drawer 
                title="Добавить продукт" 
                placement="right" 
                onClose={onDrowerClose} 
                open={form.isOpen}
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
                    <TextArea
                      placeholder="Описание..."
                      autoSize={{ maxRows: 6 }}
                      value={form.description}
                      onChange={setDescriptionValue}
                    />
                    <Select
                      mode="tags"
                      size={"large"}
                      placeholder="Размеры"
                      value={form.sizes}
                      onChange={(e)=>setForm(state=>({
                        ...state, 
                        sizes: e.map(item=>item.toUpperCase())
                      }))}
                    />
                    <Select
                      mode="tags"
                      size={"large"}
                      placeholder="Цветы"
                      value={form.colors}
                      onChange={(e)=>setForm(state=>({
                        ...state, 
                        colors: e.map(item=>item.toUpperCase())
                      }))}
                    />
                    <Select
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
                    />
                    <Upload.Dragger
                        action="http://localhost:5173/"
                        listType="picture"
                        showUploadList={{showRemoveIcon:true}}
                        accept={".jpeg, .png, .jpg"}
                        multiple
                        fileList={fileList}
                        beforeUpload={async f =>{
                            const i=await getBase64(f)
                            setFileList(state=>state.includes(i)?state.filter(item=>item!==i): [...state, i])
                            return f
                        }}
                        defaultFileList={[{
                            uid:"abc",
                            name:"exising_file.png",
                            percent:50,
                            url:"https://www.google.com/"
                        }]}
                        iconRender={(i)=><Image src={i} alt="awd" />}
                        
                        progress={{
                            strokeWidth:3,
                            style:{
                                top:12
                            }
                        }}
                    >
                        <Button>Click</Button>
                    </Upload.Dragger>
                    <Button 
                        type="primary" 
                        disabled={
                            !form.count||
                            !form.name||
                            !form.price||
                            !form.description||
                            isEmpty(fileList)
                        }
                        icon={<PlusOutlined />}
                        onClick={addProduct}
                    >
                        Добавить
                    </Button>
                </div>
            </Drawer>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                  alt="example"
                  style={{
                    width: '100%',
                  }}
                  src={previewImage}
                />
            </Modal>
        </div>
    )
}

export default Products