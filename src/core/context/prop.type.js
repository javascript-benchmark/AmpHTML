/**
 * A context property.
 *
 * @interface
 * @template T
 * @template DEP
 */
export function ContextPropDef() {}

/**
 * A globally unique key. Extensions must use a fully qualified name such
 * as "amp-extension:key" or "amp-extension:version:key".
 *
 * @type {string}
 */
ContextPropDef.prototype.key;

/**
 * An optional type object that can be used for a using system. E.g.
 * this could be a Preact's Context object.
 *
 * @type {?Object}
 */
ContextPropDef.prototype.type;

/**
 * An array of dependencies that are required for the `compute` callback.
 *
 * @type {!Array<!ContextPropDef<DEP>>}
 */
ContextPropDef.prototype.deps;

/**
 * Whether the value needs a recursive resolution of the parent value. The
 * following values are allowed:
 * - `false`: the parent value is never needed. It's a non-recursive
 * property, such as `Loaded`.
 * - `true`: the parent value is always needed. It's a recursive property.
 * It could be a simple "find first" recursive property. Or it could be a
 * computable property, such as `score` where all values of the score are
 * compounded.
 * - a function: the parent value may or may not be needed. This function
 * will be called with all of the property inputs. It should return `true`
 * if the parent value is needed for the provided inputs. For instance,
 * a recursive property based on AND (e.g. `renderable`), can immediately
 * determine that the resulting value will be `false` because some inputs
 * are `false` and thus a more resource-sensitive parent resolution is not
 * necessary.
 *
 * @type {boolean|function(!Array<T>):boolean}
 */
ContextPropDef.prototype.recursive;

/**
 * Computes the property value. This callback is passed the following
 * arguments:
 * 1. The DOM Node.
 * 2. An array of all inputs set on this DOM node for this property.
 * 3. If it's a recursive property, the parent value.
 * 4. If `deps` are specified - the dep values.
 *
 * @type {function(!Node, !Array<T>, ...DEP):(T|undefined)}
 */
ContextPropDef.prototype.compute;

/**
 * The default value of a recursive property.
 *
 * @type {T|undefined}
 */
ContextPropDef.prototype.defaultValue;
