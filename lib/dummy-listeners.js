if (!Object.prototype._listeners_) {
    Object.defineProperty(Object.prototype, '_listeners_', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: {}
    });
}

if (!Object.prototype.addListener) {
    Object.defineProperty(Object.prototype, 'addListener', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(name, callback) {
            if (!this._listeners_[name]) {
                var descriptor = Object.getOwnPropertyDescriptor(this, name);

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
                    value: this[name],
                    callbacks: []
                };

                delete this[name];

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

                    val = oldSetter.call(this, val);

                    for (var i = 0; i < field.callbacks.length; ++i)
                        field.callbacks[i](name, old, val);

                    return val;
                };

                this._listeners_[name] = field;

                Object.defineProperty(this, name, descriptor);
            }

            this._listeners_[name].callbacks.push(callback);
        }
    });
}

if (!Object.prototype.removeListener) {
    Object.defineProperty(Object.prototype, 'removeListener', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: function(name, callback) {
            if (!this._listeners_[name])
                return false;

            var callbacks = this._listeners_[name].callbacks;

            var index = callbacks.indexOf(callback);
            if (index < 0)
                return false;

            callbacks.splice(index, 1);
            return true;
        }
    });
}