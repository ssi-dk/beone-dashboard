# Installing BeONE Dashboard on Windows (non-admin)

These installation instructions assume that you are on a Windows
computer and that you don\'t have admin access to Windows.

As a prerequisite you must have Git installed on and be able to make a
local clone of a GitHub repository on your computer.

-   \'git clone\' the BeONE Dashboard repository somewhere on your
    computer. Below we will refer to the created folder
    as\<dashboard_folder\>.
-   Go to nodejs.org in a browser.
-   Select "Other downloads".
-   Download "Windows Binary (.zip)" and "64-bit".
-   Extract the content to a folder somewhere on your computer. Below we
    will refer to the extracted folder (containing \'node.exe\' etc.) as
    \<node_folder\>.
-   Create a text file named \'dashboard.bat\' somewhere on your computer
    containing (replace the placeholders with the actual paths):
    ```
    @cd <dashboard_folder>
    @set PATH=<node_folder>;%PATH%
    @npm start
    ```
When running the batch file, the dashboard should automatically open as [http://localhost:3000](http://localhost:3000) in your default browser.

## A note about Windows file and folder names

You MUST type all Windows path elements with correct casing (e. g.:
\'Users\', not \'users\'). Node does not accept incorrect casing. Casing
errors will result in error messages from Node, for instance starting
with \'ERROR in Plugin \"react\" was conflicted between\...\'.

# Opening files in the dashboard
To see data in the dashboard you must open a tree file (\*.nwk) and some BeONE JSON files (\*.json) from inside the dashboard. For testing you can use the test files provided in the test_data folder.
