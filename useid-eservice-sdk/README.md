# UseID eService SDK

> _Note_: This module is under development. It will later be moved into its own repository and published.

## Usage

```javascript
const { UseIdAPI, DataGroup } = require("useid-eservice-sdk");
// or
import { UseIdAPI, DataGroup } from "useid-eservice-sdk";
```

Create instance with API key received from UseID service:

```javascript
const useIdAPI = new UseIdAPI(
  process.env.USEID_API_KEY,
  process.env.USEID_DOMAIN
);
```

### Step 1: Embed widget

- Start session with UseID backend (call `startSession()`)
- Embed widget using `tcTokenUrl` in response of that backend call and `UseIdAPI.widgetSrc`

### Step 2: Fetch identity data

- Listen on refresh address endpoint
- Fetch data from UseID backend (call `getIdentity(eIdSessionId: string)` with `eIdSessionId` being the query parameter `sessionId` at the refresh address)
- Get the values by calling `get(dataGroup: DataGroup)` on that result
  - see [TR-03110](https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Publications/TechGuidelines/TR03110/BSI_TR-03110_Part-4_V2-2.pdf) and [DataGroup.ts](src/DataGroup.ts) for more info on data groups
  - those need to be defined and fixed beforehand when registering for the UseID service
