import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';

import "./index.css";
import { Link } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { login } from '../../store/auth/actions';

const Login = () => {
  const {  request } = useHttp();
  const dispatch = useDispatch()
  const onFinish = async (registerData) => {
    try {
      const data = await request('/api/auth/login', 'POST', {
        ...registerData,
      });
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      dispatch(login(data))
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='login_conteiner'>
      <div className='login_box'>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Введитe email!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Введите пароль!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Зайпомнить меня</Checkbox>
            </Form.Item>
          
            <a className="login-form-forgot" href="">
              Забыл пароль
            </a>
          </Form.Item>
          
          <Form.Item>
            <div className='login_button_box'>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Войти
              </Button>
              <span>
                <Link to="/registration">Зарегистрироваться!</Link>
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login;