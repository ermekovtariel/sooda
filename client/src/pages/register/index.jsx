import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
} from 'antd';

import "./index.css";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../store/auth/actions';
import { useHttp } from '../../hooks/http.hook';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const Registration = () => {
  const dispatch = useDispatch()
  const {  request } = useHttp();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const data = await request('/api/auth/register', 'POST', {
        ...values,
      });
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      dispatch(register(data))
    } catch (e) {
      console.error(e);
    }
    
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="996">996</Option>
      </Select>
    </Form.Item>
  );
  
  return (
    <div className='login_conteiner'>
        <div className='login_box'>
            <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '996',
              }}
              style={{
                maxWidth: 600,
              }}
              scrollToFirstError
            >
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: 'email',
                    message: 'Введите коректный E-mail!',
                  },
                  {
                    required: true,
                    message: 'Введите ваш E-mail!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            
              <Form.Item
                name="password"
                label="Пароль"
                rules={[
                  {
                    required: true,
                    message: 'Введите пароль!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
            
              <Form.Item
                name="confirm"
                label="Пароль"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Повторно введите пароль!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Введён некоректный пароль!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            
              <Form.Item
                name="phone"
                label="Номер тел."
                rules={[
                  {
                    required: true,
                    message: 'Введите номер телефона!',
                  },
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
              
              <Form.Item
                name="gender"
                label="Пол"
                rules={[
                  {
                    required: true,
                    message: 'Введите ваш пол!',
                  },
                ]}
              >
                <Select placeholder="Введите ваш пол">
                  <Option value="male">Мужской</Option>
                  <Option value="female">Женский</Option>
                </Select>
              </Form.Item>

              {/* <Form.Item
                name="role"
                label="Роль"
                rules={[
                  {
                    required: true,
                    message: 'Выберите роль!',
                  },
                ]}
              >
                <Select placeholder="Выберите роль">
                  <Option value="user">Покупатель</Option>
                  <Option value="seller">Продавец</Option>
                </Select>
              </Form.Item> */}
            
                  
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Согласитесь с правилами пользования сервисом')),
                  },
                ]}
                {...tailFormItemLayout}
              >
                <Checkbox>
                   Я согласен с <a href="">правилами сервиса</a>
                </Checkbox>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <div className='login_button_box'>
                    <Button type="primary" htmlType="submit">
                      Зарегистрироваться
                    </Button>
                    <span>
                        <Link to="/login">Имеется аккаует!</Link>
                    </span>
                </div>
              </Form.Item>
            </Form>
        </div>
    </div>
  );
};
export default Registration;