import { Button, Input, Modal, Table, TreeSelect } from "antd"
import { useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, getCategories } from "../../store/category/actions";
import { propOr } from "ramda";


const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '12%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '30%',
      key: 'address',
    },
  ];

const Categories = () => {
    const { request } = useHttp();
    const dispatch = useDispatch()
    const categoriesStore=useSelector(store=>store.categories.data)
    const [open, setOpen] = useState(false);
    
    const [form, setForm] = useState({
        parent: null,
        name:""
    });

    const onChange = (newValue) => {
        setForm(state=>({...state, parent: newValue}));
    };
    const showModal = () => {
      setOpen(true);
    };
  
    const handleOk = async () => {
        try {
            const data = await request(
                `/api/categories/add`, 
                'POST',
                {
                    ...form,
                    hasChildren: false
                },   
                {Authorization: localStorage.getItem("token")}
            );    
            if(data.parent){
                const setChildren = categoriesStore.map(item=>{
                    if(item._id === data.parent){
                        return {
                            ...item, 
                            hasChildren: true, 
                            children: [...propOr([], "children", item), data],
                        }
                    }
                    return item
                })
                return dispatch(getCategories(setChildren));
            }
            dispatch(addCategory(data))
            
        } catch (error) {
            console.log(error);
        }
        setForm({ parent: null,name: "" });
        setOpen(false);
    };
  
    const handleCancel = () => {
        setOpen(false);
        setForm({ parent: null,name: "" });
    };

    const onExpand = async ({ _id: id }) => {
        try {
            const data = await request(
                `/api/categories/${id}`, 
                'GET',
                null,   
                {Authorization: localStorage.getItem("token")}
            );    
            const setChildren = categoriesStore.map(item=>
                item._id === id
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
        handleCancel(false)
    };

    return (
        <div>
            <Button style={{marginBottom:"1rem"}} type="primary" onClick={showModal}>
                Добавить категорию
            </Button>
            
            <Table
                columns={columns}
                dataSource={categoriesStore.map(item=>({...item, children:propOr([], "children", item).map(child=>({...child, key:child._id}))}))}
                onExpand={(isOpen, item)=> isOpen && onExpand(item)}
            />

            <Modal
                open={open}
                title="Title"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    Отменить
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleOk}>
                    Добавить
                  </Button>,
                ]}
            >
                <TreeSelect
                    treeDataSimpleMode
                    style={{
                      width: '100%',
                      marginBottom:"1rem"
                    }}
                    value={form.parent}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: 'auto',
                    }}
                    allowClear
                    placeholder="Please select"
                    onChange={onChange}
                    loadData={(e) => onExpand({...e,_id:e.id})}
                    treeData={
                        categoriesStore.map(({_id, parent, name})=>({
                            title: name,
                            id: _id,
                            pId: parent,
                            value: _id,
                            isLeaf: true,
                            key: _id,
                        }))
                    }
                />
                <Input 
                    value={form.name}
                    onChange={e=>setForm(state=>({...state, name: e.target.value}))}
                    placeholder="Basic usage"
                 />
            </Modal>
        </div>
    )
}

export default Categories