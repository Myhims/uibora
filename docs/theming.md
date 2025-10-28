# Theme Customization with CSS Variables

You can easily customize the look and feel of your application by overriding the following CSS variables in the `:root` selector. These variables define the primary colors, text colors, background, borders, and typography for your theme.
```css
:root {
    --color-primary: 0, 123, 255;                               /* Main brand color */
    --color-primary-foreground: 255, 255, 255;                  /* Text color on primary background */
    --color-text: 80, 80, 80;                                   /* Default text color */
    --color-background-split-button: 250, 250, 250;             /* Background for split-button */
    --color-border-input: 200, 200, 200;                        /* Border color for input fields */
    --border-radius: 6px;                                       /* Default border radius for components */
    --font-family: "Roboto", "Helvetica", "Arial", sans-serif;  /* Base font family */
}
```