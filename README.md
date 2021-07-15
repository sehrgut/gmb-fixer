# gmb-fixer
preflighting script to fix broken markup in GMBinder output

## Usage
1. Open a GMBinder document in either "share" or "print" mode in Chrome.
2. Save as "Web Page (Complete)".
3. Pipe the HTML file through this script and save in the same directory.
4. Open the new HTML file in Chrome.
5. Print to PDF, now with a working TOC.

## Notes
* **Why Chrome?** GMB only supports Chrome.
* **Why do I have to do this?** You don't if you don't use header links for your TOC.