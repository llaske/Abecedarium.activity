# What is Abecedarium ?

Abecedarium activity for Sugar.  
 


# How it works ?

Abecedarium is wrote mainly in HTML5/JavaScript using the Enyo Framework.  
All the HTML5/JavaScript is encapsulated in Python code executing a WebView (an instance of the WebKit browser).  

# Folders

## /.

Contains Python code (activity.py) and the framework to communicate between Python and JavaScript (enyo.py).

## /activity

Contains the Sugar manifest manifest to describe the activity.

## /html

All the HTML5/JavaScript is in this directory. 
* index.html is the HTML container
* styles.css contains all CSS class used
* package.js list all javascript files to load
* app.js is the main screen


## /html/enyo and /html/lib

Contains the Enyo Framework.

## /html/audio

Contains all music and sound files.

## /html/images

Contains all images.

## /html/css

Styles sheet for different platforms.
