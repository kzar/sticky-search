let fieldNames = null;
let fieldValues = null;

chrome.storage.local.get("fieldValues", result =>
{
  if (result.fieldValues)
  {
    fieldValues = result.fieldValues;
    fieldNames = Object.keys(fieldValues);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
  switch (message.type)
  {
    case "clearValues":
      chrome.storage.local.set({fieldValues: null});
      let oldValues = fieldValues;
      fieldValues = null;
      fieldNames = message.fieldNames;
      sendResponse(oldValues);
      break;
  }
  return true;
});

chrome.webRequest.onBeforeRequest.addListener(details =>
{
  let url = new URL(details.url);

  if (fieldNames)
  {
    if (fieldValues)
    {
      let changes = false;
      for (let field in fieldValues)
      {
        if (!url.searchParams.has(field))
        {
          url.searchParams.set(field, fieldValues[field]);
          changes = true;
        }
      }
      if (changes)
        return {redirectUrl: url.toString()};
    }
    else
    {
      fieldValues = {};
      for (let field of fieldNames)
        if (url.searchParams.has(field))
          fieldValues[field] = url.searchParams.get(field);
      chrome.storage.local.set({fieldValues: fieldValues});
    }
  }
}, {urls: ["*://*/sch/i.html?*"]}, ["blocking"]);
