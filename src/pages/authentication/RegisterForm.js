import React from 'react'
import recLogo from '../../assets/generation-solar-logo.svg'
import mobileLogo from '../../assets/generation-solar-logo.svg'
import spinner from "../../assets/spinner.svg";
import { Row, Col, Form, Input, Checkbox, Button } from 'antd'
// import { injectIntl } from 'react-intl'
import './loginForm.css'
import './registerForm.css'
import axiosConfig from '../../api/axiosConfig'

const RegisterForm = (props) => {

  localStorage.setItem("lastPage", localStorage.getItem("actualPage"))
  localStorage.setItem("actualPage", "/register")

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
          props.history.push("/complete-register")
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

  return (
    <Row id="row-page-cotainer">
      <Col span={12} id="col-welcome-container" xs={24} sm={24} md={24} lg={12} xl={12}>
        <Col span={24} id="welcome-logo-mobile" xs={24} sm={24} md={24} lg={0} xl={0}>
          <Row>
            <img src={mobileLogo} id="welcome-logo-mobile-image" alt="mobile-logo" />
          </Row>
        </Col>
        <div id="inside-register-container" >
          <h1 id="login-title-text" >
            SIGN UP
          </h1>
          <Form onSubmit={handleFormSubmit}>
            <div id="input-login-form-fields">
              <Form.Item>
                <div id="div-register-email-background">
                  <label id="register-label">Username</label>
                  <Input
                    placeholder="Username"
                    type="text"
                    name="username"
                    id="register-username"
                    values={data.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </Form.Item>
              <Form.Item>
                <div id="div-register-email-background">
                  <label id="register-label">Email</label>
                  <Input
                    placeholder="Valid email"
                    type="email"
                    name="email"
                    id="register-email"
                    values={data.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </Form.Item>
              <Form.Item>
                <div id="div-register-email-background">
                  <label id="register-label">Password</label>
                  <Input
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="register-password"
                    values={data.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </Form.Item>
              <Form.Item>
                <div id="div-register-email-background">
                  <label id="register-label">Confirm password</label>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    id="register-confirm"
                    values={data.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div id="error-register-message">
                  {data.errorMessage && (<p >{data.errorMessage}</p>)}
                </div>
              </Form.Item>

              <div id="container-checkbox">
                <Checkbox id="checkbox-private-policy"
                  type="checkbox"
                  onChange={toggle}
                >
                  Accept <a id="link" href="/privacy-policy-sider">private policy</a>
                </Checkbox>
              </div>
            </div>

            <div id="welcome-button-container">
              {(isChecked) ?

                (<Button id="button-register" disabled>ACCEPT TO REGISTER</Button>)
                :
                (
                  <Button id="button-register" onClick={handleFormSubmit}>
                    {data.isSubmitting ? (<img src={spinner} alt="SENDING..." />) : ("SIGN UP")}
                  </Button>
                )


              }
            </div>
          </Form>
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