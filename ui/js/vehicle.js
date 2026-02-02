/* global AMap, echarts, $ */
let vehicleMap;
let markers = new Map();
let vehicleCache = [];
let selectedVin = '';
let speedChart;
let batteryChart;

function initMap() {
  vehicleMap = new AMap.Map('vehicle-map', {
    zoom: 12,
    center: [116.397428, 39.90923],
    mapStyle: 'amap://styles/darkblue',
  });
  vehicleMap.addControl(new AMap.Scale());
  vehicleMap.addControl(new AMap.ToolBar({ position: 'RB' }));
}

function initCharts() {
  speedChart = echarts.init(document.getElementById('speed-chart'));
  batteryChart = echarts.init(document.getElementById('battery-chart'));

  const baseOption = {
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#4c6a8a' } },
      axisLabel: { color: '#8fb9d6' },
      data: []
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4c6a8a' } },
      axisLabel: { color: '#8fb9d6' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: { color: '#20dbfd' },
      areaStyle: { color: 'rgba(32,219,253,0.15)' }
    }]
  };

  speedChart.setOption(baseOption);
  batteryChart.setOption(baseOption);
}

function updateSummary(summary) {
  $('#total-vehicles').text(summary.totalVehicles || 0);
  $('#online-vehicles').text(summary.onlineVehicles || 0);
  $('#avg-speed').text((summary.avgSpeed || 0).toFixed(1) + ' km/h');
  $('#avg-battery').text((summary.avgBattery || 0).toFixed(1) + '%');
  $('#total-mileage').text((summary.totalMileage || 0).toFixed(2) + ' km');
  if (summary.lastUpdated) {
    $('#last-updated').text('数据更新时间：' + summary.lastUpdated);
  }
}

function updateStatusCounts(vehicles) {
  let online = 0;
  let charging = 0;
  let fault = 0;
  let idle = 0;
  vehicles.forEach(v => {
    if (v.powerState) {
      online += 1;
      if (v.speed === 0 || v.speed === '0') {
        idle += 1;
      }
    }
    if (v.chargingStatus === 1) {
      charging += 1;
    }
    if (v.faultStatus === 1) {
      fault += 1;
    }
  });
  $('#online-vehicles').text(online);
  $('#charging-vehicles').text(charging);
  $('#fault-vehicles').text(fault);
  $('#idle-vehicles').text(idle);
}

function renderVehicleList(vehicles) {
  const $list = $('#vehicle-list');
  $list.empty();
  if (!vehicles.length) {
    $list.append('<div class="vehicle-item">暂无车辆数据</div>');
    return;
  }
  vehicles.forEach(v => {
    const isActive = v.vin === selectedVin ? 'active' : '';
    const html = `
      <div class="vehicle-item ${isActive}" data-vin="${v.vin}">
        <div class="vin">${v.vin}</div>
        <div class="meta">${v.parkName || '--'} | 电量 ${v.realBattery ?? '--'}%</div>
      </div>`;
    $list.append(html);
  });
  $list.find('.vehicle-item').on('click', function () {
    const vin = $(this).data('vin');
    selectedVin = vin;
    renderVehicleList(vehicleCache);
    const selected = vehicleCache.find(v => v.vin === vin);
    if (selected) {
      updateDetailPanel(selected);
      focusMarker(selected);
    }
  });
}

function renderParkList(stats) {
  const $list = $('#park-list');
  $list.empty();
  if (!stats || stats.length === 0) {
    $list.append('<div class="park-item"><span>暂无数据</span><span>0</span></div>');
    return;
  }
  stats.forEach(item => {
    const name = item.parkName || item.parkCode || '--';
    $list.append(`<div class="park-item"><span>${name}</span><span>${item.count}</span></div>`);
  });
}

function updateDetailPanel(v) {
  $('#detail-vin').text(v.vin || '--');
  $('#detail-mode').text(v.driveMode ?? '--');
  $('#detail-speed').text((v.speed ?? '--') + ' km/h');
  $('#detail-battery').text((v.realBattery ?? '--') + '%');
  const pos = v.position ? `${v.position.lon.toFixed(6)}, ${v.position.lat.toFixed(6)}` : '--';
  $('#detail-pos').text(pos);
  if (v.occurTimestamp) {
    const ts = v.occurTimestamp > 1e12 ? v.occurTimestamp : v.occurTimestamp * 1000;
    $('#detail-time').text(new Date(ts).toLocaleString());
  } else {
    $('#detail-time').text('--');
  }
}

function updateMapMarkers(vehicles) {
  vehicles.forEach(v => {
    if (!v.position) return;
    const lng = v.position.lon;
    const lat = v.position.lat;
    if (lng === undefined || lat === undefined) return;
    const id = v.vin;
    if (markers.has(id)) {
      markers.get(id).setPosition([lng, lat]);
    } else {
      const marker = new AMap.Marker({
        position: [lng, lat],
        title: id,
        offset: new AMap.Pixel(-10, -10)
      });
      marker.on('click', () => {
        selectedVin = id;
        renderVehicleList(vehicleCache);
        updateDetailPanel(v);
      });
      vehicleMap.add(marker);
      markers.set(id, marker);
    }
  });
}

function focusMarker(vehicle) {
  if (!vehicle || !vehicle.position) return;
  vehicleMap.setCenter([vehicle.position.lon, vehicle.position.lat]);
  vehicleMap.setZoom(14);
}

function loadSummary() {
  return $.get('/vehicle/analytics/summary')
    .done(res => updateSummary(res.data || {}));
}

function loadParkStats() {
  return $.get('/vehicle/analytics/park')
    .done(res => renderParkList(res.data || []));
}

function loadTimeSeries() {
  return $.get('/vehicle/analytics/timeseries?window=1h')
    .done(res => {
      const speed = res.data ? res.data.speed || [] : [];
      const battery = res.data ? res.data.battery || [] : [];
      speedChart.setOption({
        xAxis: { data: speed.map(p => p.time.slice(11, 16)) },
        series: [{ data: speed.map(p => p.value) }]
      });
      batteryChart.setOption({
        xAxis: { data: battery.map(p => p.time.slice(11, 16)) },
        series: [{ data: battery.map(p => p.value) }]
      });
    });
}

function loadVehicles() {
  return $.get('/vehicle/list').then(listRes => {
    const list = listRes.data || [];
    const vins = list.map(v => v.vin);
    if (!vins.length) {
      vehicleCache = [];
      renderVehicleList([]);
      return;
    }
    return $.ajax({
      url: '/vehicle/info_list',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ vin: vins })
    }).done(infoRes => {
      vehicleCache = infoRes.data || [];
      updateStatusCounts(vehicleCache);
      renderVehicleList(vehicleCache);
      updateMapMarkers(vehicleCache);
      if (!selectedVin && vehicleCache.length) {
        selectedVin = vehicleCache[0].vin;
        updateDetailPanel(vehicleCache[0]);
      } else {
        const selected = vehicleCache.find(v => v.vin === selectedVin);
        if (selected) updateDetailPanel(selected);
      }
    });
  });
}

$(function () {
  initMap();
  initCharts();
  loadSummary();
  loadParkStats();
  loadTimeSeries();
  loadVehicles();

  setInterval(loadSummary, 30000);
  setInterval(loadParkStats, 60000);
  setInterval(loadTimeSeries, 60000);
  setInterval(loadVehicles, 10000);
});
