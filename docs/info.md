

### Step by Step Guide for creating a React Django app

The following provides a step-by-step guide documenting how to create a Django react app. The steps are heavily 
inspired by [here](https://www.valentinog.com/blog/drf/). Things have been documented here for my own 
convenience. In case I need to do this again in the future.

### 1: Initialise a location where the frontend will be created

The idea is that there will be a single location where the React app(s) will be developed. To this end, 
create a directory in the root django project for the frontend
```
mkdir frontend
```

The react apps that are made will live in individual directories within this folder and have the typical react
structure.  In this project we are making a react app for the file_management django app. Therefore the structure will
look something like this:
``` bash
|-- frontend
|  |--file_management
|    |-- src
|      |-- components
|      |-- index.js
```

Webpack will be used handle the bundling which will create the respective ```.js``` files in in django's ```static``` 
folder.  In this manner the created files will be available to django templates. 

### 2: Initialise NPM
After creating the above structure:
```
cd frontend
```
Then run:
``` 
npm init -y
```
The above command will create a ```package.json```. The ```-y``` flag will create the file without user input. 


Now proceed to install requisite packages. First start with webpack:
``` 
npm i webpack webpack-cli webpack-bundle-tracker --save-dev

```
Now for Babel. This is required for transpiling javascript: 
``` 
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties --save-dev
``` 

Now for the react base react packages:
``` 
npm i react react-dom prop-types --save
```

And finally for some linters:
```
npm i eslint eslint-loader babel-eslint --save-dev
```

### 3: Setting up the configurations

Now create file in root
``` bash
touch .babelrc
```
In this file add the following:
```
{
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
    ],
    "plugins": [
      "transform-class-properties"
    ]
}
```

``` bash
touch .babelrc
```
In this file add the following:
```
{
  "parser": "babel-eslint",
  "rules": {}
}
```

Now create the webpack configuration:
- ``` touch webpack.config.js```
To this file, add:
```javascript

const path = require("path");
let BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  devtool: "source-map",
  entry: {
    file_management: ["./file_management/src/index.js"],
  },
  output: {
      path: path.resolve(
          __dirname,
          "../static/frontend/webpack_bundles/"
      ),
      filename: "main.[hash].js"
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },
  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: './webpack-stats.json',
    }),
  ],
};
```

Now, go to the ```package.json ``` file and change the ```scripts``` so that it reads:
```json
  "scripts": {
    "dev": "webpack --mode development --watch",
    "build": "webpack --mode production"
  },

```
The ``` --watch ``` flag for development means that you don't have to keep transpiling the js when you make changes
during development


### Setting up django
Make sure that ```django_webpack_loader``` is installed and included in the installed apps.
``` pip install django_webpack_loader ```

Based on the above configuration, add to the settings file.
```python
WEBPACK_LOADER = {
    'DEFAULT': {
        'STATS_FILE': os.path.join(BASE_DIR, 'frontend', 'webpack-stats.json'),
        'BUNDLE_DIR_NAME': 'frontend/webpack_bundles/'
    }
}
```