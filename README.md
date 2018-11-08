# Load Monitoring Web Service

## Introduction
Load Monitoring Web Service is a simple Server Side Rendering React Web Application.

In terms of simplicity of project management, SSR web application wins over having two different projects, frontend and backend.


## Project setup
This project setup is based on tutorials of React Server Side https://github.com/Rohitkrops/ssr, having some setup tweaked.

`index.js` // main entry file for express webserver

`src/server.js` // entry point of React render

`src/client.js` // client side companion for SSR

`src/bundle.js` // pure client side app

`src/template.js` // HTML template for server side rendering


## Application

`/src/components` is where frontend code lives. `App.js` is the main entry point of frontend.

`src/service` is the place where server side node.js logic sits.

`utils/statHelper.js` is very simple module of single function shared by both of frontend and backend. To keep consistency, I wanted to make it shared.


### Monitoring Strategy
Polling happens in both-side, server and frontend.

To support multiple clients (web browser sessions), main load history data needs to be kept in server side, while frontend also needs to keep querying to server for the data.

Alerts needs to be notified only when alert situation has changed.

For example, showing alert status for every tick is not informative, because we will be seeing same alert status without changes. We want to get notified only if cpu load crosses threshold.

### Design Details

#### Web API
`index.js` contains all `express` webserver's endpoint setup

- `/getLatestData` returns latest tick data
- `/getAllData` returns list of all tick data in window range. default is 600 ticks (10m). This is for making frontend fill with previous tick data.
- `/getllAlertHistory` returns all the alert history records. Main purpose is same to `/getAllData`: support frontend can catch up the previous history.


#### Entity shapes
##### tickData

```
{
    alert, // contains alert status data
    cpuStat, // information about various cpu stats including cpu load
    processInfo, // information about process stats
    timestamp,
}
```

##### Alert status data
```
{
    timestamp,
    message,
    load, // avg load of recent 12 ticks (2m)
    tickIndex, // for debug purpose
}
```



#### Backend

##### Monitor
`Monitor`, `monitor.js`, is the main engine for load monitoring service.
Once it is instantiated and `start()` method is called, monitoring process will keep polling performance data of running node.js process.

Every interval, monitor process grabs various performance statistics from node.js process. Also, in each tick, call `AlertManagers` `getAlert` to return alert status data.

##### AlertManager
`AlertManager` in `alertManager.js` has all core logic to alert check.

Given cpu stat in every tick, `AlertManager` maintains a window of cpu load history and decide if current situation is in alert or not.

If any change happens in current alert status, at last, the alert manager returns alert status data to notify that there is an update of alert status.

#### Frontend
`CpuStatsReader.js` is the main React component.
It fetches past history by `/getAllData` and `/getAllAlertHistory` to catch up.
After fetching `/getAllData` it starts a polling process fetching `/getLatestData` to update the bar chart.

`CpuLoadBarChart` is a chart component renders cpu load history.

`AlertHistoryList` is a simple list component to render alert history.



## Note
- `npm run jest` and `npm run lint` are not working. To run test, please use `npx jest`
- Even though redux / redux-thunk is setup, this application does not use Redux.
- babel includes test files.
