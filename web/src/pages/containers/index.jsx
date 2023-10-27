import { DeleteOutlined, ShopOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Result, Skeleton } from "antd"
import { useCallback, useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { addContainer, deleteContainer, getContainers } from "../../store/container/actions";
import {  useNavigate } from "react-router-dom";
import { isEmpty, trim } from "ramda";

const loadingArray=[1, 2, 3, 4]

const Containers=()=> {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const { request } = useHttp();
    const dispatch = useDispatch()

    const containers = useSelector(store=>store.containers.container.data)

    const showModal = () => {
      setOpen(true);
    };  

    const handleOk = async() => {
        setOpen(false);
        try {
            setIsLoading(true)
            setAdding(true); 
            const {container} = await request(
                '/api/containers/add', 
                'POST',
                {name:input},   
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(addContainer(container))
        } catch (error) {
            console.log(error);
        }
        setInput("")
        setIsLoading(false)
        setAdding(false); 
    };  

    const handleCancel = () => {
      setOpen(false);
      setInput("")
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await request(
                '/api/containers/', 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(getContainers(data))
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    },
      [dispatch, request],
    )

    useEffect(() => {
        fetchData()
    }, [fetchData]);



    const onDelete=async(id)=>{
        try {
            setIsLoading(true)
            await request(
                `/api/containers/${id}`, 
                'DELETE',
                null,   
                {Authorization: localStorage.getItem("token")}
            );
            dispatch(deleteContainer(containers.filter(({_id})=>_id!==id)))
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    }
    

    const containersComponent= isLoading
   ? loadingArray.map((_, index)=><Skeleton key={`conteiner-loading-${index}`} avatar paragraph={{ rows: 4 }} />)
   : (
        isEmpty(containers)
            ?   <Result
                  status="404"
                  title="Пусто"
                  subTitle="У вас нет магазинов или контейнеров создайте их..."
                  extra={<Button onClick={showModal} type="primary">Добавить магазин</Button>}
                />
            :   containers.map(({name, _id}, index)=> (
                   <div 
                       className="conteiner_box conteiner" 
                       key={`${_id}`+index}
                   >
                       <div 
                           onClick={()=>navigate(`/container/${_id}/products`)} 
                           className="conteiner_box pointer"
                       >
                           <div className="conteiner_icon">
                               <ShopOutlined />
                           </div>
                           <div className="conteiner_title">
                               {name}
                           </div>
                       </div>
                       <div className="conteiner_actions">
                           <Button onClick={()=>onDelete(_id)}>
                               <DeleteOutlined />
                           </Button>
                       </div>
                   </div>
            ))
    )

  return (
    <div>
        <div className="conteiners_default_actions">
            {
                (!isLoading && !isEmpty(containers))&&<div className="conteiners_actions">
                    <Button 
                        onClick={showModal}
                    >
                        Добавить магазин
                    </Button>
                </div>
            }
        </div>
        <div className="conteiners_cards_box">
            {containersComponent}
        </div>

        <Modal
            open={open}
            title="Укажите ваш магазин или контейнер"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button 
                    key="back" 
                    onClick={handleCancel}
                >
                    Отменить
                </Button>,
                <Button 
                    disabled={trim(input)===""} 
                    key="submit" 
                    type="primary" 
                    loading={adding} 
                    onClick={handleOk}
                >
                    Добавить
                </Button>,
            ]}
        >
            <Input
                value={input}
                onChange={e=>setInput(e.target.value)}
                onPressEnter={handleOk}
                size="large" 
                placeholder="Наименование мазина или контейнера" 
                prefix={<ShopOutlined />} 
            />
        </Modal>
    </div>
  )
}

export default Containers