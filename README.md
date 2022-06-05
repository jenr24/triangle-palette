# Triangle Palette

* Choose the color of each of the three corners of a triangle rendered with WebGPU in this React/Snowpack app
* Be sure to run this app only on browsers with enabled WebGPU (--enable-unsafe-webgpu for chrome and additionally --enable-features=Vulkan,UseSkiaRenderer for chrome on linux)

![App Screenshot][/repository/AppScreenshot.png](https://github.com/jenr24/triangle-palette/blob/main/AppScreenshot.png)

## NPM Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like "@snowpack/plugin-webpack" to your `snowpack.config.mjs` config file.

### npm test

Launches the application test runner.
Run with the `--watch` flag (`npm test -- --watch`) to run in interactive watch mode.

## Running the App

* This app only requires the nix package manager (https://nixos.org/download.html#download-nix) and git to get started; however, the experimental `flake` feature needs to be enabled

* Clone this repository to a location of your choosing
* Enter the repository and enter the development environment with `nix develop`
* Start the app in development mode with `nix run` or `npm run start`
* Build the app for production with `nix build` or `npm run build`
