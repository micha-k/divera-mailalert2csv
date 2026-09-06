# divera-mailalert2csv

Static browser app for parsing exported DIVERA 24/7 alert mails from `.eml`
files.

## Usage

Serve the repository root with any static web server and open `index.html`.
The app accepts multiple `.eml` files by drag and drop or file picker, then
parses them after pressing the parsing button.

All mail files are processed locally in the browser. The app does not upload
mail content to a backend service.

## Dependency

The browser app imports PostalMime from a pinned CDN URL:

```js
https://unpkg.com/postal-mime@3.0.0/src/postal-mime.js
```
