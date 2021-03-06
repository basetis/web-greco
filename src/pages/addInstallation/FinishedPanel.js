import React, { useState, useEffect } from "react"
import { Card, Button, Row, Col } from 'antd'
import solarPanel from '../../assets/solar-panel.svg'
import { Link } from "react-router-dom"
import axiosConfig from '../../api/axiosConfig'
import './finishedPanel.css'

const FinishedPanel = props => {

    localStorage.setItem("lastPage", localStorage.getItem("actualPage"))
    localStorage.setItem("actualPage", "/finished-panel")

    var access_token = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'))
    var panel = JSON.parse(localStorage.getItem('currentPanelState'))
    var currentPanelId = JSON.parse(localStorage.getItem("currentPanelId"))
    var idPanelfromUpload = JSON.parse(localStorage.getItem("idPanelfromUpload"))
    var idPanelFromPostPanel = JSON.parse(localStorage.getItem("idPanelFromPostPanel"))

    useEffect(() => {
        if (currentPanelId == 0) {
            getSpecificSolarPanel(idPanelFromPostPanel);
        } else {
            getSpecificSolarPanel(idPanelfromUpload);
        }

    }, []);


    function getSpecificSolarPanel(id) {
        axiosConfig
            .get('/solarPanel/' + id,
                {
                    headers: {
                        "Authorization": access_token
                    }
                })
            .then(response => {
                const data = response.data
                localStorage.setItem('myPanel', JSON.stringify(response.data))
                localStorage.removeItem("currentPanelId")
            })
    }

    function addNewPanel() {
        localStorage.setItem('currentPanelId', JSON.stringify(0))
        localStorage.removeItem("currentPanelState")
    }

    return (
        <Row>
            <Card id="card-panel-register-inside">
                <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div>
                        <h2 id="tittle-consgratulations">Congratulations!</h2>
                        <h2 id="tittle-finished-panel"> Your installation has been </h2>
                        {currentPanelId === null || currentPanelId === 0 ?
                            <h2 id="tittle-finished-panel">added</h2> : <h2 id="tittle-finished-panel">updated</h2>}
                        <h2 id="tittle-finished-panel"> successfully</h2>
                    </div>
                </Col>
                <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
                    <img id="solar-panel" src={solarPanel} />
                </Col>
                <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div>
                        <Link id="add-another-installation" to="/first" onClick={addNewPanel}>
                            <p>+ Add another installation</p>
                        </Link>
                    </div>
                </Col>
                <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Link to={
                        {
                            pathname: "/show-panel-details-sider",
                            myPanel: { panel }
                        }
                    }>
                        <Button id="button-panel-finish-next" >
                            SEE YOUR INSTALLATION
                        </Button>
                    </Link>
                </Col>
            </Card>
        </Row>
    )
}

export default FinishedPanel