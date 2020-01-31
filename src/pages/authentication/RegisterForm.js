import React from 'react'
import recLogo from '../../assets/rect-logo.png'
import mobileLogo from '../../assets/greco-logo-mobile.png'
import spinner from "../../assets/spinner.svg";
import { Row, Col, Divider, Form, Input, Checkbox } from 'antd'
import { Redirect } from 'react-router-dom'
// import { injectIntl } from 'react-intl'
import './loginForm.css'
import './registerForm.css'
import axiosConfig from '../../api/axiosConfig'

const RegisterForm = (props) => {

  const [data, setData] = React.useState("");
  const [isChecked, setChecked] = React.useState(true)
  const toggle = () => setChecked(!isChecked)

  const handleInputChange = event => {
    setData({ ...data, [event.target.name]: event.target.value });
  }

  const handleFormSubmit = event => {
    event.preventDefault();
    event.persist()
    setData({ ...data, isSubmitting: true, errorMessage: null });

    //POST REGISTER
    var body = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword
    }
    axiosConfig.post("/register", (body),
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem('user', data.username)
          localStorage.setItem('email', data.email)
          activateRedirection()
        }
      })
      .catch(error => {
        if (error.response === undefined)
          // NetWork Error  
          setData({ ...data, isSubmitting: false, errorMessage: error.message });
        else {
          if (error.response.data.status === 403)
            // User already exist
            setData({ ...data, isSubmitting: false, errorMessage: error.response.data.message });
          if (error.response.status === 400)
            //password and confirm password doesn´t match
            setData({ ...data, isSubmitting: false, errorMessage: error.response.data.debugMessage });
        }
      });
  };

  //Redirect
  const [toLocation, setLocation] = React.useState(false);
  function activateRedirection() {
    setLocation(true)
  }

  return (
    <Row>

      <Col span={12} id="col-welcome-container" xs={24} sm={24} md={24} lg={12} xl={12}>
        <Col span={24} id="logo-mobile" xs={24} sm={24} md={24} lg={0} xl={0}>
          <img src={mobileLogo} id="logo-mobile-image" alt="mobile-logo" />
        </Col>
        <div id="inside-welcome-container" >
          <h1 id="welcome-title-text" >
            USER REGISTER
        </h1>
          <Form onSubmit={handleFormSubmit}>
            <div id="input-login-form-fields">
              <Form.Item>
                <label id="label">Username</label>
                <Input placeholder="Username" type="text" name="username" id="username"
                  values={data.username} onChange={handleInputChange}
                  required
                />
              </Form.Item>
              <Divider id="between-inputs" />
              <Form.Item>
                <label id="label">Email</label>
                <Input placeholder="Valid email" type="email" name="email" id="email"
                  values={data.email} onChange={handleInputChange}
                  required
                />
              </Form.Item>
              <Divider id="between-inputs" />
              <Form.Item>
                <label id="label">Password</label>
                <Input type="password" placeholder="Password" name="password" id="password"
                  values={data.password} onChange={handleInputChange}
                  required
                />
              </Form.Item>
              <Divider id="between-inputs" />
              <Form.Item>
                <label id="label">Confirm password</label>
                <Input type="password" placeholder="Confirm password" name="confirmPassword" id="password"
                  values={data.confirmPassword} onChange={handleInputChange}
                  required
                />
                <div id="error-register-message">
                  {data.errorMessage && (<p >{data.errorMessage}</p>)}
                </div>
              </Form.Item>

              <div id="container-checkbox">
                <Checkbox id="checkbox-private-policy"
                  defaultChecked type="checkbox"
                  onChange={toggle}
                >
                  Accept private policy
              </Checkbox>
              </div>
            </div>

            <div id="welcome-button-container">
              {(isChecked) ?
                (
                  <button id="button-register">
                    {data.isSubmitting ? (<img src={spinner} alt="SENDING..." />) : ("REGISTER")}
                    {toLocation ? <Redirect from="/register" to="/complete-register" /> : null}
                  </button>
                ) : (<button id="button-register" disabled>ACCEPT TO REGISTER</button>)
              }
            </div>
          </Form>
        </div>
        <div id="welcome-text-footer-container">
          <h6 id="login-text-footer">&nbsp;&nbsp;</h6>
        </div>
      </Col>
      <Col span={12} id="col-background" xs={0} sm={0} md={0} lg={12} xl={12}>
        <div id="col-background-logo">
          <img src={recLogo} width="96%" height="100%" alt="background-logo" />
        </div>
      </Col>
    </Row>
  )
}

export default RegisterForm;