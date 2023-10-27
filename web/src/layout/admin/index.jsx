import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Dropdown, Input, Layout, Menu, theme } from 'antd';
import { 
    AppstoreOutlined, 
    SearchOutlined, 
    ShoppingCartOutlined, 
    ShoppingOutlined, 
    UserOutlined
} from '@ant-design/icons';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isEmpty, isNil, prop, propOr, trim, uniq } from 'ramda';
import { useHttp } from '../../hooks/http.hook';
import { getBuskets } from '../../store/busket/actions';
import { getCategories } from '../../store/category/actions';
import { getSearch, productSearching } from '../../store/product/actions';

import { isMobile } from '../../configs/utils';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth/actions';
import PT from "prop-types";

import "./index.css";



const { Header, Content, Sider } = Layout;

const Layout_ = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { request } = useHttp();
    const {pathname} = useLocation()
    const {search} = useLocation()
    const params = Object.fromEntries(new URLSearchParams(search).entries())
    
    const categories=useSelector(store=>store.categories.data)
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

    

    const profileItem =[
        {
            key: 'products',
            label: (<div onClick={()=>onChangeProfileItem("/containers")}> Магазин </div>),
        },
        {
            key: 'categories',
            label: (
              <div onClick={()=>onChangeProfileItem("/categories")}> Категория </div>
            ),
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
    ]   

    const {
      token: { colorBgContainer, colorPrimary },
    } = theme.useToken();

    const categoryId =  prop(2, pathname.split("/"))
    const defaultSelectedKeys = categoryId ? [categoryId] : []

    const categoryTitle = propOr(
        null,
        "name", 
        categories
            .map(item=>[item, ...propOr([], "children", item)])
            .flat()
            .find(({_id}) => _id === categoryId)
    )
    

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

    useEffect(() => {
        fetchBusket()
        fetchCategories()
    }, [dispatch, fetchCategories, busketRerender, request, role, fetchBusket])
    
    const expandedCategory = async (arr) => {
        const ids = arr.filter(id => !isOpened.includes(id)) 
        if(!isEmpty(ids)){
            try {
                const data = await request(
                    `/api/categories/${prop(0, ids)}`, 
                    'GET',
                    null,   
                    {Authorization: localStorage.getItem("token")}
                );    
                const setChildren = categories.map(item=>
                    item._id === prop(0, ids)
                        ? {
                            ...item, 
                            children: data,
                        }
                        : item
                )
                dispatch(getCategories(setChildren));
            } catch (error) {
                console.log(error);
            }
        }
        setIsOpened(state=>uniq([...state,...arr]))
    }

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
                    {!isNil(categoryTitle)
                        &&<div 
                            style={{
                                padding: "0 24px",
                                marginBottom: "1rem"
                            }}
                        >
                        {categoryTitle}
                        </div>
                    }
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
