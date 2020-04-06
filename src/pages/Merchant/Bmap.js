/**
 * Created by XM on 2018/9/3.
 * @email xm@tqzgc.com
 */
import React, { Component } from 'react';
import { Input, Button, Select } from 'antd';

/*
const locationIcon = {
  url: 'http://api0.map.bdimg.com/images/copyright_logo.png',
  size: { width: 100, height: 100 },
};
*/
const { Option } = Select;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { area: [], value: '' };
    this.setMapRef = ref => {
      this.mapContainer = ref;
    };
  }

  componentDidMount() {
    this.createMapScript().then(this.initMap);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value) {
      return;
    }
    if (this.inited) return;
    if (!this.mapLoaded) return;
    // console.log(nextProps.value, this.props.value)
    const { value } = nextProps;
    const { point: position = { lng: undefined, lat: undefined } } = value;
    const { point: prePosition = { lng: undefined, lat: undefined } } = this.props.value || {};

    if (position.lng && position.lat && !prePosition.lng && !prePosition.lat) {
      // console.log(position)
      const point = new global.BMap.Point(position.lng, position.lat);
      this.map.panTo(point);
      if (this.marker) {
        this.marker.setPosition(point);
      } else {
        this.marker = new global.BMap.Marker(point);
        this.map.addOverlay(this.marker);
      }
      this.inited = true;
    }
  }

  shouldComponentUpdate() {
    return !this.inited;
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.removeEventListener('click', this.onMapClick);
      this.map = null;
    }
  }

  onMapClick = event => {
    const { point } = event;
    // this.setState({ mapCenter: { lng: point.lng, lat: point.lat } });
    this.setLocal(point);
  };

  setLocal = (point, title, address) => {
    const { onChange } = this.props;

    this.map.panTo(new global.BMap.Point(point.lng, point.lat));
    if (this.marker) {
      this.marker.setPosition(point);
    } else {
      this.marker = new global.BMap.Marker(point);
    }
    this.map.addOverlay(this.marker);
    if (title) {
      var opts = {
        width: 220, // 信息窗口宽度
        height: 80, // 信息窗口高度
        title,
      };
      var infoWindow = new global.BMap.InfoWindow(address, opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, this.map.getCenter());
    }
    const myGeo = new global.BMap.Geocoder();
    myGeo.getLocation(point, result => {
      if (onChange) onChange(result, title);
    });
  };
  onSearch = value => {
    let that = this;
    if (!this.localSearch) {
      this.localSearch = new global.BMap.LocalSearch(this.map, {
        renderOptions: { map: this.map },
        onSearchComplete: results => {
          if (results && results.Uq) {
            that.setState({ area: results.Uq });
            that.forceUpdate();
          }
        },
      });
    }
    this.localSearch.search(value);
  };

  onClear = () => {
    if (this.localSearch) {
      this.localSearch.clearResults();
    }
  };

  setCity = (city, zoom) => {
    this.map.setCenter(city);
    if (zoom) this.map.setZoom(zoom);
  };

  initMap = BMap => {
    // this.defaultCenter = getPoint(116.404, 39.915);
    // this.mapContainer = this.mapContainer || this.mapContainerRef.current;
    const { value } = this.props;
    const { point: position } = value || {};

    // console.log(this.props)

    const map = new BMap.Map(this.mapContainer, { enableMapClick: false });
    if (Object.keys(map).length === 0) return;
    map.enableScrollWheelZoom();
    const point = new BMap.Point(
      (position && position.lng) || 116.404,
      (position && position.lat) || 39.915,
    );
    // console.log(point)
    map.centerAndZoom(point, 15);
    map.setDefaultCursor('pointer');

    map.addControl(new BMap.OverviewMapControl({ isOpen: true, size: new BMap.Size(140, 110) }));
    // map.addControl(new BMap.NavigationControl({type: global.BMAP_NAVIGATION_CONTROL_ZOOM}));
    map.addControl(new BMap.NavigationControl());

    // console.log(value);

    // map.addEventListener('tilesloaded', ()=>{
    // });
    if (position && position.lng && position.lat) {
      this.marker = new BMap.Marker(point);
      map.addOverlay(this.marker);
    } else {
      const myCity = new BMap.LocalCity();
      myCity.get(result => {
        // console.log(result)
        map.setCenter(result.name);
      });
    }
    map.addEventListener('click', this.onMapClick);

    this.map = map;
    this.mapLoaded = true;
  };

  createMapScript = () => {
    const ak = 'CXS6PvbOPD5DlrV5xdolrG9V9uGyaCX3';

    window.BMap = window.BMap || {};
    if (Object.keys(window.BMap).length === 0) {
      window.BMap.b_preload = new Promise(resolve => {
        const $script = document.createElement('script');
        document.body.appendChild($script);
        window.b_initBMap = () => {
          resolve(window.BMap);
          document.body.removeChild($script);
          window.BMap.b_preload = null;
          window.b_initBMap = null;
        };

        $script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=b_initBMap`;
      });
      return window.BMap.b_preload;
    }

    if (!window.BMap.b_preload) {
      return Promise.resolve(window.BMap);
    }
    return window.BMap.b_preload;
  };

  handleChange = i => {
    let { area } = this.state;
    let value = area[Number(i)];
    this.setState({ value: value.title });
    this.forceUpdate();
    this.setLocal(value.point, value.title, value.address);
  };

  render() {
    const { width = '100%', height = 400, style } = this.props;
    const options =
      this.state.area &&
      this.state.area.length &&
      this.state.area.map((d, i) => <Option key={i}>{d.title}</Option>);

    return (
      <div style={{ border: 'solid 1px #e1e1e1', marginBottom: 16, borderRadius: 5 }}>
        <div>
          {/*<Input.Search*/}
          {/*enterButton="查询"*/}
          {/*size="small"*/}
          {/*style={{ width: '50%', minWidth: 240, marginBottom: 8, marginTop: 8, marginLeft: 8 }}*/}
          {/*onSearch={this.onSearch}*/}
          {/*/>*/}
          {/*<Button type="dashed" size="small" style={{ marginLeft: 8 }} onClick={this.onClear}>*/}
          {/*清除*/}
          {/*</Button>*/}
          <Select
            showSearch
            value={this.state.value}
            placeholder={'查询地址'}
            style={{ width: 200 }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.onSearch}
            onChange={this.handleChange}
            notFoundContent={null}
          >
            {options}
          </Select>
        </div>
        <div ref={this.setMapRef} style={{ width, height, ...style }} />
      </div>
    );
  }
}
