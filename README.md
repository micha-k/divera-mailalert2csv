# divera-mailalert2csv

<img src="docs/logo.png" alt="DIVERA mail alert to CSV logo" width="120">

Static browser app for parsing exported DIVERA 24/7 alert mails from `.eml`
files.

**[Open the hosted app on GitHub Pages](https://micha-k.github.io/divera-mailalert2csv/)**

## Usage

The hosted GitHub Pages version can be used directly without installing or
starting anything locally.

### Host locally (optional)

The following server setup is only needed when you want to host the app
locally. Serve the repository root with any static web server. For example,
with Python 3:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000/](http://localhost:8000/) in a browser.

### Parse mail files

1. Add one or more `.eml` files by dragging them into the drop area or using
   the file picker.
2. Press **Parsing starten** to process the supported files.
3. Review the result table. Use the search field and status selector to filter
   rows, or select a sortable column heading to change the result order.
4. Use **Leeren** to remove the selected files and results before starting a
   new import.

All mail files are processed locally in the browser. The app does not upload
mail content to a backend service. Selected files and parsed results are kept
only in the current page and are lost when it is reloaded or closed; the
browser will normally show a confirmation dialog before that happens.

## Dependency

The browser app imports PostalMime from a pinned CDN URL:

```js
https://unpkg.com/postal-mime@3.0.0/src/postal-mime.js
```

An internet connection is therefore required when loading the app unless this
dependency is provided locally.
