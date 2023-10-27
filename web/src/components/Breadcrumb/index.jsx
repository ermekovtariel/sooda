import { useEffect, useState } from 'react'
import { Breadcrumb } from 'antd'
import { length, uniq } from 'ramda'
import { Link, useLocation } from 'react-router-dom'

import styles from "./index.module.scss";
import { useSelector } from 'react-redux';

const BreadcrumbComponent = () => {
    const {pathname} = useLocation()
    const categoryChilds = useSelector(store=>store.categories.categoryChilds)
    const [urls, setUrls] = useState(["/home"])

    useEffect(() => {
        if(pathname === "/home"){
            return setUrls(["/home"])
        }
        if(pathname.includes("/category")){
            setUrls(["/home", pathname])
        }
        if(pathname.includes("/busket")){
            setUrls(["/home", pathname])
        }
        if(pathname.includes("/containers")){
            setUrls(["/home", pathname])
        }
        if(pathname.includes("/profile")){
            setUrls(["/home", pathname])
        }
        setUrls(state=>uniq([...state, pathname]))
    }, [pathname])

    return (
        <Breadcrumb
          items={
            length(urls)>1?
            urls.map(item=>{
                let name=""
                if(item.includes("/card")){
                    name = `Артикул ${item.split("/").filter(item=>item)[1]}`
                }
                if(item.includes("/home")){
                    name = `Главная`
                }
                if(item.includes("/category")){
                    const {name:categoryName}=categoryChilds.find(({_id})=>_id===item.split("/").filter(item=>item)[1])
                    name = `Категория ${categoryName}`
                }
                
                if(item.includes("/container/")){
                    name = `Магазин ${item.split("/").filter(item=>item)[1]}`
                }
                if(item.includes("/containers")){
                    name = `Магазины`
                }
                if(item.includes("/profile")){
                    name = `Профиль`
                }
                
                return ({
                    title: item===pathname
                    ?(
                        <span className={styles.activeBreadCrumb}>
                            {name}
                        </span>
                    ):(
                        <Link to={item}>
                            <span className={styles.breadCrumb}>{name}</span>
                        </Link>
                    )
                })
            })
            :[]
          }
        />
    )}  

export default BreadcrumbComponent