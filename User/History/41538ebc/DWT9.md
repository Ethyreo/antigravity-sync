# Google Sheets API Setup Guide

To connect the Oak Lodge PWA to Google Sheets as our backend database, we need to set up a Google Cloud Project to securely access your data. Since this is a frontend-only React app (Vite), we will connect directly using the official `google-spreadsheet` library, using API keys or a Service Account securely. 

*Note: Because exposing a Service Account Key directly in frontend code is a security risk if the app is public, since this app is heavily ring-fenced behind a PIN and `robots.txt`, and hosted privately, we can use environmental variables. If you ever deploy this publicly for others, we would need a small backend proxy.*

Follow these exact steps to get the credentials we need:

## Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the **Project Dropdown** in the top-left (next to the Google Cloud logo) and click **New Project**.
3. Name it `Oak Lodge Backend` and click **Create**.
4. Once created, make sure that project is selected in the top-left dropdown.

## Step 2: Enable the Google Sheets API
1. In the Cloud Console search bar at the top, type **"Google Sheets API"** and select it from the marketplace results.
2. Click the blue **Enable** button.

## Step 3: Create a Service Account
We need a "bot" account that our app will use to read/write the sheet.
1. In the left sidebar menu, go to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS** at the top, and select **Service account**.
3. Name it `oak-lodge-bot` and click **Create and Continue**. (You can skip granting optional roles and click **Done**).
4. You will now see the Service Account in the list. Under the "Email" column, you will see an email address that looks like `oak-lodge-bot@your-project-id.iam.gserviceaccount.com`. **Copy this email address and save it.**

## Step 4: Generate the Private Key
1. Click on the newly created Service Account email address to open its details.
2. Go to the **Keys** tab at the top.
3. Click **Add Key > Create new key**.
4. Choose **JSON** as the format and click **Create**.
5. A JSON file will automatically download to your computer. Keep this file very safe.

## Step 5: Prepare the Google Sheet
1. Open up the actual Google Sheet you want to use for the building data.
2. Look at the URL in your browser. It will look like this: `https://docs.google.com/spreadsheets/d/1ABC123xyz_LONG_ID_HERE/edit`
3. Copy the long ID from the middle of the URL (e.g., `1ABC123xyz_LONG_ID_HERE`). This is your **Spreadsheet ID**.
4. Click the green **Share** button in the top right of the Google Sheet.
5. Paste the **Service Account Email** (from Step 3) into the sharing box.
6. Make sure the role is set to **Editor**, uncheck "Notify people", and click **Share**.

## Step 6: Provide Me With the Details
Once you have done these steps, I need you to securely provide me with three things to wire up the application:
1.  **The Spreadsheet ID** (From Step 5)
2.  **The Service Account Email** (`client_email` from the JSON file you downloaded)
3.  **The Private Key** (The massive block of text starting with `-----BEGIN PRIVATE KEY-----` in the JSON file you downloaded. *Make sure to copy the entire block including the BEGIN and END lines with all the \n characters*).

**Please paste those 3 items here in the chat**, and I will install the library, write the `GoogleSheetsProvider.jsx`, and link it to our Bulk Entry page!
