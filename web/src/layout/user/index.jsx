import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Drawer, Dropdown, Input, Layout, Menu, theme } from 'antd';
import { 
    AppstoreOutlined, 
    SearchOutlined, 
    ShoppingCartOutlined, 
    ShoppingOutlined, 
    UserOutlined
} from '@ant-design/icons';

import { isMobile } from '../../configs/utils';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth/actions';
import PT from "prop-types";

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isEmpty, isNil, prop, propOr, trim } from 'ramda';
import { useHttp } from '../../hooks/http.hook';
import { getBuskets } from '../../store/busket/actions';
import { getCategories, getCategoryChilds } from '../../store/category/actions';
import { getSearch, productSearching } from '../../store/product/actions';
import BreadcrumbComponent from '../../components/Breadcrumb';

import "./index.css";
import styles from "./index.module.scss";

const { Header, Content, Sider } = Layout;

const Layout_ = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { request } = useHttp();
    const {pathname} = useLocation()
    const {search} = useLocation()
    const params=Object.fromEntries(new URLSearchParams(search).entries())
    const authStore = useSelector(store=>store.auth)
    // const {isLoading: categoryIsLoading, data:{category}} = useSelector( store => store.product.category )
    const categories=useSelector(store=>store.categories.data)
    const categoryChilds=useSelector(store=>store.categories.categoryChilds)
    
    const busketRerender = useSelector(store=>store.busket.rerender)
    const role = useSelector(store=>store.auth.role)
    const busketCount = useSelector(store=>store.busket.count)

    const [collapsed, setCollapsed] = useState(true);
    const [open, setOpen] = useState({parent:false, child:false});
    console.log(open);
    const [searchInput, setSearchInput] = useState(params.search);

    const onChangeProfileItem = useCallback(( e ) => {
        setSearchInput("")
        navigate(e)
    }, [navigate])

    const profileItem = useMemo(() =>  isNil(propOr(null, "token", authStore))
    ? [
        {
            key: 'exit_button',
            label: isNil(propOr(null, "token", authStore))
            ? <div onClick={()=>navigate("/login")}>Войти</div>
            :(
              <div onClick={()=>dispatch(logout())}> Выход </div>
            ),
        },
    ]:[
            {
                key: 'products',
                label: (<div onClick={()=>onChangeProfileItem("/containers")}> Магазин </div>),
            },
            {
                key: 'profile',
                label: (
                  <div onClick={()=>onChangeProfileItem("/profile")}> Профиль </div>
                ),
            },
            {
                key: 'exit_button',
                label: isNil(propOr(null, "token", authStore))
                ? <div onClick={()=>navigate("/login")}>Войти</div>
                :(
                  <div onClick={()=>dispatch(logout())}> Выход </div>
                ),
            },
        ], 
        [authStore, onChangeProfileItem, navigate, dispatch]
    )

    const {
      token: { colorBgContainer, colorPrimary },
    } = theme.useToken();

    const categoryId =  prop(2, pathname.split("/"))
    const defaultSelectedKeys = categoryId ? [categoryId] : []

    const onSearch= async ({target}) => {
        const {value} = target
        if(trim(value)){
           navigate(`/?search=${value}`)
           setCollapsed(true)

           try {
                dispatch(productSearching(true))
                const srachData = await request(
                    `/api/products/search?q=${value}`, 
                    'GET',
                    null,
                    {Authorization: localStorage.getItem("token")}
                );

                dispatch(getSearch(srachData));
            } catch (error) {
                console.log(error);
            }
            dispatch(productSearching(false))
           return 
        }
        navigate(`/`)

     
    }

    const onChangeMenuItem=({key})=>{
        setSearchInput("")
        navigate(`/category/${key}`)
        setCollapsed(state=>!state)
    }

    const fetchBusket=useCallback(async()=>{
        try {
            const busket = await request(
                `/api/busket/`, 
                'GET',
                null,
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(getBuskets(busket));
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, request])

    const fetchCategories = useCallback(async () => {
        try {
            const data = await request(
                `/api/categories/`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(getCategories(data));
        } catch (error) {
            console.log(error);
        }
    },
      [dispatch, request],
    )
    
    const fetchCategoriesChild = useCallback(async () => {
        try {
            const data = await request(
                `/api/categories/product-create-halper`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")}
            );

            dispatch(getCategoryChilds(data));
        } catch (error) {
            console.log(error);
        }
    },
      [dispatch, request],
    )

    useEffect(() => {
        fetchBusket()
        fetchCategories()
        fetchCategoriesChild()
    }, [
        dispatch, 
        fetchCategories, 
        fetchCategoriesChild, 
        busketRerender, 
        request, 
        role, 
        fetchBusket
    ])
    
    const expandedCategory = async (arr) => {
        if(!isEmpty(arr)){
            try {
                const setChildren = categories.map(item=> (
                    arr.includes(item._id)
                        ? {
                            ...item, 
                            children: categoryChilds
                                .filter(({parent})=>item._id===parent),
                        }
                        : item
                ))

                dispatch(getCategories(setChildren));
            } catch (error) {
                console.log(error);
            }
        }
    }



    return (
        <Layout style={{margin:0}}>
            <Layout style={{overflowY:"scroll"}}>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        position:"sticky",
                        top:"0",
                        right:"0",
                        zIndex:10
                    }}
                >
                    <div className='user_layout_header'>
                        <div className='user_layout_header_block'>
                            {!isMobile && <Button 
                                className='blue_button'
                                onClick={()=>setOpen(state=>({...state, parent:true}))}
                                icon={<AppstoreOutlined />} 
                                size={"large"} 
                            />}
                            <Link
                                to={"/"}
                                style={{ color: colorPrimary }}
                                id='logo'
                                className='user_layout_header_title'
                                onClick={()=>setCollapsed(true)}
                            >
                                <ShoppingOutlined 
                                    className='user_layout_header_title_icon'
                                />
                                Sooda
                            </Link>
                        </div>
                        {!isMobile &&<div className='user_layout_header_search'>
                            <Input 
                                prefix={<SearchOutlined />} 
                                placeholder="Я ищу..." 
                                value={searchInput}
                                onChange={e=>setSearchInput(e.target.value)}
                                onPressEnter={onSearch}
                            />
                        </div>}
                        <div className='user_layout_header_accounts'>
                            <Dropdown
                                trigger={['click']}
                                menu={{
                                  items: profileItem
                                }}
                            >
                                <Button 
                                    icon={<UserOutlined />} 
                                    size={"large"} 
                                />
                            </Dropdown>
                            <Link to="/busket">
                                <Badge count={busketCount}>
                                    <Button 
                                        icon={<ShoppingCartOutlined />} 
                                        size={"large"} 
                                    />
                                </Badge>
                            </Link>
                        </div>
                    </div>
                </Header>
                
                <Content>
                    <div className={styles.breadcrumbBox}>
                        <BreadcrumbComponent />
                    </div>
                    <div
                        className={styles.userLayoutContentBox}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        {children} 
                    </div>
                    <div style={{height:"10px"}}/>
                </Content>
                <Drawer
                  title={`Категории`}
                  placement="left"
                  
                  size={"default"}
                  onClose={()=>setOpen(state=>({...state, parent:false}))}
                  open={open.parent}
                >
                        
                    <Button onClick={()=>setOpen(state=>({...state, child:true}))}>
                        awd
                    </Button>
                    <Drawer
                      title={`Подкатегории`}
                      placement="left"
                      size={"large"}
                      onClose={()=>setOpen(state=>({...state, child:false}))}
                      open={open.child}
                    >
                        dawdwa
                    </Drawer>
                </Drawer>
            </Layout>
            
        </Layout>
    )
}

Layout_.propTypes = {
    children: PT.element, 
}

export default Layout_
