import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button, Row, Col, Divider, Tooltip, Icon } from 'antd';
import spinner from "../../assets/spinner.svg";
import noImage from '../../assets/solar-panel.svg';
import 'leaflet/dist/leaflet.css';
import './Mapping.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Header from '../../header/Header';
import axiosConfig from '../../api/axiosConfig'
import { Link } from 'react-router-dom'

const PanelImage = ({ imageUrl }) => {
  switch (imageUrl) {
    case null: {
      return <img src={spinner} alt="LOADING..." />;
    }
    case 'no-image': {
      return <img
        src={noImage}
        alt="image"
        id="public-private-mapping-no-image-panel"
      />
    }
    default: {
      return (
        <img
          src={imageUrl}
          alt="image"
          id="public-private-mapping-panel-image"
        />
      );
    }
  }
};

const PrivateMapping = () => {

  const access_token = 'Bearer ' + JSON.parse(localStorage.getItem('access_token'))

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  const initMarker = ref => {
    if (ref) {
      ref.leafletElement.openPopup()
    }
  }

  const [panels, setPanels] = useState([])
  const [individualPanel, setIndividualPanel] = useState({});
  const [imageUrl, setImageUrl] = useState();

  //GET ALL PANELS
  useEffect(() => {
    axiosConfig
      .get('/solarPanel/getAllSolarPanel')
      .then(response => {
        setPanels(response.data);
      });
  }, []);

  //GET ESPECIFIC SOLAR PANEL
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
        setIndividualPanel({ ...data });
      })
  }

  //GET PANEL IMAGE
  function getImage(id) {
    axiosConfig({
      url: '/multimedia/' + id + '/getImage/',
      method: 'GET',
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setImageUrl(url);
    });
  }

  //GIVE LIKE
  const giveLike = (id) => {
    var body
    axiosConfig
      .post("/like/givelike/" + id, body,
        {
          headers: {
            "Authorization": access_token
          }
        })
      .then(response => {
        setIndividualPanel({
          likes: response.data.numberOfLikes,
          liked: response.data.liked
        });

      });
  }
  return (
    <React.Fragment>
      <Header />
      <div className="leaflet-container">
        <LeafletMap
          style={{ height: '94vh' }}
          center={[50, 10]}
          zoom={4}
          maxZoom={18}
          attributionControl={true}
          zoomControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={true}
          easeLinearity={0.35}
        >
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {panels.map((panel, id) => (
            <Marker key={id} position={[panel.lat, panel.lon]}
              onClick={() => {
                console.log("Panel", individualPanel)
                getSpecificSolarPanel(panel.id)
                if (panel.multimedia && panel.multimedia.length > 0) {
                  console.log('img exist with id: ', panel.multimedia[0].id);
                  getImage(panel.multimedia[0].id);
                } else {
                  console.log('img not exist');
                  setImageUrl('no-image');
                }
              }}
            >
              <Popup >
                <span>
                  <Tooltip title="Like" id="tooltip-like">
                    <Icon style={{ fontSize: '16px', color: '#c3c3c3' }}
                      type="like"
                      theme={individualPanel.liked ? 'twoTone' : 'outlined'}
                      onClick={() => {
                        giveLike(panel.id)
                      }}
                      id="like-icon" />
                  </Tooltip>
                  <p id={individualPanel.liked ? "text-likes-checked" : "text-likes"}>likes:</p>
                  <p id={individualPanel.liked ? "number-likes-checked" : "number-likes"}>{individualPanel.likes}</p>
                </span>
                <div id="public-private-mapping-popup">
                  <Row>
                    <Col span={24} id="public-private-mapping-installation-name">
                      <p>{panel.installationName}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div id="container-img">
                        <PanelImage imageUrl={imageUrl} />
                      </div>
                    </Col>
                  </Row>
                  <Divider id="divider-mapping-top" />
                  <Row id="public-private-mapping-text-fields">
                    <Col span={8}>
                      <h5 id="public-private-mapping-data-labels">
                        Electrical capacity
                      </h5>
                      <h3 id="public-private-mapping-data-fields">
                        {panel.electrical_capacity} Kw
                      </h3>
                    </Col>
                    <Col span={8}>
                      <h5 id="public-private-mapping-data-labels">
                        Surface
                      </h5>
                      <h3 id="public-private-mapping-data-fields">
                        {panel.surface} Kw
                      </h3>
                    </Col>
                    <Col span={8}>
                      <h5 id="public-private-mapping-data-labels">
                        Inverter capacity
                      </h5>
                      <h3 id="public-private-mapping-data-fields">
                        {panel.inverterCapacity} Kw
                      </h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Link to={
                        {
                          pathname: "/show-panel-details",
                          myPanel: { panel }
                        }
                      }>
                        <Button id="mapping-button-left">
                          + info
                    </Button>
                      </Link>
                    </Col>
                    <Col span={12}>
                      <Link to={
                        {
                          pathname: "/feed-panel",
                          // pathname: `/feed-panel/${panel.id}`,
                          myPanel: { panel }
                        }
                      }>
                        <Button id="mapping-button-right">
                          Feed
                    </Button>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Popup>
            </Marker>
          ))}
        </LeafletMap>
      </div>
    </React.Fragment >
  )
}

export default PrivateMapping;