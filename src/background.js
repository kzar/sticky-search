let fieldNames = null;
let values = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
  switch (message.type)
  {
    case "clearValues":
      values = null;
      fieldNames = message.fieldNames;
      break;
  }
});

chrome.webRequest.onBeforeRequest.addListener(details =>
{
  let url = new URL(details.url);

  if (fieldNames)
  {
    if (values)
    {
      let changes = false;
      for (let field in values)
      {
        if (!url.searchParams.has(field))
        {
          url.searchParams.set(field, values[field]);
          changes = true;
        }
      }
      if (changes)
        return {redirectUrl: url.toString()};
    }
    else
    {
      // FIXME - Would be cool to save these for after Chrome restarts.
      values = {};
      for (let field of fieldNames)
        if (url.searchParams.has(field))
          values[field] = url.searchParams.get(field);
    }
  }
// FIXME - Don't hardcode .co.uk domains
}, {urls: ["*://*.ebay.co.uk/sch/i.html?*"]}, ["blocking"]);
