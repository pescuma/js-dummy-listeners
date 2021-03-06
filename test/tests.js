var suite = {
	'Value changed with field existing' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		c.a = 2;

		test.ok(notified);

		test.done();
	},
	
	'Value changed with field not existing' : function(test) {
		var c = { };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		c.a = 2;

		test.ok(notified);

		test.done();
	},
	
	'Add twice' : function(test) {
		var c = { a: 1 };
		
		var notified = 0;
		var listener = function() {
			notified++;
		};
		
		c.addListener('a', listener);
		c.addListener('a', listener);
		
		c.a = 2;

		test.ok(notified == 2);

		test.done();
	},
	
	'Remove' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		var listener = function() {
			notified = true;
		};
		
		c.addListener('a', listener);
		c.removeListener('a', listener);
		
		c.a = 2;

		test.ok(!notified);

		test.done();
	},
	
	'Remove before add' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		var listener = function() {
			notified = true;
		};
		
		c.removeListener('a', listener);
		c.addListener('a', listener);
		
		c.a = 2;

		test.ok(notified);

		test.done();
	},

	'Ignore same value' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		c.a = 1;

		test.ok(!notified);

		test.done();
	},

	'Don\'t ignore similar value' : function(test) {
		var c = { a: 0 };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		c.a = false;

		test.ok(notified);

		test.done();
	},

	'Ignore undefined on field not existing' : function(test) {
		var c = { };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		c.a = undefined;

		test.ok(!notified);

		test.done();
	},

	'Don\'t ignore undefined on field existing' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		c.a = undefined;

		test.ok(notified);

		test.done();
	},

	'Return correct value on change' : function(test) {
		var c = { a: 0 };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		test.ok((c.a = 1) === 1);

		test.done();
	},

	'Return correct value on ignore' : function(test) {
		var c = { a: 0 };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		test.ok((c.a = 0) === 0);

		test.done();
	},
	
	'One object does not affect other' : function(test) {
		var c = { a: 1 };
		var d = { a: 1 };
		
		var notified = false;
		
		c.addListener('a', function() {
			notified = true;
		});
		
		d.a = 2;

		test.ok(!notified);

		test.done();
	},
	
	'Add in multiple fields with field existing' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		
		c.addListener('a', 'b', function() {
			notified = true;
		});
		
		c.a = 2;

		test.ok(notified);

		test.done();
	},
	
	'Add in multiple fields with field not existing' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		
		c.addListener('a', 'b', function() {
			notified = true;
		});
		
		c.b = 2;

		test.ok(notified);

		test.done();
	},
	
	'Remove in multiple fields' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		var listener = function() {
			notified = true;
		};
		
		c.addListener('a', 'b', listener);
		c.removeListener('c', 'a', listener);
		
		c.a = 2;

		test.ok(!notified);

		test.done();
	},
	
	'Remove in multiple fields does not affect others' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		var listener = function() {
			notified = true;
		};
		
		c.addListener('a', 'b', listener);
		c.removeListener('c', 'a', listener);
		
		c.b = 2;

		test.ok(notified);

		test.done();
	},
	
	'Invalid arg type in add' : function(test) {
		test.throws(function() {
			c.addListener('a', 'b');
		});

		test.done();
	},
	
	'Too few args in add' : function(test) {
		test.throws(function() {
			c.addListener('a');
		});

		test.done();
	},
	
	'Invalid arg type in remove' : function(test) {
		test.throws(function() {
			c.removeListener('a', 'b');
		});

		test.done();
	},
	
	'Too few args in remove' : function(test) {
		test.throws(function() {
			c.removeListener('a');
		});

		test.done();
	},
	
	'Remove with return from add' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		
		var remover = c.addListener('a', function() {
			notified = true;
		});
		remover();
		
		c.a = 2;

		test.ok(!notified);

		test.done();
	},
	
	'Remove with return from add with multiple fields' : function(test) {
		var c = { a: 1 };
		
		var notified = false;
		
		var remover = c.addListener('a', 'b', function() {
			notified = true;
		});
		remover();
		
		c.a = 2;
		c.b = 2;

		test.ok(!notified);

		test.done();
	},
};


if (typeof exports != 'undefined') {
	require('../lib/dummy-listeners.js');
	exports['Simple tests'] = suite;
} else {
	this.tests = suite;
}