if (!Object.prototype.addListener) {
    Object.defineProperty(Object.prototype, 'addListener', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function() {
			function addOneListener(obj, name, callback) {
				if (!obj._listeners_) {
					Object.defineProperty(obj, '_listeners_', {
						enumerable: false,
						configurable: true,
						writable: false,
						value: {}
					});
				}

				if (!obj._listeners_[name]) {
					var descriptor = Object.getOwnPropertyDescriptor(obj, name);

					if (!descriptor) {
						descriptor = {
							enumerable: true,
							configurable: true,
							writable: true,
							value: undefined
						};
					}

					if (!descriptor.configurable)
						throw 'It is not possible to add a listener to field ' + name;

					var field = {
						value: obj[name],
						callbacks: []
					};

					delete obj[name];

					if (descriptor.value !== undefined || descriptor.writable) {
						descriptor.set = function(val) {
							field.value = val;
							return val;
						};

						descriptor.get = function() {
							return field.value;
						};

						delete descriptor.value;
						delete descriptor.writable;
					}

					var oldSetter = descriptor.set;

					descriptor.set = function(val) {
						var old = field.value;

						if (old === val)
							return old;

						val = oldSetter.call(obj, val);

						for (var i = 0; i < field.callbacks.length; ++i)
							field.callbacks[i](name, old, val);

						return val;
					};

					obj._listeners_[name] = field;

					Object.defineProperty(obj, name, descriptor);
				}

				obj._listeners_[name].callbacks.push(callback);
			}
			
			if (arguments.length < 2)
				throw 'At least 2 args are needed: field name and callback';
			
			var callback = arguments[arguments.length - 1];
			
			if (typeof callback != 'function')
				throw 'The callback (last arg) must be a function (was "' + callback + '")';
			
			for(var i = 0; i < arguments.length - 1; i++)
				addOneListener(this, arguments[i], callback);
			
			var obj = this;
			var args = arguments;
			return function() {
				obj['removeListener'].apply(obj, args);
			};
		}
    });
}

if (!Object.prototype.removeListener) {
    Object.defineProperty(Object.prototype, 'removeListener', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function() {
			function removeOneListener(obj, name, callback) {
				if (!obj._listeners_ || !obj._listeners_[name])
					return false;

				var callbacks = obj._listeners_[name].callbacks;

				var index = callbacks.indexOf(callback);
				if (index < 0)
					return false;

				callbacks.splice(index, 1);
				return true;
			}
			
			if (arguments.length < 2)
				throw 'At least 2 args are needed: field name and callback';
			
			var callback = arguments[arguments.length - 1];
			
			if (typeof callback != 'function')
				throw 'The callback (last arg) must be a function (was "' + callback + '")';
			
			for(var i = 0; i < arguments.length - 1; i++)
				removeOneListener(this, arguments[i], callback);
        }
    });
}