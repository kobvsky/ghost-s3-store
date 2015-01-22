# ghost-s3-store
node.js ghost: upload images to aws s3 instead of local-store

## Why I made this
1. other ghost-s3 stuffs are no longer working due to ghost itself changed its structure.
1. others not using bluebird which gives some bad points because ghost itself is using bluebird!!

## Installation
1. in ghost root terminal:
`npm install aws-sdk --save-dev`
1. put `s3-store.js` file as `ghost/core/server/storage/s3-store.js`
1. change `config.js` file through adding aws values. below example could applied to development config.

        production: {
                url: 'http://my-ghost-blog.com',
                mail: {},
                database: {
                    client: 'sqlite3',
                    connection: {
                        filename: path.join(__dirname, '/content/data/ghost.db')
                    },
                    debug: false
                },

                server: {
                    // Host to be passed to node's `net.Server#listen()`
                    host: '127.0.0.1',
                    // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
                    port: '2368'
                }

                aws: {
                    accessKeyId: <YOUR_KEY>,
                    secretAccessKey: <YOUR_SECRET>,
                    bucket: <YOUR_BUCKET>,
                    region: <YOUR_REGION>
                }
            }
1. modifiy `ghost/core/server/storage/index.js`:
`storageChoice = 's3-store'; // instead of 'local-file-store.js'`

## License
Read LICENSE.
