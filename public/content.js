chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_DOM') {
    const memberNodeList = document.querySelectorAll(
      "div[role='list'] > div[role='listitem'] > div > div > div > span:first-child"
    )
    const imageNodeList = document.querySelectorAll(
      "div[role='list'] > div[role='listitem'] > div > div > img"
    )

    const names = Array.from(memberNodeList).map((node) => node.textContent)
    const images = Array.from(imageNodeList).map((node) =>
      node.getAttribute('src')
    )

    sendResponse({ names, images })
  }
})
