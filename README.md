Echo of TOs formatting script
=============================

The script works for single Google doc, you will have to apply the steps every time you write a new Echo des TOs.

# Usage

- From the Google doc you are editing, click on `Tools -> Script Editor` and open the Google Apps Script editor.
- Copy the `script.gs`, `header.html` and `footer.html` to your current project
- Then you should be able to see the function `ConvertGoogleDocToCleanHtml`

By running this function, the script will convert the Google doc to html and send an Email to you.

> Attention: make sure your Echo's title is formatted with `title` and the lecture time is formatted with `subtitle`

# TODO

- Improve how the title block is generated
- Separate editing/testing mode (send to your own Email) and the final publication mode (send to all Xebians and cc to Slack channel)
- Font styles 
- Image and caption formatting
- Add more styling, currently there are only styles for `h1`, `h2`, `h3`, `p` & lists.

Feel free to update/improve the script :)