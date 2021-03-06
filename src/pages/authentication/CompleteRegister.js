import React, { useState } from 'react'
import recLogo from '../../assets/generation-solar-logo.svg'
import solarHouse from '../../assets/solar-house.png'
import mobileLogo from '../../assets/generation-solar-logo.svg'
import { Row, Col, Card, Button } from 'antd'
import { Link } from 'react-router-dom'
import './completeRegister.css'

const CompleteRegister = () => {

  localStorage.setItem("lastPage", localStorage.getItem("actualPage"))
  localStorage.setItem("actualPage", "/complete-register")

  const userName = (localStorage.getItem('user')).toUpperCase();
  localStorage.removeItem("user")

  return (
    <Row>
      <Card>
        <Col span={24} id="logo-mobile" xs={24} sm={24} md={24} lg={0} xl={0}>
          <img src={mobileLogo} id="logo-mobile-image" alt="mobile-logo" />
        </Col>
        <Col id="col-welcome-container" span={24} xs={24} sm={24} md={24} lg={12} xl={12}>
          <div id="inside-complete-container">
            <h1 id="title-register-complete" >
              {"WELL DONE! " + userName + ", YOU´RE ALREADY REGISTERED!"}
            </h1>
            <div id="col-solar-image">
              <img id="solar-image" src={solarHouse} />
            </div>
            <div id="text-register-complete">
              <h4>You are already part of this great community. You only have one last step left to finish the process</h4>
            </div>
            <Link to="/login">
              <Button id="button-register-complete">
                NEXT
            </Button>
            </Link>
          </div>
        </Col>
        <Col span={24} id="col-background" xs={0} sm={0} md={0} lg={12} xl={12}>
          <div id="col-background-logo">
            <img src={recLogo} alt="logo" id="background-logo" />
          </div>
        </Col>
      </Card>
    </Row >
  )
}

export default CompleteRegister