# #AccessibleOlli bus stop concierge

## Overview

## Prerequisites

olli-stop requires [olli-stop-backend](https://github.com/AccessibleOlli/olli-stop-backend).
Follow the instructions to install olli-stop-backend before proceeding.

## Installing

1. Install [Node](https://nodejs.org)
2. Clone this repo
  - *change to directory where you want to install*
  - `git clone git@github.com:AccessibleOlli/olli-stop.git`
  - OR `git clone https://github.com/AccessibleOlli/olli-stop`
3. Install node modules
  - `cd olli-stop`
  - `npm install`
4. Copy `.env.template` to `.env`. The file should look similar to the following:

```
REACT_APP_OLLI_STOP_IDX=3
REACT_APP_OLLI_BLIND_STOP_IDX=0
REACT_APP_OLLI_BLIND_STOP_DELAY=1000
REACT_APP_REMOTE_TELEMETRY_DB=http://admin:admin@127.0.0.1:5984/telemetry_transitions
REACT_APP_REMOTE_EVENT_DB=http://admin:admin@127.0.0.1:5984/rule_event_transitions
REACT_APP_REMOTE_PERSONA_DB=http://admin:admin@127.0.0.1:5984/persona_transitions
```

5. Change the CouchDB database urls to point to your CouchDB instance (with the appropriate credentials)

## Running

1. Ensure you are running [olli-stop-backend](https://github.com/AccessibleOlli/olli-stop-backend)
2. Make sure your proxy setting is configured properly to point to olli-stop-backend. It should look something like this:

```
"proxy": {
  "/socket": {
    "target": "ws://localhost:44000",
    "changeOrigin": true,
    "ws": true
  },
  "/": {
    "target": "http://localhost:44000",
    "changeOrigin": true
  }
}
```

3. `PORT=44000 npm start`
