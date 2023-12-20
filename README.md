# namespace-to-module

Convert typescript namespaces to modules

## Usage

```bash
npx namespace-to-module xxx.d.ts

// eg. npx namespace-to-module chrome.d.ts
```

Or

```bash
npm i -g namespace-to-module
namespace-to-module xxx.d.ts
// or ns2module xxx.d.ts
```

## Explanation

This tool processes the incoming *.d.ts file and divides it into sub-files (and folders) based on the namespace hierarchy.

Once the division is done, you will need to include the following line:

```typescript
import * as xxx from './xxx';
```

This approach remains compatible with the original namespace usage.

> It's important to note that certain namespace syntax, such as export var, export class, export function, etc., is not supported in module usage.
> In such cases, these type definitions will be transformed into an `export default interface _ {}`, which can then be utilized with xxx.default.

Example: Take [chrome.d.ts](./test/data/chrome.d.ts) in @types/chrome and use this tool to break it down into the following structure.

```bash
.
├── accessibilityFeatures.ts
├── action.ts
├── alarms.ts
├── bookmarks.ts
├── browser.ts
├── browserAction.ts
├── browsingData.ts
├── commands.ts
├── contentSettings.ts
├── contextMenus.ts
├── cookies.ts
├── debugger.ts
├── declarativeContent.ts
├── declarativeNetRequest.ts
├── declarativeWebRequest.ts
├── desktopCapture.ts
├── devtools
│   ├── index.ts
│   ├── inspectedWindow.ts
│   ├── network.ts
│   └── panels.ts
├── documentScan.ts
├── dom.ts
├── downloads.ts
├── enterprise
│   ├── deviceAttributes.ts
│   ├── index.ts
│   ├── networkingAttributes.ts
│   └── platformKeys.ts
├── events.ts
├── extension.ts
├── fileBrowserHandler.ts
├── fileSystemProvider.ts
├── fontSettings.ts
├── gcm.ts
├── history.ts
├── i18n.ts
├── identity.ts
├── idle.ts
├── index.ts
├── input
│   ├── ime.ts
│   └── index.ts
├── loginState.ts
├── management.ts
├── networking
│   ├── config.ts
│   └── index.ts
├── notifications.ts
├── offscreen.ts
├── omnibox.ts
├── pageAction.ts
├── pageCapture.ts
├── permissions.ts
├── platformKeys.ts
├── power.ts
├── printerProvider.ts
├── privacy.ts
├── proxy.ts
├── runtime.ts
├── scriptBadge.ts
├── scripting.ts
├── search.ts
├── serial
│   ├── index.ts
│   ├── onReceive.ts
│   └── onReceiveError.ts
├── serial.ts
├── sessions.ts
├── sidePanel.ts
├── socket.ts
├── storage.ts
├── system
│   ├── cpu.ts
│   ├── display.ts
│   ├── index.ts
│   ├── memory.ts
│   └── storage.ts
├── tabCapture.ts
├── tabGroups.ts
├── tabs.ts
├── topSites.ts
├── tts.ts
├── ttsEngine.ts
├── types.ts
├── vpnProvider.ts
├── wallpaper.ts
├── webNavigation.ts
├── webRequest.ts
├── webstore.ts
└── windows.ts
```

You can run npm test after cloning the project to see how it looks. The output is in the `test/output` folder.

## Test

```bash
npm test
```