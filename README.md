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

# List of validators

This library uses the [is library](https://github.com/enricomarino/is) under the hood, and all its validations are available.

To extend them, just extend the `require("is")` in order to add new validators.

# Syntax

This library uses simple `string splits` in this order:

- `;` to separate properties
- `:` to separate property rules (left: property; right: validator)
- `.` to separate property concatenations (for the previous left-side only)
- `&` to separate property validations (for the previous right-side only)
- `|` to separate property validation alternatives (for all the groups made by `&`)

This could be a common example:

```
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



