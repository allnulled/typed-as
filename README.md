# typed-as

Library to automate validations.

# Install

`$ npm i -s @allnulled/typed-as`

# Usage

```js
const { checkTypes, TypedConstructor } = require("@allnulled/typed-as");

checkTypes({ name: "John", surname: "Smith" }, "name:string;surname:string"); // true
checkTypes({ name: "Alice", surname: "Smith" }, "name:string;surname:number"); // false
checkTypes({ name: undefined, age: 64 }, `
    name : string | undefined ;
    age : gt( 18 ) ;
`); // true
```

# Validators

This library uses the ["is" npm module](https://github.com/enricomarino/is) under the hood, and all its validations are available.

The syntax to use the validators, in `typed-as`, results to something like this:

<pre>
property.subproperty:
  validator1
  & validator2(arg1)
  & validator3(arg1, arg2)
  | alternativeValidator(arg1);
property.subproperty2:
  & validator1 & validator2
  | !alternativeValidator
</pre>

The following list represents all the available validators in `is@3.3.0` and `@allnulled/typed-as@0.0.1`:

- **General:**

    - `is.a (value, type) or is.type (value, type)`
    - `is.defined (value)`
    - `is.empty (value)`
    - `is.equal (value, other)`
    - `is.hosted (value, host)`
    - `is.instance (value, constructor)`
    - `is.instanceof (value, constructor) // DEPRECATED`
    - `is.nil (value)`
    - `is.null (value) // DEPRECATED`
    - `is.undef (value)`
    - `is.undefined (value) // DEPRECATED`

- **Arguments:**

    - `is.args (value)`
    - `is.arguments (value) // DEPRECATED`
    - `is.args.empty (value)`

- **Array:**

    - `is.array (value)`
    - `is.array.empty (value)`
    - `is.arraylike (value)`

- **Boolean:**

    - `is.bool (value)`
    - `is.boolean (value) // DEPRECATED`
    - `is.false (value) // DEPRECATED`
    - `is.true (value) // DEPRECATED`

- **Date:**

    - `is.date (value)`

- **Element:**

    - `is.element (value)`

- **Error:**

    - `is.error (value)`

- **Function:**

    - `is.fn (value)`
    - `is.function (value) // DEPRECATED`

- **Number:**

    - `is.number (value)`
    - `is.infinite (value)`
    - `is.decimal (value)`
    - `is.divisibleBy (value, n)`
    - `is.integer (value)`
    - `is.int (value) // DEPRECATED`
    - `is.maximum (value, others)`
    - `is.minimum (value, others)`
    - `is.nan (value)`
    - `is.even (value)`
    - `is.odd (value)`
    - `is.ge (value, other)`
    - `is.gt (value, other)`
    - `is.le (value, other)`
    - `is.lt (value, other)`
    - `is.within (value, start, finish)`

- **Object:**

    - `is.object (value)`

- **Regexp:**

    - `is.regexp (value)`

- **String:**

    - `is.string (value)`

- **Encoded binary:**

    - `is.base64 (value)`
    - `is.hex (value)`

- **Symbols:**

    - `is.symbol (value)`

- **BigInt:**

    - `is.bigint (value)`


To extend this list, just extend the `require("is")` in order to add new validators.

# Syntax

This library uses simple `string splits` in this order:

- `;` to separate properties
- `:` to separate property rules (left: property; right: validator)
- `.` to separate property concatenations (for the previous left-side only)
- `&` to separate property validations (for the previous right-side only)
- `|` to separate property validation alternatives (for all the groups made by `&`)
- `!` to negate a property validation

This could be a common example:

```
id:!undefined;
name:string;
direction:string;
age:number&gt(18);
form.comments:string|undefined;
form.details:string|undefined;
```

This expression represents how the data is structured and read, and it is a valid expression (if there were such validators and accessible parameters):

```
property.property1:
        validator1A(arg1, arg2)
            |
        validator1B
    &
        validator2A(arg1, arg2)
            |
        validator2B
    &
        validator3A(arg1, arg2)
            |
        validator3B
;
property.property2:
        validator1A(arg1, arg2)
            |
        validator1B
    &
        validator2A(arg1, arg2)
            |
        validator2B
    &
        validator3A(arg1, arg2)
            |
        validator3B
;
```

The `&`, as in the list of `string splits`, takes precedence over `|`.

# Acknowledgement

Thanks to *Cannabis sativa*.

# License

Do what you want, I do not care.