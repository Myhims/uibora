# Theme Customization with CSS Variables

You can easily customize the look and feel of your application by overriding the following CSS variables in the `:root` selector. These variables define the primary colors, text colors, background, borders, and typography for your theme.
```css
:root {
    --uib-color-primary: 0, 123, 255;                               /* Main brand color */
    --uib-color-primary-foreground: 255, 255, 255;                  /* Text color on primary background */
    --uib-color-text: 80, 80, 80;                                   /* Default text color */
    --uib-color-background-light-button: 250, 250, 250;             /* Background for split-button */
    --uib-color-border-input: 200, 200, 200;                        /* Border color for input fields */
    --uib-border-radius: 6px;                                       /* Default border radius for components */
    --uib-font-family: "Roboto", "Helvetica", "Arial", sans-serif;  /* Base font family */
    --uib-color-error: 221, 29, 29;                                 /* Color for error elements */
    --uib-disabled-color: 235, 235, 235;                            /* Color for disbaled elements */
    --uib-color-background-panel: 50, 50, 50;                       /* Color for panels backgrounds */
}
```

A **dark theme** and a **light theme** are available in the `./theme/uib-m3.scss` file.