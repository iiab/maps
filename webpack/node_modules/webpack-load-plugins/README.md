# webpack-load-plugins


## Install

```sh
$ npm install --save-dev webpack-load-plugins
```


## Usage

Given a `package.json` file that has some dependencies within:

```json
{
    "devDependencies": {
        "clean-webpack-plugin": "*",
        "html-webpack-plugin": "*"
    }
}
```

Adding this into your `webpack.config.js`:

```js
var webpack = require('webpack');
var webpackLoadPlugins = require('webpack-load-plugins');
var plugins = webpackLoadPlugins();
```

Or, even shorter:

```js
var plugins = require('webpack-load-plugins')();
```

Will result in the following happening (roughly, plugins are lazy loaded but in practice you won't notice any difference):

```js
plugins.clean = require('clean-webpack-plugin');
plugins.html = require('html-webpack-plugin');
```

You can then use the plugins just like you would if you'd manually required them, but referring to them as `plugins.name()`, rather than just `name()`.

This frees you up from having to manually require each webpack plugin.

## Options

You can pass in an object of options that are shown below: (the values for the keys are the defaults):

```js
webpackLoadPlugins({
    pattern: ['*-webpack-plugin','@*/*-webpack-plugin'], // the glob(s) to search for
    config: 'package.json', // where to find the plugins, by default searched up from process.cwd()
    scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
    replaceString: /-webpack-plugin$/, // what to remove from the name of the module when adding it to the context
    camelize: true, // if true, transforms hyphenated plugins names to camel case
    lazy: true, // whether the plugins should be lazy loaded on demand
    rename: {}, // a mapping of plugins to rename
    renameFn: function (name) { ... } // a function to handle the renaming of plugins (the default works)
});
```

## Renaming

You can pass in an object of mappings for renaming plugins. For example, imagine you want to load the 
`html-webpack-plugin` plugin, but want to refer to it as just `html`:

```js
webpackLoadPlugins({
  rename: {
    'html-webpack-plugin': 'html'
  }
});
```

Note that if you specify the `renameFn` options with your own custom rename function, while the `rename` option will 
still work, the `replaceString` and `camelize` options will be ignored.

## npm Scopes

`webpack-load-plugins` comes with [npm scope](https://docs.npmjs.com/misc/scope) support. 
The major difference is that scoped plugins are accessible through an object on `plugins` that represents the scope. 
For example, if the plugin is `@savl/webpack-test-plugin` then you can access the plugin as shown in the following example:

```js
var plugins = require('webpack-load-plugins')();
plugins.savl.testPlugin();
```

## Credit

Credit largely goes to @jackfranklin for his [gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins) 
plugin & @sindresorhus for his [load-grunt-plugins](https://github.com/sindresorhus/load-grunt-tasks) plugin. This 
plugin is almost identical, just tweaked slightly to work with Webpack and to expose the required plugins.