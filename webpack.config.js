var path = require("path");
var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var Clean = require("clean-webpack-plugin");
var git = require("git-rev-sync");
require("es6-promise").polyfill();
const CopyWebpackPlugin = require("copy-webpack-plugin");
var locales = require("./app/assets/locales");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/*
* For staging builds, set the version to the latest commit hash, for
* production set it to the package version
*/
let branch = !!process.env.BRANCH ? process.env.BRANCH : git.branch();
var __VERSION__ =
    branch === "develop" ? git.short() : require("./package.json").version;

// BASE APP DIR
var root_dir = path.resolve(__dirname);

module.exports = function(env) {
    // STYLE LOADERS
    var cssLoaders = [
        {
            loader: "style-loader"
        },
        {
            loader: "css-loader"
        },
        {
            loader: "postcss-loader"
        }
    ];

    var scssLoaders = [
        {
            loader: "style-loader"
        },
        {
            loader: "css-loader"
        },
        {
            loader: "postcss-loader"
        },
        {
            loader: "sass-loader",
            options: {
                outputStyle: "expanded"
            }
        }
    ];

    // OUTPUT PATH
    var outputPath = path.join(root_dir, "assets");

    // COMMON PLUGINS
    const baseUrl = env.electron ? "./" : "baseUrl" in env ? env.baseUrl : "/";

    /*
    * moment and react-intl include tons of locale files, use a regex and
    * ContextReplacementPlugin to only include certain locale files
    */
    let regexString = "";
    locales.forEach((l, i) => {
        regexString = regexString + (l + (i < locales.length - 1 ? "|" : ""));
    });
    const localeRegex = new RegExp(regexString);

    /* CRYPTOBRIDGE */
    const recaptchaSiteKey =
        process.env.RECAPTCHA_SITE_KEY ||
        "6LdlhIsUAAAAAHzlruhPZ4yJKPd5Zo18eLRFP7hj";

    const cryptoBridgePubKey =
        process.env.CRYPTOBRIDGE_PUB_KEY ||
        "BTS74ePvhPVtYw79orHZkHgfpGr5vRJ1ZPyDDZcCBEg275DGpCy8k";

    const chainId =
        process.env.CHAIN_ID ||
        "6847b2f6e1b52cee660d748f70565bd3248c4498f7b208fbf15e63e93b3e1eb6";

    const isLocalChain =
        chainId ===
        "6847b2f6e1b52cee660d748f70565bd3248c4498f7b208fbf15e63e93b3e1eb6";

    const walletUrl = process.env.WALLET_URL || "http://localhost:8080";
    const apiUrl = process.env.API_URL || "http://localhost:5000";
    const apiSupportUrl =
        process.env.API_SUPPORT_URL || "http://localhost:3000";
    /* /CRYPTOBRIDGE */

    var plugins = [
        new HtmlWebpackPlugin({
            template: "!!handlebars-loader!app/assets/index.hbs",
            templateParameters: {
                title: "CryptoBridge",
                INCLUDE_BASE: !!env.prod && !env.hash,
                PRODUCTION: !!env.prod,
                ELECTRON: !!env.electron
            }
        }),

        new webpack.DefinePlugin({
            APP_VERSION: JSON.stringify(__VERSION__),
            __ELECTRON__: !!env.electron,
            __HASH_HISTORY__: !!env.hash,
            __BASE_URL__: JSON.stringify(baseUrl),
            __UI_API__: JSON.stringify(env.apiUrl),
            __TESTNET__: !!env.testnet,
            __DEPRECATED__: !!env.deprecated,
            DEFAULT_SYMBOL: "BTS",
            __GIT_BRANCH__: JSON.stringify(git.branch()),
            __PERFORMANCE_DEVTOOL__: !!env.perf_dev,

            /* CRYPTOBRIDGE */
            __IS_LOCAL_CHAIN__: isLocalChain,

            __CHAIN_ID_LOCAL__: JSON.stringify(
                "6847b2f6e1b52cee660d748f70565bd3248c4498f7b208fbf15e63e93b3e1eb6"
            ),
            __CHAIN_ID_TEST__: JSON.stringify(
                "2821abbb9923c830cf8300136c431674756270d9019f56c00e80b296e3afc079"
            ),
            __CHAIN_ID_MAIN__: JSON.stringify(
                "4018d7844c78f6a6c41c6a552b898022310fc5dec06da467ee7905a8dad512c8"
            ),

            __CHAIN_ID__: JSON.stringify(chainId),
            __CHAIN_ID_SHORT__: JSON.stringify(chainId.substr(0, 8)),

            __CRYPTOBRIDGE_PUB_KEY__: JSON.stringify(cryptoBridgePubKey),
            __RECAPTCHA_SITE_KEY__: JSON.stringify(recaptchaSiteKey),

            __WALLET_URL__: JSON.stringify(walletUrl),
            __WALLET_URL_PROD__: JSON.stringify(
                "https://wallet.crypto-bridge.org"
            ),
            __API_URL__: JSON.stringify(apiUrl),
            __API_SUPPORT_URL__: JSON.stringify(apiSupportUrl),

            __FAUCET_URL__: JSON.stringify(apiUrl),

            __BCO_ASSET_ID__: JSON.stringify(
                isLocalChain ? "1.3.2" : "1.3.1564"
            ),
            __BCO_ASSET_PRECISION__: 7

            /* /CRYPTOBRIDGE */
        }),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            localeRegex
        ),
        new webpack.ContextReplacementPlugin(
            /react-intl[\/\\]locale-data$/,
            localeRegex
        ),
        new CopyWebpackPlugin([
            {
                from: path.join(root_dir, "charting_library"),
                to: "charting_library"
            }
        ])
    ];
    if (env.prod) {
        // PROD OUTPUT PATH
        let outputDir = env.electron
            ? "electron"
            : env.hash
                ? !baseUrl
                    ? "hash-history"
                    : `hash-history_${baseUrl.replace("/", "")}`
                : "dist";
        outputPath = path.join(root_dir, "build", outputDir);

        // DIRECTORY CLEANER
        var cleanDirectories = [outputPath];

        // WRAP INTO CSS FILE
        cssLoaders = [
            {loader: MiniCssExtractPlugin.loader},
            {loader: "css-loader"},
            {
                loader: "postcss-loader",
                options: {
                    minimize: true,
                    debug: false
                }
            }
        ];
        scssLoaders = [
            {loader: MiniCssExtractPlugin.loader},
            {loader: "css-loader"},
            {
                loader: "postcss-loader",
                options: {
                    minimize: true,
                    debug: false
                }
            },
            {loader: "sass-loader", options: {outputStyle: "expanded"}}
        ];

        // PROD PLUGINS
        plugins.push(new Clean(cleanDirectories, {root: root_dir}));
        plugins.push(
            new webpack.DefinePlugin({
                __DEV__: false
            })
        );
        plugins.push(
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css"
            })
        );
    } else {
        plugins.push(
            new webpack.DefinePlugin({
                "process.env": {NODE_ENV: JSON.stringify("development")},
                __DEV__: true
            })
        );
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    plugins.push(
        new CopyWebpackPlugin(
            [
                {
                    from: path.join(
                        root_dir,
                        "app",
                        "assets",
                        "locales",
                        "*.json"
                    ),
                    to: path.join(outputPath, "[name].[ext]"),
                    toType: "template"
                },
                {
                    from: path.join(
                        root_dir,
                        "app",
                        "lib",
                        "common",
                        "dictionary_en.json"
                    ),
                    to: path.join(outputPath, "dictionary.json"),
                    toType: "file"
                },
                {
                    from: path.join(
                        root_dir,
                        "app",
                        "assets",
                        "outdated_browser.css"
                    ),
                    to: path.join(outputPath, "outdated_browser.css"),
                    toType: "file"
                }
            ],
            {}
        )
    );

    var config = {
        mode: env.noUgly ? "none" : env.prod ? "production" : "development",
        entry: {
            app: env.prod
                ? path.resolve(root_dir, "app/Main.js")
                : [
                      "webpack-hot-middleware/client",
                      "react-hot-loader/patch",
                      path.resolve(root_dir, "app/Main.js")
                  ]
        },
        output: {
            publicPath: env.prod ? "" : "/",
            path: outputPath,
            filename: env.prod ? "[name].[chunkhash].js" : "[name].js",
            chunkFilename: env.prod ? "[name].[chunkhash].js" : "[name].js",
            pathinfo: !env.prod,
            sourceMapFilename: "[name].js.map"
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: "styles",
                        test: /\.css$/,
                        chunks: "all",
                        enforce: true
                    },
                    vendor: {
                        name: "vendor",
                        test: /node_modules/,
                        chunks: "initial",
                        enforce: true
                    }
                }
            }
        },
        devtool:
            env.noUgly || !env.prod
                ? "inline-cheap-module-source-map"
                : "cheap-source-map",
        module: {
            rules: [
                {
                    // Test for a polyfill (or any file) and it won't be included in your
                    // bundle
                    test: /node-fetch/,
                    use: "null-loader"
                },
                {
                    test: /\.jsx$/,
                    include: [
                        path.join(root_dir, "app"),
                        path.join(
                            root_dir,
                            "node_modules/react-foundation-apps"
                        )
                    ],
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: env.prod ? false : true,
                                plugins: ["react-hot-loader/babel"]
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    include: [
                        path.join(root_dir, "app"),
                        path.join(root_dir, "node_modules/react-datepicker2"),
                        path.join(root_dir, "node_modules/alt-container"),
                        path.join(root_dir, "node_modules/alt-react")
                    ],
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                compact: false,
                                cacheDirectory: env.prod ? false : true,
                                plugins: ["react-hot-loader/babel"]
                            }
                        }
                    ]
                },
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                },
                {test: /\.coffee$/, loader: "coffee-loader"},
                {
                    test: /\.(coffee\.md|litcoffee)$/,
                    loader: "coffee-loader?literate"
                },
                {
                    test: /\.css$/,
                    use: cssLoaders
                },
                {
                    test: /\.scss$/,
                    use: scssLoaders
                },
                {
                    test: /\.png$/,
                    exclude: [
                        path.resolve(root_dir, "app/assets/asset-symbols"),
                        path.resolve(
                            root_dir,
                            "app/assets/language-dropdown/img"
                        )
                    ],
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 100000
                            }
                        }
                    ]
                },

                {
                    test: /\.woff$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 100000,
                                mimetype: "application/font-woff"
                            }
                        }
                    ]
                },
                {
                    test: /.*\.svg$/,
                    exclude: [
                        path.resolve(root_dir, "app/assets/cryptobridge"), // CRYPTOBRIDGE
                        path.resolve(root_dir, "app/assets/model-type-images"),
                        path.resolve(root_dir, "app/assets/bin-file")
                    ],
                    use: [
                        {
                            loader: "svg-inline-loader"
                        },
                        {
                            loader: "svgo-loader",
                            options: {
                                plugins: [
                                    {cleanupAttrs: true},
                                    {removeMetadata: true},
                                    {removeXMLNS: true},
                                    {removeViewBox: false}
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.md/,
                    use: [
                        {
                            loader: "html-loader",
                            options: {
                                removeAttributeQuotes: false
                            }
                        },
                        {
                            loader: "markdown-loader",
                            options: {}
                        }
                    ]
                }
            ]
        },
        resolve: {
            modules: [
                path.resolve(root_dir, "app"),
                path.resolve(root_dir, "app/lib"),
                "node_modules"
            ],
            extensions: [".js", ".jsx", ".coffee", ".json"],
            mainFields: ["module", "jsnext:main", "browser", "main"],
            alias: {
                sanitize$: "xss",
                moment$: path.resolve(
                    root_dir,
                    "node_modules/moment/moment.js"
                ),
                bitsharesjs$: path.resolve(
                    root_dir,
                    "node_modules/bitsharesjs/"
                ),
                "bitshares-ui-style-guide$": path.resolve(
                    root_dir,
                    "node_modules/bitshares-ui-style-guide/dist/main.js"
                )
            }
        },
        plugins: plugins
    };

    return config;
};
