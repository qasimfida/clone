#Games Lobby

Steps to install
1. Install dotnet framework 5.0
2. Open the project folder
3. Open terminal and run the following commands

dotnet restore
yarn install
cd ClientApp
yarn install


4. Press F5 to run the project
5. Open Browser and navigate to 
http://localhost:12380




if you see this error at the console
One or more errors occurred. (ValidationError: Invalid options object. Dev Middleware has been initialized using an options object that does not match the API schema.
 - options has an unknown property 'watchOptions'. These properties are valid:
   object { mimeTypes?, writeToDisk?, methods?, headers?, publicPath?, stats?, serverSideRender?, outputFileSystem?, index? }
    at validate (D:\repo\curiousgames\CuriousApps\GamesLobby\ClientApp\node_modules\webpack-dev-middleware\node_modules\schema-utils\dist\validate.js:105:11)
    at wdm (D:\repo\curiousgames\CuriousApps\GamesLobby\ClientApp\node_modules\webpack-dev-middleware\dist\index.js:31:29)
    at attachWebpackDevMiddleware (D:\repo\curiousgames\CuriousApps\GamesLobby\ClientApp\node_modules\aspnet-webpack\WebpackDevMiddleware.js:72:46)
    at D:\repo\curiousgames\CuriousApps\GamesLobby\ClientApp\node_modules\aspnet-webpack\WebpackDevMiddleware.js:271:25
    at Array.forEach (<anonymous>)
    at Server.<anonymous> (D:\repo\curiousgames\CuriousApps\GamesLobby\ClientApp\node_modules\aspnet-webpack\WebpackDevMiddleware.js:234:36)
    at Object.onceWrapper (events.js:420:28)
    at Server.emit (events.js:314:20)
    at emitListeningNT (net.js:1350:10)
    at processTicksAndRejections (internal/process/task_queues.js:83:21)


please navigate to 
node_modules\aspnet-webpack\WebpackDevMiddleware.js:72
change this
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        stats: webpackConfig.stats,
        publicPath: ensureLeadingSlash(webpackConfig.output.publicPath),
        watchOptions: webpackConfig.watchOptions
    }));

to this
    app.use(require('webpack-dev-middleware')(compiler, {
        stats: webpackConfig.stats,
        publicPath: ensureLeadingSlash(webpackConfig.output.publicPath)
    }));


and re run the project

