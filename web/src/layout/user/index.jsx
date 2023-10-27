import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Dropdown, Input, Layout, Menu, Skeleton, theme } from 'antd';
import { 
    AppstoreOutlined, 
    MessageOutlined, 
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
import { isEmpty, prop, trim, uniq } from 'ramda';
import { useHttp } from '../../hooks/http.hook';
import { getBuskets } from '../../store/busket/actions';
import { getCategories, getCategoryChilds } from '../../store/category/actions';
import { getSearch, productSearching } from '../../store/product/actions';

import "./index.css";

const { Header, Content, Sider } = Layout;

const Layout_ = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { request } = useHttp();
    const {pathname} = useLocation()
    const {search} = useLocation()
    const params=Object.fromEntries(new URLSearchParams(search).entries())
    
    const {isLoading: categoryIsLoading, data:{category}} = useSelector( store => store.product.category )
    const categories=useSelector(store=>store.categories.data)
    const categoryChilds=useSelector(store=>store.categories.categoryChilds)
    
    const busketRerender = useSelector(store=>store.busket.rerender)
    const role = useSelector(store=>store.auth.role)
    const busketCount = useSelector(store=>store.busket.count)

    const [collapsed, setCollapsed] = useState(true);
    const [searchInput, setSearchInput] = useState(params.search);
    const [isOpened, setIsOpened] = useState([]);

    const onChangeProfileItem = useCallback(( e ) => {
        setSearchInput("")
        navigate(e)
    }, [navigate])

    const profileItem = useMemo(() =>  [
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
                label: (
                  <div onClick={()=>dispatch(logout())}> Выход </div>
                ),
            },
        ], 
        [ onChangeProfileItem, dispatch]
    )

    const {
      token: { colorBgContainer, colorPrimary },
    } = theme.useToken();

    const categoryId =  prop(2, pathname.split("/"))
    const defaultSelectedKeys = categoryId ? [categoryId] : []

    const onSearch= async ({target}) => {
        const {value} = target
        if(trim(value)){
           navigate(`/home?search=${value}`)
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
        navigate(`/home`)

     
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
        setIsOpened(state=>uniq([...state,...arr]))
    }

    const categoryTitle=useMemo(() => (
        pathname.split("/")[1]==="category" 
            ? categoryIsLoading 
                ? <Skeleton.Input />
                : prop("name", category) 
                    && <div 
                        style={{
                            padding: "0 24px",
                            marginBottom: "1rem"
                        }}
                    >
                        {prop("name", category)}
                    </div>
            : null
        ), 
    [category, categoryIsLoading,  pathname])     

    return (
        <Layout style={{margin:0}}>
            <Sider
                collapsed={collapsed} 
                onCollapse={(value) => setCollapsed(value)}
                collapsedWidth="0"
                breakpoint={isMobile && "xxl"}
            >
                <Menu 
                    defaultSelectedKeys={defaultSelectedKeys} 
                    selectedKeys={defaultSelectedKeys}
                    onSelect={onChangeMenuItem}
                    mode="inline" 
                    // items={items} 
                    onOpenChange={expandedCategory}
                    items={categories.map(item=>{
                        if(prop("children", item) && prop("hasChildren", item)){
                            return ({
                                key: item._id, 
                                children:  item.children.map(item=>({
                                        key:item._id, 
                                        label:item.name,
                                    })), 
                                label: item.name,
                            })
                        }
                        return ({
                            key: item._id, 
                            label: item.name,
                        })
                    })} 
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <div className='user_layout_header'>
                        <div className='user_layout_header_block'>
                            {!isMobile && <Button 
                                className='blue_button'
                                onClick={() => setCollapsed(state=>!state)}
                                icon={<AppstoreOutlined />} 
                                size={"large"} 
                            />}
                            <Link
                                to={"/home"}
                                style={{ color: colorPrimary }}
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
                            <Link to="/chat">
                                <Badge count={busketCount}>
                                    <Button 
                                        icon={<MessageOutlined />} 
                                        size={"large"} 
                                    />
                                </Badge>
                            </Link>
                            
                        </div>
                    </div>
                </Header>
                
                <Content
                    style={{
                      margin: '24px 16px 0',
                      overflowY: "scroll",
                      maxHeight: "90%",
                      borderRadius:"10px"
                    }}
                >
                    {categoryTitle}
                    <div
                        className="user_layout_content_box"
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        {children} 
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

Layout_.propTypes = {
    children: PT.element, 
}

export default Layout_
