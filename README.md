js-dummy-listeners
==================

A JavaScript listener implementation for all fields

[![Build Status](https://travis-ci.org/pescuma/js-dummy-listeners.png)](https://travis-ci.org/pescuma/js-dummy-listeners)


## Installation

Download [lib/dummy-listeners.js](https://raw.github.com/pescuma/js-dummy-listeners/master/lib/dummy-listeners.js).

Import inside HTML:

```html
<script type="text/javascript" src="dummy-listeners.js"></script>
```

## Usage

```javascript
var obj = {
	name: 'a'
};

var listener = function(name, oldVal, newVal) {
	alert(name + ': ' + oldVal + ' -> ' + newVal);
};

// Listen to changes to existing fields
obj.addListener('name', listener);

// Or for fields that don't exist yet
obj.addListener('size', listener);

obj.name = 'b';
obj.size = 10;

// It won't notify when setting same value
obj.name = 'b';

obj.removeListener('size', listener);

obj.name = 'c';
obj.size = 20;
```
