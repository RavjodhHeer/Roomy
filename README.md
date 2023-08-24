![Roomy](./Roomy/public/images/roomylogofull.svg)

# Where LinkedIn meets Zillow

If you're in the housing market, whether as a future tenant or a future landlord, you can put a face and story to your rental applications.

## Current Features

- View and post a rental property
- Customize your profile to your preferences
- View other people looking for roommates & advertise yourself
- Make general posts on the homepage

# Visit our deployed WebApp!

- https://roomy-e2f16.web.app/

# Get Started

## Start Local Site

- Clone the repo, and open your terminal wherever you cloned to.
- Run the following commands in your terminal:
  - ```properties
    cd ./Roomy/roomy
    npm i
    npm run start
    ```
- Development site should be hosted on http://localhost:3000/

## Troubleshooting

- If npm run start does not work then please try:
  - ```properties
    export NODE_OPTIONS=--openssl-legacy-provider
    ```
- If having errors with eslint then please try:
  - Deleting .eslintrc.js file in the root directory and trying again

## Unit Testing

- Clone the repo, and open your terminal wherever you cloned to.
- Run the following commands in your terminal:
  - ```properties
    cd ./Roomy
    npm i
    npm run test
    ```
  - If you're on a mac device, tests may not work without typing `npm install fsevents`
