let form = document.getElementById("adv_search_from");
let fieldNames = new Set();

function restoreField(field, value)
{
  if (field.tagName == "INPUT")
  {
    if (field.type == "checkbox")
    {
      if (value)
        field.setAttribute("checked", "checked");
      else
        field.removeAttribute("checked");
    }
    else
      field.value = value;
  }
  else if (field.tagName == "SELECT")
  {
    for (let option of field.getElementsByTagName("option"))
      if (option.value == value)
        option.setAttribute("selected", "selected");
      else
        option.removeAttribute("selected");
  }
}

function allFields()
{
  let fields = [];
  for (let tag of ["input", "select"])
    for (let field of form.getElementsByTagName(tag))
      if (field.type != "hidden")
        fields.push(field);
  return fields;
}

for (let field of allFields())
  fieldNames.add(field.name);

chrome.runtime.sendMessage({
  type: "clearValues",
  fieldNames: Array.from(fieldNames)
}, fieldValues => {
  if (fieldValues)
    for (let field of allFields())
      if (field.name in fieldValues)
        restoreField(field, fieldValues[field.name]);
});

