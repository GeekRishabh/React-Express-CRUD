
### `yarn run deploy` (`deploy.js`)

* Builds the project from source files (`build.js`)
* Pushes the contents of the `/build` folder to a remote server with Git

## Options

Flag        | Description
----------- | --------------------------------------------------
`--release` | Minimizes and optimizes the compiled output
`--verbose` | Prints detailed information to the console
`--analyze` | Launches [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer)
`--static`  | Renders [specified routes](./render.js#L15) as static html files
`--docker`  | Build an image from a Dockerfile
`--silent`  | Do not open the default browser

For example:

```sh
$ yarn run build -- --release --verbose   # Build the app in production mode
```

or

```sh
$ yarn start -- --release                 # Launch dev server in production mode
```

