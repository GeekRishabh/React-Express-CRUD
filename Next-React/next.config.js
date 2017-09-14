const glob = require('glob-promise')
const { join } = require('path')

module.exports = {
  distDir: 'build',
  webpack: function (config, { dev }) {
    const entry = config.entry
    // Also bundle pages for server
    config.entry = async () => {
      const entries = await entry()
      const pages = await glob('pages/**/*.js', { cwd: config.context })
      const nextPages = await glob('node_modules/next/dist/pages/**/*.js', { cwd: config.context })
      pages.concat(nextPages).forEach((file) => {
        entries[join('dist', file.replace('node_modules/next/dist', ''))] = [`./${file}?entry`]
      })
      return entries
    }
    const cssConfig = {
      test: /\.css$/,
      use: [
        'isomorphic-style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
            minimize: !dev,
            localIdentName: '[name]-[local]-[hash:base64:5]'
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            config: './postcss.config.js'
          }
        }
      ]
    }
    const imageConfig =
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: ['file-loader?context=src/images&name=images/[path][name].[ext]', {
        loader: 'image-webpack-loader',
        query: {
          mozjpeg: {
            progressive: true,
          },
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 4,
          },
          pngquant: {
            quality: '75-90',
            speed: 3,
          },
        },
      }],
      exclude: /node_modules/,
      include: __dirname,
    }

    // Remove emit-file-loader to bundle pages on server-side
    config.module.rules = config.module.rules.filter((rule) =>
      rule.loader !== 'emit-file-loader'
    )

    // Remove chunking plugins that cause problems
    config.plugins = config.plugins.filter((plugin) =>
      !/Chunk/.test(plugin.constructor.name)
    )

    config.module.rules.push(cssConfig, imageConfig)

    return config
  }
}
