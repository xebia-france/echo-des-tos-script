function ConvertGoogleDocToCleanHtml() {
    var body = DocumentApp.getActiveDocument().getBody();
    var numChildren = body.getNumChildren();
    var output = [];
    var images = [];
    var listCounters = {};

    // Walk through all the child elements of the body.
    for (var i = 0; i < numChildren; i++) {
        var child = body.getChild(i);
        output.push(processItem(child, listCounters, images));
    }

    var content = output.join('\r');
    var header = include("header.html")
    var footer = include("footer.html")
    var html = header + content + footer

    emailHtml(html, images);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};

function emailHtml(html, images) {
    var attachments = [];
    for (var j = 0; j < images.length; j++) {
        attachments.push({
            "fileName": images[j].name,
            "mimeType": images[j].type,
            "content": images[j].blob.getBytes()
        });
    }

    var inlineImages = {};
    for (var j = 0; j < images.length; j++) {
        inlineImages[[images[j].name]] = images[j].blob;
    }

    var name = DocumentApp.getActiveDocument().getName();
    attachments.push({
        "fileName": name,
        "mimeType": "text/html",
        "content": html
    });
    MailApp.sendEmail({
        to: Session.getActiveUser().getEmail(),
        //to: "XXX@xebia.fr",
        //bcc: "YYY@xebiafr.slack.com",
        subject: name,
        htmlBody: html,
        inlineImages: inlineImages,
        attachments: attachments
    });
}

function processItem(item, listCounters, images) {
    var output = [];
    var prefix = "",
        suffix = "";

    if (item.getType() == DocumentApp.ElementType.PARAGRAPH) {
      
        var alignment = item.getAlignment();
        var alignmentClass = "";
        switch (alignment) {
            case DocumentApp.HorizontalAlignment.CENTER:
                alignmentClass = "centered";
                break;
            default:
                break;
        }

        switch (item.getHeading()) {
            // Add a # for each heading level. No break, so we accumulate the right number.
            case DocumentApp.ParagraphHeading.TITLE:
                prefix = '<div class="main-title"><img src="https://github.com/xebia-france/echo-des-tos-script/raw/feature/pse-ui/static/header.png?v=2" alt="photo" style="width:100%;" align="right"/>'+ 
                '<h1 class="main-title">', 
                suffix = '</h1></div><div class="content">';
                break;
            case DocumentApp.ParagraphHeading.SUBTITLE:
                prefix = '<h4 class="subtitle ' + alignmentClass + '">', suffix = "</h4>";
                break;
            case DocumentApp.ParagraphHeading.HEADING6:
                prefix = "<h6 class=\"" + alignmentClass + "\">", suffix = "</h6>";
                break;
            case DocumentApp.ParagraphHeading.HEADING5:
                prefix = "<h5 class=\"" + alignmentClass + "\">", suffix = "</h5>";
                break;
            case DocumentApp.ParagraphHeading.HEADING4:
                prefix = "<h4 class=\"" + alignmentClass + "\">", suffix = "</h4>";
                break;
            case DocumentApp.ParagraphHeading.HEADING3:
                prefix = "<h3 class=\"" + alignmentClass + "\">", suffix = "</h3>";
                break;
            case DocumentApp.ParagraphHeading.HEADING2:
                prefix = "<h2 class=\"" + alignmentClass + "\">", suffix = "</h2>";
                break;
            case DocumentApp.ParagraphHeading.HEADING1:
                prefix = "<h1 class=\"" + alignmentClass + "\">", suffix = "</h1>";
                break;
            default:
                prefix = "<p class=\"" + alignmentClass + "\">", suffix = "</p>";
        }

        if (item.getNumChildren() == 0) {
            return "";
        }
    } else if (item.getType() == DocumentApp.ElementType.INLINE_IMAGE) {
        processImage(item, images, output);
    } else if (item.getType() === DocumentApp.ElementType.LIST_ITEM) {
        var listItem = item;
        var gt = listItem.getGlyphType();
        var key = listItem.getListId() + '.' + listItem.getNestingLevel();
        var counter = listCounters[key] || 0;

        // First list item
        if (counter == 0) {
            // Bullet list (<ul>):
            if (gt === DocumentApp.GlyphType.BULLET ||
                gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
                gt === DocumentApp.GlyphType.SQUARE_BULLET) {
                prefix = '<ul class="small"><li>', suffix = "</li>";
            } else {
                // Ordered list (<ol>):
                prefix = "<ol><li>", suffix = "</li>";
            }
        } else {
            prefix = "<li>";
            suffix = "</li>";
        }

        if (item.getNextSibling().getType() == DocumentApp.ElementType.LIST_ITEM && item.getNextSibling().getNestingLevel() < item.getNestingLevel()) {
            if (gt === DocumentApp.GlyphType.BULLET ||
                gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
                gt === DocumentApp.GlyphType.SQUARE_BULLET) {
                suffix += "</ul>";
            } else {
                // Ordered list (<ol>):
                suffix += "</ol>";
            }
        }
        if (item.isAtDocumentEnd() || item.getNextSibling().getType() != DocumentApp.ElementType.LIST_ITEM) {
            if (gt === DocumentApp.GlyphType.BULLET ||
                gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
                gt === DocumentApp.GlyphType.SQUARE_BULLET) {
                var times = 0;
                var levels = item.getNestingLevel();
                var acc = "";
                while (times < levels) {
                  acc += "</ul>";
                  times += 1;
                }
                suffix += acc + "</ul>";
            } else {
                // Ordered list (<ol>):
                suffix += "</ol>";
            }
        }


        if (item.isAtDocumentEnd() || item.getNextSibling().getType() != DocumentApp.ElementType.LIST_ITEM) {
            if (gt === DocumentApp.GlyphType.BULLET ||
                gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
                gt === DocumentApp.GlyphType.SQUARE_BULLET) {
                var times = 0;
                var levels = item.getNestingLevel();
                var acc = "";
                while (times < levels) {
                  acc += "</ul>";
                  times += 1;
                }
                suffix += acc + "</ul>";
            } else {
                // Ordered list (<ol>):
                suffix += "</ol>";
            }
        }

        counter++;
        if (item.getNextSibling().getType() == DocumentApp.ElementType.LIST_ITEM && item.getNextSibling().getNestingLevel() < item.getNestingLevel()) {
            counter = 0;
        }
        listCounters[key] = counter;
    }

    output.push(prefix);

    if (item.getType() == DocumentApp.ElementType.TEXT) {
        processText(item, output);
    } else {
        if (item.getNumChildren) {
            var numChildren = item.getNumChildren();

            // Walk through all the child elements of the doc.
            for (var i = 0; i < numChildren; i++) {
                var child = item.getChild(i);
                output.push(processItem(child, listCounters, images));
            }
        }
    }

    output.push(suffix);
    return output.join('');
}

function processText(item, output) {
    var text = item.getText();
    var indices = item.getTextAttributeIndices();
    var youTubeRegEx = /^(https:\/\/)(www\.)*(youtube\.com\/watch\?v=)([a-zA-Z0-9]+)/g;

    if (indices.length <= 1) {
        // Assuming that a whole para fully italic is a quote
        if (item.isBold()) {
            output.push('<b>' + text + '</b>');
        } else if (item.isItalic()) {
            output.push('<blockquote>' + text + '</blockquote>');
        } else if (item.getLinkUrl()) {
            var url = item.getLinkUrl()
            if (url.match(youTubeRegEx)) {
                var parsedGroups = youTubeRegEx.exec(url);
                output.push('<a href="' + url + '"><img src="https://img.youtube.com/vi/' + parsedGroups[4] + '/hqdefault.jpg" style="width: 100%;"><br>' + url +'</a>')
            } else {
                output.push('<a href="' + item.getLinkUrl() + '">' + text + '</a>');
            }
        } else if (text.trim().indexOf('http://') == 0) {
            output.push('<a href="' + text + '" rel="nofollow">' + text + '</a>');
        } else {
            output.push(text);
        }
    } else {
        for (var i = 0; i < indices.length; i++) {
            var partAtts = item.getAttributes(indices[i]);
            var startPos = indices[i];
            var endPos = i + 1 < indices.length ? indices[i + 1] : text.length;
            var partText = text.substring(startPos, endPos);

            Logger.log(partText);

            if (partAtts.LINK_URL) {
                var url = item.getLinkUrl(startPos);
                output.push('<a href="' + url + '">');
            }
            if (partAtts.ITALIC) {
                output.push('<i>');
            }
            if (partAtts.BOLD) {
                output.push('<b>');
            }
            if (partAtts.UNDERLINE) {
                output.push('<u>');
            }
            if (partAtts.STRIKETHROUGH) {
                output.push('<del>');
            }

            // If someone has written [xxx] and made this whole text some special font, like superscript
            // then treat it as a reference and make it superscript.
            // Unfortunately in Google Docs, there s no way to detect superscript
            if (partText.indexOf('[') == 0 && partText[partText.length - 1] == ']') {
                output.push('<sup>' + partText + '</sup>');
            } else if (partText.trim().indexOf('http://') == 0) {
                output.push('<a href="' + partText + '" rel="nofollow">' + partText + '</a>');
            } else {
                output.push(partText);
            }

            if (partAtts.LINK_URL) {
                output.push('</a>');
            }
            if (partAtts.ITALIC) {
                output.push('</i>');
            }
            if (partAtts.BOLD) {
                output.push('</b>');
            }
            if (partAtts.UNDERLINE) {
                output.push('</u>');
            }
            if (partAtts.STRIKETHROUGH) {
                output.push('</del>');
            }

        }
    }
}

function processImage(item, images, output) {
    images = images || [];
    var blob = item.getBlob();
    var contentType = blob.getContentType();
    var extension = "";
    if (/\/png$/.test(contentType)) {
        extension = ".png";
    } else if (/\/gif$/.test(contentType)) {
        extension = ".gif";
    } else if (/\/jpe?g$/.test(contentType)) {
        extension = ".jpg";
    } else {
        throw "Unsupported image type: " + contentType;
    }
    var imagePrefix = "Image_";
    var imageCounter = images.length;
    var name = imagePrefix + imageCounter + extension;
    imageCounter++;
    output.push('<img src="cid:' + name + '" />');
    images.push({
        "blob": blob,
        "type": contentType,
        "name": name
    });
}
