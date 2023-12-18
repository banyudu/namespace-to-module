import path from 'path'
import ns2Module from '..'
import assert = require('assert')
import fs from 'fs'

describe('Chrome', () => {
  const outputDir = path.join(__dirname, 'output')
  const outputFiles = [
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
  ].map(file => {
    return path.join(outputDir, 'chrome', file)
  })

  before(async () => {
    await fs.rmSync(outputDir, { recursive: true })
    await ns2Module(path.join(__dirname, 'data', 'chrome.d.ts'), outputDir)
  })

  it('should generate module files', async () => {
    assert(fs.existsSync(path.join(outputDir, 'chrome')))

    for (const file of outputFiles) {
      assert(fs.existsSync(file), `should output module file ${file}`)
    }
  })

  it('should not contain `export function`', async () => {
    // export function
    for (const file of outputFiles) {
      const fileContent = fs.readFileSync(file)
      assert(!fileContent.includes('export function '), `${file} should not contain 'export function '`)
    }
  })

  it('should not contain `export var`', async () => {
    // export var
    for (const file of outputFiles) {
      const fileContent = fs.readFileSync(file)
      assert(!fileContent.includes('export var '), `${file} should not contain 'export var '`)
    }
  })

  it('should reserve comments', async () => {
    const comments = [
      '/** Fired when a URL is visited, providing the HistoryItem data for that URL. This event fires before the page has loaded. */',
      '/** Optional. The number of times the user has navigated to this page by typing in the address. */',
      '/** An object encapsulating one result of a history query. */'
    ]
    const historyFile = fs.readFileSync(path.join(outputDir, 'chrome', 'history.ts'))
    for (const comment of comments) {
      assert(historyFile.includes(comment), `chrome/history.ts should contain comment: ${comment}`)
    }
  })
})
