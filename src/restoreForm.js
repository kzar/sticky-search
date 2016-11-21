let form = document.getElementById("adv_search_from");
let fieldNames = new Set();

// FIXME - In the future it would be nice to restore the form values here too.
for (let tag of ["input", "select"])
  for (let field of form.getElementsByTagName(tag))
    if (field.type != "hidden")
      fieldNames.add(field.name);

chrome.runtime.sendMessage({
  type: "clearValues",
  fieldNames: Array.from(fieldNames)
});

