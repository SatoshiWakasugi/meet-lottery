chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_MEMBERS') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      if (currentTab?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTab.id },
            files: ['content.js'],
          },
          () => {
            chrome.tabs.sendMessage(
              currentTab.id,
              { type: 'GET_DOM' },
              (response) => {
                if (response) {
                  sendResponse(response)
                } else {
                  sendResponse({ names: [], images: [] })
                }
              }
            )
          }
        )
      }
    })
    return true // 非同期 sendResponse のため
  }
})
