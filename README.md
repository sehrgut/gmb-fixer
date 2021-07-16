# gmb-fixer
preflighting script to fix broken markup in GMBinder output

## Usage
1. Open a GMBinder document in either "share" or "print" mode in Chrome.
2. Save as "Web Page (Complete)".
3. Pipe the HTML file through this script and save in the same directory.
4. Open the new HTML file in Chrome.
5. Print to PDF, now with a working TOC.

## How It Works
GMB generates an `id` for each heading element based on a sluggified version of its text. This can be used as an anchor for internal document links, which is a popular way to build tables of contents.

Since mid-2020, GMB has generated `section` tags surrounding each section defined by a heading. This wouldn't require fixing, except for the fact that the `section` is given the exact same `id` as the section heading. In HTML, the `id` of an element MUST be unique, so this breaks internal links to those headings as the browser has no choice but to ignore the duplicate `id`s.

This script fixes the issue by appending the "-section" suffix to the `id` of each of these automatically-generated `section`s. It does this by finding all `section` tags whose first child is a heading tag: if you have embedded HTML in your document that matches this criterion, you will get some overlap.

Additionally, to avoid problems running locally, it removes the Facebook Pixel tracking code, and makes internal links relative (since saving from Chrome makes them absolute references to the online copy of the document for some reason).

## Notes
* **Why Chrome?** GMB only supports Chrome.
* **Why do I have to do this?** You don't if you don't use header links for your TOC.