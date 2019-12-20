# django-react

An attempt to combine django and react


### Step by Step Guide for creating a react django app

### 1: Create a new app and implementing the basic architecture
First, create a new app to house the react front end:
```
python manage.py startapp frontend
```

Make directory for React and static components:
```
mkdir -p ./frontend/src/components
mkdir -p ./frontend/{static,templates}/frontend
```

```components``` is where we will create the react app. ```static``` is where the 
compiled javascript will end up. 


### 2: Install Node packages

In the root directory create a ```package.json``` file with the js requirements. To do this run:
``` 
npm init -y
```
The ```-y``` flag means the file is created automatically without any user input.

Now proceed to install requisite npm packages. First start with webpack:
``` 
npm i -D webpack webpack-cli 
```
NOTE: -D flag means install a development dependency.

Now for Babel. This is required for transpiling javasript i.e. we can write modern javascript 
and babel will handle translating to a form that is legible for older JS versions.
``` 
npm i -D @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties 
``` 

Now for react:
``` 
npm i react react-dom prop-types 
```
```prop-types``` is used within react for checking the property types.

### 3: Configuring things

Now create file in root
- ``` touch .babelrc```
In the file add the following:
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

Now create another file in the root:
- ``` touch webpack.config.js```
To this file, add:
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```

Now, go to the ```package.json ``` file and change the ```scripts``` so that it reads:
```json
  "scripts" : {
    "dev": "webpack --mode development --watch ./frontend/src/index.js --output ./frontend/static/frontend/main.js",
    "build": "webpack --mode production ./frontend/src/index.js --output ./frontend/static/frontend/main.js"
  },
```
The ``` --watch ``` flag for development means that you don't have to keep transpiling the js when you make changes
during development

###
 
Now make the following file:
- ``` touch frontend/src/index.js```
The file should contain the following:
```javascript
import App from './components/App';
```

Now make the following file:
``` 
touch frontend/components/App.js
```

Look at ```create-react-app ``` for inspiration about how this should be formatted.
If using PyCharm, make sure that the editor is treating the file for JSX and not JS.

We need to make a template for react to render in, i.e:
```
touch frontend/templates/frontend/index.html  
```
A boilerplate can be used to create a generic HTML5 template. This template will be rendered by 
Django, therefore you can use template tags. A ```div``` with an id needs to be included for React 
to work. Add Js and Css links for bootstrap here if you are using that. 

Create a view in ```frontend/views.py``` that utilizes  the newly made template and incorporate this view
as per standard Django.  

### Getting everything running
Transpile the javascript:
```javascript
npm run dev
```

Then run the django server
```
python manage.py runserver
```

### Recommended reading
https://www.valentinog.com/blog/drf/
