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

# TODO

- Uplaod static resources to dedicated S3 bucket
- Improve how the title block is generated
- Separate editing/testing mode (send to your own Email) and the final publication mode (send to all Xebians and cc to Slack channel)
- Font styles 
- Add more styling, currently there are only styles for `h1`, `h2`, `h3`, `p` & lists.

Feel free to update/improve the script :)
