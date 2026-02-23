# Momotech AI Assistant WordPress Plugin

This plugin embeds the Momotech AI Assistant React application into your WordPress site.

## Installation Instructions

1. **Build the React App**
   Open your terminal in the project root and run:
   ```bash
   npm run build
   ```
   This will create a `dist` folder containing the compiled code.

2. **Prepare the Plugin**
   - Copy the entire `dist` folder you just created into the `momotech-assistant` directory.
   - Your folder structure should look like this:
     ```
     momotech-assistant/
     ├── momotech-assistant.php
     ├── README.md
     └── dist/
         ├── assets/
         │   ├── index-xxxx.js
         │   └── index-xxxx.css
         └── index.html
     ```

3. **Package the Plugin**
   - Zip the `momotech-assistant` folder. Name it `momotech-assistant.zip`.

4. **Install on WordPress**
   - Go to your WordPress Admin Dashboard.
   - Navigate to **Plugins > Add New**.
   - Click **Upload Plugin**.
   - Select the `momotech-assistant.zip` file and click **Install Now**.
   - Click **Activate Plugin**.

## Usage

1. Create a new Page in WordPress (e.g., "Shop" or "Assistant").
2. Add the following shortcode to the page content:
   ```
   [momotech_assistant]
   ```
3. Publish the page.

## Notes

- **Full Width Layout:** For best results, use a "Full Width" or "Blank" page template in your WordPress theme settings to allow the app to take up the full screen.
- **API Key:** Ensure your API Key is correctly set in the React code before building.
