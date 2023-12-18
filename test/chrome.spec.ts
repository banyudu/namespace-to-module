import path from 'path'
import ns2Module from '..'
import assert = require('assert')
import fs from 'fs'

describe('Chrome', () => {
  const outputDir = path.join(__dirname, 'output')
  before(async () => {
    await fs.rmSync(outputDir, { recursive: true })
    await ns2Module(path.join(__dirname, 'data', 'chrome.d.ts'), outputDir)
  })

  it('should generate module files', async () => {
    assert(fs.existsSync(path.join(outputDir, 'chrome')))

    const files = [
      'history.ts',
      'webRequest.ts',
      'privacy.ts',
      'gcm.ts',
      'dom.ts',
      'power.ts',
      'tabCapture.ts',
      'offscreen.ts',
      'fileBrowserHandler.ts',
      'identity.ts',
      'contextMenus.ts',
      'commands.ts',
      'webstore.ts',
      'socket.ts',
      'declarativeWebRequest.ts',
      'vpnProvider.ts',
      'alarms.ts',
      'enterprise/networkingAttributes.ts',
      'enterprise/deviceAttributes.ts',
      'enterprise/platformKeys.ts',
      'bookmarks.ts',
      'windows.ts',
      'input/ime.ts',
      'search.ts',
      'notifications.ts',
      'i18n.ts',
      'management.ts',
      'permissions.ts',
      'networking/config.ts',
      'storage.ts',
      'serial.ts',
      'browserAction.ts',
      'extension.ts',
      'scriptBadge.ts',
      'browsingData.ts',
      'browser.ts',
      'action.ts',
      'desktopCapture.ts',
      'webNavigation.ts',
      'downloads.ts',
      'runtime.ts',
      'types.ts',
      'accessibilityFeatures.ts',
      'sidePanel.ts',
      'system/storage.ts',
      'system/display.ts',
      'system/cpu.ts',
      'system/memory.ts',
      'contentSettings.ts',
      'pageCapture.ts',
      'tts.ts',
      'devtools/panels.ts',
      'devtools/network.ts',
      'devtools/inspectedWindow.ts',
      'scripting.ts',
      'declarativeNetRequest.ts',
      'fileSystemProvider.ts',
      'events.ts',
      'proxy.ts',
      'omnibox.ts',
      'tabs.ts',
      'topSites.ts',
      'pageAction.ts',
      'platformKeys.ts',
      'wallpaper.ts',
      'loginState.ts',
      'tabGroups.ts',
      'fontSettings.ts',
      'sessions.ts',
      'declarativeContent.ts',
      'ttsEngine.ts',
      'documentScan.ts',
      'cookies.ts',
      'idle.ts',
      'serial/onReceiveError.ts',
      'serial/onReceive.ts',
      'printerProvider.ts'
    ]

    for (const file of files) {
      const filePath = path.join(outputDir, 'chrome', file.replace('/', path.sep))
      assert(fs.existsSync(filePath), `should output module file ${file}`)
    }
  })
})
