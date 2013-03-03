# ZenJS

XML Style Template Engine

## Installation

    $ npm install zenjs

## Features

  * Uses the xml tag format for template customization
  * Uses css style tag modifications for data manipulation
  * provide inline vars ie. {{foo}}
  * provide inline var modification ie. {{foo|text-format:lower;}}
  * Supports tag customization
  * Includes
  * provide a caching option
  * Complies with the [Express](http://expressjs.com) view system

## Example
    
    ## Set a variable
    <z:set name="foo" value="bar"/>
    
    ## echo foo
    <z:var name="foo"/>

    ## Array or data

    <z:array name="data">
      <z:item>Item 1</item>
      <z:item>Item 2</item>
      <z:item>Item 3</item>
      <z:item>Item 4</item>
    </z:array>

    ## Display all of the items in the data array

    <z:each var="data">
      <z:var name="data.item"/> <br/>
    </z:each>

    ## control structures (this is not w3c compliant!)

    <z:if cond="{{foo}} == 'bar'">
      <p>We have a bar</p>
    <z:elseif cond="{{foo}} == 'bat'">
      <p>We have a bat</p>
    <z:else>
      <p>Nothing Matching</p>
    </z:if>

    ## Include a file
    <z:include file="/path/to/file.js"/>

## Usage

    zjs.compile(str, options);
    // => Function

    zjs.render(str, options);
    // => str

