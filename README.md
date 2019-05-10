Echo of TOs formatting script
=============================

The script `script.gs` works for a single Google doc.

You will have to apply the steps every time you write a new _Echo des TOs_.

# Usage

- From the Google doc you are editing, click on `Tools -> Script Editor` and
  open the Google Apps Script editor.
- Copy the `script.gs`, `header.html` and `footer.html` to your current project
- Then you should be able to see the function `ConvertGoogleDocToCleanHtml`

By running this function, the script will convert the Google doc to HTML and
send an e-mail to you.

> Warning: make sure your Echo's title is formatted with `title` and the
> lecture time is formatted with `subtitle`

# Links

- Credentials/OAuth app : <https://console.developers.google.com/apis/credentials?organizationId=552523943544&project=tos-echo-formatting>
- GDoc API : <https://console.developers.google.com/apis/api/docs.googleapis.com/overview?organizationId=552523943544&project=tos-echo-formatting>
- [Text Attributes
  enumeration](https://developers.google.com/apps-script/reference/document/attribute)


# Contribution

Feel free to update/improve the script :)
